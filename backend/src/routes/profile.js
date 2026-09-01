import express from "express";

const router = express.Router();

let currentProfile = {
  student_id: "demo_student_01",
  name: "Alex Morgan",
  goal: "AI Engineer",
  interests: ["AI", "Machine Learning", "Research"],
  skills: [
    { name: "Python", level: "Intermediate" },
    { name: "SQL", level: "Beginner" },
  ],
  available_hours_per_week: 6.0,
  preferred_opportunity_types: ["Course", "Research", "Club"],
  career_interest_weight: 0.4,
  research_interest_weight: 0.3,
  networking_interest_weight: 0.3,
};

router.get("/", (req, res) => {
  return res.json(currentProfile);
});

router.post("/", (req, res) => {
  currentProfile = { ...currentProfile, ...req.body };
  return res.json(currentProfile);
});

export default router;
