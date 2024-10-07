import React, { useState } from "react";
import axios from "axios";

const CreateTourismGovernor = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateGovernor = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/tourism-governor",
        {
          username: username.trim(), // Trim whitespace
          password: password.trim(), // Trim whitespace
        }
      );
      setMessage(response.data.msg);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error(err); // Log the error for better debugging
      setError(
        err.response?.data.message ||
          "An error occurred while creating the Tourism Governor."
      );
      setMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div>
      <h2>Create Tourism Governor</h2>
      <form onSubmit={handleCreateGovernor}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create Tourism Governor</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateTourismGovernor;
