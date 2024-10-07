// Notification.js
import React from "react";
import "./Notification.css"; // Add styles for the notification

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Notification;
