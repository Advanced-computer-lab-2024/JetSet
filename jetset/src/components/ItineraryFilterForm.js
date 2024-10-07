import React, { useState } from 'react';

const ItineraryFilterForm = () => {
  const [formData, setFormData] = useState({
    budget: '',
    startDate: '',
    endDate: '',
    tag: '',
    language: ''
  });

  const [itineraries, setItineraries] = useState([]); // State to store filtered itineraries
  const [error, setError] = useState(null); // State to store any errors

  // Handle changes to input fields
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

    // Construct the query string from formData
    const queryString = new URLSearchParams(formData).toString();

    try {
      const response = await fetch(`http://localhost:3000/guest/filter-itineraries?${queryString}`, { 
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong'); // Adjust error message handling
      }

      const itinerariesData = await response.json();
      setItineraries(itinerariesData); // Store the itineraries in state
    } catch (err) {
      setError(err.message); // Set error if something goes wrong
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Filter Itineraries</h2>
        <input
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Budget"
          min="0" // Added min value for budget
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          placeholder="Start Date"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          placeholder="End Date"
        />
        <input
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          placeholder="Tag (comma-separated)"
        />
        <input
          name="language"
          value={formData.language}
          onChange={handleChange}
          placeholder="Language"
        />
        <button type="submit">Filter</button>
      </form>

      {/* Display error if any */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Display filtered itineraries */}
      {itineraries.length > 0 && (
        <div>
          <h3>Filtered Itineraries:</h3>
          <ul>
            {itineraries.map((itinerary) => (
              <li key={itinerary._id}>
                <h4>{itinerary.name}</h4>
                <p>Budget: {itinerary.budget}</p>
                <p>Available Dates: {itinerary.availability_dates.join(', ')}</p>
                <p>Tags: {itinerary.tag.map((t) => t.name).join(', ')}</p> {/* Updated to access name of tag */}
                <p>Language: {itinerary.language}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ItineraryFilterForm;
