const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
  title: {
      type: String,
      required: true
  },
  budget: {
      type: Number,
      required: true
  },
  date: {
      type: Date,
      required: true
  },
  time: {
      type: String,
      required: true
  },
  location: {
      address: {
          type: String,
          required: true
      },
      coordinates: {
          lat: { type: Number },
          lng: { type: Number }
      }
  },
  price: {
      fixed: { type: Number },
      range: {
          min: { type: Number },
          max: { type: Number }
      }
  },
  category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
  },
  tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
  }],
  special_discount: {
      type: String,
      required: true,
      default: "0"
  },
  booking_open: {
      type: Boolean,
      default: true
  },
  budget: { type: Number },
  rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
  },
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
