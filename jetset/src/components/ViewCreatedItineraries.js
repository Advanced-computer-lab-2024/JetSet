import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewCreatedItineraries = ({ id }) => {
  const [itineraries, setItineraries] = useState([]);
  const [touristItineraries, setTouristItineraries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch itineraries and tourist itineraries when component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/listofiternaries/${id}`);
        setItineraries(response.data.itineraries);
        setTouristItineraries(response.data.touristItineraries);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching itineraries');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [id]);

  if (loading) {
    return <p>Loading itineraries...</p>;
  }

  return (
    <div>
      <h2>Created Itineraries</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Regular Itineraries</h3>
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

      <h3>Tourist Itineraries</h3>
      <ul>
        {touristItineraries.length > 0 ? (
          touristItineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <h4>Activities: {itinerary.activities?.map(activity => activity.name).join(', ') || 'No activities listed'}</h4>
              <p>Locations: {itinerary.locations?.map(location => location.address).join(', ') || 'No locations listed'}</p>
              <p>Date Range: {itinerary.dateRange?.startDate ? new Date(itinerary.dateRange.startDate).toLocaleDateString() : 'N/A'} to {itinerary.dateRange?.endDate ? new Date(itinerary.dateRange.endDate).toLocaleDateString() : 'N/A'}</p>
              <p>Tags: {itinerary.tags?.map(tag => tag.name).join(', ') || 'No tags available'}</p>
            </li>
          ))
        ) : (
          <p>No tourist itineraries found.</p>
        )}
      </ul>
    </div>
  );
};

export default ViewCreatedItineraries;
