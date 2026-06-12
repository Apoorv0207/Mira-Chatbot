const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");
const { protect } = require("../middleware/auth");

// All routes are protected
router.use(protect);

// GET /api/history — load user's chat history
router.get("/", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/history — save a message (or batch of messages)
// POST /api/history — save a batch of messages
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const docs = messages.map((m) => ({
      userId: req.user._id,
      from: m.from || "bot",
      text: m.text || "",
      type: m.type || "text",
      properties: m.properties || [],
    }));

    await ChatMessage.insertMany(docs, { ordered: false });
    res.status(201).json({ saved: docs.length });
  } catch (err) {
    console.error("History save error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history — clear user's entire chat history
router.delete("/", async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });
    res.json({ message: "Chat history cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
