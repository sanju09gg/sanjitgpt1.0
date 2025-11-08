import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 4040;

app.use(express.json());
app.use(cookieParser());

// ✅ Correct CORS config
app.use(
  cors({
    origin: "https://sanjitgpt-frontend1.onrender.com", // exact frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies
  })
);

// routes
app.use("/api", chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to Database!");
  } catch (err) {
    console.log("Failed to connect!", err);
  }
};

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});


