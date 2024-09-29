const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const tourGuideSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    years_of_experience: Number, // For Tour Guides
    previous_work: String, // For Tour Guides
  }, { timestamps: true });
  
  const TourGuide = mongoose.model('TourGuide', tourGuideSchema);
  module.exports = TourGuide;