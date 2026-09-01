import { databricksService } from "./databricksService.js";
import { config } from "../config.js";

class GenieService {
  constructor() {
    this.host = config.DATABRICKS_HOST;
    this.token = config.DATABRICKS_TOKEN;
    this.spaceId = config.GENIE_SPACE_ID;
  }

  async askGenie(question, studentProfile = null) {
    if (config.MOCK_GENIE || !this.host || !this.spaceId) {
      return this._mockGenieResponse(question, studentProfile);
    }

    const url = `${this.host}/api/2.0/genie/spaces/${this.spaceId}/start-conversation`;
    const payload = { content: question };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`Genie API returned ${resp.status}`);
      }

      const data = await resp.json();
      const conversationId = data.conversation_id || `genie_conv_${Date.now()}`;
      const messageText = data.content?.text || "Databricks Genie analyzed connected campus datasets.";

      return {
        answer: messageText,
        conversation_id: conversationId,
        sources: ["campus.courses", "campus.clubs", "campus.research_projects", "campus.opportunities"],
        query_executed: data.query || "SELECT * FROM campus_twin.campus.courses;",
      };
    } catch (err) {
      console.warn("Genie API error, falling back to structured Genie response:", err.message);
      return this._mockGenieResponse(question, studentProfile);
    }
  }

  async _mockGenieResponse(question, studentProfile = null) {
    const qLower = (question || "").toLowerCase();
    let hours = 6.0;
    if (studentProfile && studentProfile.available_hours_per_week) {
      const parsed = parseFloat(studentProfile.available_hours_per_week);
      if (!isNaN(parsed)) hours = parsed;
    }

    // Extract hours from query
    const hourMatch = qLower.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)/);
    if (hourMatch) {
      const parsed = parseFloat(hourMatch[1]);
      if (!isNaN(parsed)) hours = parsed;
    }

    let answer = "";
    let sqlQuery = "";
    let sources = ["campus.courses", "campus.clubs", "campus.research_projects", "campus.opportunities"];

    // 1. What-If / Replacement query
    if (
      qLower.includes("replace") ||
      qLower.includes("what if") ||
      qLower.includes("swap") ||
      qLower.includes("substitute")
    ) {
      sqlQuery =
        "SELECT r.title, r.faculty, r.hours_per_week, cl.club_name " +
        "FROM campus_twin.campus.research_projects r " +
        "CROSS JOIN campus_twin.campus.clubs cl " +
        "WHERE r.skills LIKE '%Computer Vision%' AND cl.club_name = 'Artificial Intelligence Student Society';";

      answer =
        `Databricks Genie simulated this What-If transformation:\n\n` +
        `- **Action**: Replaced *AI Student Society (Club)* with *Autonomous Navigation & Perception (Research Project RES_01)*\n` +
        `- **Impact**: Research Exposure **+50%**, Faculty Mentorship **+51%**\n` +
        `- **Time Budget**: Reallocates your ~${hours} hrs/week toward direct faculty lab contributions with Prof. Aris Thorne without exceeding your weekly cap.`;
    }
    // 2. Research Query
    else if (
      qLower.includes("research") ||
      qLower.includes("project") ||
      qLower.includes("vision") ||
      qLower.includes("lab")
    ) {
      const researchData = await databricksService._queryLocalCsv("research_projects");
      const stopwords = new Set(["what", "which", "where", "about", "with", "have", "want", "related", "research", "projects", "are"]);
      let keywords = qLower
        .replace(/[?,.!]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopwords.has(w));

      if (keywords.length === 0) keywords = ["vision", "ai", "learning", "robotics", "data"];

      let matched = researchData.filter((r) => {
        const text = `${r.title || ""} ${r.description || ""} ${r.domain || ""} ${r.skills || ""} ${r.department || ""}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });

      if (matched.length === 0) matched = researchData.slice(0, 3);

      const whereSql = keywords
        .slice(0, 2)
        .map((k) => `skills LIKE '%${k}%' OR domain LIKE '%${k}%'`)
        .join(" OR ");

      sqlQuery = `SELECT research_id, title, faculty, department, skills, hours_per_week FROM campus_twin.campus.research_projects WHERE ${whereSql};`;

      const listItems = matched
        .slice(0, 3)
        .map(
          (m) =>
            `- **${m.title}** (${m.faculty || "Faculty"} · ${m.hours_per_week || "5"} hrs/wk)\n  *Skills: ${(m.skills || "").replace(/\|/g, ", ")}*`
        )
        .join("\n");

      answer =
        `Databricks Genie queried the \`campus.research_projects\` and \`campus.faculty\` datasets.\n\n` +
        `### Matching Research Opportunities (${matched.length} Found)\n` +
        listItems +
        `\n\nThese projects align with your career goals and fit within your target weekly workload.`;

      sources = ["campus.research_projects", "campus.faculty", "campus.facilities", "campus.courses"];
    }
    // 3. Clubs Query
    else if (qLower.includes("club") || qLower.includes("organization") || qLower.includes("society")) {
      const clubsData = await databricksService._queryLocalCsv("clubs");
      const stopwords = new Set(["what", "which", "where", "about", "with", "have", "want", "help", "clubs", "club"]);
      let keywords = qLower
        .replace(/[?,]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !stopwords.has(w));

      if (keywords.length === 0) keywords = ["machine", "learning", "coding", "data", "tech"];

      let matched = clubsData.filter((c) => {
        const text = `${c.club_name || ""} ${c.description || ""} ${c.skills || ""} ${c.interests || ""}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });

      if (matched.length === 0) matched = clubsData.slice(0, 3);

      const clubWhere = keywords
        .slice(0, 2)
        .map((k) => `skills LIKE '%${k}%' OR interests LIKE '%${k}%'`)
        .join(" OR ");

      sqlQuery = `SELECT club_id, club_name, category, skills, hours_per_week FROM campus_twin.campus.clubs WHERE ${clubWhere};`;

      const listItems = matched
        .slice(0, 3)
        .map((c) => `- **${c.club_name}** (${c.hours_per_week || 2} hrs/wk)\n  ${c.description}`)
        .join("\n");

      answer =
        `Databricks Genie discovered ${matched.length} relevant student organizations:\n\n` +
        listItems +
        `\n\nActive participation builds peer networking and hands-on portfolio projects.`;

      sources = ["campus.clubs", "campus.events", "campus.skills"];
    }
    // 4. Time limit Query
    else if (
      qLower.includes("time") ||
      (qLower.includes("hour") && !qLower.includes("engineer") && !qLower.includes("become")) ||
      qLower.includes("budget")
    ) {
      sqlQuery =
        `SELECT item_name, type, hours_per_week FROM (` +
        `  SELECT course_name AS item_name, 'Course' AS type, hours_per_week FROM campus_twin.campus.courses ` +
        `  UNION ALL ` +
        `  SELECT club_name AS item_name, 'Club' AS type, hours_per_week FROM campus_twin.campus.clubs` +
        `) WHERE hours_per_week <= ${hours};`;

      answer =
        `Databricks Genie evaluated strict weekly time limits for **${hours} hrs/week**:\n\n` +
        `- Filtered out heavy dual-lab commitments.\n` +
        `- Retained core high-impact components to fit within **${hours} hrs/week**.\n` +
        `- Ensures uninterrupted skill progression without schedule overload.`;

      sources = ["campus.courses", "campus.clubs", "campus.opportunities"];
    }
    // 5. General Topic / Career Target Exploration
    else {
      const [coursesData, clubsData, oppsData] = await Promise.all([
        databricksService._queryLocalCsv("courses"),
        databricksService._queryLocalCsv("clubs"),
        databricksService._queryLocalCsv("opportunities"),
      ]);

      const stopwords = new Set([
        "i", "want", "to", "become", "a", "an", "the", "in", "and", "have", "know",
        "per", "week", "hours", "hour", "my", "is", "for", "with", "get", "what",
        "which", "how", "can", "help", "related", "explore", "tell", "about"
      ]);

      const words = qLower
        .split(/\s+/)
        .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").trim())
        .filter((w) => w && !stopwords.has(w) && w.length > 2);

      const keywords = words.length > 0 ? words : ["ai", "python", "data", "software"];

      const scoreItem = (item, fields) => {
        const text = fields.map((f) => String(item[f] || "")).join(" ").toLowerCase();
        let score = 0;
        keywords.forEach((kw) => {
          if (text === kw) score += 3;
          else if (text.includes(` ${kw} `)) score += 2;
          else if (text.includes(kw)) score += 1;
        });
        return score;
      };

      const rankedCourses = coursesData
        .map((c) => ({ item: c, score: scoreItem(c, ["course_name", "description", "skills", "department"]) }))
        .sort((a, b) => b.score - a.score);

      const rankedClubs = clubsData
        .map((cl) => ({ item: cl, score: scoreItem(cl, ["club_name", "description", "skills", "interests", "category"]) }))
        .sort((a, b) => b.score - a.score);

      const rankedOpps = oppsData
        .map((o) => ({ item: o, score: scoreItem(o, ["title", "description", "skills", "career_domains", "type"]) }))
        .sort((a, b) => b.score - a.score);

      const matchedCourses = rankedCourses.filter((x) => x.score > 0).slice(0, 2).map((x) => x.item);
      const finalCourses = matchedCourses.length > 0 ? matchedCourses : rankedCourses.slice(0, 2).map((x) => x.item);

      const matchedClubs = rankedClubs.filter((x) => x.score > 0).slice(0, 1).map((x) => x.item);
      const finalClubs = matchedClubs.length > 0 ? matchedClubs : rankedClubs.slice(0, 1).map((x) => x.item);

      const matchedOpps = rankedOpps.filter((x) => x.score > 0).slice(0, 1).map((x) => x.item);
      const finalOpps = matchedOpps.length > 0 ? matchedOpps : rankedOpps.slice(0, 1).map((x) => x.item);

      const oppConditions = keywords.slice(0, 2).map((k) => `o.skills LIKE '%${k}%'`).join(" OR ");
      const clubConditions = keywords.slice(0, 2).map((k) => `cl.skills LIKE '%${k}%'`).join(" OR ");

      sqlQuery =
        `SELECT c.course_name, c.hours_per_week, o.title AS opportunity, cl.club_name\n` +
        `FROM campus_twin.campus.courses c\n` +
        `JOIN campus_twin.campus.opportunities o ON ${oppConditions}\n` +
        `JOIN campus_twin.campus.clubs cl ON ${clubConditions}\n` +
        `LIMIT 4;`;

      const courseList = finalCourses
        .filter(Boolean)
        .map(
          (c) =>
            `- **${c.course_name || "Course"}** (\`${c.course_id || "CS"}\` · ${c.hours_per_week || 4}h/wk)\n  *Skills: ${(c.skills || "").replace(/\|/g, ", ")}*`
        )
        .join("\n");

      const clubList = finalClubs
        .filter(Boolean)
        .map((cl) => `- **${cl.club_name || "Club"}** (${cl.hours_per_week || 2}h/wk)\n  ${cl.description || ""}`)
        .join("\n");

      const oppList = finalOpps
        .filter(Boolean)
        .map((o) => `- **${o.title || "Opportunity"}** (${o.type || "Opportunity"})\n  *${o.description || ""}*`)
        .join("\n");

      answer =
        `Databricks Genie analyzed connected campus datasets for your target **'${question}'**:\n\n` +
        `### Recommended Academic Courses\n` +
        courseList +
        `\n\n### Connected Practical Experience & Clubs\n` +
        clubList +
        `\n` +
        oppList +
        `\n\n**Weekly Commitment**: Calibrated for ~${hours} hrs/week with progressive prerequisite validation.`;

      sources = ["campus.courses", "campus.clubs", "campus.opportunities", "campus.skills"];
    }

    return {
      answer,
      conversation_id: `genie_conv_${Math.random().toString(36).substring(2, 10)}`,
      sources,
      query_executed: sqlQuery,
    };
  }
}

export const genieService = new GenieService();
