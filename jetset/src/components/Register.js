import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import "./styles.css"; // Import your CSS file

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("tour_guide");
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Use useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/register", {
        username,
        password,
        email,
        role,
      });

      setMessage(response.data.msg);

      if (role === "seller") {
        setShowModal(true); // Show the popup if the role is seller
      }
    } catch (err) {
      setMessage("Error creating account.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/createseller", { state: { username, password, email } }); // Pass data using state
  };

  return (
    <div className="App">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="tour_guide">Tour Guide</option>
          <option value="advertiser">Advertiser</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit">Register</button>
        {message && (
          <p
            className={
              message.includes("Error") ? "error-message" : "success-message"
            }
          >
            {message}
          </p>
        )}
      </form>

      {showModal && (
        <div className="modal">
          <p>You are accepted as a seller!</p>
          <button onClick={handleCloseModal}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Register;
