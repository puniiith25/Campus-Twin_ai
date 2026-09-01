import express from "express";
import { genieService } from "../services/genieService.js";
import { recommendationService } from "../services/recommendationService.js";

const router = express.Router();

// In-memory chat history store per user / session
const chatHistoryStore = new Map();

router.post("/", async (req, res) => {
  try {
    const { question, student_profile, conversation_id, user_id = "default_user" } = req.body;
    if (!question) {
      return res.status(400).json({ error: "question is required" });
    }

    const profileData = student_profile || {};
    const questionLower = question.toLowerCase();
    const stopwords = new Set([
      "i", "want", "to", "become", "a", "an", "the", "in", "and", "have", "know",
      "per", "week", "hours", "hour", "my", "is", "for", "with", "get", "what",
      "which", "how", "are", "help", "related", "tell", "about"
    ]);

    const words = questionLower
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").trim())
      .filter((w) => w && !stopwords.has(w) && w.length > 2);

    const inferredGoal = words.length > 0 ? words.join(" ") : profileData.goal || "AI Engineer";

    const student = {
      goal: inferredGoal,
      interests: [...(profileData.interests || []), ...words.map((w) => w.charAt(0).toUpperCase() + w.slice(1))],
      skills: profileData.skills || [{ name: "Python", level: "Intermediate" }],
      available_hours_per_week: parseFloat(profileData.available_hours_per_week || 6.0),
    };

    // 1. Genie Response
    const genieResp = await genieService.askGenie(question, student_profile);

    // 2. Recommendations matching the question intent
    const allRecommendations = await recommendationService.getRecommendations(student);
    const topRecommendations = allRecommendations.slice(0, 4);

    const chatResponse = {
      answer: genieResp.answer,
      recommendations: topRecommendations,
      conversation_id: genieResp.conversation_id || conversation_id,
      sources: genieResp.sources,
      query_executed: genieResp.query_executed,
    };

    // Save to user history
    if (!chatHistoryStore.has(user_id)) {
      chatHistoryStore.set(user_id, []);
    }
    chatHistoryStore.get(user_id).push({
      id: Date.now().toString(),
      question,
      response: chatResponse,
      timestamp: new Date().toISOString(),
    });

    return res.json(chatResponse);
  } catch (err) {
    console.error("Chat endpoint error:", err);
    return res.status(500).json({ error: "Internal chat server error" });
  }
});

// Databricks Genie query / structured response endpoint
router.post("/query", async (req, res) => {
  try {
    const { query, studentProfile } = req.body;
    if (!query) {
      return res.status(400).json({ error: "query is required" });
    }

    const target = studentProfile?.careerGoal || "AI Engineer";
    const hours = studentProfile?.weeklyHours || 6;
    const cgpa = studentProfile?.cgpa || 8.2;

    const genieResp = await genieService.askGenie(query, studentProfile);

    const structuredAnswer = {
      recommendation: genieResp.answer,
      why: `Your academic score (${cgpa} CGPA) clears recruitment cut-offs. With ${hours}h/week, you can systematically bridge prioritized technical gaps this semester.`,
      skillGaps: [
        "SQL (Intermediate for Lakehouse & analytics workflows)",
        "Model Deployment & Fast Execution (Docker & API integration)",
      ],
      relevantOpportunities: (genieResp.recommendations || []).slice(0, 2).map((r) => ({
        title: r.name || r.title,
        type: r.type || "Opportunity",
        provider: r.faculty_or_organizer || "Campus Innovation Cell",
        timeCommitment: `${r.hours_per_week || 4} hrs/week`,
      })),
      nextAction: "Enroll in your top matching opportunity to close your primary technical gap.",
      alternativePath: "Explore complementary software or research branches with your verified skill matrix.",
    };

    return res.json({
      success: true,
      answer: structuredAnswer,
      source: "campus-twin-databricks-engine",
    });
  } catch (err) {
    console.error("Genie query endpoint error:", err);
    return res.status(500).json({ error: "Failed to process Genie query" });
  }
});

// Chat history endpoints
router.get("/history", (req, res) => {
  const userId = req.query.user_id || "default_user";
  const history = chatHistoryStore.get(userId) || [];
  return res.json({ history });
});

router.delete("/history", (req, res) => {
  const userId = req.query.user_id || "default_user";
  chatHistoryStore.set(userId, []);
  return res.json({ message: "History cleared successfully" });
});

export default router;
