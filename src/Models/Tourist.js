const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const touristSchema = new Schema(
  {
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
    preferences: {
      historicAreas: { type: Boolean, default: false },
      beaches: { type: Boolean, default: false },
      familyFriendly: { type: Boolean, default: false },
      shopping: { type: Boolean, default: false },
      budget: { type: Number, default: 0 },
    },

    mobile_number: String,
    nationality: String,
    DOB: Date,
    job: String,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    wallet: { type: Number, default: 0 },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badge: {
      type: String,
      default: "Bronze",
    },
    bookedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    bookedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    bookedTransportations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transportation",
      },
    ],
    payedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    payedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
    payedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    preferredCurrency: {
      type: String,
      default: "EGP",
    },

    // Added a bookmarkedActivities field
    bookmarkedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    bookmarkedIteniraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary",
      },
    ],
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;
