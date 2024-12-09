// // import React, { useState } from "react";
// // import axios from "axios";

// // const AdvertiserSalesReport = () => {
// //   const [username, setUsername] = useState("");
// //   const [totalRevenue, setTotalRevenue] = useState(0);
// //   const [errorMessage, setErrorMessage] = useState(""); // State for error messages

// //   const fetchSalesReport = async () => {
// //     try {
// //       const response = await axios.get("/advertiser-sales-report", {
// //         params: { username },
// //       });
// //       setTotalRevenue(response.data.totalRevenue);
// //       setErrorMessage(""); // Clear error message on successful fetch
// //     } catch (error) {
// //       // Check if the error response has a message
// //       if (error.response && error.response.status === 404) {
// //         setErrorMessage(error.response.data.error); // Set the error message from the response
// //       } else {
// //         setErrorMessage("An error occurred while fetching the report."); // Generic error message
// //       }
// //       setTotalRevenue(0); // Reset total revenue on error
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Advertiser Sales Report</h1>
// //       <label>
// //         Username:
// //         <input
// //           type="text"
// //           value={username}
// //           onChange={(e) => setUsername(e.target.value)}
// //         />
// //       </label>
// //       <button onClick={fetchSalesReport}>Generate Report</button>
// //       {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>} {/* Display error message */}
// //       <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
// //     </div>
// //   );
// // };

// // export default AdvertiserSalesReport;
// ///////////////////WORKING/////////////////////////
// // import React, { useState } from "react";
// // import axios from "axios";

// // const AdvertiserSalesReport = () => {
// //   const [id, setId] = useState(""); // Change to id
// //   const [totalRevenue, setTotalRevenue] = useState(0);
// //   const [errorMessage, setErrorMessage] = useState(""); // State for error messages

// //   const fetchSalesReport = async () => {
// //     try {
// //       const response = await axios.get("/advertiser-sales-report", {
// //         params: { id }, // Use id instead of username
// //       });
// //       setTotalRevenue(response.data.totalRevenue);
// //       setErrorMessage(""); // Clear error message on successful fetch
// //     } catch (error) {
// //       // Check if the error response has a message
// //       if (error.response && error.response.status === 404) {
// //         setErrorMessage(error.response.data.error); // Set the error message from the response
// //       } else {
// //         setErrorMessage("An error occurred while fetching the report."); // Generic error message
// //       }
// //       setTotalRevenue(0); // Reset total revenue on error
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Advertiser Sales Report</h1>
// //       <label>
// //         ID: {/* Update label */}
// //         <input
// //           type="text"
// //           value={id}
// //           onChange={(e) => setId(e.target.value)}
// //         />
// //       </label>
// //       <button onClick={fetchSalesReport}>Generate Report</button>
// //       {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>} {/* Display error message */}
// //       <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
// //     </div>
// //   );
// // };

// // export default AdvertiserSalesReport;

// import React, { useState } from "react";
// import axios from "axios";

// const AdvertiserSalesReport = () => {
//   const [id, setId] = useState(""); // Advertiser ID
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [activityDetails, setActivityDetails] = useState([]); // State for activity details
//   const [errorMessage, setErrorMessage] = useState(""); // State for error messages

//   const fetchSalesReport = async () => {
//     try {
//       const response = await axios.get("/advertiser-sales-report", {
//         params: { id }, // Use id instead of username
//       });
//       setTotalRevenue(response.data.totalRevenue);
//       setActivityDetails(response.data.activityDetails); // Set activity details
//       setErrorMessage(""); // Clear error message on successful fetch
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setErrorMessage(error.response.data.error); // Set the error message from the response
//       } else {
//         setErrorMessage("An error occurred while fetching the report."); // Generic error message
//       }
//       setTotalRevenue(0); // Reset total revenue on error
//       setActivityDetails([]); // Reset activity details on error
//     }
//   };

//   return (
//     <div>
//       <h1>Advertiser Sales Report</h1>
//       <label>
//         Advertiser ID:
//         <input
//           type="text"
//           value={id}
//           onChange={(e) => setId(e.target.value)}
//         />
//       </label>
//       <button onClick={fetchSalesReport}>Generate Report</button>
//       {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>} {/* Display error message */}
//       <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
//       {activityDetails.length > 0 && (
//         <div>
//           <h3>Activity Details:</h3>
//           <ul>
//             {activityDetails.map((activity, index) => (
//               <li key={index}>
//                 <h4>{activity.name}</h4>
//                 <p>Budget: ${activity.budget}</p>
//                 <p>Location: {activity.location}</p>
//                 <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
//                 <h5>Bookings:</h5>
//                 <ul>
//                   {activity.bookings.map((booking, bookingIndex) => (
//                     <li key={bookingIndex}>
//                       Tourist: {booking.touristName}, Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState } from "react";
import axios from "axios";

const AdvertiserSalesReport = ({ advertiserId }) => {
  //const [id, setId] = useState(""); // Advertiser ID
  const [month, setMonth] = useState(""); // Month filter
  const [date, setDate] = useState(""); // Date filter
  const [activity, setActivity] = useState(""); // Activity title filter
  const [report, setReport] = useState(null); // Full report state
  const [filteredReport, setFilteredReport] = useState(null); // Filtered report state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the full sales report
  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    setFilteredReport(null);

    try {
      const response = await axios.get(`/advertiser-sales-report`, {
        params: { id: advertiserId },
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to the report
  const applyFilters = async () => {
    setLoading(true);
    setError(null);
    setFilteredReport(null);

    try {
      const response = await axios.get(`/filter-advertiser-sales-report`, {
        params: { id: advertiserId , month, date, activity },
      });
      setFilteredReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while applying filters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Advertiser Sales Report</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchReport();
        }}
      >
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
      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>
      <label>
        Activity Title:
        <input
          type="text"
          placeholder="Search by activity title"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />
      </label>
      <button onClick={applyFilters}>Apply Filters</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {report && !filteredReport && (
        <div>
          <h2>Total Revenue: ${report.totalRevenue.toFixed(2)}</h2>
          <h3>Activity Details:</h3>
          <ul>
            {report.activityDetails.map((activity) => (
              <li key={activity.name}>
                <strong>{activity.name}</strong>: ${activity.budget.toFixed(2)}
                <ul>
                  <li>Location: {activity.location}</li>
                  <li>Date: {new Date(activity.date).toLocaleDateString()}</li>
                  <li>
                    Bookings:
                    <ul>
                      {activity.bookings.map((booking, index) => (
                        <li key={index}>
                          Tourist ID: {booking.touristId}, Name: {booking.touristName},
                          Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}
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

      {filteredReport && (
        <div>
          <h2>Filtered Report</h2>
          <h3>Total Revenue: ${filteredReport.totalRevenue.toFixed(2)}</h3>
          <ul>
            {filteredReport.activityDetails.map((activity) => (
              <li key={activity.name}>
                <strong>{activity.name}</strong>: ${activity.revenue.toFixed(2)}
                <ul>
                  <li>Location: {activity.location}</li>
                  <li>Date: {new Date(activity.date).toLocaleDateString()}</li>
                  <li>Total Tourists: {activity.totalTourists}</li>
                  <li>
                    Tourists:
                    <ul>
                      {activity.tourists.map((tourist) => (
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

export default AdvertiserSalesReport;


