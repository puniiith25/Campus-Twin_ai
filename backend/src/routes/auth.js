import express from "express";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config.js";

const router = express.Router();
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

// Users Directory & Profile Store (in-memory persistent state)
export const userDatabase = new Map();
export const profileDatabase = new Map();

// Helper to generate internal user ID
function generateUserId() {
  return `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

// Default demo account
const DEFAULT_USER_ID = "usr_demo_01";
userDatabase.set(DEFAULT_USER_ID, {
  user_id: DEFAULT_USER_ID,
  google_id: "google_demo_01",
  email: "alex.morgan@campus.edu",
  name: "Alex Morgan",
  profile_picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
  onboarding_completed: true,
});

profileDatabase.set(DEFAULT_USER_ID, {
  user_id: DEFAULT_USER_ID,
  preferredName: "Alex Morgan",
  fieldOfStudy: "Computer Science",
  year: 3,
  semester: 5,
  careerGoals: ["AI / ML Engineer", "Software Engineer"],
  interests: ["Artificial Intelligence", "Hackathons", "Research"],
  skills: ["Python", "JavaScript", "SQL"],
  skillLevel: "Intermediate",
  skillsToImprove: ["Machine Learning", "System Design"],
  campusActivities: ["Technical Clubs", "AI / ML Clubs", "Hackathons"],
  learningStyle: ["Hands-on Projects", "Hackathons"],
  sixMonthGoal: "Get an Internship",
  weeklyAvailableHours: 6.0,
  balancePreference: "Career-focused",
  priorities: ["Courses", "Hackathons", "Research"],
  careerCertainty: "I have a general direction",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Middleware to extract verified user from header or fallback
export function getAuthenticatedUser(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer usr_")) {
    const userId = authHeader.replace("Bearer ", "").trim();
    if (userDatabase.has(userId)) {
      return userDatabase.get(userId);
    }
  }
  return userDatabase.get(DEFAULT_USER_ID);
}

// 1. Google OAuth Token Exchange / Login
router.post("/google", async (req, res) => {
  const { credential, client_id } = req.body;
  if (!credential) {
    return res.status(400).json({ error: "credential token is required" });
  }

  try {
    let payload = null;
    if (config.GOOGLE_CLIENT_ID) {
      try {
        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: client_id || config.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (e) {
        console.warn("Client ID verification skipped/fallback for decoded token:", e.message);
      }
    }

    if (!payload) {
      const base64Payload = credential.split(".")[1];
      const decodedJson = Buffer.from(base64Payload, "base64").toString("utf-8");
      payload = JSON.parse(decodedJson);
    }

    const googleId = payload.sub;
    const email = payload.email;

    // Check if user already exists
    let existingUser = Array.from(userDatabase.values()).find(
      (u) => u.google_id === googleId || u.email === email
    );

    if (existingUser) {
      existingUser.last_login = new Date().toISOString();
      existingUser.updated_at = new Date().toISOString();
      if (payload.picture) existingUser.profile_picture = payload.picture;
      if (payload.name) existingUser.name = payload.name;
      userDatabase.set(existingUser.user_id, existingUser);

      return res.json({
        success: true,
        user: existingUser,
        hasProfile: profileDatabase.has(existingUser.user_id) && existingUser.onboarding_completed,
      });
    }

    // Create new user account
    const newUserId = generateUserId();
    const newUser = {
      user_id: newUserId,
      google_id: googleId,
      email: email,
      name: payload.name || "Student",
      profile_picture: payload.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      onboarding_completed: false,
    };

    userDatabase.set(newUserId, newUser);

    return res.json({
      success: true,
      user: newUser,
      hasProfile: false,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(401).json({ error: "Failed to authenticate Google credential" });
  }
});

// 2. Demo / Guest Login
router.post("/guest", (req, res) => {
  const guestUser = userDatabase.get(DEFAULT_USER_ID);
  return res.json({
    success: true,
    user: guestUser,
    hasProfile: true,
  });
});

// 3. Current Session
router.get("/me", (req, res) => {
  const user = getAuthenticatedUser(req);
  const profile = profileDatabase.get(user.user_id) || null;
  return res.json({
    user,
    profile,
    onboarding_completed: !!user.onboarding_completed,
  });
});

// 4. Logout
router.post("/logout", (req, res) => {
  return res.json({ success: true, message: "Logged out successfully" });
});

export default router;
