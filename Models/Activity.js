const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    title: {
      type: String,
      required: true, // Optional field
    },
    budget: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      /*coordinates: {
        lat: Number, // Optional
        lng: Number  // Optional
      }*/
    },

    // price: {
    //     fixed: Number, // Optional
    //     range: {
    //       min: Number, // Optional
    //       max: Number  // Optional
    //     },
    // },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ], // Optional array of tags

    special_discount: {
      type: String,
      required: true,
      default: "0", // Default as string
    }, // Optional field

    booking_open: {
      type: Boolean,
      //default: true,
    },

    budget: Number,
    rating: {
      type: Number,
      min: 0,
      max: 5,
    }, // Optional field
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

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertiser",
    }, // Optional reference to creator
    flag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
