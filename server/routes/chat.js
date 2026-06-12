const express = require("express");
const router = express.Router();
const { filterProperties } = require("../utils/mergeData");
const { parseQuery } = require("../utils/parseQuery");

// POST /api/chat
// Body: { message: "3bhk in Delhi under 80 lakhs" }
router.post("/", (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Parse natural language → structured filters
    const filters = parseQuery(message);

    // Filter merged properties
    const results = filterProperties(filters);

    // Build a friendly bot reply
    let reply;
    if (results.length === 0) {
      reply = "I couldn't find any properties matching your criteria. Try adjusting your budget or location!";
    } else {
      reply = `I found ${results.length} propert${results.length === 1 ? "y" : "ies"} for you! 🏠`;
    }

    res.json({
      reply,
      filters,         // send back so frontend can show what was parsed
      properties: results,
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

module.exports = router;
