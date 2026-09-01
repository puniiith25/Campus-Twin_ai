import express from "express";
import { compareService } from "../services/compareService.js";
import { pathService } from "../services/pathService.js";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { path_a, path_b, student_profile } = req.body;
    const student = {
      goal: student_profile?.goal || "AI Engineer",
      available_hours_per_week: parseFloat(student_profile?.available_hours_per_week || 6.0),
      interests: student_profile?.interests || [],
    };

    const defaultPaths = pathService.generatePathsForStudent(student);
    const finalPathA = path_a || defaultPaths[0];
    const finalPathB = path_b || defaultPaths[1];

    const result = compareService.comparePaths(finalPathA, finalPathB, student);
    return res.json(result);
  } catch (err) {
    console.error("Compare route error:", err);
    return res.status(500).json({ error: "Failed to compare paths" });
  }
});

export default router;
