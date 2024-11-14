import React, { useState, useEffect } from "react";
import axios from "axios";
import "./bookmark.css";
import "font-awesome/css/font-awesome.min.css";

//const touristId = "672635325490518dc4cd46cc"; // Hard-coded tourist ID
const ActivitiesList = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state variables
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");

  // Sorting state variables
  const [sortBy, setSortBy] = useState("ratings"); // Default sort option
  const [sortOrder, setSortOrder] = useState(1); // Default to ascending order

  // Fetch all activities
  const fetchActivities = async () => {
    setLoading(true); // Show loading state
    setError(null); // Reset error state

    try {
      const response = await axios.get("/getactivity"); // Assuming the endpoint is "/activities"
      setActivities(response.data); // Store the activities in state
    } catch (err) {
      setError("Error fetching activities: " + err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Filter activities based on user inputs
  const filterActivities = async () => {
    setLoading(true); // Show loading state
    setError(null); // Reset error state

    try {
      const response = await axios.get("/filterActivity", {
        params: {
          budget: budget || undefined, // Send filter params only if they exist
          date: date || undefined,
          category: category || undefined,
          rating: rating || undefined,
        },
      });
      setActivities(response.data); // Store the filtered activities in state
    } catch (err) {
      setError("Error filtering activities: " + err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Sort activities based on user inputs
  const sortActivities = async () => {
    setLoading(true); // Show loading state
    setError(null); // Reset error state

    try {
      const response = await axios.get("/sortactivities", {
        params: {
          sortBy,
          sortOrder,
        },
      });

      setActivities(response.data); // Store the sorted activities in state
    } catch (err) {
      setError("Error fetching sorted activities: " + err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const bookmarkActivity = async (activityId, isBookmarked) => {
    // Get the activity from the list of activities
    const activity = activities.find((a) => a._id === activityId);
  
    // If the activity is already bookmarked and the user wants to unbookmark, perform unbookmarking
    if (isBookmarked) {
      try {
        const touristId = "672635325490518dc4cd46cc"; // Hardcoded touristId
  
        console.log("Unbookmarking activity with touristId:", touristId, "and activityId:", activityId);
  
        // Send a request to unbookmark the activity
        const response = await axios.post("http://localhost:3000/api/unbookmarkActivity", {
          touristId, // Using the hardcoded touristId
          activityId,
        });
  
        if (response.data.message) {
          console.log("Unbookmark activity success:", response.data.message);
          // Update the local state to reflect that the activity is unbookmarked
          setActivities((prevActivities) =>
            prevActivities.map((activity) =>
              activity._id === activityId
                ? { ...activity, isBookmarked: false } // Set the activity as unbookmarked
                : activity
            )
          );
        } else {
          console.error("Error:", response.data.error);
          alert(response.data.error); // Display the error message from the server
        }
      } catch (err) {
        console.error("Error unbookmarking activity:", err); // Log any error that occurs
        alert("Error unbookmarking activity: " + err.message); // Display the error message to the user
      }
    } else {
      // If the activity is not bookmarked, perform bookmarking
      try {
        const touristId = "672635325490518dc4cd46cc"; // Hardcoded touristId
  
        console.log("Sending request to bookmark activity with touristId:", touristId, "and activityId:", activityId);
  
        // Send a POST request to bookmark the activity
        const response = await axios.post("http://localhost:3000/api/bookmarkActivity", {
          touristId, // Using the hardcoded touristId
          activityId,
        });
  
        if (response.data.message) {
          console.log("Bookmark activity success:", response.data.message);
          // Update the local state to reflect that the activity is bookmarked
          setActivities((prevActivities) =>
            prevActivities.map((activity) =>
              activity._id === activityId
                ? { ...activity, isBookmarked: true } // Set the activity as bookmarked
                : activity
            )
          );
        } else {
          console.error("Error:", response.data.error);
          alert(response.data.error); // Display the error message from the server
        }
      } catch (err) {
        console.error("Error bookmarking activity:", "err"); // Log any error that occurs
        alert("Error bookmarking activity: " + "already bookmarked"); // Display the error message to the user
      }
    }
  };
  
  
  
  

  // Fetch all activities when the component mounts
  useEffect(() => {
    fetchActivities();
  }, []); // Run only once on mount

  return (
    <div>
      <h2>Activities List</h2>

      {/* Loading and Error States */}
      {loading && <div>Loading activities...</div>}
      {error && <div>{error}</div>}

      {/* Filter Inputs */}
      <div className="filters">
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button onClick={filterActivities}>Filter Activities</button>
      </div>

      {/* Sort Options */}
      <div className="sort-options">
        <h3>Sort Activities</h3>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="ratings">Sort by Ratings</option>
          <option value="budget">Sort by Budget</option>
        </select>

        <select
          onChange={(e) => setSortOrder(Number(e.target.value))}
          value={sortOrder}
        >
          <option value={1}>Ascending</option>
          <option value={-1}>Descending</option>
        </select>
        <button onClick={sortActivities}>Sort Activities</button>
      </div>

      {/* Activities List */}
      <ul>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.title || "No Title Available"}</h3>
              <p>
                Location:{" "}
                {activity.location?.address || "No Location Available"}
              </p>
              <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              <p>Budget: {activity.budget || "No Budget"}</p>
              <p>Rating: {activity.rating || "No Rating"}</p>
              <p>Category: {activity.category || "No Category Available"}</p>
              <p>
                Tags:{" "}
                {activity.tags.length > 0
                  ? activity.tags.join(", ")
                  : "No Tags"}
              </p>
              <p>Booking Open: {activity.booking_open ? "Yes" : "No"}</p>
              {/* Bookmark Button */}
              <button
        className="bookmark-button"
        onClick={() => bookmarkActivity(activity._id, activity.isBookmarked)}
      >
        <i
          className={`fa ${activity.isBookmarked ? "fa-bookmark" : "fa-bookmark-o"}`}
        ></i>
        {activity.isBookmarked ? " Unbookmark" : " Bookmark"}
      </button>
            </li>
          ))
        ) : (
          <div>No activities available.</div>
        )}
      </ul>
    </div>
  );
};

export default ActivitiesList;