import React, { useState } from "react";
import Layout from "../components/Layout";
import { updatePreferences } from "../api/user";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/user";       // ADD THIS
import { useAuth } from "../context/AuthContext";  // ADD THIS

const assetOptions = ["bitcoin", "ethereum", "solana", "cardano", "dogecoin"];
const investorTypes = ["HODLer", "Day Trader", "NFT Collector", "DeFi Explorer"];
const contentOptions = ["Market News", "Charts", "Social", "Fun"];

const OnboardingPage: React.FC = () => {
  const [cryptoAssets, setCryptoAssets] = useState<string[]>(["bitcoin"]);
  const [investorType, setInvestorType] = useState<string>("HODLer");
  const [contentTypes, setContentTypes] = useState<string[]>(["Market News"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const toggleInArray = (value: string, arr: string[], setFn: (v: string[]) => void) => {
    if (arr.includes(value)) setFn(arr.filter(x => x !== value));
    else setFn([...arr, value]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updatePreferences({ cryptoAssets, investorType, contentTypes });
      // NEW: update global user
      const me = await getMe();   // import getMe()
      setAuth(localStorage.getItem("token")!, me);  // update context user
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h1 className="text-xl font-semibold mb-4">Onboarding</h1>
        <p className="text-sm text-slate-300 mb-4">
          Help us understand your crypto style so we can personalize your dashboard.
        </p>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="font-medium mb-2 text-sm">
              What crypto assets are you interested in?
            </h2>
            <div className="flex flex-wrap gap-2">
              {assetOptions.map(asset => (
                <button
                  key={asset}
                  type="button"
                  onClick={() => toggleInArray(asset, cryptoAssets, setCryptoAssets)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    cryptoAssets.includes(asset)
                      ? "bg-emerald-500/10 border-emerald-500"
                      : "bg-slate-950 border-slate-700"
                  }`}
                >
                  {asset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-medium mb-2 text-sm">What type of investor are you?</h2>
            <select
              value={investorType}
              onChange={e => setInvestorType(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm w-full"
            >
              {investorTypes.map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="font-medium mb-2 text-sm">
              What kind of content would you like to see?
            </h2>
            <div className="flex flex-wrap gap-2">
              {contentOptions.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleInArray(opt, contentTypes, setContentTypes)}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    contentTypes.includes(opt)
                      ? "bg-emerald-500/10 border-emerald-500"
                      : "bg-slate-950 border-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Saving..." : "Continue to dashboard"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default OnboardingPage;
