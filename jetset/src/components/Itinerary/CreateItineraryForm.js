import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateItineraryForm = ({ tourguideId }) => {
  const [formData, setFormData] = useState({
    name: "",
    activities: [], // Array to hold selected activity ids
    budget: "",
    locations: "",
    timeline: "",
    duration: "",
    language: "",
    availability_dates: "",
    pickup_location: "",
    dropoff_location: "",
    accessibility: "",
    created_by: tourguideId || "",
    tags: [], // Array to hold selected tag ids
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activities, setActivities] = useState([]); // State for storing activities
  const [tags, setTags] = useState([]); // State for storing tags
  const [selectedActivities, setSelectedActivities] = useState([]); // To track selected activities for each dropdown

  // Fetch activities and tags when the component mounts
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getactivity");
        setActivities(response.data); // Assuming the response is an array of activity objects
      } catch (err) {
        setError("An error occurred while fetching the activities.");
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Tags");
        setTags(response.data); // Assuming the response is an array of tag objects
      } catch (err) {
        setError("An error occurred while fetching the tags.");
      }
    };

    fetchActivities();
    fetchTags();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "activities" || name === "tags") {
      // Handle multi-select values
      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({
        ...formData,
        [name]: selectedValues,
      });
    } else {
      // Handle single field changes
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle adding a new activity dropdown
  const handleAddActivity = () => {
    setSelectedActivities([...selectedActivities, ""]); // Add a new empty string to the selectedActivities array
  };

  // Handle selecting activity for a specific dropdown
  const handleActivitySelect = (index, activityId) => {
    const updatedActivities = [...selectedActivities];
    updatedActivities[index] = activityId;
    setSelectedActivities(updatedActivities);
    
    // Directly update formData activities here
    setFormData(prevFormData => ({
      ...prevFormData,
      activities: updatedActivities
    }));
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const { name, value } = e.target;
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      [name]: selectedValues,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedActivities.length === 0 || selectedActivities.includes("")) {
      setError("You must add at least one activity.");
      return;
    }
  
    // FormData already has the updated activities now
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

        {/* Add activities dynamically */}
        <div>
          <label>Activities:</label>
          {selectedActivities.map((activityId, index) => (
            <div key={index}>
              <select
                value={activityId}
                onChange={(e) => handleActivitySelect(index, e.target.value)}
                required
              >
                <option value="">Select an activity</option>
                {activities.map((activity) => (
                  <option key={activity._id} value={activity._id}>
                    {activity._id} {/* Adjust this to show appropriate name */}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button type="button" onClick={handleAddActivity}>Add Activity</button>
        </div>

        {/* Select Tags */}
        <div>
          <label>Tags:</label>
          <select
            name="tags"
            value={formData.tags}
            onChange={handleTagChange}
            required
          >
            <option value="">Select tags</option>
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag._id} {/* Adjust this to show appropriate tag name */}
              </option>
            ))}
          </select>
        </div>

        {/* Other form fields */}
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
            type="date"
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
        <button type="submit">Create Itinerary</button>
      </form>
    </div>
  );
};

export default CreateItineraryForm;
