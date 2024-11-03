const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const touristSchema = new Schema(
  {
    preferredCurrency: {
      type: String,
      default: "USD" // Set a default currency, like USD
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
    email: {
      type: String,
      required: true,
    },
    mobile_number: String,
    nationality: String,
    DOB: Date,
    job: String,
    wallet: Number,
  },
  
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;
