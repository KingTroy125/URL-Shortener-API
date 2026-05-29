import mongoose from "mongoose";

// Define the ShortUrl schema
const shortUrlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the ShortUrl model
const ShortUrl = mongoose.models.ShortUrl || mongoose.model("ShortUrl", shortUrlSchema);

export default ShortUrl;
