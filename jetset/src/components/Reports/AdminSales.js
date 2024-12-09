// // import React, { useState } from "react";
// // import axios from "axios";

// // const AdminSales = () => {
// //   const [adminId, setAdminId] = useState("");
// //   const [report, setReport] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   // Fetch the sales report
// //   const fetchReport = async () => {
// //     if (!adminId) {
// //       setError("Admin ID is required");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");
// //     setReport(null);

// //     try {
// //       // Pass the adminId as a query parameter in the GET request
// //       const response = await axios.get(`/admin-sales-report?id=${adminId}`);
// //       setReport(response.data);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Error fetching report");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="sales-report">
// //       <h1>Sales Report</h1>
// //       <div className="form-group">
// //         <label htmlFor="adminId">Admin ID:</label>
// //         <input
// //           type="text"
// //           id="adminId"
// //           value={adminId}
// //           onChange={(e) => setAdminId(e.target.value)}
// //           placeholder="Enter Admin ID"
// //         />
// //       </div>
// //       <button onClick={fetchReport} disabled={loading}>
// //         {loading ? "Loading..." : "Get Report"}
// //       </button>

// //       {error && <div className="error-message">{error}</div>}

// //       {report && (
// //         <div className="report">
// //           <h2>Total Revenue: {report.totalRevenue} EGP</h2>
// //           <h3>Breakdown:</h3>
// //           <ul>
// //             <li>Activity Revenue: {report.breakdown.activityRevenue} EGP</li>
// //             <li>Itinerary Revenue: {report.breakdown.itineraryRevenue} EGP</li>
// //             <li>Product Revenue: {report.breakdown.productRevenue} EGP</li>
// //           </ul>
// //           <h3>Details:</h3>
// //           <div>
// //             <h4>Activities:</h4>
// //             {report.individualReports.activities.map((activity) => (
// //               <div key={activity.id}>
// //                 <strong>{activity.title}</strong>: {activity.revenue} EGP
// //               </div>
// //             ))}
// //           </div>
// //           <div>
// //             <h4>Itineraries:</h4>
// //             {report.individualReports.itineraries.map((itinerary) => (
// //               <div key={itinerary.id}>
// //                 <strong>{itinerary.name}</strong>: {itinerary.revenue} EGP
// //               </div>
// //             ))}
// //           </div>
// //           <div>
// //             <h4>Products:</h4>
// //             {report.individualReports.products.map((product) => (
// //               <div key={product.id}>
// //                 <strong>{product.name}</strong>: {product.revenue} EGP
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminSales;

// // src/SalesReport.js
// import React, { useState } from 'react';

// const SalesReport = () => {
//   const [adminId, setAdminId] = useState('');
//   const [report, setReport] = useState(null);
//   const [error, setError] = useState(null);

//   const fetchSalesReport = async () => {
//     setError(null);
//     setReport(null);
    
//     try {
//       const response = await fetch(`/admin-sales-report?id=${adminId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch sales report');
//       }
//       const data = await response.json();
//       setReport(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Sales Report</h1>
//       <input
//         type="text"
//         value={adminId}
//         onChange={(e) => setAdminId(e.target.value)}
//         placeholder="Enter Admin ID"
//       />
//       <button onClick={fetchSalesReport}>Get Report</button>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {report && (
//         <div>
//           <h2>{report.message}</h2>
//           <p>Total Revenue: ${report.totalRevenue.toFixed(2)}</p>
//           <h3>Breakdown:</h3>
//           <ul>
//             <li>Activity Revenue: ${report.breakdown.activityRevenue.toFixed(2)}</li>
//             <li>Itinerary Revenue: ${report.breakdown.itineraryRevenue.toFixed(2)}</li>
//             <li>Product Revenue: ${report.breakdown.productRevenue.toFixed(2)}</li>
//           </ul>

//           <h3>Individual Reports:</h3>
//           <h4>Activities:</h4>
//           <ul>
//             {report.individualReports.activities.map(activity => (
//               <li key={activity.id}>
//                 {activity.title} - Budget: ${activity.budget.toFixed(2)}, Revenue: ${activity.revenue.toFixed(2)}
//               </li>
//             ))}
//           </ul>

//           <h4>Itineraries:</h4>
//           <ul>
//             {report.individualReports.itineraries.map(itinerary => (
//               <li key={itinerary.id}>
//                 {itinerary.name} - Budget: ${itinerary.budget.toFixed(2)}, Revenue: ${itinerary.revenue.toFixed(2)}
//               </li>
//             ))}
//           </ul>

