// src/Activity/ActivitiesByCategory.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivitiesByCategory = () => {
  const categoryId = "60d5ec49f47a1b001c8b4567"; // Hardcoded category ID
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`/activities/by-category`, {
        params: { category: categoryId },
      });
      setActivities(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching activities");
    }
  };

  return (
    <div>
      <h2>Activities in Category</h2>
      <button onClick={fetchActivities}>Fetch Activities</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {activities.map((activity) => (
          <li key={activity._id}>{activity.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivitiesByCategory;
