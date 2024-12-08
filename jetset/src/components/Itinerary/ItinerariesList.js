import React, { useEffect, useState } from "react";
import axios from "axios";

const ItineraryList = (onEdit) => {
  const [itineraries, setItineraries] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch itineraries on component mount
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Itineraries");
        setItineraries(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  // Handle itinerary deletion
  // const handleDelete = async (id) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:3000/deleteItinerary`,
  //       {
  //         data: { id }, // Pass the ID in the request body
  //       }
  //     );

  //     // Update the state to remove the deleted itinerary
  //     setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
  //     alert("Itinerary deleted successfully!");
  //   } catch (err) {
  //     setError(
  //       err.response?.data?.error ||
  //         "An error occurred while deleting the itinerary."
  //     );
  //   }
  // };

  const deleteItinerary = async (itineraryId) => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this itinerary?");
    
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/deleteItinerary`,
          {
            data: { id: itineraryId }, // Sending the ID in the body
          }
        );
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
        response = await axios.post(`http://localhost:3000/deactivateItinerary/${itineraryId}`);
      } else {
        response = await axios.post(`http://localhost:3000/activateItinerary/${itineraryId}`);
      }
        setMessage(response.data.message);
        setError("");
        window.location.reload();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to toggle itinerary status.');
      setMessage("");
    }
  };

  if (loading) return <p>Loading itineraries...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Itineraries</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}
      <ul>
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <p>Name: {itinerary.name || "N/A"}</p>
              <h4>
                Activities:{" "}
                {itinerary.activities
                  ?.map((activity) => activity.title)
                  .join(", ") || "No activities listed"}
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
              </p><div style={{ display: "flex", gap: "10px" }}>
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
                {itinerary.status ==="active" ? "Deactivate" : "Activate"}
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

export default ItineraryList;
