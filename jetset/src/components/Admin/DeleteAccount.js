import React, { useState } from "react";
import axios from "axios";

const DeleteAccount = () => {
  const [accountUsername, setAccountUsername] = useState("");
  const [accountType, setAccountType] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        "http://localhost:8000/deleteAccount",
        {
          data: { accountUsername, accountType },
        }
      );
      setMessage(response.data.message);
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(
        err.response?.data.message ||
          "An error occurred while deleting the account."
      );
      setMessage(""); // Clear any previous success messages
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <form onSubmit={handleDeleteAccount}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={accountUsername}
            onChange={(e) => setAccountUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="accountType">Account Type:</label>
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="">Select Account Type</option>
            <option value="Tourist">Tourist</option>
            <option value="Tour Guide">Tour Guide</option>
            <option value="Seller">Seller</option>
            <option value="Advertiser">Advertiser</option>
          </select>
        </div>

        <button type="submit">Delete Account</button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteAccount;
