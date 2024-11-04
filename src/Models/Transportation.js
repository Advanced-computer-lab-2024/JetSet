// Models/Transportation.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transportationSchema = new Schema(
  {
    type: {
      type: String, // e.g., "car", "bus", "train"
      required: true,
    },
    company: {
      type: String, // Transportation company name
      required: true,
    },
    price: {
      type: Number, // Price per trip
      required: true,
    },
    availability: {
      type: Date, // Availability date
    },
    pickup_location: {
      type: String, // Starting location
      required: true,
    },
    dropoff_location: {
      type: String, // Destination
      required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advertiser",
    }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transportation", transportationSchema);