import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    dbName: "crypto-advisor"
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });

export default mongoose;
