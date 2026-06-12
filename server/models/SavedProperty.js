const mongoose = require("mongoose");

const savedPropertySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: String, required: true },
    title: String,
    price: Number,
    location: String,
    bedrooms: Number,
    bathrooms: Number,
    size: String,
    amenities: [String],
    images: [String],
  },
  { timestamps: true }
);

// Prevent saving the same property twice for the same user
savedPropertySchema.index({ propertyId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("SavedProperty", savedPropertySchema);
