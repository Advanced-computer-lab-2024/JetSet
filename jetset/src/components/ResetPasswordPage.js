import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import logo from "./images/logo.jpg";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const username = searchParams.get("username");
    const role = searchParams.get("role");
    const otp = searchParams.get("otp");

    if (!username || !role || !otp) {
      setError("Invalid reset link.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/reset-password", {
        username,
        role,
        otp,
        newPassword,
      });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
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

        {message ? (
          <div style={{ padding: "1rem 0" }}>
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ fontSize: "3rem", color: "var(--color-accent)", marginBottom: "1rem" }}
            />
            <h2 style={{ fontSize: "1.5rem" }}>Password Reset</h2>
            <p className="success-message" style={{ marginTop: "1rem" }}>
              {message}
            </p>
            <Link
              to="/login"
              className="btn"
              style={{
                display: "inline-block",
                marginTop: "1.5rem",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                display: "grid",
                placeItems: "center",
                color: "#fff",
                fontSize: "1.15rem",
                margin: "0 auto 1rem",
              }}
            >
              <FontAwesomeIcon icon={faLock} />
            </span>
            <h2 style={{ fontSize: "1.75rem" }}>Reset Password</h2>
            <p style={{ color: "var(--color-muted)", marginBottom: "1.5rem" }}>
              Please enter your new password below.
            </p>

            <div className="form-stack" style={{ textAlign: "left" }}>
              <div>
                <label htmlFor="reset-new-password">New Password</label>
                <input
                  id="reset-new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  aria-label="New password"
                />
              </div>
              <div>
                <label htmlFor="reset-confirm-password">Confirm Password</label>
                <input
                  id="reset-confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-label="Confirm new password"
                />
              </div>

              <button
                type="button"
                className="btn"
                onClick={handleResetPassword}
                disabled={loading}
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </div>

            {error && (
              <p className="error-message" role="alert" style={{ marginTop: "1rem" }}>
                {error}
              </p>
            )}

            <p style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
              Remember your password?{" "}
              <Link to="/login" style={{ fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
