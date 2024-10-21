import React, { useState } from "react";
import axios from "axios";

const CreateItineraryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    activities: "",
    budget: "",
    locations: "",
    timeline: "",
    duration: "",
    language: "",
    availability_dates: "",
    pickup_location: "",
    dropoff_location: "",
    accessibility: "",
    created_by: "",
    tags: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/addItinerary",
        formData
      );
      setMessage(response.data.msg);
      setError(""); // Clear any previous error
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An error occurred while creating the itinerary."
      );
      setMessage(""); // Clear success message
    }
  };

  return (
    <div>
      <h2>Create Itinerary</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Activities:</label>
          <input
            type="text"
            name="activities"
            value={formData.activities}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Locations:</label>
          <input
            type="text"
            name="locations"
            value={formData.locations}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Timeline:</label>
          <input
            type="text"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Duration:</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Language:</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Availability Dates:</label>
          <input
            type="text"
            name="availability_dates"
            value={formData.availability_dates}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Pickup Location:</label>
          <input
            type="text"
            name="pickup_location"
            value={formData.pickup_location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Dropoff Location:</label>
          <input
            type="text"
            name="dropoff_location"
            value={formData.dropoff_location}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Accessibility:</label>
          <input
            type="text"
            name="accessibility"
            value={formData.accessibility}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Created By:</label>
          <input
            type="text"
            name="created_by"
            value={formData.created_by}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Itinerary</button>
      </form>
    </div>
  );
};

export default CreateItineraryForm;
