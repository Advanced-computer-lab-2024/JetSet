// src/ItineraryForm.js

import React, { useState } from 'react';
import axios from 'axios';

const ItineraryForm = () => {
  const [formData, setFormData] = useState({
    activities: '',
    locations: '',
    timeline: '',
    duration: '',
    language: '',
    price: '',
    availability_dates: '',
    pickup_location: '',
    dropoff_location: '',
    accessibility: '',
    budget: '',
    created_by: '',
    tags: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/create-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.msg);
        setFormData({
          activities: '',
          locations: '',
          timeline: '',
          duration: '',
          language: '',
          price: '',
          availability_dates: '',
          pickup_location: '',
          dropoff_location: '',
          accessibility: '',
          budget: '',
          created_by: '',
          tags: '',
        });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating itinerary:', error);
      alert('An error occurred while creating the itinerary.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Itinerary</h2>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>
            {key.replace(/_/g, ' ')}:
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      ))}
      <button type="submit">Submit Itinerary</button>
    </form>
  );
};

export default ItineraryForm;