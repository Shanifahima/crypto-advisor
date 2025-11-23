import mongoose from "mongoose";

const preferencesSchema = new mongoose.Schema(
  {
    cryptoAssets: [String],          // e.g. ["bitcoin", "ethereum"]
    investorType: String,           // e.g. "HODLer"
    contentTypes: [String]          // e.g. ["Market News", "Charts"]
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    preferences: preferencesSchema,
    onboardingCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
