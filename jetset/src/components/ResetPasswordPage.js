import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "./ResetPasswordPage.css"; // Add custom styles here

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    const username = searchParams.get("username");
    const role = searchParams.get("role");
    const otp = searchParams.get("otp");

    if (!username || !role || !otp) {
      setError("Invalid reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/reset-password",
        {
          username,
          role,
          otp,
          newPassword,
        }
      );
      setMessage(response.data.message);
      setError(""); // Clear any previous errors
    } catch (error) {
      setMessage("");
      setError(error.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h1 className="reset-password-header">Reset Password</h1>
        <p className="reset-password-description">
          Please enter your new password below.
        </p>
        <div className="reset-password-inputs">
          <input
            type="password"
            placeholder="Enter new password"
            className="input-field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="primary-btn" onClick={handleResetPassword}>
          Reset Password
        </button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
