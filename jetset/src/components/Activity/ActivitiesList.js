import React, { useState, useEffect } from "react";
import axios from "axios";
import "./bookmark.css";
import "font-awesome/css/font-awesome.min.css";

//const touristId = "672635325490518dc4cd46cc"; // Hard-coded tourist ID
const ActivitiesList = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]); // Store bookmarked activities
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

    // New state variable to toggle between showing all or only bookmarked activities
    const [showBookmarked, setShowBookmarked] = useState(false);

  // Fetch all activities
  const fetchActivities = async () => {
    setLoading(true); // Show loading state
    setError(null); // Reset error state

    try {
      // Fetch activities
      const activityResponse = await axios.get("/getactivity");
      setActivities(activityResponse.data);

      // Fetch tourist data
      const touristResponse = await axios.get(`/getTourist/${touristId}`);
      setBookmarkedActivities(touristResponse.data.bookmarkedActivities || []);
    } catch (err) {
      setError("Error fetching data: " + err.message);
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

  // const bookmarkActivity = async (activityId, isBookmarked) => {
  //   // Get the activity from the list of activities
  //   const activity = activities.find((a) => a._id === activityId);
  
  //   // If the activity is already bookmarked and the user wants to unbookmark, perform unbookmarking
  //   if (isBookmarked) {
  //     try {
  //       //const touristId = "672635325490518dc4cd46cc"; // Hardcoded touristId
  
  //       console.log("Unbookmarking activity with touristId:", touristId, "and activityId:", activityId);
  
  //       // Send a request to unbookmark the activity
  //       const response = await axios.post("http://localhost:3000/api/unbookmarkActivity", {
  //         touristId, // Using the hardcoded touristId
  //         activityId,
  //       });
  
  //       if (response.data.message) {
  //         console.log("Unbookmark activity success:", response.data.message);
  //         // Update the local state to reflect that the activity is unbookmarked
  //         setActivities((prevActivities) =>
  //           prevActivities.map((activity) =>
  //             activity._id === activityId
  //               ? { ...activity, isBookmarked: false } // Set the activity as unbookmarked
  //               : activity
  //           )
  //         );
  //       } else {
  //         console.error("Error:", response.data.error);
  //         alert(response.data.error); // Display the error message from the server
  //       }
  //     } catch (err) {
  //       console.error("Error unbookmarking activity:", err); // Log any error that occurs
  //       alert("Error unbookmarking activity: " + err.message); // Display the error message to the user
  //     }
  //   } else {
  //     // If the activity is not bookmarked, perform bookmarking
  //     try {
  //       //const touristId = "672635325490518dc4cd46cc"; // Hardcoded touristId
  
  //       console.log("Sending request to bookmark activity with touristId:", touristId, "and activityId:", activityId);
  
  //       // Send a POST request to bookmark the activity
  //       const response = await axios.post("http://localhost:3000/api/bookmarkActivity", {
  //         touristId, // Using the hardcoded touristId
  //         activityId,
  //       });
  
  //       if (response.data.message) {
  //         console.log("Bookmark activity success:", response.data.message);
  //         // Update the local state to reflect that the activity is bookmarked
  //         setActivities((prevActivities) =>
  //           prevActivities.map((activity) =>
  //             activity._id === activityId
  //               ? { ...activity, isBookmarked: true } // Set the activity as bookmarked
  //               : activity
  //           )
  //         );
  //       } else {
  //         console.error("Error:", response.data.error);
  //         alert(response.data.error); // Display the error message from the server
  //       }
  //     } catch (err) {
  //       console.error("Error bookmarking activity:", "err"); // Log any error that occurs
  //       alert("Error bookmarking activity: " + "already bookmarked"); // Display the error message to the user
  //     }
  //   }
  // };

  const bookmarkActivity = async (activityId, isBookmarked) => {
    try {
      const endpoint = isBookmarked
        ? "/api/unbookmarkActivity"
        : "/api/bookmarkActivity";

      // Send request to bookmark or unbookmark
      const response = await axios.post(endpoint, {
        touristId,
        activityId,
      });

      if (response.data.message) {
        // Update bookmarkedActivities in state
        setBookmarkedActivities((prevBookmarked) =>
          isBookmarked
            ? prevBookmarked.filter((id) => id !== activityId) // Remove from bookmarked
            : [...prevBookmarked, activityId] // Add to bookmarked
        );
      } else {
        alert(response.data.error || "Error updating bookmark status");
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
      alert("Error updating bookmark: " + err.message);
    }
  };

  // Fetch all activities when the component mounts
  useEffect(() => {
    fetchActivities();
  }, []); // Run only once on mount

  // Toggle between showing all activities and only bookmarked ones
  const handleToggleBookmarked = () => {
    setShowBookmarked((prev) => !prev);
  };

  // Filter activities to show only bookmarked ones if the flag is true
  const displayedActivities = showBookmarked
    ? activities.filter((activity) =>
        bookmarkedActivities.includes(activity._id)
      )
    : activities;

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

      {/* Toggle Bookmarked Activities Button */}
      <div className="toggle-bookmarked">
        <button
          className="toggle-btn"
          onClick={handleToggleBookmarked}
        >
          {showBookmarked ? "Show All Activities" : "Show Bookmarked Activities"}
        </button>
      </div>

      {/* Activities List */}
      <ul>
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity) => {
            const isBookmarked = bookmarkedActivities.includes(activity._id);
            return (
              <li key={activity._id} className="activity-item">
                <h3>{activity.title || "No Title Available"}</h3>
                <p>
                  Location: {activity.location?.address || "No Location"}
                </p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                <p>Budget: {activity.budget || "No Budget"}</p>
                <p>Rating: {activity.rating || "No Rating"}</p>
                <p>Category: {activity.category || "No Category"}</p>
                <p>Tags: {activity.tags.length > 0 ? activity.tags.join(", ") : "No Tags"}</p>
                <p>Booking Open: {activity.booking_open ? "Yes" : "No"}</p>
                {/* Bookmark Button */}
                <button
                  className="bookmark-button"
                  onClick={() => bookmarkActivity(activity._id, isBookmarked)}
                >
                  <i
                    className={`fa ${isBookmarked ? "fa-bookmark" : "fa-bookmark-o"}`}
                  ></i>
                  {isBookmarked ? " Unbookmark" : " Bookmark"}
                </button>
              </li>
            );
          })
        ) : (
          <div>No activities available.</div>
        )}
      </ul>
    </div>
  );
};

export default ActivitiesList;