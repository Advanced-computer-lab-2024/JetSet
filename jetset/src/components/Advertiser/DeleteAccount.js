import React from "react";
import axios from "axios";
import { Button, Modal, notification } from "antd";

const DeleteAccount = ({ advertiserId }) => {
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteAccAdvertiser/${advertiserId}`
      );
      notification.success({
        message: "Account Deleted",
        description: response.data.message,
        style: {
          fontSize: "25px", // Larger font size for readability
          padding: "20px", // Add more padding for better spacing
          borderRadius: "8px", // Rounded corners for modern feel
          backgroundColor: "#f6ffed", // Light green background for success
          color: "#389e0d", // Dark green text for better contrast
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // Soft shadow for modern look
        },
      });
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.response?.data?.message || "An error occurred",
        style: {
          fontSize: "25px", // Larger font size for readability
          padding: "20px", // Add more padding for better spacing
          borderRadius: "8px", // Rounded corners for modern feel
          backgroundColor: "#fff2f0", // Light red background for error
          color: "#f5222d", // Dark red text for contrast
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)", // Soft shadow for modern look
        },
      });
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete your account?",
      content: "This action is irreversible. Please confirm to proceed.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: handleDeleteAccount,
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Button
        type="primary"
        danger
        onClick={confirmDelete}
        style={{ backgroundColor: "#f5222d", borderColor: "#f5222d" }}
      >
        Delete Account
      </Button>
    </div>
  );
};

export default DeleteAccount;
