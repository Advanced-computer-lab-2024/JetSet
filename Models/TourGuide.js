const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    years_of_experience: Number, // For Tour Guides
    previous_work: String, // For Tour Guides
    images: {
      type: [String],
      default: [],
    },
    document: { type: [String] },
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
    resetOtp: { type: String },
  },
  { timestamps: true }
);

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);
module.exports = TourGuide;
