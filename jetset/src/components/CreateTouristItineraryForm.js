import React, { useState } from 'react';
import LocationInput from './LocationInput'; // Import the LocationInput component
import axios from 'axios';

const CreateTouristItineraryForm = ({ id }) => { // Accept id as a prop
  const [itineraryData, setItineraryData] = useState({
    activities: '',
    locations: [],
    availability_dates: { startDate: '', endDate: '' },
    tags: '',
  });

  // Handle location change
  const handleLocationChange = (location, index) => {
    const newLocations = [...itineraryData.locations];
    newLocations[index] = location;
    setItineraryData({ ...itineraryData, locations: newLocations });
  };

  // Add a new location field
  const addLocation = () => {
    setItineraryData({
      ...itineraryData,
      locations: [...itineraryData.locations, { address: '', coordinates: { lat: '', lng: '' } }],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/createTouristItineraries/${id}', {
        ...itineraryData,
        created_by: id,  // Include the tour guide ID in the request
      });
      alert('Itinerary created successfully');
    } catch (error) {
      // Check if the error response exists and display the error message
      const errorMessage = error.response?.data?.error || 'Error creating itinerary'; // Fallback error message
      alert(errorMessage);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Itinerary</h2>

      {/* Date Range Inputs */}
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={itineraryData.availability_dates.startDate}
          onChange={(e) =>
            setItineraryData({
              ...itineraryData,
              availability_dates: { ...itineraryData.availability_dates, startDate: e.target.value },
            })
          }
        />
      </div>

      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={itineraryData.availability_dates.endDate}
          onChange={(e) =>
            setItineraryData({
              ...itineraryData,
              availability_dates: { ...itineraryData.availability_dates, endDate: e.target.value },
            })
          }
        />
      </div>

      {/* Locations Input */}
      <h3>Locations</h3>
      {itineraryData.locations.map((location, index) => (
        <LocationInput
          key={index}
          onChange={(newLocation) => handleLocationChange(newLocation, index)}
        />
      ))}
      <button type="button" onClick={addLocation}>
        Add Another Location
      </button>

      {/* Activities Input */}
      <div>
        <label>Activities:</label>
        <input
          type="text"
          value={itineraryData.activities}
          onChange={(e) => setItineraryData({ ...itineraryData, activities: e.target.value })}
        />
      </div>

      {/* Tags Input */}
      <div>
        <label>Tags (comma separated):</label>
        <input
          type="text"
          value={itineraryData.tags}
          onChange={(e) => setItineraryData({ ...itineraryData, tags: e.target.value.split(',') })}
        />
      </div>

      <button type="submit">Create Itinerary</button>
    </form>
  );
};

export default CreateTouristItineraryForm;
