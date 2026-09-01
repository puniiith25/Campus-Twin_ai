export class ScoringService {
  static calculateScore(item, studentProfile) {
    const stopwords = new Set([
      "i", "want", "to", "become", "a", "an", "the", "in", "and", "have", "know",
      "per", "week", "hours", "hour", "my", "is", "for", "with", "get", "what",
      "which", "how", "can", "help", "related", "explore", "tell", "about"
    ]);

    const goalStr = studentProfile?.goal || "AI Engineer";
    const rawWords = goalStr
      .toLowerCase()
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").trim())
      .filter((w) => w && !stopwords.has(w) && w.length > 2);

    const goalKeywords = rawWords.length > 0 ? rawWords : ["ai", "engineer"];

    const itemText = (
      `${item.name || ""} ${item.title || ""} ${item.description || ""} ` +
      `${item.skills || ""} ${item.department || ""} ${item.category || ""}`
    ).toLowerCase();

    // 1. Goal Match (55%)
    const goalHits = goalKeywords.filter((kw) => itemText.includes(kw)).length;
    let goalMatch = 10.0;
    if (goalHits > 0) {
      goalMatch = Math.min(100.0, 50.0 + goalHits * 25.0);
    }

    // 2. Skill Match (20%)
    const studentSkills = (studentProfile?.skills || []).map((s) =>
      typeof s === "string" ? s.toLowerCase() : (s.name || "").toLowerCase()
    );
    const itemSkills = (item.skills || "")
      .split("|")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    let skillMatch = 50.0;
    if (itemSkills.length > 0) {
      const shared = itemSkills.filter((s) => studentSkills.includes(s));
      skillMatch = shared.length > 0
        ? Math.min(100.0, (shared.length / Math.max(1, itemSkills.length)) * 80.0 + 20.0)
        : 40.0;
    }

    // 3. Time Fit (15%)
    const itemHours = parseFloat(item.hours_per_week || 2);
    const availHours = parseFloat(studentProfile?.available_hours_per_week || 6.0);
    let timeFit = 100.0;
    if (itemHours > availHours) {
      const over = itemHours - availHours;
      timeFit = Math.max(10.0, 100.0 - over * 25.0);
    }

    // 4. Opportunity Value (10%)
    const itemType = (item.type || "").toLowerCase();
    let opportunityValue = 75.0;
    if (
      itemType.includes("research") ||
      itemType.includes("fellowship") ||
      itemType.includes("hackathon") ||
      itemType.includes("internship")
    ) {
      opportunityValue = 95.0;
    } else if (itemType.includes("course") || itemType.includes("workshop")) {
      opportunityValue = 85.0;
    }

    // Total Score
    const totalScore = Math.round(
      (goalMatch * 0.55 + skillMatch * 0.20 + timeFit * 0.15 + opportunityValue * 0.10) * 10
    ) / 10;

    // Label
    let label = "Low Match";
    if (totalScore >= 90) label = "Excellent Match";
    else if (totalScore >= 75) label = "Strong Match";
    else if (totalScore >= 60) label = "Good Match";
    else if (totalScore >= 40) label = "Possible Match";

    // Match reasons
    const reasons = [];
    if (goalMatch >= 70) {
      reasons.push(`Directly aligns with your '${goalStr}' goal`);
    }
    if (itemHours <= availHours) {
      reasons.push(`Fits within your ${availHours}h/week schedule (${itemHours}h required)`);
    } else {
      reasons.push(`Requires ${itemHours}h/week (exceeds your ${availHours}h target)`);
    }
    if (studentSkills.some((s) => s && itemText.includes(s))) {
      reasons.push(`Leverages your existing skills (${studentSkills.filter(Boolean).join(", ")})`);
    }

    return {
      score: totalScore,
      label,
      reasons,
    };
  }
}

export const scoringService = ScoringService;
