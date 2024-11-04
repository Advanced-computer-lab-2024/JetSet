import React, { useState, useEffect } from "react";
import axios from "axios";

const HistoricalPlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [tag, setTag] = useState(""); // Only tracking tag for filtering

  // Fetch all historical places initially
  const fetchAllPlaces = async () => {
    try {
      const response = await axios.get("/viewAllPlaces");
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching historical places:", error);
    }
  };

  useEffect(() => {
    fetchAllPlaces();
  }, []); // Only fetch once on component mount

  // Fetch filtered historical places based on the tag
  useEffect(() => {
    const fetchFilteredPlaces = async () => {
      if (tag) {
        // Only fetch if tag is present
        try {
          const response = await axios.get("/filterHistoricalTags", {
            params: { tag },
          });
          console.log("Filtered places response:", response.data); // Log the response
          setPlaces(response.data);
        } catch (error) {
          console.error("Error fetching filtered historical places:", error);
        }
      } else {
        fetchAllPlaces(); // Fetch all places if no tag is provided
      }
    };

    fetchFilteredPlaces();
  }, [tag]); // Only fetch when the tag changes

  const handleChange = (e) => {
    setTag(e.target.value); // Update tag state directly
    console.log("Current tag:", e.target.value); // Log current tag
  };

  const handleClearFilter = () => {
    setTag(""); // Clear the tag filter
    fetchAllPlaces(); // Fetch all places again
  };

  return (
    <div>
      <h2>Historical Places</h2>
      <ul>
        {places.map((place) => (
          <li key={place._id}>
            <strong>Name:</strong> {place.Name}
            <br />
            <strong>Description:</strong> {place.Description}
            <br />
            <strong>Location:</strong>{" "}
            {place.location && place.location.address
              ? place.location.address
              : "N/A"}
            <br />
            <strong>Coordinates:</strong>{" "}
            {place.location && place.location.coordinates
              ? `${place.location.coordinates.lat}, ${place.location.coordinates.lng}`
              : "N/A"}
            <br />
            <strong>Opening Hours:</strong> {place.opening_hours}
            <br />
            <strong>Pictures:</strong>{" "}
            {place.Pictures.length > 0 ? place.Pictures.join(", ") : "None"}
            <br />
            <strong>Ticket Price (Family):</strong> ${place.TicketPricesF}
            <br />
            <strong>Ticket Price (Normal):</strong> ${place.TicketPricesN}
            <br />
            <strong>Ticket Price (Student):</strong> ${place.TicketPricesS}
            <br />
            <strong>Managed By:</strong>{" "}
            {place.managed_by ? place.managed_by : "N/A"}
            <br />
            <strong>Tags:</strong>{" "}
            {place.tags.length > 0 ? place.tags.join(", ") : "None"}
            <br /> {/* Tags Added */}
            <strong>Created At:</strong>{" "}
            {new Date(place.createdAt).toLocaleDateString()}
            <br />
            <strong>Updated At:</strong>{" "}
            {new Date(place.updatedAt).toLocaleDateString()}
            <br />
          </li>
        ))}
      </ul>

      <h3>Filter Historical Places by Tag</h3>
      <input
        type="text"
        name="tag"
        placeholder="Enter Tag"
        value={tag}
        onChange={handleChange}
      />
      <button onClick={handleClearFilter}>Clear Filter</button>
    </div>
  );
};

export default HistoricalPlacesList;