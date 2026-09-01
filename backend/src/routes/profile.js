import express from "express";
import { userDatabase, profileDatabase, getAuthenticatedUser } from "./auth.js";
import { databricksService } from "../services/databricksService.js";

const router = express.Router();

// Helper to format student profile for recommendation engine
export function getStandardizedProfile(userId) {
  const profile = profileDatabase.get(userId) || profileDatabase.get("usr_demo_01");
  return {
    student_id: userId,
    name: profile.preferredName || "Student",
    goal: (profile.careerGoals && profile.careerGoals[0]) || "AI / ML Engineer",
    careerGoals: profile.careerGoals || ["AI / ML Engineer"],
    fieldOfStudy: profile.fieldOfStudy || "Computer Science",
    year: profile.year || 3,
    semester: profile.semester || 5,
    interests: profile.interests || ["Artificial Intelligence", "Hackathons"],
    skills: (profile.skills || ["Python"]).map((s) => ({
      name: typeof s === "string" ? s : s.name,
      level: profile.skillLevel || "Intermediate",
    })),
    skillLevel: profile.skillLevel || "Intermediate",
    skillsToImprove: profile.skillsToImprove || ["Machine Learning"],
    learningStyle: profile.learningStyle || ["Hands-on Projects"],
    sixMonthGoal: profile.sixMonthGoal || "Get an Internship",
    available_hours_per_week: parseFloat(profile.weeklyAvailableHours || 6.0),
    balancePreference: profile.balancePreference || "Career-focused",
    preferred_opportunity_types: profile.priorities || ["Courses", "Research", "Clubs"],
    careerCertainty: profile.careerCertainty || "I have a general direction",
  };
}

// 1. Get Current Student Profile
router.get("/", (req, res) => {
  const user = getAuthenticatedUser(req);
  const profile = profileDatabase.get(user.user_id) || profileDatabase.get("usr_demo_01");
  return res.json(profile);
});

// Natural language profile extraction endpoint
router.post("/extract-natural", (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text parameter is required" });
    }

    const lower = text.toLowerCase();
    const cgpaMatch = text.match(/([5-9](\.\d{1,2})?|10(\.0{1,2})?)\s*(cgpa|gpa)?/i);
    const semMatch = text.match(/(\d)(st|nd|rd|th)?\s*(sem|semester)/i);

    const skills = [];
    const skillKeywords = [
      "python", "c++", "java", "javascript", "sql", "react", "node.js",
      "machine learning", "data science", "git", "docker", "cloud", "statistics", "pytorch"
    ];
    skillKeywords.forEach((k) => {
      if (lower.includes(k)) {
        skills.push({
          name: k.charAt(0).toUpperCase() + k.slice(1),
          level: lower.includes(`advanced ${k}`) ? "Advanced" : "Intermediate",
        });
      }
    });

    const interests = [];
    if (lower.includes("ai") || lower.includes("artificial intelligence")) interests.push("Artificial Intelligence");
    if (lower.includes("data")) interests.push("Data Science");
    if (lower.includes("web") || lower.includes("software")) interests.push("Software Development");
    if (lower.includes("research")) interests.push("Academic Research");

    const projMatch = text.match(/(\d+)\s*(project|projects)/i);

    const extractedProfile = {
      name: "Student",
      department: lower.includes("ece") || lower.includes("electronics") ? "Electronics & Communication" : "Computer Science & Engineering",
      semester: semMatch ? parseInt(semMatch[1], 10) : 4,
      cgpa: cgpaMatch ? parseFloat(cgpaMatch[1]) : 8.2,
      skills: skills.length > 0 ? skills : [{ name: "Python", level: "Intermediate" }, { name: "C++", level: "Intermediate" }],
      interests: interests.length > 0 ? interests : ["Artificial Intelligence", "Data Science"],
      projectsCount: projMatch ? parseInt(projMatch[1], 10) : 2,
      careerGoal: lower.includes("ai") ? "AI Engineer" : lower.includes("data") ? "Data Scientist" : "Full-Stack Software Engineer",
      weeklyHours: 6,
    };

    return res.json({ success: true, extracted: extractedProfile, source: "backend-nlp-parser" });
  } catch (error) {
    console.error("Extraction error:", error);
    return res.status(500).json({ error: "Failed to extract profile" });
  }
});

// 2. Submit 15-Question Onboarding Survey
router.post("/onboarding", (req, res) => {
  const user = getAuthenticatedUser(req);
  const data = req.body;

  const newProfile = {
    user_id: user.user_id,
    preferredName: data.preferredName || user.name || "Student",
    fieldOfStudy: data.fieldOfStudy || "Computer Science",
    year: parseInt(data.year) || 3,
    semester: parseInt(data.semester) || 5,
    careerGoals: Array.isArray(data.careerGoals) ? data.careerGoals : [data.careerGoals || "AI / ML Engineer"],
    interests: Array.isArray(data.interests) ? data.interests : ["Artificial Intelligence"],
    skills: Array.isArray(data.skills) ? data.skills : ["Python"],
    skillLevel: data.skillLevel || "Intermediate",
    skillsToImprove: Array.isArray(data.skillsToImprove) ? data.skillsToImprove : ["Machine Learning"],
    campusActivities: Array.isArray(data.campusActivities) ? data.campusActivities : ["Technical Clubs"],
    learningStyle: Array.isArray(data.learningStyle) ? data.learningStyle : ["Hands-on Projects"],
    sixMonthGoal: data.sixMonthGoal || "Get an Internship",
    weeklyAvailableHours: parseFloat(data.weeklyAvailableHours) || 6.0,
    balancePreference: data.balancePreference || "Career-focused",
    priorities: Array.isArray(data.priorities) ? data.priorities : ["Courses", "Research", "Clubs"],
    careerCertainty: data.careerCertainty || "I have a general direction",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Save to profile database
  profileDatabase.set(user.user_id, newProfile);

  // Persist to Databricks Lakehouse SQL table
  databricksService.storeStudentProfile(newProfile);

  // Update user onboarding status
  const userObj = userDatabase.get(user.user_id);
  if (userObj) {
    userObj.onboarding_completed = true;
    userObj.name = newProfile.preferredName;
    userObj.updated_at = new Date().toISOString();
    userDatabase.set(user.user_id, userObj);
  }

  return res.json({
    success: true,
    message: "Onboarding completed successfully",
    profile: newProfile,
    summary: `${newProfile.preferredName} (${newProfile.fieldOfStudy}, Year ${newProfile.year}). Goal: ${newProfile.careerGoals.join(", ")}. Skills: ${newProfile.skills.join(", ")}. Available: ${newProfile.weeklyAvailableHours}h/wk.`,
  });
});

// 3. Update Existing Profile
router.post("/update", (req, res) => {
  const user = getAuthenticatedUser(req);
  const existing = profileDatabase.get(user.user_id) || {};
  const updated = {
    ...existing,
    ...req.body,
    user_id: user.user_id,
    updated_at: new Date().toISOString(),
  };

  profileDatabase.set(user.user_id, updated);

  // Persist to Databricks Lakehouse SQL table
  databricksService.storeStudentProfile(updated);

  return res.json({ success: true, profile: updated });
});

export default router;
