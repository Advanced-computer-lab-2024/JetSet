const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Percentage or fixed discount
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }, // Reference to the admin who created it
});

module.exports = mongoose.model("PromoCode", PromoCodeSchema);
