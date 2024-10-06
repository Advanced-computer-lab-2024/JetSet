import React, { useState } from 'react';
import axios from 'axios';

const DeleteTouristItineraryForm = () => {
  const [touristItineraryID, setTouristItineraryID] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`http://localhost:5000/deleteTouristItineraries/${touristItineraryID}`);
      setSuccess('Itinerary deleted successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error deleting itinerary');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Delete Tourist Itinerary</h2>

      {/* Itinerary ID Input */}
      <div>
        <label>Itinerary ID:</label>
        <input
          type="text"
          value={touristItineraryID}
          onChange={(e) => setTouristItineraryID(e.target.value)}
          required
        />
      </div>

      <button type="submit">Delete Itinerary</button>

      {/* Error and Success Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default DeleteTouristItineraryForm;
