import express from "express";
import { pathService } from "../services/pathService.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { goal = "AI Engineer", available_hours = 6.0, skills = ["Python"], interests = ["AI", "Machine Learning"] } = req.body;

  const student = {
    goal,
    available_hours_per_week: parseFloat(available_hours),
    skills,
    interests,
  };

  const paths = pathService.generatePathsForStudent(student);
  return res.json({ paths });
});

export default router;
