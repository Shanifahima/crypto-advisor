import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/auth.js";
import Feedback from "../models/Feedback.js";
import { getRandomMeme } from "../utils/memes.js";
import { generateAiInsight } from "../utils/aiInsight.js";
import { newsFallback } from "../utils/newsFallback.js";

dotenv.config();
const router = express.Router();

// GET /api/dashboard
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const prefs = user.preferences || {};
    const assets = prefs.cryptoAssets || ["bitcoin", "ethereum"];

    // 1. Coin prices from CoinGecko
    const coingeckoBase = process.env.COINGECKO_API_BASE || "https://api.coingecko.com/api/v3";

    const priceUrl = `${coingeckoBase}/simple/price?ids=${assets.join(
      ","
    )}&vs_currencies=usd&include_24hr_change=true`;

    let coinPrices = {};
    try {
      const priceRes = await axios.get(priceUrl);
      coinPrices = priceRes.data;
    } catch (err) {
      console.error("CoinGecko error", err.message);
      coinPrices = {};
    }

    // 2. Market News (CryptoPanic or fallback)
    let news = newsFallback;
    const token = process.env.CRYPTOPANIC_API_TOKEN;
    if (token) {
      try {
        const newsRes = await axios.get(
          `https://cryptopanic.com/api/v1/posts/`,
          {
            params: {
              auth_token: token,
              kind: "news",
              currencies: assets.join(",")
            }
          }
        );

        news =
          newsRes.data?.results?.map(post => ({
            id: post.id,
            title: post.title,
            url: post.url,
            source: post.source?.title,
            summary: post.domain
          })) || newsFallback;
      } catch (err) {
        console.error("CryptoPanic error, using fallback", err.message);
      }
    }

    // 3. AI Insight of the Day
    const aiInsight = generateAiInsight(prefs);

    // 4. Random Meme
    const meme = getRandomMeme();

    res.json({
      marketNews: news,
      coinPrices,
      aiInsight,
      meme
    });
  } catch (err) {
    console.error("Dashboard error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/dashboard/feedback
router.post("/feedback", authMiddleware, async (req, res) => {
  try {
    const { section, vote, contentId, metadata } = req.body;
    if (!["marketNews", "coinPrices", "aiInsight", "meme"].includes(section)) {
      return res.status(400).json({ message: "Invalid section" });
    }
    if (![1, -1].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote" });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      section,
      vote,
      contentId,
      metadata
    });

    res.status(201).json({ message: "Feedback stored", feedbackId: feedback._id });
  } catch (err) {
    console.error("Feedback error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
