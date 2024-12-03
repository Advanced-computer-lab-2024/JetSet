const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    // Reference to the admin who created it
  },
  { timestamps: true }
);

module.exports = mongoose.model("PromoCode", PromoCodeSchema);
