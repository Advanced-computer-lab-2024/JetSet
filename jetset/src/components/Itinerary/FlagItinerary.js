import React, { useState, useEffect } from "react";
import axios from "axios";

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);

  // Fetch itineraries when the component loads
  useEffect(() => {
    fetchItineraries();
  }, []);

  const fetchItineraries = async () => {
    try {
      const response = await axios.get("http://localhost:3000/itineraries");
      setItineraries(response.data);
    } catch (error) {
      console.error("Error fetching itineraries:", error);
    }
  };

  // Function to flag or unflag an itinerary
  const toggleFlag = async (id, currentFlag) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/flagItinerary/${id}`,
        { flag: !currentFlag }
      );
      const updatedItinerary = response.data.itinerary;

      // Update the state to reflect the change immediately
      setItineraries(
        itineraries.map((itinerary) =>
          itinerary._id === id ? updatedItinerary : itinerary
        )
      );
    } catch (error) {
      console.error("Error flagging itinerary:", error);
    }
  };

  return (
    <div>
      <h2>Itineraries</h2>
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <p>{itinerary.name}</p>
            <p>Status: {itinerary.flag ? "Flagged" : "Unflagged"}</p>
            <button onClick={() => toggleFlag(itinerary._id, itinerary.flag)}>
              {itinerary.flag ? "Unflag" : "Flag"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Itineraries;
