import { databricksService } from "./databricksService.js";
import { scoringService } from "./scoringService.js";

class RecommendationService {
  async getRecommendations(studentProfile) {
    const coursesQuery = "SELECT * FROM campus_twin.campus.courses";
    const clubsQuery = "SELECT * FROM campus_twin.campus.clubs";
    const eventsQuery = "SELECT * FROM campus_twin.campus.events";
    const researchQuery = "SELECT * FROM campus_twin.campus.research_projects";
    const oppsQuery = "SELECT * FROM campus_twin.campus.opportunities";

    const [courses, clubs, events, research, opps] = await Promise.all([
      databricksService.executeSql(coursesQuery).catch(() => []),
      databricksService.executeSql(clubsQuery).catch(() => []),
      databricksService.executeSql(eventsQuery).catch(() => []),
      databricksService.executeSql(researchQuery).catch(() => []),
      databricksService.executeSql(oppsQuery).catch(() => []),
    ]);

    const allItems = [];

    // Parse courses
    (courses || []).forEach((row) => {
      allItems.push({
        id: row.course_id || "",
        name: row.course_name || "",
        type: "Course",
        description: row.description || "",
        hours_per_week: parseFloat(row.hours_per_week || 3),
        skills: row.skills || "",
        prerequisites: (row.prerequisites || "")
          .split("|")
          .map((p) => p.trim())
          .filter((p) => p && p !== "None"),
        difficulty: row.difficulty || "Intermediate",
        category_or_department: row.department || "",
        faculty_or_organizer: row.faculty_id || "",
      });
    });

    // Parse clubs
    (clubs || []).forEach((row) => {
      allItems.push({
        id: row.club_id || "",
        name: row.club_name || "",
        type: "Club",
        description: row.description || "",
        hours_per_week: parseFloat(row.hours_per_week || 2),
        skills: row.skills || "",
        prerequisites: [],
        difficulty: "All Levels",
        category_or_department: row.category || "",
        faculty_or_organizer: "",
      });
    });

    // Parse events
    (events || []).forEach((row) => {
      allItems.push({
        id: row.event_id || "",
        name: row.event_name || "",
        type: row.event_type || "Event",
        description: row.description || "",
        hours_per_week: parseFloat(row.duration_hours || 2),
        skills: row.skills || "",
        prerequisites: [],
        difficulty: "Open",
        category_or_department: "",
        faculty_or_organizer: row.organizer || "",
      });
    });

    // Parse research
    (research || []).forEach((row) => {
      allItems.push({
        id: row.research_id || "",
        name: row.title || "",
        type: "Research Project",
        description: row.description || "",
        hours_per_week: parseFloat(row.hours_per_week || 5),
        skills: row.skills || "",
        prerequisites: (row.prerequisites || "")
          .split("|")
          .map((p) => p.trim())
          .filter((p) => p && p !== "None"),
        difficulty: row.difficulty || "Advanced",
        category_or_department: row.department || "",
        faculty_or_organizer: row.faculty || "",
      });
    });

    // Parse opportunities
    (opps || []).forEach((row) => {
      allItems.push({
        id: row.opportunity_id || "",
        name: row.title || "",
        type: row.type || "Opportunity",
        description: row.description || "",
        hours_per_week: parseFloat(row.hours_per_week || 10),
        skills: row.skills || "",
        prerequisites: (row.prerequisites || "")
          .split("|")
          .map((p) => p.trim())
          .filter((p) => p && p !== "None"),
        difficulty: "Selective",
        category_or_department: row.career_domains || "",
        faculty_or_organizer: row.organization || "",
      });
    });

    // Score and rank all items
    const scoredOpps = allItems.map((raw) => {
      const { score, reasons } = scoringService.calculateScore(raw, studentProfile);
      const skillsList = (raw.skills || "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);

      return {
        id: raw.id,
        name: raw.name,
        type: raw.type,
        description: raw.description,
        hours_per_week: raw.hours_per_week,
        skills_developed: skillsList,
        prerequisites: raw.prerequisites,
        difficulty: raw.difficulty,
        score,
        match_reasons: reasons,
        category_or_department: raw.category_or_department,
        faculty_or_organizer: raw.faculty_or_organizer,
      };
    });

    return scoredOpps.sort((a, b) => b.score - a.score);
  }
}

export const recommendationService = new RecommendationService();
