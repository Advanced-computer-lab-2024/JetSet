import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch itineraries on component mount
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/Itinerary");
        setItineraries(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  // Handle itinerary deletion
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteItinerary`, {
        data: { id } // Pass the ID in the request body
      });

      // Update the state to remove the deleted itinerary
      setItineraries(itineraries.filter(itinerary => itinerary._id !== id)); 
      alert('Itinerary deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while deleting the itinerary.');
    }
  };

  if (loading) return <p>Loading itineraries...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Itineraries</h2>
      <ul>
        {itineraries.map(itinerary => (
          <li key={itinerary._id}>
            <h3>{itinerary.activities.join(', ')}</h3>
            <p>Location: {itinerary.locations.join(', ')}</p>
            <p>Duration: {itinerary.duration}</p>
            <button onClick={() => handleDelete(itinerary._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryList;
