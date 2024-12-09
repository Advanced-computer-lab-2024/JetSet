import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, notification, Card } from "antd";

const ChangePasswordForm = ({ id }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notification.error({
        message: "Error",
        description: "New passwords do not match",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/cpAdvertiser/${id}`,
        {
          oldPassword,
          newPassword,
        }
      );
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      notification.error({
        message: "Error",
        description:
          error.response?.data?.message || "Error updating password",
      });
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Card
        title="Change Password"
        style={{
          margin: "20px auto",
          maxWidth: "500px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form onFinish={handleChangePassword} layout="vertical">
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              { required: true, message: "Please input your old password!" },
            ]}
          >
            <Input.Password
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
            />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
            ]}
          >
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
            }}
          >
            Change Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;