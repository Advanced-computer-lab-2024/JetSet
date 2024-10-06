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
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <h4>Activities: {itinerary.activities?.map(activity => activity.name).join(', ') || 'No activities listed'}</h4>
              <p>Locations: {itinerary.locations?.join(', ') || 'No locations listed'}</p>
              <p>Timeline: {itinerary.timeline || 'N/A'}</p>
              <p>Duration: {itinerary.duration || 'N/A'}</p>
              <p>Language: {itinerary.language || 'N/A'}</p>
              <p>Price: ${itinerary.price || 'N/A'}</p>
              <p>Availability Dates: {itinerary.availability_dates?.map(date => new Date(date).toLocaleDateString()).join(', ') || 'N/A'}</p>
              <p>Pickup Location: {itinerary.pickup_location || 'N/A'}</p>
              <p>Dropoff Location: {itinerary.dropoff_location || 'N/A'}</p>
              <p>Accessibility: {itinerary.accessibility || 'N/A'}</p>
              <p>Budget: ${itinerary.budget || 'N/A'}</p>
              <p>Tags: {itinerary.tag?.map(tag => tag.name).join(', ') || 'No tags available'}</p>
            </li>
          ))
        ) : (
          <p>No itineraries found.</p>
        )}
      </ul>
    </div>
  );
};

export default ItineraryList;
