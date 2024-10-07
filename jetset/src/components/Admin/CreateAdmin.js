import React, { useState } from "react";
import axios from "axios";

const CreateAdmin = () => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setLoading(true); // Set loading state to true
    setError(null); // Reset error state
    setSuccess(null); // Reset success state

    try {
      const response = await axios.post("http://localhost:8000/admin", {
        username,
        password,
      });
      setSuccess(response.data.msg); // Set success message from the response
      setUsername(""); // Clear the username field
      setPassword(""); // Clear the password field
    } catch (err) {
      setError(err.response?.data.message || "Error creating admin."); // Set error message
    } finally {
      setLoading(false); // Set loading state to false after request
    }
  };

  return (
    <div className="create-admin">
      <h1>Create Admin</h1>
      <form onSubmit={handleSubmit}>
        {/* Input for username */}
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
            required // Make this field required
          />
        </div>
        {/* Input for password */}
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required // Make this field required
          />
        </div>
        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </button>
      </form>
      {/* Display success message */}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateAdmin;
