// import React, { useState } from "react";
// import axios from "axios";

// const ActivityForm = ({ onActivityCreated }) => {
//   const BASE_URL = "http://localhost:3000";

//   const [formData, setFormData] = useState({
//     title: "",
//     budget: "",
//     date: "",
//     time: "",
//     location: "",
//     category: "",
//     special_discount: "",
//     booking_open: true,
//     tags: "",
//   });

//   const [activityId, setActivityId] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");
//   const [activities, setActivities] = useState([]);
//   const [isFetchingActivities, setIsFetchingActivities] = useState(false);
//   const [activitiesFetched, setActivitiesFetched] = useState(false);

//   const getActivities = async () => {
//     setIsFetchingActivities(true);
//     try {
//       const response = await axios.get(`${BASE_URL}/getactivity`);
//       setActivities(response.data);
//       setActivitiesFetched(true);
//       setStatusMessage("Activities fetched successfully!");
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//       setStatusMessage("Error fetching activities. Please try again.");
//     } finally {
//       setIsFetchingActivities(false);
//     }
//   };

//   // const handleChange = (e) => {
//   //   const { name, value, type, checked } = e.target;

//   //   if (type === "checkbox" && name === "booking_open") {
//   //     setFormData((prevState) => ({ ...prevState, booking_open: checked }));
//   //   } else {
//   //     setFormData((prevState) => ({ ...prevState, [name]: value }));
//   //   }
//   // };
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: type === "checkbox" ? checked : value, // Handle checkbox separately
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const preparedData = {
//         ...formData,
//         tags: formData.tags.split(",").map((tag) => tag.trim()),
//       };

//       const response = await axios.post(
//         `${BASE_URL}/addactivity`,
//         preparedData
//       );
//       onActivityCreated(response.data);
//       resetForm();
//       setStatusMessage("Activity added successfully!");
//       getActivities();
//     } catch (error) {
//       console.error("Error adding activity:", error);
//       setStatusMessage("Error adding activity. Please try again.");
//     }
//   };

//   const handleUpdateActivity = async () => {
//     if (!activityId.trim()) {
//       setStatusMessage("Please enter an Activity ID to update.");
//       return;
//     }

//     try {
//       const preparedData = {
//         ...formData,
//         tags: formData.tags.split(",").map((tag) => tag.trim()), // Ensure tags are formatted correctly
//       };

//       console.log(preparedData); // Log prepared data to check if it's correct

//       await axios.put(`${BASE_URL}/updateactivity/${activityId}`, preparedData);
//       setStatusMessage("Activity updated successfully!");
//       getActivities();
//     } catch (error) {
//       console.error("Error updating activity:", error);
//       setStatusMessage("Error updating activity. Please try again.");
//     }
//   };

//   const handleDeleteActivity = async () => {
//     if (!activityId.trim()) {
//       setStatusMessage("Please enter an Activity ID to delete.");
//       return;
//     }

//     try {
//       await axios.delete(`${BASE_URL}/deleteactivity/${activityId}`);
//       setStatusMessage("Activity deleted successfully!");
//       getActivities();
//     } catch (error) {
//       console.error("Error deleting activity:", error);
//       setStatusMessage("Error deleting activity. Please try again.");
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: "",
//       budget: "",
//       date: "",
//       time: "",
//       location: "",
//       category: "",
//       special_discount: "",
//       booking_open: true,
//       tags: "",
//     });
//     setActivityId("");
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <h3>Create Activity</h3>

//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//           placeholder="Title"
//           required
//         />

//         <input
//           type="number"
//           name="budget"
//           value={formData.budget}
//           onChange={handleChange}
//           placeholder="Budget"
//           required
//         />

//         <input
//           type="date"
//           name="date"
//           value={formData.date}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="time"
//           name="time"
//           value={formData.time}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="location"
//           value={formData.location}
//           onChange={handleChange}
//           placeholder="Location (Address)"
//           required
//         />

//         <input
//           type="text"
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           placeholder="Category ID"
//           required
//         />
//         <input
//           type="text"
//           name="special_discount"
//           value={formData.special_discount}
//           onChange={handleChange}
//           placeholder="Special Discount"
//         />

//         <label>
//           Booking Open:
//           <input
//             type="checkbox"
//             name="booking_open"
//             checked={formData.booking_open}
//             onChange={handleChange}
//           />
//         </label>

//         <input
//           type="text"
//           name="tags"
//           value={formData.tags}
//           onChange={handleChange}
//           placeholder="Tags (comma-separated)"
//         />

//         <input
//           type="text"
//           value={activityId}
//           onChange={(e) => setActivityId(e.target.value)}
//           placeholder="Enter Activity ID for Update/Delete"
//         />

//         <button type="submit">Add Activity</button>
//         <button type="button" onClick={handleUpdateActivity}>
//           Update Activity
//         </button>
//         <button type="button" onClick={handleDeleteActivity}>
//           Delete Activity
//         </button>
//       </form>

//       {statusMessage && <p>{statusMessage}</p>}

//       <button onClick={getActivities}>Get Activities</button>

//       {isFetchingActivities ? (
//         <p>Loading activities...</p>
//       ) : activitiesFetched && activities.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Budget</th>
//               <th>Date</th>
//               <th>Time</th>
//               <th>Location</th>
//               <th>Category</th>
//               <th>Special Discount</th>
//               <th>Booking Open</th>
//               <th>Tags</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr key={activity._id}>
//                 <td>{activity.title || "N/A"}</td>
//                 <td>{activity.budget || "N/A"}</td>
//                 <td>
//                   {activity.date
//                     ? new Date(activity.date).toLocaleDateString()
//                     : "N/A"}
//                 </td>
//                 <td>{activity.time || "N/A"}</td>
//                 <td>{activity.location || "N/A"}</td>
//                 <td>{activity.category || "N/A"}</td>
//                 <td>{activity.special_discount || "N/A"}</td>
//                 <td>
//                   {activity.booking_open !== undefined
//                     ? activity.booking_open
//                       ? "True"
//                       : "False"
//                     : "N/A"}
//                 </td>
//                 <td>{activity.tags?.join(", ") || "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No activities found.</p>
//       )}
//     </div>
//   );
// };

// export default ActivityForm;

import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivityForm = ({ onActivityCreated }) => {
  const BASE_URL = "http://localhost:3000";

  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    date: "",
    time: "",
    location: "",
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

  // Fetch the activities when the component mounts
  useEffect(() => {
    getActivities();
  }, []);

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
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      getActivities();
    } catch (error) {
      console.error("Error adding activity:", error);
      setStatusMessage("Error adding activity. Please try again.");
    }
  };

  const handleUpdateActivity = async () => {
    if (!activityId.trim()) {
      setStatusMessage("Please select an Activity ID to update.");
      return;
    }

    // Prepare data for sending to the backend
    const preparedData = {};

    // Only add fields that are filled out
    if (formData.title) preparedData.title = formData.title;
    if (formData.budget) preparedData.budget = formData.budget;
    if (formData.date) preparedData.date = formData.date;
    if (formData.time) preparedData.time = formData.time;
    if (formData.location) preparedData.location = formData.location;
    if (formData.category) preparedData.category = formData.category;
    if (formData.special_discount)
      preparedData.special_discount = formData.special_discount;
    if (formData.booking_open !== undefined)
      preparedData.booking_open = formData.booking_open;
    if (formData.tags)
      preparedData.tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag); // Filter out empty tags

    // Check if there's any data to update
    if (Object.keys(preparedData).length === 0) {
      setStatusMessage("Please fill in at least one field to update.");
      return;
    }

    console.log("Sending data for update:", preparedData); // Log prepared data to check structure

    try {
      await axios.put(`${BASE_URL}/updateactivity/${activityId}`, preparedData);
      setStatusMessage("Activity updated successfully!");
      getActivities();
    } catch (error) {
      console.error("Error updating activity:", error);
      setStatusMessage("Error updating activity. Please try again.");
    }
  };

  const handleDeleteActivity = async () => {
    if (!activityId.trim()) {
      setStatusMessage("Please select an Activity ID to delete.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/deleteactivity/${activityId}`);
      setStatusMessage("Activity deleted successfully!");
      getActivities();
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
      location: "",
      category: "",
      special_discount: "",
      booking_open: true,
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
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location (Address)"
          required
        />

        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category ID"
          required
        />
        <input
          type="text"
          name="special_discount"
          value={formData.special_discount}
          onChange={handleChange}
          placeholder="Special Discount"
        />

        <label>
          Booking Open:
          <input
            type="checkbox"
            name="booking_open"
            checked={formData.booking_open}
            onChange={handleChange}
          />
        </label>

        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
        />

        {/* Activity ID Dropdown */}
        <label>
          Select Activity to Update/Delete:
          <select
            name="activityId"
            value={activityId}
            onChange={(e) => setActivityId(e.target.value)}
          >
            <option value="">Select an Activity</option>
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.title} (ID: {activity._id})
              </option>
            ))}
          </select>
        </label>

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
              <th>Location</th>
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
                <td>
                  {activity.date
                    ? new Date(activity.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{activity.time || "N/A"}</td>
                <td>{activity.location || "N/A"}</td>
                <td>{activity.category || "N/A"}</td>
                <td>{activity.special_discount || "N/A"}</td>
                <td>
                  {activity.booking_open !== undefined
                    ? activity.booking_open
                      ? "True"
                      : "False"
                    : "N/A"}
                </td>
                <td>{activity.tags?.join(", ") || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No activities found.</p>
      )}
    </div>
  );
};

export default ActivityForm;
