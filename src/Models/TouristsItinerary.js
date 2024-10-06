const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const touristItinerarySchema = new Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist" }, // Reference to the tourist
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  locations: [
    {
      address: {
        type: String,
        required: true, // Make address required
      },
      coordinates: {
        lat: {
          type: Number,
          required: false, // Optional
        },
        lng: {
          type: Number,
          required: false, // Optional
        },
      },
    },
  ], // Locations to be visited
  dateRange: {
    startDate: Date,
    endDate: Date,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag", // Referencing the Tag model
    },
  ], // e.g., adventure, family, luxury
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourGuide', // Tour Guide reference
    required: true
  }
});

const TouristItinerary = mongoose.model(
  "TouristItinerary",
  touristItinerarySchema
);
module.exports = TouristItinerary;
