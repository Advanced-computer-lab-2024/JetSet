const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historicalSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: String,
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },
    pictures: [String], // Array of image URLs
    opening_hours: String,
    ticket_prices: Number,
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HistoricalTags'
      }], 
    managed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TourismGoverner', // Reference to Tourism Governor
      required: true
    }
  }, { timestamps: true });
  
  const Historical = mongoose.model('Historical', historicalSchema);
  module.exports = Historical;
  