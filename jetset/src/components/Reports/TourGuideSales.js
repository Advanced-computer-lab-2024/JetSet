import React, { useState } from "react";
import axios from "axios";

const TourGuideSalesReport = () => {
  const [id, setId] = useState(""); // Tour Guide ID
  const [itinerary, setItinerary] = useState(""); // Itinerary filter
  const [date, setDate] = useState(""); // Date filter
  const [month, setMonth] = useState(""); // Month filter
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [itineraryDetails, setItineraryDetails] = useState([]); // State for itinerary details
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get("/tour-guide-sales-report", {
        params: { id },
      });
      setTotalRevenue(response.data.totalRevenue);
      setItineraryDetails(response.data.itineraryDetails);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while fetching the report.");
      }
      setTotalRevenue(0);
      setItineraryDetails([]);
    }
  };

  const applyFilters = async () => {
    try {
      const response = await axios.get("/filter-tour-guide-sales-report", {
        params: { id, itinerary, date, month },
      });
      setTotalRevenue(response.data.totalRevenue);
      setItineraryDetails(response.data.itineraryDetails);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while applying filters.");
      }
      setTotalRevenue(0);
      setItineraryDetails([]);
    }
  };

  return (
    <div>
      <h1>Tour Guide Sales Report</h1>
      <label>
        ID:
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <button onClick={fetchSalesReport}>Generate Report</button>

      <h2>Apply Filters:</h2>
      <label>
        Itinerary Name:
        <input
          type="text"
          value={itinerary}
          onChange={(e) => setItinerary(e.target.value)}
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
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

      <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
      {itineraryDetails.length > 0 && (
        <div>
          <h3>Itinerary Details:</h3>
          <ul>
            {itineraryDetails.map((itinerary) => (
              <li key={itinerary.name}>
                {itinerary.name}: ${itinerary.budget} budget
                <ul>
                  {itinerary.bookings.map((booking) => (
                    <li key={booking.touristId}>
                      {booking.touristName} (Booking Date:{" "}
                      {new Date(booking.bookingDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TourGuideSalesReport;
