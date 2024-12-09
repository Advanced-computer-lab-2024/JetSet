const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }, // To track if the notification is read
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
