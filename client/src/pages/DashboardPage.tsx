import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DashboardSection from "../components/DashboardSection";
import { DashboardData } from "../types";
import { getDashboard, sendFeedback } from "../api/dashboard";

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboard();
      setData(res);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const vote = async (
    section: "marketNews" | "coinPrices" | "aiInsight" | "meme",
    voteValue: 1 | -1,
    contentId?: string
  ) => {
    try {
      await sendFeedback(section, voteValue, contentId);
    } catch (err) {
      console.error("Feedback error", err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-sm text-slate-300">Loading dashboard...</p>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <p className="text-sm text-rose-400 mb-4">{error}</p>
        <button
          onClick={loadDashboard}
          className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sm"
        >
          Retry
        </button>
      </Layout>
    );
  }

  const { marketNews, coinPrices, aiInsight, meme } = data;

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Daily Crypto Dashboard</h1>
        <button
          onClick={loadDashboard}
          className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Market News */}
        <DashboardSection
          title="Market News"
          onVoteUp={() => vote("marketNews", 1)}
          onVoteDown={() => vote("marketNews", -1)}
        >
          <ul className="space-y-2 text-sm">
            {marketNews.map(item => (
              <li
                key={item.id}
                className="border-b border-slate-800 pb-2 last:border-0 last:pb-0"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-emerald-400 hover:underline"
                >
                  {item.title}
                </a>
                <div className="text-xs text-slate-400">
                  {item.source} {item.summary ? "• " + item.summary : ""}
                </div>
              </li>
            ))}
          </ul>
        </DashboardSection>

        {/* Coin Prices */}
        <DashboardSection
          title="Coin Prices"
          onVoteUp={() => vote("coinPrices", 1)}
          onVoteDown={() => vote("coinPrices", -1)}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-400">
                <th className="text-left py-1">Coin</th>
                <th className="text-right py-1">Price (USD)</th>
                <th className="text-right py-1">24h %</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(coinPrices).map(([id, info]) => (
                <tr key={id} className="border-t border-slate-800">
                  <td className="py-1 capitalize">{id}</td>
                  <td className="py-1 text-right">${info.usd.toFixed(2)}</td>
                  <td
                    className={`py-1 text-right ${
                      (info.usd_24h_change || 0) >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {(info.usd_24h_change || 0).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardSection>

        {/* AI Insight */}
        <DashboardSection
          title="AI Insight of the Day"
          onVoteUp={() => vote("aiInsight", 1, aiInsight.id)}
          onVoteDown={() => vote("aiInsight", -1, aiInsight.id)}
        >
          <p className="text-sm text-slate-200 whitespace-pre-line">
            {aiInsight.text}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Not financial advice. For educational purposes only.
          </p>
        </DashboardSection>

        {/* Meme */}
        <DashboardSection
          title="Fun Crypto Meme"
          onVoteUp={() => vote("meme", 1, meme.id)}
          onVoteDown={() => vote("meme", -1, meme.id)}
        >
          <div className="flex flex-col gap-2 items-center">
            <img
              src={meme.url}
              alt={meme.caption}
              className="rounded-lg max-h-64 object-contain border border-slate-800"
            />
            <p className="text-xs text-slate-300">{meme.caption}</p>
          </div>
        </DashboardSection>
      </div>
    </Layout>
  );
};

export default DashboardPage;
