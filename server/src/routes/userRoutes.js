import express from "express";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// GET /api/user/me
router.get("/me", authMiddleware, async (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    preferences: user.preferences,
    onboardingCompleted: user.onboardingCompleted
  });
});

// PUT /api/user/preferences
router.put("/preferences", authMiddleware, async (req, res) => {
  try {
    const { cryptoAssets, investorType, contentTypes } = req.body;

    req.user.preferences = {
      cryptoAssets,
      investorType,
      contentTypes
    };
    req.user.onboardingCompleted = true;
    await req.user.save();

    res.json({
      message: "Preferences updated",
      preferences: req.user.preferences,
      onboardingCompleted: req.user.onboardingCompleted
    });
  } catch (err) {
    console.error("Update preferences error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
