import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristProfile = ({ touristId }) => {
  const [tourist, setTourist] = useState(null);
  const [updateFields, setUpdateFields] = useState({});

  useEffect(() => {
    const fetchTourist = async () => {
      if (touristId) {
        try {
          const response = await axios.get(`/getTourist/${touristId}`);
          setTourist(response.data);
        } catch (error) {
          alert(
            error.response?.data?.message || "Error fetching tourist profile"
          );
        }
      }
    };
    fetchTourist();
  }, [touristId]);

  const handleUpdateChange = (e) => {
    setUpdateFields({ ...updateFields, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/updateTourist/${touristId}`,
        {
          ...updateFields,
        }
      );
      setTourist(response.data);
      alert("Tourist profile updated!");
    } catch (error) {
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
  onChange={(e) => {
    const id = e.target.value;
    setTouristId(id);
    localStorage.setItem('touristId', id); // Save to localStorage as the user types
  }}
/>
      <button onClick={fetchTourist}>Fetch Profile</button>

      {tourist && (
        <div>
          <h3>{tourist.username}</h3>
          <p>Email: {tourist.email}</p>
          <p>Nationality: {tourist.nationality}</p>
          <p>Job: {tourist.job}</p>
          <p>Mobile: {tourist.mobile_number}</p>
          <p>Nationality:{tourist.nationality}</p>

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
      ) : (
        <p>No profile found. Please register.</p>
      )}
    </div>
  );
};

export default TouristProfile;
