import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Form, Typography, notification } from "antd";

const { Title, Text } = Typography;

const ChangePasswordForm = ({ touristId }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Password Mismatch",
        description: "New passwords do not match",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/cpTourist/${touristId}`,
        {
          oldPassword,
          newPassword,
        }
      );
      notification.success({
        message: "Password Changed Successfully",
        description: response.data.message,
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data.message || "Error updating password",
      });
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Change Password</Title>
      <Form onSubmit={handleChangePassword}>
        <Form.Item label="Old Password" required>
          <Input.Password
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
          />
        </Form.Item>
        <Form.Item label="New Password" required>
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter a new password"
          />
        </Form.Item>
        <Form.Item label="Confirm New Password" required>
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            onClick={handleChangePassword}
            style={{ backgroundColor: "#1d3557", borderColor: "#1d3557" }}
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
