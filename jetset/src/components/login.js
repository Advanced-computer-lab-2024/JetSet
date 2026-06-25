import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Input, Button, Modal, Select, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import logo from "./images/logo.jpg";

const { Text } = Typography;

const Login = () => {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [forgetPasswordUsername, setForgetPasswordUsername] = useState("");
  const [forgetPasswordRole, setForgetPasswordRole] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
      tourist: "loginTourist",
      admin: "loginAdmin",
      seller: "loginSeller",
      tourguide: "loginTourGuide",
      advertisor: "loginAdv",
      tourismgovernor: "loginTourism",
    };

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = async () => {
    setMessage("");
    setResetMessage("");
    if (!forgetPasswordUsername || !forgetPasswordRole) {
      setResetMessage("Please enter your username and select a role.");
      return;
    }

    try {
      const response = await axios.post("/forgot-password", {
        username: forgetPasswordUsername,
        role: forgetPasswordRole,
      });
      setResetMessage(response.data.message || "Reset link sent successfully.");
    } catch (error) {
      setResetMessage(
        error.response?.data?.message || "Error sending reset password link."
      );
    }
  };

  const roleOptions = [
    { value: "tourist", label: "Tourist" },
    { value: "admin", label: "Admin" },
    { value: "seller", label: "Seller" },
    { value: "tourguide", label: "Tour Guide" },
    { value: "advertisor", label: "Advertiser" },
    { value: "tourismgovernor", label: "Tourism Governor" },
  ];

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <img
            src={logo}
            alt="JetSet"
            className="auth-logo"
          />
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">
            Sign in to your JetSet account
          </p>
        </div>

        <div className="form-stack">
          <div>
            <label htmlFor="login-username">Username</label>
            <Input
              id="login-username"
              aria-label="Username"
              prefix={<UserOutlined />}
              placeholder="Enter username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setMessage(null);
              }}
              size="large"
            />
          </div>

          <div>
            <label htmlFor="login-password">Password</label>
            <Input.Password
              id="login-password"
              aria-label="Password"
              prefix={<LockOutlined />}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage(null);
              }}
              size="large"
            />
          </div>

          <div>
            <label htmlFor="login-role">Role</label>
            <Select
              id="login-role"
              aria-label="Role"
              value={role || undefined}
              onChange={(val) => {
                setRole(val);
                setMessage(null);
              }}
              placeholder="Select your role"
              style={{ width: "100%" }}
              size="large"
              options={roleOptions}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleLogin}
            disabled={loading}
            style={{ width: "100%", height: 48, marginTop: "0.25rem" }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowForgetPassword(true)}
            style={{
              marginTop: "0.5rem",
              fontWeight: 600,
              color: "var(--color-primary)",
            }}
          >
            Forgot Password?
          </button>
        </div>

        {message && (
          <p
            className="error-message"
            role="alert"
            style={{ marginTop: "1rem", textAlign: "center" }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.9rem",
            color: "var(--color-muted)",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ fontWeight: 600, color: "var(--color-primary)" }}>
            Register
          </Link>
        </p>
      </div>

      {showForgetPassword && (
        <Modal
          title="Forgot Password"
          open={showForgetPassword}
          onCancel={() => {
            setShowForgetPassword(false);
            setResetMessage("");
            setForgetPasswordUsername("");
            setForgetPasswordRole("");
          }}
          footer={null}
          centered
        >
          <div className="form-stack" style={{ paddingTop: "0.5rem" }}>
            <div>
              <label htmlFor="forgot-username">Username</label>
              <Input
                id="forgot-username"
                aria-label="Forgot password username"
                placeholder="Enter username"
                value={forgetPasswordUsername}
                onChange={(e) => setForgetPasswordUsername(e.target.value)}
                size="large"
              />
            </div>
            <div>
              <label htmlFor="forgot-role">Role</label>
              <Select
                id="forgot-role"
                aria-label="Forgot password role"
                value={forgetPasswordRole || undefined}
                onChange={setForgetPasswordRole}
                placeholder="Select your role"
                style={{ width: "100%" }}
                size="large"
                options={roleOptions}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={handleForgetPassword}
              style={{ width: "100%", height: 48 }}
            >
              Send Reset Link
            </button>
          </div>
          {resetMessage && (
            <p
              className={resetMessage.includes("Error") ? "error-message" : "success-message"}
              role="alert"
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              {resetMessage}
            </p>
          )}
        </Modal>
      )}
    </main>
  );
};

export default Login;
