import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Button, Modal, Select, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Register = () => {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [forgetPasswordUsername, setForgetPasswordUsername] = useState("");
  const [forgetPasswordRole, setForgetPasswordRole] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage("Please enter both username and password.");
      return;
    }

    const endpointMap = {
      tourist: "http://localhost:3000/loginTourist",
      admin: "http://localhost:3000/loginAdmin",
      seller: "http://localhost:3000/loginSeller",
      tourguide: "http://localhost:3000/loginTourGuide",
      advertisor: "http://localhost:3000/loginAdv",
      tourismgovernor: "http://localhost:3000/loginTourism",
    };

    try {
      const response = await axios.post(endpointMap[role], {
        user: username,
        password,
      });

      if (role === "tourist") {
        navigate(`/tourist/${response.data.tourist._id}`);
      } else if (role === "seller") {
        const newSellerId = response.data.seller._id;
        navigate(`/sellerfrontend/${newSellerId}`);
      } else if (role === "tourguide") {
        const newTourGuideId = response.data.tourGuide._id;
        navigate(`/tourguide/${newTourGuideId}`);
      } else if (role === "advertisor") {
        const newAdvertiserId = response.data.adv._id;
        navigate(`/createadvertiser/${newAdvertiserId}`);
      } else if (role === "admin") {
        const admin = response.data.admin._id;
        navigate(`/admin/${admin}`);
      } else if (role === "tourismgovernor") {
        const Tourism = response.data.Tourism._id;
        navigate(`/place/${Tourism}`);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error during authentication."
      );
    }
  };

  const handleForgetPassword = async () => {
    setMessage("");
    setResetMessage(""); // Clear previous messages
    if (!forgetPasswordUsername || !forgetPasswordRole) {
      setResetMessage("Please enter your username and select a role.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/forgot-password",
        {
          username: forgetPasswordUsername,
          role: forgetPasswordRole,
        }
      );
      setResetMessage(response.data.message || "Reset link sent successfully.");
    } catch (error) {
      setResetMessage(
        error.response?.data?.message || "Error sending reset password link."
      );
    }
  };

  const customBlue = "#1d3557"; // Custom blue shade

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            fontSize: "30px",
            color: customBlue,
            fontWeight: "bold",
          }}
        >
          Login
        </Title>

        {/* Username Input */}
        <Input
          prefix={<UserOutlined />}
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            marginBottom: "15px",
            fontSize: "18px",
            borderColor: customBlue,
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        />

        {/* Password Input */}
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginBottom: "15px",
            fontSize: "18px",
            borderColor: customBlue,
            borderRadius: "8px",
            padding: "10px 12px",
          }}
        />

        {/* Role Selection */}
        <Select
          value={role}
          onChange={setRole}
          placeholder="Select your role"
          style={{
            marginBottom: "15px",
            width: "100%",
            fontSize: "18px",
            borderColor: customBlue,
            borderRadius: "8px",
            padding: "12px 12px",
            height: "50px", // Increased height for the selection
          }}
        >
          <Select.Option value="tourist">Tourist</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
          <Select.Option value="seller">Seller</Select.Option>
          <Select.Option value="tourguide">Tour Guide</Select.Option>
          <Select.Option value="advertisor">Advertisor</Select.Option>
          <Select.Option value="tourismgovernor">
            Tourism Governor
          </Select.Option>
        </Select>

        {/* Login Button */}
        <Button
          type="primary"
          block
          onClick={handleLogin}
          style={{
            marginBottom: "15px",
            fontSize: "18px",
            backgroundColor: customBlue,
            borderColor: customBlue,
            borderRadius: "8px",
            padding: "12px 0",
          }}
        >
          Login
        </Button>

        {/* Forgot Password Button */}
        <Button
          type="link"
          block
          onClick={() => setShowForgetPassword(true)}
          style={{ fontSize: "16px", color: customBlue }}
        >
          Forgot Password?
        </Button>

        {/* Error Message */}
        {message && (
          <Text
            type="danger"
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "15px",
              fontSize: "16px",
            }}
          >
            {message}
          </Text>
        )}
      </div>

      {/* Modal for Forgot Password */}
      {showForgetPassword && (
        <Modal
          title="Forgot Password"
          visible={showForgetPassword}
          onCancel={() => setShowForgetPassword(false)}
          footer={null}
          style={{ fontSize: "16px", padding: "20px" }}
        >
          <Input
            placeholder="Enter username"
            value={forgetPasswordUsername}
            onChange={(e) => setForgetPasswordUsername(e.target.value)}
            style={{
              marginBottom: "15px",
              fontSize: "18px",
              borderColor: customBlue,
              borderRadius: "8px",
              padding: "10px 12px",
            }}
          />
          <Select
            value={forgetPasswordRole}
            onChange={setForgetPasswordRole}
            placeholder="Select your role"
            style={{
              marginBottom: "15px",
              width: "100%",
              fontSize: "18px",
              borderColor: customBlue,
              borderRadius: "8px",
              padding: "12px 12px",
              height: "50px", // Increased height for the selection
            }}
          >
            <Select.Option value="tourist">Tourist</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="seller">Seller</Select.Option>
            <Select.Option value="tourguide">Tour Guide</Select.Option>
            <Select.Option value="advertisor">Advertisor</Select.Option>
            <Select.Option value="tourismgovernor">
              Tourism Governor
            </Select.Option>
          </Select>
          <Button
            type="primary"
            block
            onClick={handleForgetPassword}
            style={{
              marginBottom: "15px",
              fontSize: "18px",
              backgroundColor: customBlue,
              borderColor: customBlue,
              borderRadius: "8px",
              padding: "12px 0",
            }}
          >
            Send Reset Link
          </Button>
          {resetMessage && (
            <Text
              type={resetMessage.includes("Error") ? "danger" : "success"}
              style={{
                display: "block",
                textAlign: "center",
                fontSize: "16px",
              }}
            >
              {resetMessage}
            </Text>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Register;
