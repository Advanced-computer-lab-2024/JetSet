import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import NavAdmin from "./Admin/navAdmin";

const Register = () => {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [forgetPasswordUsername, setForgetPasswordUsername] = useState("");
  const [forgetPasswordRole, setForgetPasswordRole] = useState("");
  const navigate = useNavigate();

  // Handle login
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

  // Handle forget password
  const handleForgetPassword = async () => {
    if (!forgetPasswordUsername || !forgetPasswordRole) {
      setMessage("Please enter your username and select a role.");
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

      setMessage(response.data.message || "OTP sent to your email.");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error sending reset password link."
      );
    }
  };

  return (
    <div className="App">
      {/* Login Form */}
      <div className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <h3>Select Your Role</h3>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="role-dropdown"
        >
          <option value="">Select a role</option>
          <option value="tourist">Tourist</option>
          <option value="admin">Admin</option>
          <option value="seller">Seller</option>
          <option value="tourguide">Tour Guide</option>
          <option value="advertisor">Advertisor</option>
          <option value="tourismgovernor">Tourism Governor</option>
        </select>
        <button onClick={handleLogin}>Next</button>
        <button
          className="forget-password-btn"
          onClick={() => setShowForgetPassword(true)}
        >
          Forget Password?
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Forget Password Modal */}
      {showForgetPassword && (
        <div className="forget-password-modal">
          <h3>Forget Password</h3>
          <input
            type="text"
            placeholder="Enter username"
            value={forgetPasswordUsername}
            onChange={(e) => setForgetPasswordUsername(e.target.value)}
          />
          <select
            value={forgetPasswordRole}
            onChange={(e) => setForgetPasswordRole(e.target.value)}
            className="role-dropdown"
          >
            <option value="">Select a role</option>
            <option value="tourist">Tourist</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="tourguide">Tour Guide</option>
            <option value="advertisor">Advertisor</option>
            <option value="tourismgovernor">Tourism Governor</option>
          </select>
          <button onClick={handleForgetPassword}>Send Reset Link</button>
          <button onClick={() => setShowForgetPassword(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Register;
