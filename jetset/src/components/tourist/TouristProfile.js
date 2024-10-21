import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristProfile = () => {
  const [tourist, setTourist] = useState(null);
  const [touristId, setTouristId] = useState(""); // Tourist ID
  const [updateFields, setUpdateFields] = useState({});

  const fetchTourist = async () => {
    if (touristId) {
      try {
        // Sending the touristId in the body of a POST request
        const response = await axios.get(
          "/getTourist/67024f808e5755ccfde222bb"
        );
        setTourist(response.data);
      } catch (error) {
        alert(
          error.response?.data?.message || "Error fetching tourist profile"
        );
      }
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateFields({ ...updateFields, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending the touristId and update fields in the body of the PUT request
      const response = await axios.put(
        "/updateTourist/67024f808e5755ccfde222bb",
        {
          ...updateFields, // Include all fields to update
        }
      );
      setTourist(response.data); // Update the local state with the response
      alert("Tourist profile updated!"); // Notify user of success
    } catch (error) {
      // Handle error appropriately, using optional chaining for safer access
      alert(error.response?.data?.message || "Error updating tourist profile");
    }
  };

  return (
    <div>
      <h2>Get Tourist Profile</h2>
      <input
        type="text"
        placeholder="Enter Tourist ID"
        value={touristId}
        onChange={(e) => setTouristId(e.target.value)}
      />
      <button onClick={fetchTourist}>Fetch Profile</button>

      {tourist && (
        <div>
          <h3>{tourist.username}</h3>
          <p>Email: {tourist.email}</p>
          <p>Nationality: {tourist.nationality}</p>
          <p>Job: {tourist.job}</p>
          <p>Mobile: {tourist.mobile}</p>
        </div>
      )}

      <h3>Update Profile</h3>
      <form onSubmit={handleUpdateSubmit}>
        <input
          type="text"
          name="mobile"
          placeholder="New Mobile"
          onChange={handleUpdateChange}
        />
        <input
          type="text"
          name="job"
          placeholder="New Job"
          onChange={handleUpdateChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default TouristProfile;
