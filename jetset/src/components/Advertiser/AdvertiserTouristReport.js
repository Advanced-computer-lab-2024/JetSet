// // import React, { useState } from "react";
// // import axios from "axios";

// // const AdvertiserTouristReport = () => {
// //   const [username, setUsername] = useState("");
// //   const [report, setReport] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const fetchReport = async () => {
// //     setLoading(true);
// //     setError(""); // Clear previous error
// //     try {
// //       const response = await axios.get(`/advertiser-tourist-report`, {
// //         params: { username },
// //       });
// //       setReport(response.data);
// //     } catch (err) {
// //       setError(err.response?.data?.error || "Failed to fetch the report.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Advertiser Tourist Report</h1>
// //       <div>
// //         <label htmlFor="username">Advertiser Username:</label>
// //         <input
// //           type="text"
// //           id="username"
// //           value={username}
// //           onChange={(e) => setUsername(e.target.value)}
// //         />
// //         <button onClick={fetchReport} disabled={loading}>
// //           {loading ? "Loading..." : "Get Report"}
// //         </button>
// //       </div>
// //       {error && <p style={{ color: "red" }}>{error}</p>}
// //       {report && (
// //         <div>
// //           <h2>Total Tourists: {report.totalTourists}</h2>
// //           <h3>Activities:</h3>
// //           <ul>
// //             {report.activityDetails.map((activity, index) => (
// //               <li key={index}>
// //                 {activity.title}: {activity.totalTourists} tourists
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdvertiserTouristReport;

// ////////////////////////WORKING/////////////////////////
// import React, { useState } from "react";
// import axios from "axios";

// const AdvertiserTouristReport = () => {
//   const [id, setId] = useState(""); // Advertiser ID
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchReport = async () => {
//     setLoading(true);
//     setError(""); // Clear previous error
//     try {
//       const response = await axios.get(`/advertiser-tourist-report`, {
//         params: { id }, // Use id instead of username
//       });
//       setReport(response.data);
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to fetch the report.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Advertiser Tourist Report</h1>
//       <div>
//         <label htmlFor="id">Advertiser ID:</label>
//         <input
//           type="text"
//           id="id"
//           value={id}
//           onChange={(e) => setId(e.target.value)}
//         />
//         <button onClick={fetchReport} disabled={loading}>
//           {loading ? "Loading..." : "Get Report"}
//         </button>
//       </div>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {report && (
//         <div >
//           <h2>Total Tourists: {report.totalTourists}</h2>
//           <h3>Activities:</h3>
//           <ul>
//             {report.activityDetails.map((activity, index) => (
//               <li key={index}>
//                 <h4>{activity.name}</h4>
//                 <p>Total Tourists: {activity.totalTourists}</p>
//                 <p>Budget: ${activity.budget}</p>
//                 <p>Location: {activity.location}</p>
//                 <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
//                 <h5>Tourists:</h5>
//                 <ul>
//                   {activity.tourists.map((tourist, touristIndex) => (
//                     <li key={touristIndex}>
//                       Tourist: {tourist.touristName}, Email: {tourist.touristEmail}, Mobile: {tourist.touristMobile}, Booking Date: {new Date(tourist.bookingDate).toLocaleDateString()}
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

// export default AdvertiserTouristReport;

import React, { useState } from "react";
import axios from "axios";

const AdvertiserTouristReport = ({advertiserId}) => {
  //const [id, setId] = useState(""); // Advertiser ID
  const [month, setMonth] = useState(""); // Month filter
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the full report
  const fetchReport = async () => {
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const response = await axios.get("/advertiser-tourist-report", {
        params: { id: advertiserId },
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch the report.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to fetch filtered report
  const applyFilters = async () => {
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const response = await axios.get("/filter-advertiser-tourist-report", {
        params: { id: advertiserId, month },
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Advertiser Tourist Report</h1>
      <div>
        <button onClick={fetchReport} disabled={loading}>
          {loading ? "Loading..." : "Get Report"}
        </button>
      </div>

      <h2>Apply Filters</h2>
      <div>
        <label htmlFor="month">Month (1-12):</label>
        <input
          type="number"
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
        />
        <button onClick={applyFilters} disabled={loading}>
          {loading ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {report && (
        <div>
          <h2>Total Tourists: {report.totalTourists}</h2>
          <h3>Activities:</h3>
          <ul>
            {report.activityDetails.map((activity, index) => (
              <li key={index}>
                <h4>{activity.name}</h4>
                <p>Total Tourists: {activity.totalTourists}</p>
                <p>Budget: ${activity.budget}</p>
                <p>Location: {activity.location}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                <h5>Tourists:</h5>
                <ul>
                  {activity.tourists.map((tourist, touristIndex) => (
                    <li key={touristIndex}>
                      Tourist: {tourist.touristName}, Email: {tourist.touristEmail}, Mobile: {tourist.touristMobile}, Booking Date: {new Date(tourist.bookingDate).toLocaleDateString()}
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

export default AdvertiserTouristReport;
