import React, { useEffect, useState } from "react";
import UpdateItineraryForm from "./UpdateItineraryForm.js";
import axios from "axios";

const ViewCreatedItineraries = ({ id, onEdit }) => {
  const [itineraries, setItineraries] = useState([]);
  const [touristItineraries, setTouristItineraries] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch itineraries and tourist itineraries when component mounts
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/listofiternaries/${id}`
        );
        setItineraries(response.data.itineraries);
        setTouristItineraries(response.data.touristItineraries);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [id]);

  if (loading) {
    return <p>Loading itineraries...</p>;
  }

  const deleteItinerary = async (itineraryId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this itinerary?"
    );

    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/deleteItinerary`,
          {
            data: { id: itineraryId }, // Sending the ID in the body
          }
        );
        window.location.reload();
        setMessage(response.data.msg || "Itinerary deleted successfully!");
        setError(""); // Clear any previous error
        setItineraries((prevItineraries) =>
          prevItineraries.filter((itinerary) => itinerary._id !== itineraryId)
        );
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "An error occurred while deleting the itinerary."
        );
        setMessage(""); // Clear success message
      }
    }
  };

  const toggleActivationStatus = async (itineraryId, currentStatus) => {
    try {
      let response;

      if (currentStatus === "active") {
        response = await axios.post(
          `http://localhost:3000/deactivateItinerary/${itineraryId}`
        );
      } else {
        response = await axios.post(
          `http://localhost:3000/activateItinerary/${itineraryId}`
        );
      }
      window.location.reload();
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to toggle itinerary status."
      );
      setMessage("");
    }
  };

  return (
    <div>
      <h2>My Created Itineraries</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
      <h3>Regular Itineraries</h3>
      <ul>
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <p>Name: {itinerary.name}</p>
              <h4>
                Activities:{" "}
                {itinerary.activities && itinerary.activities.length > 0
                  ? itinerary.activities
                      .map((activity) => activity?.title || "Unnamed Activity")
                      .join(", ")
                  : "No activities listed"}
              </h4>
              <p>
                Locations:{" "}
                {itinerary.locations?.join(", ") || "No locations listed"}
              </p>
              <p>Timeline: {itinerary.timeline || "N/A"}</p>
              <p>Duration: {itinerary.duration || "N/A"}</p>
              <p>Language: {itinerary.language || "N/A"}</p>
              <p>
                Availability Dates:{" "}
                {itinerary.availability_dates
                  ?.map((date) => new Date(date).toLocaleDateString())
                  .join(", ") || "N/A"}
              </p>
              <p>Pickup Location: {itinerary.pickup_location || "N/A"}</p>
              <p>Dropoff Location: {itinerary.dropoff_location || "N/A"}</p>
              <p>Accessibility: {itinerary.accessibility || "N/A"}</p>
              <p>Budget: ${itinerary.budget || "N/A"}</p>
              <p>
                Tags:{" "}
                {itinerary.tag?.map((tag) => tag.name).join(", ") ||
                  "No tags available"}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <a
                  href="#"
                  style={{
                    color: "green",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() =>
                    toggleActivationStatus(itinerary._id, itinerary.status)
                  }
                >
                  {itinerary.status === "active" ? "Deactivate" : "Activate"}
                </a>
                <a
                  href="#"
                  style={{
                    color: "red",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => deleteItinerary(itinerary._id)}
                >
                  Delete
                </a>
                <a
                  href="#"
                  style={{
                    color: "#007BFF",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => onEdit(itinerary._id)}
                >
                  Edit
                </a>
              </div>
            </li>
          ))
        ) : (
          <p>No itineraries found.</p>
        )}
      </ul>
    </div>
  );
};

export default ViewCreatedItineraries;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaFlag } from "react-icons/fa"; // Import Font Awesome flag icon

// const ViewCreatedItineraries = ({ id }) => {
//   const [itineraries, setItineraries] = useState([]);
//   const [touristItineraries, setTouristItineraries] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   // Fetch itineraries and tourist itineraries when component mounts
//   useEffect(() => {
//     const fetchItineraries = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/listofiternaries/${id}`
//         );
//         setItineraries(response.data.itineraries);
//         setTouristItineraries(response.data.touristItineraries);
//         setError("");
//       } catch (err) {
//         setError(err.response?.data?.error || "Error fetching itineraries");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchItineraries();
//   }, [id]);

