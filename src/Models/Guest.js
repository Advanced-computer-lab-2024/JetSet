const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const guestSchema = new Schema({
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
    }
  }, { timestamps: true });
  
  const Guest = mongoose.model('Guest', guestSchema);
  module.exports = Guest;