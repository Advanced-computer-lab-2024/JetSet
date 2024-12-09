// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const historicalSchema = new Schema(
//   {
//     Name: {
//       type: String,
//       required: true,
//     },
//     Description: String,
//     location: {
//       address: String,
//       coordinates: {
//         lat: Number,
//         lng: Number,
//       },
//     },
//     Pictures: [String], // Array of image URLs
//     opening_hours: String,

//     tags: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "HistoricalTags",
//       },
//     ],
//     TicketPricesF: {
//       type: Number,
//       required: true,
//     },
//     TicketPricesN: {
//       type: Number,
//       required: true,
//     },
//     TicketPricesS: {
//       type: Number,
//       required: true,
//     },
//     managed_by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "TourismGoverner", // Reference to Tourism Governor
//     },
//   },
//   { timestamps: true }
// );

// const Historical = mongoose.model("Historical", historicalSchema);
// module.exports = Historical;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Description: String,
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    Pictures: [String], // Array of image URLs
    opening_hours: String,

    tags: [String],

    TicketPricesF: {
      type: Number,
      required: true,
    },
    TicketPricesN: {
      type: Number,
      required: true,
    },
    TicketPricesS: {
      type: Number,
      required: true,
    },
    managed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TourismGoverner", // Reference to Tourism Governor
      required: false,
    },
  },
  { timestamps: true }
);

const Historical = mongoose.model("Historical", historicalSchema);
module.exports = Historical;
