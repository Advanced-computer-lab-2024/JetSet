const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const tagSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    type:{
      type: String,
      required: true
    }, 
     period:{
      type: String,
      required: true
    }
  }, { timestamps: true });
  
  const Tag = mongoose.model('Tag', tagSchema);
  module.exports = Tag;
  