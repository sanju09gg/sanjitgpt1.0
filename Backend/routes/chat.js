import express from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import Thread from "../models/Thread.js";
import getOpenAPIAIResponse from "../utils/openai.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/SecretToken.js";

const router = express.Router();

// POST /login
router.post("/login", async (req, res)=> {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }


    // 2️⃣ Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);



    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // 3️⃣ Create JWT token
    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // true in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // 5️⃣ Send response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

// 🟢 Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });



    const user = await User.create({
      username,
      email,
      password,
    });



    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // set to true in production
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// Logout Route
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // set to true in production (HTTPS)
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
});


// Test route
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "hii",
      title: "Testing New Thread 0",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

// Get all threads
router.post("/thread", async (req, res) => {
  try {
    const { userId } = req.body;

    const allThreads = await Thread.find({ user: userId }).sort({ updatedAt: -1 });
    
    res.json(allThreads);
  } catch (err) {
    console.log("Failed to load threads!", err);
    res.status(500).json({ error: "Failed to load threads" });
  }
});


// Get one thread by threadId
router.get("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "No thread found!" });
    }
    res.json(thread.message);
  } catch (err) {
    console.log("Failed to load thread!", err);
    res.status(500).json({ error: "Failed to fetch the thread" });
  }
});

// Delete a thread
router.delete("/thread/:threadId", async (req, res) => {

  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "No thread found to be deleted!" });
    }
     await User.updateMany(
      { threads: deletedThread._id },
      { $pull: { threads:  deletedThread._id  } }
  );
 
    res.status(200).json({ success: "Thread is deleted successfully." });
  } catch (err) {
    console.log("Failed to delete the thread!", err);
    res.status(500).json({ error: "Failed to delete the thread" });
  }
});

// Chat route
router.post("/chat", async (req, res) => {
  try {
    const { threadId, message, userId, privateChat } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required!" });
    }

    // ✅ Get reply from Gemini (backend handles AI)
    const reply = await getOpenAPIAIResponse(message);

    // ✅ If guest or private → No saving
    if (privateChat || !userId) {
      return res.json({ reply });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        user: user._id,
        title: message,
        message: [{ role: "user", content: message }],
      });

      await thread.save();
      user.threads.push(thread._id);
      await user.save();
    } else {
      thread.message.push({ role: "user", content: message });
    }

    // ✅ Store assistant reply
    thread.message.push({ role: "assistant", content: reply });
    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply });

  } catch (err) {
    console.error("Failed to update thread:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.get("/verify", verifyToken, async (req, res) => {
  try {
    // `req.user` was set by verifyToken middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
