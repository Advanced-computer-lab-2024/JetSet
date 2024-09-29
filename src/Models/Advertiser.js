const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const advertiserSchema = new Schema({
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    company_name: String, // For Advertisers
    website: String, // For Advertisers
    hotline: String, // For Advertisers
  }, { timestamps: true });
  
  const Advertiser = mongoose.model('Advertiser', advertiserSchema);
  module.exports = Advertiser;