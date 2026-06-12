const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: String, required: true },
    text: { type: String, default: "" },
    type: { type: String, default: "text" },
    properties: { type: mongoose.Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

chatMessageSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);