import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    const username = searchParams.get("username");
    const role = searchParams.get("role");
    const otp = searchParams.get("otp");

    if (!username || !role || !otp) {
      setMessage("Invalid reset link.");
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
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordPage;
