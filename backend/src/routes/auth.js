import express from "express";
import { OAuth2Client } from "google-auth-library";
import { config } from "../config.js";

const router = express.Router();
const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

// In-memory user session directory
const userDirectory = new Map();

router.post("/google", async (req, res) => {
  const { credential, client_id } = req.body;

  if (!credential) {
    return res.status(400).json({ error: "credential token is required" });
  }

  try {
    let payload = null;

    // Verify token if Google Client ID is configured
    if (config.GOOGLE_CLIENT_ID) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: client_id || config.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else {
      // Decode JWT payload for demo/local mode
      const base64Payload = credential.split(".")[1];
      const decodedJson = Buffer.from(base64Payload, "base64").toString("utf-8");
      payload = JSON.parse(decodedJson);
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
    };

    userDirectory.set(user.id, user);

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("Google auth verification error:", err);
    return res.status(401).json({ error: "Failed to authenticate Google credential" });
  }
});

export default router;
