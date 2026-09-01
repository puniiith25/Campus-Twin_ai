import express from "express";
import { recommendationService } from "../services/recommendationService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { type, skill, difficulty, max_hours } = req.query;
    const student = {
      goal: "AI Engineer",
      available_hours_per_week: 6.0,
      skills: [{ name: "Python", level: "Intermediate" }],
      interests: ["AI", "Machine Learning"],
    };

    const allOpps = await recommendationService.getRecommendations(student);

    const filtered = allOpps.filter((opp) => {
      if (type && !opp.type.toLowerCase().includes(type.toLowerCase())) {
        return false;
      }
      if (
        skill &&
        !opp.skills_developed.some((s) => s.toLowerCase().includes(skill.toLowerCase()))
      ) {
        return false;
      }
      if (difficulty && !opp.difficulty.toLowerCase().includes(difficulty.toLowerCase())) {
        return false;
      }
      if (max_hours && opp.hours_per_week > parseFloat(max_hours)) {
        return false;
      }
      return true;
    });

    return res.json(filtered);
  } catch (err) {
    console.error("Opportunities list error:", err);
    return res.status(500).json({ error: "Failed to fetch opportunities" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = { goal: "AI Engineer", available_hours_per_week: 6.0 };
    const allOpps = await recommendationService.getRecommendations(student);
    const found = allOpps.find((opp) => opp.id.toLowerCase() === id.toLowerCase());

    if (!found) {
      return res.status(404).json({ error: `Opportunity '${id}' not found` });
    }

    return res.json(found);
  } catch (err) {
    console.error("Opportunity detail error:", err);
    return res.status(500).json({ error: "Failed to fetch opportunity detail" });
  }
});

export default router;