//   // Toggle flag status
//   const toggleFlagStatus = async (itineraryId, currentStatus) => {
//     try {
//       await axios.patch(
//         `http://localhost:3000/itineraries/${itineraryId}/flag`,
//         {
//           flagged: !currentStatus,
//         }
//       );
//       setItineraries((prevItineraries) =>
//         prevItineraries.map((itinerary) =>
//           itinerary._id === itineraryId
//             ? { ...itinerary, flagged: !currentStatus }
//             : itinerary
//         )
//       );
//     } catch (error) {
//       setError("Error updating flag status");
//     }
//   };

//   if (loading) {
//     return <p>Loading itineraries...</p>;
//   }

//   return (
//     <div>
//       <h2>Created Itineraries</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <h3>Regular Itineraries</h3>
//       <ul>
//         {itineraries.length > 0 ? (
//           itineraries.map((itinerary) => (
//             <li key={itinerary._id}>
//               <p>
//                 Name: {itinerary.name}
//                 <FaFlag
//                   onClick={() =>
//                     toggleFlagStatus(itinerary._id, itinerary.flagged)
//                   }
//                   style={{
//                     color: itinerary.flagged ? "red" : "grey",
//                     cursor: "pointer",
//                     marginLeft: "8px",
//                   }}
//                   title={
//                     itinerary.flagged ? "Unflag Itinerary" : "Flag Itinerary"
//                   }
//                 />
//               </p>
//               <h4>
//                 Activities:{" "}
//                 {itinerary.activities
//                   ?.map((activity) => activity.name)
//                   .join(", ") || "No activities listed"}
//               </h4>
//               <p>
//                 Locations:{" "}
//                 {itinerary.locations?.join(", ") || "No locations listed"}
//               </p>
//               <p>Timeline: {itinerary.timeline || "N/A"}</p>
//               <p>Duration: {itinerary.duration || "N/A"}</p>
//               <p>Language: {itinerary.language || "N/A"}</p>
//               <p>
//                 Availability Dates:{" "}
//                 {itinerary.availability_dates
//                   ?.map((date) => new Date(date).toLocaleDateString())
//                   .join(", ") || "N/A"}
//               </p>
//               <p>Pickup Location: {itinerary.pickup_location || "N/A"}</p>
//               <p>Dropoff Location: {itinerary.dropoff_location || "N/A"}</p>
//               <p>Accessibility: {itinerary.accessibility || "N/A"}</p>
//               <p>Budget: ${itinerary.budget || "N/A"}</p>
//               <p>
//                 Tags:{" "}
//                 {itinerary.tag?.map((tag) => tag.name).join(", ") ||
//                   "No tags available"}
//               </p>
//             </li>
//           ))
//         ) : (
//           <p>No itineraries found.</p>
//         )}
//       </ul>

//       <h3>Tourist Itineraries</h3>
//       <ul>
//         {touristItineraries.length > 0 ? (
//           touristItineraries.map((itinerary) => (
//             <li key={itinerary._id}>
//               <h4>
//                 Activities:{" "}
//                 {itinerary.activities
//                   ?.map((activity) => activity.name)
//                   .join(", ") || "No activities listed"}
//               </h4>
//               <p>
//                 Locations:{" "}
//                 {itinerary.locations
//                   ?.map((location) => location.address)
//                   .join(", ") || "No locations listed"}
//               </p>
//               <p>
//                 Date Range:{" "}
//                 {itinerary.dateRange?.startDate
//                   ? new Date(itinerary.dateRange.startDate).toLocaleDateString()
//                   : "N/A"}{" "}
//                 to{" "}
//                 {itinerary.dateRange?.endDate
//                   ? new Date(itinerary.dateRange.endDate).toLocaleDateString()
//                   : "N/A"}
//               </p>
//               <p>
//                 Tags:{" "}
//                 {itinerary.tags?.map((tag) => tag.name).join(", ") ||
//                   "No tags available"}
//               </p>
//             </li>
//           ))
//         ) : (
//           <p>No tourist itineraries found.</p>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default ViewCreatedItineraries;
