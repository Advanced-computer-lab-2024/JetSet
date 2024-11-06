const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const itinerarySchema = new Schema(
  {
    name: {
      type: String,
      required: true, // Optional field
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    budget: Number,
    locations: [String], // List of locations to visit
    timeline: String,
    duration: String,
    language: String,
    availability_dates: [Date],
    pickup_location: String,
    dropoff_location: String,
    accessibility: String,
    tag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag", // Referencing the Tag model
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    ratings: [
      {
        touristId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tourist",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
        comment: { type: String, required: false },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // Default status is active
    },

    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourGuide", // Tour Guide reference
      required: false,
    },
    flag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", itinerarySchema);
module.exports = Itinerary;
