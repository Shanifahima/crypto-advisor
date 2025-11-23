import api from "./client";
import { DashboardData } from "../types";

export const getDashboard = async () => {
  const res = await api.get<DashboardData>("/dashboard");
  return res.data;
};

export const sendFeedback = async (
  section: "marketNews" | "coinPrices" | "aiInsight" | "meme",
  vote: 1 | -1,
  contentId?: string,
  metadata?: Record<string, unknown>
) => {
  const res = await api.post("/dashboard/feedback", {
    section,
    vote,
    contentId,
    metadata
  });
  return res.data;
};
