// src/DeleteAccount.js
import React from "react";
import axios from "axios";
import { Button, notification } from "antd"; // Importing Ant Design components

const DeleteAccount = ({ touristId }) => {
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteAccTourist/${touristId}`
      );
      notification.success({
        message: "Success",
        description: response.data.message,
      });
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.response?.data?.message || "An error occurred",
      });
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleDeleteAccount}
      style={{
        backgroundColor: "#1d3557",
        borderColor: "#1d3557",
        color: "white",
        marginLeft: "10px", // Ensure some space between the buttons
        width: "auto", // Let the button resize accordingly
      }}
    >
      Delete Account
    </Button>
  );
};

export default DeleteAccount;
