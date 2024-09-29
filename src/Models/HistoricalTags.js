const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const historicalTagSchema = new Schema({
    type: {
      type: String,
      required: true
    },
    period: {
        type: String,
        required: true
      }

  }, { timestamps: true });
  
  const Tag = mongoose.model('HistoricalTags', historicalTagSchema);
  module.exports = Tag;