import React, { useState, useEffect } from "react";
import axios from "axios";

const AddAddress = ({ touristId }) => {
  const [addresses, setAddresses] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = value;
    setAddresses(updatedAddresses);
  };

  const addNewAddressField = () => {
    setAddresses([...addresses, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (addresses.some((address) => !address.trim())) {
      setError("All address fields must be filled.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `/addTouristAddress/${touristId}`,
        { addresses }
      );
      setMessage(response.data.message);
      setAddresses([""]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add addresses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New Addresses</h2>

      {loading ? (
        <p>Loading addresses...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {addresses.map((address, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Address ${index + 1}`}
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addNewAddressField}>
            Add Another Address
          </button>
          <button type="submit" disabled={loading}>
            Submit Addresses
          </button>
        </form>
      )}

      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddAddress;
