// src/UpdateItinerary.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateItinerary = ({id}) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    activities: "",
    locations: "",
    timeline: "",
    duration: "",
    language: "",
    availability_dates: "",
    pickup_location: "",
    dropoff_location: "",
    accessibility: "",
    budget: "",
    created_by: "",
    tags: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`/api/itineraries/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch itinerary");
        }
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

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
      const response = await fetch(`/api/itineraries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update itinerary");
      }

      const updatedItinerary = await response.json();
      alert("Itinerary updated successfully");
      navigate("/itineraries"); // Redirect to the itineraries list
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <h2>Loading itinerary...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Itinerary</h2>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>
            {key.replace(/_/g, " ")}:
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
      <button type="submit">Update Itinerary</button>
    </form>
  );
};

export default UpdateItinerary;
