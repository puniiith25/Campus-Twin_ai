import express from "express";
import { whatIfService } from "../services/whatIfService.js";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const result = whatIfService.executeScenario(req.body);
    return res.json(result);
  } catch (err) {
    console.error("What-If route error:", err);
    return res.status(500).json({ error: "Failed to process What-If scenario" });
  }
});

export default router;
