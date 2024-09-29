const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;


const itinerarySchema = new Schema({
    activities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    }],
    locations: [String], // List of locations to visit
    timeline: String,
    duration: String,
    language: String,
    price: Number,
    availability_dates: [Date],
    pickup_location: String,
    dropoff_location: String,
    accessibility: String,
    budget: Number,
    tag: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'  // Referencing the Tag model
      }],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourGuide', // Tour Guide reference
      required: true
    }
  }, { timestamps: true });
  
  const Itinerary = mongoose.model('Itinerary', itinerarySchema);
  module.exports = Itinerary;
  