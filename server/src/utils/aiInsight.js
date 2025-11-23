export const generateAiInsight = (userPreferences) => {
  const { investorType, cryptoAssets = [], contentTypes = [] } =
    userPreferences || {};

  const assetList = cryptoAssets.length ? cryptoAssets.join(", ") : "your top coins";
  const style =
    investorType || "crypto investor";

  return {
    id: `ai-${Date.now()}`,
    text: `As a ${style}, consider setting clear entry and exit rules for ${assetList}. 
Even in volatile markets, having a plan can reduce emotional decisions. This is not financial advice, just a friendly AI nudge 🙂`,
    meta: {
      investorType,
      contentTypes
    }
  };
};
