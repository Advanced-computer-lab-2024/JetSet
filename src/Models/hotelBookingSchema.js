const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Hotel Booking Schema
const hotelBookingSchema = new mongoose.Schema({
  booked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  adults: {
    type: Number,
    required: true,
  },
  children: {
    type: Number,
    required: true,
  },
  destinationCode: {
    type: String,
    required: true,
  },
  paxes: [
    {
      type: {
        type: String,
        enum: ["AD", "CH"], // AD for Adult, CH for Child
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
    },
  ],
  rooms: {
    type: Number,
    default: 1, // Default to one room
  },
  status: {
    type: String,
    enum: ["pending", "booked", "failed"],
    default: "pending",
  },
  bookingReference: {
    type: String,
    unique: true,
  },
  response: {
    type: mongoose.Schema.Types.Mixed, // Stores response from the external API
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

module.exports = HotelBooking;
