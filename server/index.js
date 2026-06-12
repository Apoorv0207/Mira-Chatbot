require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const chatRoutes = require("./routes/chat");
const savedRoutes = require("./routes/saved");
const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/chatHistory");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "Mira is running 🏠" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
