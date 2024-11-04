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
      ref: "Seller"
    }, // added
    ratings: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviews: [String],
    quantity: Number,
    images: [String],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
