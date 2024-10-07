import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const CreateSeller = () => {
  const location = useLocation();
  const { username = "", password = "", email = "" } = location.state || {}; // Get passed data from state or default to empty

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleCreateSeller = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/createSeller", {
        username,
        password,
        email,
        name,
        description,
      });

      setMessage(response.data.msg); // Display success message

      // Navigate to SellerFrontend with the username after profile creation
      navigate("/sellerfrontend");
    } catch (err) {
      setMessage("Error creating seller profile.");
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleCreateSeller}>
        <h2>Create Seller Profile</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          readOnly // Make it read-only since it's passed from the Register component
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          readOnly // Make it read-only since it's passed from the Register component
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          readOnly // Make it read-only since it's passed from the Register component
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit">Create Profile</button>
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
    </div>
  );
};

export default CreateSeller;
