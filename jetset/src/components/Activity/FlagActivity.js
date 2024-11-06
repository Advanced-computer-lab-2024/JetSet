import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);

  // Fetch all activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []);

  // Function to fetch activities
  const fetchActivities = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getactivity");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  // Function to toggle the flag status of an activity
  const handleFlag = async (id, currentFlagStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/flagActivity/${id}`,
        {
          flag: !currentFlagStatus, // Toggle the flag status
        }
      );
      alert(response.data.message); // Show success message

      // Update the activities list to reflect the flag change
      const updatedActivities = activities.map((activity) =>
        activity._id === id
          ? { ...activity, flag: !currentFlagStatus }
          : activity
      );
      setActivities(updatedActivities);
    } catch (error) {
      console.error("Error updating flag status:", error);
    }
  };

  return (
    <div>
      <h1>Activities List</h1>
      {activities.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Name</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Flag Status
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {activity.title}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {activity.description}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {activity.flag ? "flag" : "unflag"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() => handleFlag(activity._id, activity.flag)}
                  >
                    {activity.flag ? "Unflag" : "Flag"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No activities available.</p>
      )}
    </div>
  );
};

export default ActivityList;
