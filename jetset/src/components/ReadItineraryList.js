import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReadItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getTouristItineraries'); // Adjust the URL according to your backend endpoint
        setItineraries(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching itineraries.');
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  if (loading) return <p>Loading itineraries...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Tourist Itineraries</h2>
      {itineraries.length === 0 ? (
        <p>No itineraries found.</p>
      ) : (
        <ul>
          {itineraries.map(itinerary => (
            <li key={itinerary._id}>
              <h3>Itinerary Details</h3>
              <p><strong>Tourist ID:</strong> {itinerary.tourist}</p>
              <p>
                <strong>Date Range:</strong> 
                {itinerary.dateRange?.startDate ? new Date(itinerary.dateRange.startDate).toLocaleDateString() : 'N/A'} - 
                {itinerary.dateRange?.endDate ? new Date(itinerary.dateRange.endDate).toLocaleDateString() : 'N/A'}
              </p>
              <h4>Locations:</h4>
              <ul>
                {itinerary.locations.map((location, index) => (
                  <li key={index}>
                    <strong>Address:</strong> {location.address}
                    {location.coordinates.lat && location.coordinates.lng && (
                      <>
                        <br />
                        <strong>Coordinates:</strong> ({location.coordinates.lat}, {location.coordinates.lng})
                      </>
                    )}
                  </li>
                ))}
              </ul>
              <h4>Activities:</h4>
              <p>{itinerary.activities.join(', ')}</p>
              <h4>Tags:</h4>
              <p>{itinerary.tags.join(', ')}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
  
};

export default ReadItineraryList;
