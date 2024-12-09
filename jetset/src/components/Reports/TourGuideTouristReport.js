// // // src/TourGuideReport.js
// // import React, { useState } from 'react';

// // const TourGuideReport = () => {
// //   const [username, setUsername] = useState('');
// //   const [report, setReport] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const fetchReport = async () => {
// //     setLoading(true);
// //     setError(null);
// //     setReport(null);

// //     try {
// //       const response = await fetch(`/tour-guide-tourist-report?username=${username}`);
// //       if (!response.ok) {
// //         throw new Error('Tour Guide not found or internal server error');
// //       }
// //       const data = await response.json();
// //       setReport(data);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     fetchReport();
// //   };

// //   return (
// //     <div>
// //       <h1>Tour Guide Tourist Report</h1>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="text"
// //           placeholder="Enter Tour Guide Username"
// //           value={username}
// //           onChange={(e) => setUsername(e.target.value)}
// //           required
// //         />
// //         <button type="submit">Get Report</button>
// //       </form>

// //       {loading && <p>Loading...</p>}
// //       {error && <p style={{ color: 'red' }}>{error}</p>}
// //       {report && (
// //         <div>
// //           <h2>Report for {username}</h2>
// //           <p>Total Tourists: {report.totalTourists}</p>
// //           <h3>Itinerary Details:</h3>
// //           <ul>
// //             {report.itineraryDetails.map((itinerary) => (
// //               <li key={itinerary.name}>
// //                 {itinerary.name}: {itinerary.totalTourists} tourists
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TourGuideReport;
// ////////////////////WORKING////////////////////
// // import React, { useState } from 'react';

// // const TourGuideReport = () => {
// //   const [id, setId] = useState(''); // Change to id
// //   const [report, setReport] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const fetchReport = async () => {
// //     setLoading(true);
// //     setError(null);
// //     setReport(null);

// //     try {
// //       const response = await fetch(`/tour-guide-tourist-report?id=${id}`); // Use id instead of username
// //       if (!response.ok) {
// //         throw new Error('Tour Guide not found or internal server error');
// //       }
// //       const data = await response.json();
// //       setReport(data);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     fetchReport();
// //   };

// //   return (
// //     <div>
// //       <h1>Tour Guide Tourist Report</h1>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="text"
// //           placeholder="Enter Tour Guide ID" // Update placeholder
// //           value={id}
// //           onChange={(e) => setId(e.target.value)}
// //           required
// //         />
// //         <button type="submit">Get Report</button>
// //       </form>

// //       {loading && <p>Loading...</p>}
// //       {error && <p style={{ color: 'red' }}>{error}</p>}
// //       {report && (
// //         <div>
// //           <h2>Report for Tour Guide ID: {id}</h2> {/* Update display */}
// //           <p>Total Tourists: {report.totalTourists}</p>
// //           <h3>Itinerary Details:</h3>
// //           <ul>
// //             {report.itineraryDetails.map((itinerary) => (
// //               <li key={itinerary.name}>
// //                 {itinerary.name}: {itinerary.totalTourists} tourists
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default TourGuideReport;

import React, { useState } from "react";
import axios from "axios";

const TourGuideReport = ({tourGuideID}) => {
  const [id, setId] = useState(""); // Tour Guide ID
  const [month, setMonth] = useState(""); // Month filter
  const [totalTourists, setTotalTourists] = useState(0);
  const [itineraryDetails, setItineraryDetails] = useState([]); // State for itinerary details
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  // Fetch the full tourist report
  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch(`/tour-guide-tourist-report?id=${tourGuideID}`); // Fetch tourist report by ID
      if (!response.ok) {
        throw new Error("Tour Guide not found or internal server error");
      }
      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  // Apply filters to fetch a filtered report
  const applyFilters = async () => {
    try {
      const response = await axios.get("/filter-tour-guide-tourist-report", {
        params: { id:tourGuideID, month },
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
      <form onSubmit={handleSubmit}>
        
        <button type="submit">Generate Report</button>
      </form>

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

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>}

      {report && (
        <div>
          <h2>Report for Tour Guide ID: {id}</h2>
          <p>Total Tourists: {report.totalTourists}</p>
          <h3>Itinerary Details:</h3>
          <ul>
            {report.itineraryDetails.map((itinerary) => (
              <li key={itinerary.name}>
                {itinerary.name}: {itinerary.totalTourists} tourists
                <ul>
                <ul>
                  <li>Budget: ${itinerary.budget.toFixed(2)}</li>
                  <li>Locations: {itinerary.locations.join(", ")}</li>
                  <li>Availability Dates: {itinerary.availability_dates.join(", ")}</li>
                  </ul>
                  {itinerary.tourists.map((tourist) => (
                    <li key={tourist.touristId}>
                      {tourist.touristName} (Email: {tourist.touristEmail}, Mobile: {tourist.touristMobile}, Booking Date: {new Date(tourist.bookingDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

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