import React, { useState } from "react";
import axios from "axios";

const ActivityForm = ({ onActivityCreated }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8000";

  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    date: "",
    time: "",
    location: { coordinates: { lat: "", lng: "" } },
    price: { fixed: "", range: { min: "", max: "" } },
    category: "",
    special_discount: "",
    booking_open: true,
    tags: "",
  });

  const [activityId, setActivityId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [activities, setActivities] = useState([]);
  const [isFetchingActivities, setIsFetchingActivities] = useState(false);
  const [activitiesFetched, setActivitiesFetched] = useState(false);

  const getActivities = async () => {
    setIsFetchingActivities(true);
    try {
      const response = await axios.get(`${BASE_URL}/getactivity`);
      setActivities(response.data);
      setActivitiesFetched(true);
      setStatusMessage("Activities fetched successfully!");
    } catch (error) {
      console.error("Error fetching activities:", error);
      setStatusMessage("Error fetching activities. Please try again.");
    } finally {
      setIsFetchingActivities(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.coordinates")) {
      const field = name.split(".")[2];
      setFormData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          coordinates: { ...prevState.location.coordinates, [field]: value },
        },
      }));
    } else if (name.startsWith("price.range")) {
      const field = name.split(".")[2];
      setFormData((prevState) => ({
        ...prevState,
        price: {
          ...prevState.price,
          range: { ...prevState.price.range, [field]: value },
        },
      }));
    } else if (name === "price.fixed") {
      setFormData((prevState) => ({
        ...prevState,
        price: {
          ...prevState.price,
          fixed: value,
        },
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const preparedData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      const response = await axios.post(
        `${BASE_URL}/addactivity`,
        preparedData
      );
      onActivityCreated(response.data);
      resetForm();
      setStatusMessage("Activity added successfully!");
      getActivities(); // Optionally refresh the activities after adding
    } catch (error) {
      console.error("Error adding activity:", error);
      setStatusMessage("Error adding activity. Please try again.");
    }
  };

  const handleUpdateActivity = async () => {
    if (!activityId.trim()) {
      setStatusMessage("Please enter an Activity ID to update.");
      return;
    }

    try {
      const preparedData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      await axios.put(`${BASE_URL}/updateactivity/${activityId}`, preparedData);
      setStatusMessage("Activity updated successfully!");
      getActivities(); // Optionally refresh the activities after updating
    } catch (error) {
      console.error("Error updating activity:", error);
      setStatusMessage("Error updating activity. Please try again.");
    }
  };

  const handleDeleteActivity = async () => {
    if (!activityId.trim()) {
      setStatusMessage("Please enter an Activity ID to delete.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/deleteactivity/${activityId}`);
      setStatusMessage("Activity deleted successfully!");
      getActivities(); // Optionally refresh the activities after deleting
    } catch (error) {
      console.error("Error deleting activity:", error);
      setStatusMessage("Error deleting activity. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      budget: "",
      date: "",
      time: "",
      location: { coordinates: { lat: "", lng: "" } },
      price: { fixed: "", range: { min: "", max: "" } },
      category: "",
      specialDiscount: "",
      bookingOpen: "",
      tags: "",
    });
    setActivityId("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Create Activity</h3>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="Budget"
          required
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="location.coordinates.lat"
          value={formData.location.coordinates.lat}
          onChange={handleChange}
          placeholder="Latitude"
          required
        />
        <input
          type="number"
          name="location.coordinates.lng"
          value={formData.location.coordinates.lng}
          onChange={handleChange}
          placeholder="Longitude"
          required
        />

        <input
          type="number"
          name="price.fixed"
          value={formData.price.fixed}
          onChange={handleChange}
          placeholder="Fixed Price"
        />
        <input
          type="number"
          name="price.range.min"
          value={formData.price.range.min}
          onChange={handleChange}
          placeholder="Min Price"
        />
        <input
          type="number"
          name="price.range.max"
          value={formData.price.range.max}
          onChange={handleChange}
          placeholder="Max Price"
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <input
          type="text"
          name="specialDiscount"
          value={formData.specialDiscount}
          onChange={handleChange}
          placeholder="Special Discount"
        />
        <input
          type="text"
          name="bookingOpen"
          value={formData.bookingOpen}
          onChange={handleChange}
          placeholder="Booking Open"
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
        />

        <input
          type="text"
          value={activityId}
          onChange={(e) => setActivityId(e.target.value)}
          placeholder="Enter Activity ID for Update/Delete"
        />

        <button type="submit">Add Activity</button>
        <button type="button" onClick={handleUpdateActivity}>
          Update Activity
        </button>
        <button type="button" onClick={handleDeleteActivity}>
          Delete Activity
        </button>
      </form>

      {statusMessage && <p>{statusMessage}</p>}

      <button onClick={getActivities}>Get Activities</button>

      {isFetchingActivities ? (
        <p>Loading activities...</p>
      ) : activitiesFetched && activities.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Budget</th>
              <th>Date</th>
              <th>Time</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Fixed Price</th>
              <th>Min Price</th>
              <th>Max Price</th>
              <th>Category</th>
              <th>Special Discount</th>
              <th>Booking Open</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.title || "N/A"}</td>
                <td>{activity.budget || "N/A"}</td>
                <td>{activity.date || "N/A"}</td>
                <td>{activity.time || "N/A"}</td>
                <td>{activity.location?.coordinates?.lat || "N/A"}</td>
                <td>{activity.location?.coordinates?.lng || "N/A"}</td>
                <td>{activity.price?.fixed || "N/A"}</td>
                <td>{activity.price?.range?.min || "N/A"}</td>
                <td>{activity.price?.range?.max || "N/A"}</td>
                <td>{activity.category || "N/A"}</td>
                <td>{activity.specialDiscount || "N/A"}</td>
                <td>{activity.bookingOpen ? "Yes" : "No"}</td>
                <td>{activity.tags?.join(", ") || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        activitiesFetched && <p>No activities available.</p>
      )}
    </div>
  );
};

export default ActivityForm;
