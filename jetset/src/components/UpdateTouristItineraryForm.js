import React, { useState } from 'react';
import axios from 'axios';
import LocationInput from './LocationInput'; // Import the LocationInput component

const UpdateTouristItineraryForm = () => {
  const [touristItineraryID, setTouristItineraryID] = useState('');
  const [activities, setActivities] = useState('');
  const [locations, setLocations] = useState([]); // Multiple locations
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/updateTouristItineraries/${touristItineraryID}`, {
        activities,
        locations,
        dateRange,
        tags,
      });

      setSuccess('Itinerary updated successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating itinerary');
      setSuccess('');
    }
  };

  // Function to handle location changes
  const handleLocationChange = (location, index) => {
    const updatedLocations = [...locations];
    updatedLocations[index] = location;
    setLocations(updatedLocations); // Update locations array in parent state
  };

  // Function to add a new location
  const addLocation = () => {
    setLocations([...locations, { address: '', coordinates: { lat: '', lng: '' } }]); // Add a new empty location
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Tourist Itinerary</h2>

      {/* Itinerary ID Input */}
      <div>
        <label>Itinerary ID:</label>
        <input
          type="text"
          value={touristItineraryID}
          onChange={(e) => setTouristItineraryID(e.target.value)} // Handle ID input change
          required
        />
      </div>

      {/* Activities Input */}
      <div>
        <label>Activities:</label>
        <input
          type="text"
          value={activities}
          onChange={(e) => setActivities(e.target.value)} // Handle activities input change
        />
      </div>

      {/* Locations Input */}
      <h3>Locations:</h3>
      {locations.map((location, index) => (
        <LocationInput
          key={index}
          onChange={(newLocation) => handleLocationChange(newLocation, index)} // Pass the specific location's index to update it
        />
      ))}
      <button type="button" onClick={addLocation}>Add Location</button>

      {/* Date Range Inputs */}
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} // Handle start date change
        />
      </div>

      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} // Handle end date change
        />
      </div>

      {/* Tags Input */}
      <div>
        <label>Tags:</label>
        <input
          type="text"
          value={tags.join(', ')} // Convert array to comma-separated string
          onChange={(e) => setTags(e.target.value.split(', ').map(tag => tag.trim()))} // Handle tags change
          placeholder="Enter tags separated by commas"
        />
      </div>

      <button type="submit">Update Itinerary</button>

      {/* Error and Success Messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default UpdateTouristItineraryForm;
