import express from "express";
import Tool from "../models/Tool.js";

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    let responseText;

    const lower = prompt.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
      responseText = "Hello! How can I help you today?";
    } else if (lower.includes("time")) {
      responseText = `Current time is ${new Date().toLocaleTimeString()}`;
    } else if (lower.includes("date")) {
      responseText = `Today's date is ${new Date().toLocaleDateString()}`;
    } else if (lower.includes("your name")) {
      responseText = "I am Gemini AI, your assistant.";
    } else {
      responseText = "I'm a free AI mock. I can't fully solve everything yet.";
    }

    const toolEntry = new Tool({ prompt, response: responseText });
    await toolEntry.save();

    res.json({ answer: responseText });
  } catch (err) {
    console.error("AI generate error:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
});


router.get("/history", async (req, res) => {
  try {
    const history = await Tool.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("AI history error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
