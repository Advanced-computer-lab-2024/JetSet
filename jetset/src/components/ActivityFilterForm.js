import React, { useState } from 'react';

const ActivityFilterForm = () => {
  const [formData, setFormData] = useState({
    budget: '',
    date: '',
    category: '',
    rating: ''
  });

  const [activities, setActivities] = useState([]); // State to store filtered activities
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
      const response = await fetch(`http://localhost:3000/filterActivityGuest?${queryString}`, { // Correct URL for your backend
        method: 'GET', // Use GET method
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) { // Check if response is successful
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const activitiesData = await response.json();
      setActivities(activitiesData); // Store the activities in state
    } catch (err) {
      setError(err.message); // Set error if something goes wrong
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Filter Activities</h2>
        <input
          name="budget"
          type="number"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Budget"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="Date"
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <input
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
          min="1"
          max="5"
        />
        <button type="submit">Filter</button>
      </form>

      {/* Display error if any */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Display filtered activities */}
      {activities.length > 0 && (
        <div>
          <h3>Filtered Activities:</h3>
          <ul>
            {activities.map((activity) => (
              <li key={activity._id}>
                <h4>{activity.name}</h4>
                <p>Budget: {activity.budget}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                <p>Category: {activity.category}</p>
                <p>Rating: {activity.rating}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityFilterForm;
