import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeactivateItinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all itineraries when the component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('http://localhost:3000/itineraries'); // Adjust the endpoint as needed
        setItineraries(response.data);
      } catch (err) {
        console.error("Error fetching itineraries:", err);
      }
    };

    fetchItineraries();
  }, []);

  const deactivateItinerary = async () => {
    if (!selectedItineraryId) {
      setError('Please select an itinerary.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`http://localhost:3000/deactivateItinerary/${selectedItineraryId}`);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to deactivate itinerary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Deactivate Itinerary</h3>
      <select
        value={selectedItineraryId}
        onChange={(e) => setSelectedItineraryId(e.target.value)}
      >
        <option value="">Select an Itinerary</option>
        {itineraries.map(itinerary => (
          <option key={itinerary._id} value={itinerary._id}>
            {itinerary.name} {/* Adjust the display name as necessary */}
          </option>
        ))}
      </select>
      <button onClick={deactivateItinerary} disabled={loading}>
        {loading ? 'Deactivating...' : 'Deactivate Itinerary'}
      </button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeactivateItinerary;
