const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    seller_id: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        touristId: {
          type: Schema.Types.ObjectId,
          ref: "Tourist",
          required: true,
        },
        reviewText: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    quantity: Number,
    sales: {
      type: Number,
      default: 0, // Default to 0 if not specified
    },
    archive: {
      type: Boolean,
      default: false, // Default to false if not specified
    },

    images: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
