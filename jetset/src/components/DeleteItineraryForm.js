import React, { useState } from "react";
import axios from "axios";

const DeleteItineraryForm = () => {
  const [itineraryID, setItineraryID] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setItineraryID(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteItinerary`,
        {
          data: { id: itineraryID }, // Sending the ID in the body
        }
      );
      setMessage(response.data.msg || "Itinerary deleted successfully!");
      setError(""); // Clear any previous error
      setItineraryID(""); // Clear the input field
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while deleting the itinerary."
      );
      setMessage(""); // Clear success message
    }
  };

  return (
    <div>
      <h2>Delete Itinerary</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Itinerary ID:</label>
          <input
            type="text"
            value={itineraryID}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Delete Itinerary</button>
      </form>
    </div>
  );
};

export default DeleteItineraryForm;
