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
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <img
            src={logo}
            alt="JetSet"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              objectFit: "cover",
              margin: "0 auto 1rem",
              display: "block",
              boxShadow: "0 4px 12px rgba(15,76,129,0.12)",
            }}
          />
          <h2 style={{ marginBottom: "0.35rem", fontSize: "1.75rem" }}>
            Welcome Back
          </h2>
          <p style={{ color: "var(--color-muted)", margin: 0, fontSize: "0.95rem" }}>
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

          <Button
            type="primary"
            block
            size="large"
            onClick={handleLogin}
            loading={loading}
            style={{
              height: 48,
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: "var(--radius-md)",
              background: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              marginTop: "0.25rem",
            }}
          >
            Sign In
          </Button>

          <button
            type="button"
            onClick={() => setShowForgetPassword(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-primary)",
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "center",
              padding: "0.5rem",
              minHeight: "auto",
              fontSize: "0.9rem",
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
            <Button
              type="primary"
              block
              size="large"
              onClick={handleForgetPassword}
              style={{
                height: 48,
                fontWeight: 700,
                borderRadius: "var(--radius-md)",
                background: "var(--color-primary)",
                borderColor: "var(--color-primary)",
              }}
            >
              Send Reset Link
            </Button>
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
    </div>
  );
};

export default Login;
