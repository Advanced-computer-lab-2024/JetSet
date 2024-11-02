const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const tourGuideSchema = new Schema(
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
    mobile_number: {
      type: String,
      required: false,
    },
    ratings: [
      {
        touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 }, // Rating between 1 and 5
        comment: { type: String, required: false },
      },
    ],
    years_of_experience: {
      type: Number,
      required: true,
    },
    previous_work: {
      type: String,
      required: false,
    },
    
 
  },
  { timestamps: true }
);

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
module.exports = TourGuide;
