import React, { useState } from 'react';

const HistoricalFilterForm = () => {
  const [formData, setFormData] = useState({
    tag: ''
  });

  const [historicalPlaces, setHistoricalPlaces] = useState([]); // State to store the filtered historical places
  const [error, setError] = useState(null); // State to handle errors

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    // Construct the query string for the GET request
    const queryString = new URLSearchParams({ tag: formData.tag }).toString();

    try {
      // Make the GET request to filter by tag
      const response = await fetch(`/filterHistoricalTags?${queryString}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }

      const historicalPlacesData = await response.json();
      setHistoricalPlaces(historicalPlacesData); // Store the historical places in state
    } catch (err) {
      setError(err.message); // Set the error message
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Filter Historical Places by Tag</h2>
        <input
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          placeholder="Tag"
        />
        <button type="submit">Filter</button>
      </form>

      {/* Display error if any */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Display filtered historical places */}
      {historicalPlaces.length > 0 && (
        <div>
          <h3>Filtered Historical Places:</h3>
          <ul>
            {historicalPlaces.map((place) => (
              <li key={place._id}>
                <h4>{place.name}</h4>
                <p>Location: {place.location}</p>
                <p>Tags: {place.tags.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HistoricalFilterForm;