//           <h4>Products:</h4>
//           <ul>
//             {report.individualReports.products.map(product => (
//               <li key={product.id}>
//                 {product.name} - Price: ${product.price.toFixed(2)}, Sales: {product.sales}, Revenue: ${product.revenue.toFixed(2)}
//                 <ul>
//                   {product.purchaseRecords.map(record => (
//                     <li key={record.touristEmail}>
//                       {record.touristUsername} - Quantity: {record.quantity}, Date: {new Date(record.purchaseDate).toLocaleDateString()}
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

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const SalesReport = () => {
//   const [id, setId] = useState(""); // Admin ID
//   const [product, setProduct] = useState(""); // Filter by product name
//   const [date, setDate] = useState(""); // Filter by specific date
//   const [month, setMonth] = useState(""); // Filter by month
//   const [activities, setActivities] = useState([]); // List of activities
//   const [itineraries, setItineraries] = useState([]); // List of itineraries
//   const [products, setProducts] = useState([]); // List of products
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch activities, itineraries, and products when admin ID is provided
//   const fetchInitialData = async () => {
//     if (!id) return;
//     setLoading(true);
//     setError(""); // Clear previous error
//     try {
//       const response = await axios.get(`/admin-sales-report`, { params: { id } });
//       setActivities(response.data.individualReports.activities);
//       setItineraries(response.data.individualReports.itineraries);
//       setProducts(response.data.individualReports.products);
//       setReport(response.data); // Set the entire report data
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch the initial data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch filtered sales report based on filters
//   const fetchFilteredReport = async () => {
//     setLoading(true);
//     setError(""); // Clear previous error
//     try {
//       const response = await axios.get(`/filter-admin-report`, {
//         params: { id, product, date, month },
//       });
//       setReport(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch the filtered report.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, [id]); // Trigger fetch when admin ID changes

//   return (
//     <div>
//       <h1>Admin Sales Report</h1>

//       {/* Admin ID Input */}
//       <div>
//         <label htmlFor="id">Admin ID:</label>
//         <input
//           type="text"
//           id="id"
//           value={id}
//           onChange={(e) => setId(e.target.value)}
//         />
//         <button onClick={fetchInitialData} disabled={loading}>
//           {loading ? "Loading..." : "Fetch Initial Data"}
//         </button>
//       </div>

//       {/* Filters Section */}
//       <div>
//         <h2>Filters</h2>
//         <div>
//           <label htmlFor="product">Product Name:</label>
//           <input
//             type="text"
//             id="product"
//             value={product}
//             onChange={(e) => setProduct(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="date">Date (YYYY-MM-DD):</label>
//           <input
//             type="date"
//             id="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="month">Month (1-12):</label>
//           <input
//             type="number"
//             id="month"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             min="1"
//             max="12"
//           />
//         </div>
//         <button onClick={fetchFilteredReport} disabled={loading}>
//           {loading ? "Loading..." : "Apply Filters"}
//         </button>
//       </div>

//       {/* Error Handling */}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Report Data */}
//       {report && (
//         <div>
//           <h2>Total Revenue: ${report.totalRevenue ? report.totalRevenue.toFixed(2) : 0}</h2>
//           <h3>Revenue Breakdown:</h3>
//           <p>Activity Revenue: ${report.breakdown?.activityRevenue ? report.breakdown .activityRevenue.toFixed(2) : 0}</p>
//           <p>Itinerary Revenue: ${report.breakdown?.itineraryRevenue ? report.breakdown.itineraryRevenue.toFixed(2) : 0}</p>
//           <p>Product Revenue: ${report.breakdown?.productRevenue ? report.breakdown.productRevenue.toFixed(2) : 0}</p>

//           <h3>Products:</h3>
//           <ul>
//             {report.individualReports?.products?.map((product, index) => (
//               <li key={index}>
//                 <h4>{product.name}</h4>
//                 <p>Price: ${product.price.toFixed(2)}</p>
//                 <p>Sales: {product.sales}</p>
//                 <p>Revenue: ${product.revenue.toFixed(2)}</p>
//                 <h5>Purchase Records:</h5>
//                 <ul>
//                   {product.purchaseRecords?.map((record, recordIndex) => (
//                     <li key={recordIndex}>
//                       Quantity: {record.quantity} | Purchase Date:{" "}
//                       {new Date(record.purchaseDate).toLocaleDateString()}
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>

//           {/* Activities */}
//           {activities.length > 0 && (
//             <div>
//               <h3>Activities:</h3>
//               <ul>
//                 {activities.map((activity, index) => (
//                   <li key={index}>
//                     <h4>{activity.title}</h4>
//                     <p>Budget: ${activity.budget.toFixed(2)}</p>
//                     <p>Revenue: ${activity.revenue.toFixed(2)}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Itineraries */}
//           {itineraries.length > 0 && (
//             <div>
//               <h3>Itineraries:</h3>
//               <ul>
//                 {itineraries.map((itinerary, index) => (
//                   <li key={index}>
//                     <h4>{itinerary.name}</h4>
//                     <p>Budget: ${itinerary.budget.toFixed(2)}</p>
//                     <p>Revenue: ${itinerary.revenue.toFixed(2)}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesReport;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const SalesReport = ({adminId}) => {
//   const [id, setId] = useState(""); // Admin ID
//   const [product, setProduct] = useState(""); // Filter by product name
//   const [date, setDate] = useState(""); // Filter by specific date
//   const [month, setMonth] = useState(""); // Filter by month
//   const [activities, setActivities] = useState([]); // List of activities
//   const [itineraries, setItineraries] = useState([]); // List of itineraries
//   const [products, setProducts] = useState([]); // List of products
//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch activities, itineraries, and products when admin ID is provided
//   const fetchInitialData = async () => {
//     if (!id) return;
//     setLoading(true);
//     setError(""); // Clear previous error
//     try {
//       const response = await axios.get("/admin-sales-report", { params: { id } });
//       setActivities(response.data.individualReports.activities);
//       setItineraries(response.data.individualReports.itineraries);
//       setProducts(response.data.individualReports.products);
//       setReport(response.data); // Set the entire report data
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch the initial data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch filtered sales report based on filters
//   const fetchFilteredReport = async () => {
//     setLoading(true);
//     setError(""); // Clear previous error
//     try {
//       const response = await axios.get("/filter-admin-report", {
//         params: { id, product, date, month },
//       });
//       setReport(response.data);
//       setProducts(response.data.products); // Update products with filtered products
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch the filtered report.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInitialData();
//   }, [id]); // Trigger fetch when admin ID changes

//   return (
//     <div>
//       <h1>Admin Sales Report</h1>

//       {/* Admin ID Input */}
//       <div>
//         <label htmlFor="id">Admin ID:</label>
//         <input
//           type="text"
//           id="id"
//           value={id}
//           onChange={(e) => setId(e.target.value)}
//         />
//         <button onClick={fetchInitialData} disabled={loading}>
//           {loading ? "Loading..." : "Fetch Initial Data"}
//         </button>
//       </div>

//       {/* Filters Section */}
//       <div>
//         <h2>Filters</h2>
//         <div>
//           <label htmlFor="product">Product Name:</label>
//           <input
//             type="text"
//             id="product"
//             value={product}
//             onChange={(e) => setProduct(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="date">Date (YYYY-MM-DD):</label>
//           <input
//             type="date"
//             id="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="month">Month (1-12):</label>
//           <input
//             type="number"
//             id="month"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             min="1"
//             max="12"
//           />
//         </div>
//         <button onClick={fetchFilteredReport} disabled={loading}>
//           {loading ? "Loading..." : "Apply Filters"}
//         </button>
//       </div>

//       {/* Error Handling */}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Report Data */}
//       {report && (
//         <div>
//           <h2>Total Revenue: ${ report.totalRevenue ? report.totalRevenue.toFixed(2) : 0}</h2>
//           <h3>Revenue Breakdown:</h3>
//           <p>Activity Revenue: ${report.breakdown?.activityRevenue ? report.breakdown.activityRevenue.toFixed(2) : 0}</p>
//           <p>Itinerary Revenue: ${report.breakdown?.itineraryRevenue ? report.breakdown.itineraryRevenue.toFixed(2) : 0}</p>
//           <p>Product Revenue: ${report.breakdown?.productRevenue ? report.breakdown.productRevenue.toFixed(2) : 0}</p>

//           <h3>Products:</h3>
//           <ul>
//             {products.map((product, index) => (
//               <li key={index}>
//                 <h4>{product.name}</h4>
//                 <p>Price: ${product.price.toFixed(2)}</p>
//                 <p>Sales: {product.sales}</p>
//                 <p>Revenue: ${product.revenue.toFixed(2)}</p>
//                 <h5>Purchase Records:</h5>
//                 <ul>
//                   {product.purchaseRecords?.map((record, recordIndex) => (
//                     <li key={recordIndex}>
//                       Quantity: {record.quantity} | Purchase Date:{" "}
//                       {new Date(record.purchaseDate).toLocaleDateString()}
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>

//           {/* Activities */}
//           {activities.length > 0 && (
//             <div>
//               <h3>Activities:</h3>
//               <ul>
//                 {activities.map((activity, index) => (
//                   <li key={index}>
//                     <h4>{activity.title}</h4>
//                     <p>Budget: ${activity.budget.toFixed(2)}</p>
//                     <p>Revenue: ${activity.revenue.toFixed(2)}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Itineraries */}
//           {itineraries.length > 0 && (
//             <div>
//               <h3>Itineraries:</h3>
//               <ul>
//                 {itineraries.map((itinerary, index) => (
//                   <li key={index}>
//                     <h4>{itinerary.name}</h4>
//                     <p>Budget: ${itinerary.budget.toFixed(2)}</p>
//                     <p>Revenue: ${itinerary.revenue.toFixed(2)}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalesReport;
import React, { useState, useEffect } from "react";
import axios from "axios";

const SalesReport = ({ adminId }) => {
  const [product, setProduct] = useState(""); // Filter by product name
  const [date, setDate] = useState(""); // Filter by specific date
  const [month, setMonth] = useState(""); // Filter by month
  const [activities, setActivities] = useState([]); // List of activities
  const [itineraries, setItineraries] = useState([]); // List of itineraries
  const [products, setProducts] = useState([]); // List of products
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch activities, itineraries, and products when admin ID is provided
  const fetchInitialData = async () => {
    if (!adminId) return; // Ensure adminId is available
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const response = await axios.get("/admin-sales-report", { params: { id: adminId } });
      setActivities(response.data.individualReports.activities);
      setItineraries(response.data.individualReports.itineraries);
      setProducts(response.data.individualReports.products);
      setReport(response.data); // Set the entire report data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch the initial data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch filtered sales report based on filters
  const fetchFilteredReport = async () => {
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const params = { id: adminId }; // Always include adminId
      if (product) params.product = product; // Only add if product is not empty
      if (date) params.date = date; // Only add if date is not empty
      if (month) params.month = month; // Only add if month is not empty

      const response = await axios.get("/filter-admin-report", { params });
      setReport(response.data);
      setProducts(response.data.products); // Update products with filtered products
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch the filtered report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [adminId]); // Trigger fetch when admin ID changes

  return (
    <div>
      <h1>Admin Sales Report</h1>

      {/* Filters Section */}
      <div>
        <h2>Filters</h2>
        <div>
          <label htmlFor="product">Product Name:</label>
          <input
            type="text"
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date">Date (YYYY-MM-DD):</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
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
        </div>
        <button onClick={fetchFilteredReport} disabled={loading}>
          {loading ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      {/* Error Handling */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Report Data */}
      {report && (
        <div>
          <h2>Total Revenue: ${ report.totalRevenue ? report.totalRevenue.toFixed(2) : 0}</h2>
          <h3>Revenue Breakdown:</h3>
          <p>Activity Revenue: ${report.breakdown?.activityRevenue ? report.breakdown.activityRevenue.toFixed(2) : 0}</p>
          <p>Itinerary Revenue: ${report.breakdown?.itineraryRevenue ? report.breakdown.itineraryRevenue.toFixed(2) : 0}</p>
          <p>Product Revenue: ${report.breakdown?.productRevenue ? report.breakdown.productRevenue.toFixed(2) : 0}</p>

          <h3>Products:</h3>
          <ul>
            {products.map((product, index) => (
              <li key={index}>
                <h4>{product.name}</h4>
                <p>Price: ${product.price.toFixed(2)}</p>
                <p>Sales: {product.sales}</p>
                <p>Revenue: ${product.revenue.toFixed(2)}</p>
                <h5>Purchase Records:</h5>
                <ul>
                  {product.purchaseRecords?.map((record, recordIndex) => (
                    <li key={recordIndex}>
                      Quantity: {record.quantity} | Purchase Date:{" "}
                      {new Date(record.purchaseDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Activities */}
          {activities.length > 0 && (
            <div>
              <h3>Activities:</h3>
              <ul>
                {activities.map((activity, index) => (
                  <li key={index}>
                    <h4>{activity.title}</h4>
                    <p>Budget: ${activity.budget.toFixed(2)}</p>
                    <p>Revenue: ${activity.revenue.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itineraries */}
          {itineraries.length > 0 && (
            <div>
              <h3>Itineraries:</h3>
              <ul>
                {itineraries.map((itinerary, index) => (
                  <li key={index}>
                    <h4>{itinerary.name}</h4>
                    <p>Budget: ${itinerary.budget.toFixed(2)}</p>
                    <p>Revenue: ${itinerary.revenue.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesReport;