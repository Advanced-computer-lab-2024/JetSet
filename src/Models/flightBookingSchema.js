const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Flight Booking Schema
const flightBookingSchema = new mongoose.Schema({
  booked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    required: true,
  },
  adults: {
    type: Number,
    required: true,
  },
  maxPrice: {
    type: Number,
    default: 500, // Optional max price filter
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

const FlightBooking = mongoose.model("FlightBooking", flightBookingSchema);

module.exports = FlightBooking;
