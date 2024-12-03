const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const tourismGovernerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensure usernames are unique
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    resetOtp: { type: String },
  },
  { timestamps: true }
);

const TourismGoverner = mongoose.model(
  "TourismGoverner",
  tourismGovernerSchema
);
module.exports = TourismGoverner;
