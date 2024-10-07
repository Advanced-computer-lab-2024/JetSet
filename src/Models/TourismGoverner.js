const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const tourismGovernerSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
    },

    Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TourismGoverner = mongoose.model(
  "TourismGoverner",
  tourismGovernerSchema
);
module.exports = TourismGoverner;
