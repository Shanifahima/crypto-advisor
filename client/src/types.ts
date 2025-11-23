export type User = {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
};

export type Preferences = {
  cryptoAssets: string[];
  investorType: string;
  contentTypes: string[];
};

export type MarketNewsItem = {
  id: string;
  title: string;
  url: string;
  source?: string;
  summary?: string;
};

export type AiInsight = {
  id: string;
  text: string;
  meta?: Record<string, unknown>;
};

export type Meme = {
  id: string;
  url: string;
  caption: string;
};

export type DashboardData = {
  marketNews: MarketNewsItem[];
  coinPrices: Record<
    string,
    {
      usd: number;
      usd_24h_change?: number;
    }
  >;
  aiInsight: AiInsight;
  meme: Meme;
};
