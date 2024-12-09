import React, { useState } from "react";
import axios from "axios";

const TourGuideReport = () => {
  const [id, setId] = useState(""); // Tour Guide ID
  const [month, setMonth] = useState(""); // Month filter
  const [totalTourists, setTotalTourists] = useState(0);
  const [itineraryDetails, setItineraryDetails] = useState([]); // State for itinerary details
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  // Fetch the full tourist report
  const fetchTouristReport = async () => {
    try {
      const response = await axios.get("/tour-guide-tourist-report", {
        params: { id },
      });
      setTotalTourists(response.data.totalTourists);
      setItineraryDetails(response.data.filteredItineraryDetails);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while fetching the report.");
      }
      setTotalTourists(0);
      setItineraryDetails([]);
    }
  };

  // Apply filters to fetch a filtered report
  const applyFilters = async () => {
    try {
      const response = await axios.get("/filter-tour-guide-tourist-report", {
        params: { id, month },
      });
      setTotalTourists(response.data.totalTourists);
      setItineraryDetails(response.data.filteredItineraryDetails);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while applying filters.");
      }
      setTotalTourists(0);
      setItineraryDetails([]);
    }
  };

  return (
    <div>
      <h1>Tour Guide Tourist Report</h1>
      <label>
        ID:
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <button onClick={fetchTouristReport}>Generate Report</button>

      <h2>Apply Filters:</h2>
      <label>
        Month:
        <input
          type="number"
          placeholder="Month (1-12)"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </label>
      <button onClick={applyFilters}>Apply Filters</button>

      {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>}

      <h2>Total Tourists: {totalTourists}</h2>
      {itineraryDetails.length > 0 && (
        <div>
          <h3>Itinerary Details:</h3>
          <ul>
            {itineraryDetails.map((itinerary) => (
              <li key={itinerary.name}>
                <strong>{itinerary.name}</strong>: {itinerary.totalTourists} tourists
                <ul>
                  <li>Budget: ${itinerary.budget.toFixed(2)}</li>
                  <li>Locations: {itinerary.locations.join(", ")}</li>
                  <li>Availability Dates: {itinerary.availability_dates.join(", ")}</li>
                  <li>
                    <h4>Tourist Details:</h4>
                    <ul>
                      {itinerary.tourists.map((tourist) => (
                        <li key={tourist.touristId}>
                          Name: {tourist.touristName}, Email: {tourist.touristEmail}, 
                          Mobile: {tourist.touristMobile}, 
                          Booking Date: {new Date(tourist.bookingDate).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TourGuideReport;
