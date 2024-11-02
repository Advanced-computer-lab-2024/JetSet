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
      budget: { type: Number, default: 0 }, // Default budget
    },
    
    mobile_number: String,
    nationality: String,
    DOB: Date,
    job: String,
    wallet: Number,
  },
  { timestamps: true }
);

const Tourist = mongoose.model("Tourist", touristSchema);
module.exports = Tourist;
