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
    if (!role) {
      setMessage("Please select your role.");
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
        navigate("/tourist", {
          state: { touristId: response.data.tourist._id },
        });
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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Title
          level={2}
          style={{
            textAlign: "center",
            fontSize: "30px",
            color: "var(--color-primary-strong)",
            fontWeight: "bold",
          }}
        >
          Login
        </Title>

        {/* Username Input */}
        <div className="form-stack">
          <label htmlFor="login-username">Username</label>
          <Input
            id="login-username"
            aria-label="Username"
            prefix={<UserOutlined />}
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password Input */}
          <label htmlFor="login-password">Password</label>
          <Input.Password
            id="login-password"
            aria-label="Password"
            prefix={<LockOutlined />}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Selection */}
          <label htmlFor="login-role">Role</label>
          <Select
            id="login-role"
            aria-label="Role"
            value={role || undefined}
            onChange={setRole}
            placeholder="Select your role"
            style={{ width: "100%" }}
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
          <Button type="primary" block onClick={handleLogin}>
            Login
          </Button>

          {/* Forgot Password Button */}
          <Button type="link" block onClick={() => setShowForgetPassword(true)}>
            Forgot Password?
          </Button>
        </div>

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
          open={showForgetPassword}
          onCancel={() => setShowForgetPassword(false)}
          footer={null}
          style={{ fontSize: "16px", padding: "20px" }}
        >
          <div className="form-stack">
          <label htmlFor="forgot-username">Username</label>
          <Input
            id="forgot-username"
            aria-label="Forgot password username"
            placeholder="Enter username"
            value={forgetPasswordUsername}
            onChange={(e) => setForgetPasswordUsername(e.target.value)}
          />
          <label htmlFor="forgot-role">Role</label>
          <Select
            id="forgot-role"
            aria-label="Forgot password role"
            value={forgetPasswordRole || undefined}
            onChange={setForgetPasswordRole}
            placeholder="Select your role"
            style={{ width: "100%" }}
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
          >
            Send Reset Link
          </Button>
          </div>
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
