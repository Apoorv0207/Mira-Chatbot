const express = require("express");
const router = express.Router();
const SavedProperty = require("../models/SavedProperty");
const { protect } = require("../middleware/auth");

// All routes require login
router.use(protect);

// GET /api/saved — only this user's saved properties
router.get("/", async (req, res) => {
  try {
    const saved = await SavedProperty.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/saved — save a property for this user
router.post("/", async (req, res) => {
  try {
    const property = new SavedProperty({ ...req.body, userId: req.user._id });
    await property.save();
    res.status(201).json({ message: "Property saved! ❤️", property });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Already saved!" });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/saved/:id — only owner can delete
router.delete("/:id", async (req, res) => {
  try {
    const property = await SavedProperty.findOne({ _id: req.params.id, userId: req.user._id });
    if (!property) return res.status(404).json({ error: "Not found or not yours" });
    await property.deleteOne();
    res.json({ message: "Property removed from saved." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
