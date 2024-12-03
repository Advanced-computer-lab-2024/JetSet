import React, { useState, useEffect } from "react";
import axios from "axios";
import NavAdmin from "./navAdmin";
import { useParams } from "react-router-dom";

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [email, setEmail] = useState("");

  const { adminId } = useParams();

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getadminbyId/${adminId}`
      );
      setAdminUsername(response.data.username);
      setEmail(response.data.admin.email);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/cpAdmin/${adminId}`, // Fixed the URL to use adminId
        {
          oldPassword,
          newPassword,
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "Error updating password");
    }
  };

  return (
    <div>
      <NavAdmin adminUsername={adminUsername} />
      <h2>My Profile</h2>

      {/* Display Admin Username and Email */}
      <div>
        <p>
          <strong>Username:</strong> {adminUsername}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
      </div>

      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <label>
          Old Password:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Change Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangePasswordForm;
