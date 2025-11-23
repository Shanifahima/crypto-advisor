import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    section: {
      type: String,
      enum: ["marketNews", "coinPrices", "aiInsight", "meme"],
      required: true
    },
    vote: { type: Number, enum: [1, -1], required: true },
    contentId: { type: String }, // e.g. article ID, coin id, meme id
    metadata: { type: Object }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
