const mongoose = require("mongoose");

const LostItemSchema = new mongoose.Schema(
  {
    lostItemId: {
      type: String,
      required: true,
      unique: true,
    },
    pickupStation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    foundDate: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostItem", LostItemSchema);
