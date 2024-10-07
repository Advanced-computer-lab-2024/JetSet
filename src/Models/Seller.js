const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const sellerSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    seller_name: {
      type: String,
    }, // For Sellers
    seller_description: {
      type: String,
    }, // For Sellers
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
