const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const guestSchema = new Schema(
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
    role: {
      type: String,
      required: true,
    },
    document: { type: [String] },
    flag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Guest = mongoose.model("Guest", guestSchema);
module.exports = Guest;
