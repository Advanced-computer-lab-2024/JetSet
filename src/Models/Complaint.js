const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    default:"Pending",
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tourist', 
    required: false },
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
