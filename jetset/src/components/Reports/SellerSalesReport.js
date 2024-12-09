// // // // import React, { useState } from "react";
// // // // import axios from "axios";

// // // // const SellerSalesReport = () => {
// // // //   const [username, setUsername] = useState("");
// // // //   const [totalRevenue, setTotalRevenue] = useState(0);
// // // //   const [errorMessage, setErrorMessage] = useState(""); // State for error messages

// // // //   const fetchSalesReport = async () => {
// // // //     try {
// // // //       const response = await axios.get("/seller-sales-report", {
// // // //         params: { username },
// // // //       });
// // // //       setTotalRevenue(response.data.totalRevenue);
// // // //       setErrorMessage(""); // Clear error message on successful fetch
// // // //     } catch (error) {
// // // //       // Check if the error response has a message
// // // //       if (error.response && error.response.data && error.response.data.error) {
// // // //         setErrorMessage(error.response.data.error); // Set the error message from the response
// // // //       } else {
// // // //         setErrorMessage("An error occurred while fetching the report."); // Generic error message
// // // //       }
// // // //       setTotalRevenue(0); // Reset total revenue on error
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h1>Seller Sales Report</h1>
// // // //       <label>
// // // //         Username:
// // // //         <input
// // // //           type="text"
// // // //           value={username}
// // // //           onChange={(e) => setUsername(e.target.value)}
// // // //         />
// // // //       </label>
// // // //       <button onClick={fetchSalesReport}>Generate Report</button>
// // // //       {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>} {/* Display error message */}
// // // //       <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SellerSalesReport;
// // // //////////WORKING////////////
// // // // import React, { useState } from "react";
// // // // import axios from "axios";

// // // // const SellerSalesReport = () => {
// // // //   const [id, setId] = useState(""); // Change to id
// // // //   const [totalRevenue, setTotalRevenue] = useState(0);
// // // //   const [errorMessage, setErrorMessage] = useState(""); // State for error messages

// // // //   const fetchSalesReport = async () => {
// // // //     try {
// // // //       const response = await axios.get("/seller-sales-report", {
// // // //         params: { id }, // Use id instead of username
// // // //       });
// // // //       setTotalRevenue(response.data.totalRevenue);
// // // //       setErrorMessage(""); // Clear error message on successful fetch
// // // //     } catch (error) {
// // // //       // Check if the error response has a message
// // // //       if (error.response && error.response.data && error.response.data.error) {
// // // //         setErrorMessage(error.response.data.error); // Set the error message from the response
// // // //       } else {
// // // //         setErrorMessage("An error occurred while fetching the report."); // Generic error message
// // // //       }
// // // //       setTotalRevenue(0); // Reset total revenue on error
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div>
// // // //       <h1>Seller Sales Report</h1>
// // // //       <label>
// // // //         ID: {/* Update label */}
// // // //         <input
// // // //           type="text"
// // // //           value={id}
// // // //           onChange={(e) => setId(e.target.value)}
// // // //         />
// // // //       </label>
// // // //       <button onClick={fetchSalesReport}>Generate Report</button>
// // // //       {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>} {/* Display error message */}
// // // //       <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SellerSalesReport;

// // // import React, { useState } from "react";
// // // import axios from "axios";

// // // const SellerSalesReport = () => {
// // //   const [id, setId] = useState(""); // Seller ID
// // //   const [sellerDetails, setSellerDetails] = useState(null); // State for seller details
// // //   const [totalRevenue, setTotalRevenue] = useState(0); // State for total revenue
// // //   const [products, setProducts] = useState([]); // State for product details
// // //   const [errorMessage, setErrorMessage] = useState(""); // State for error messages
// // //   const [loading, setLoading] = useState(false); // Loading state

// // //   const fetchSalesReport = async () => {
// // //     setLoading(true);
// // //     setErrorMessage(""); // Clear previous error message
// // //     try {
// // //       const response = await axios.get("/seller-sales-report", {
// // //         params: { id }, // Use seller ID
// // //       });
// // //       setSellerDetails(response.data.sellerDetails); // Set seller details
// // //       setTotalRevenue(response.data.totalRevenue); // Set total revenue
// // //       setProducts(response.data.products); // Set product details
// // //     } catch (error) {
// // //       if (error.response && error.response.status === 404) {
// // //         setErrorMessage(error.response.data.message); // Set the error message from the response
// // //       } else {
// // //         setErrorMessage("An error occurred while fetching the report."); // Generic error message
// // //       }
// // //       setSellerDetails(null); // Reset seller details on error
// // //       setTotalRevenue(0); // Reset total revenue on error
// // //       setProducts([]); // Reset product details on error
// // //     } finally {
// // //       setLoading(false); // Stop loading
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <h1>Seller Sales Report</h1>
// // //       <label>
// // //         Seller ID:
// // //         <input
// // //           type="text"
// // //           value={id}
// // //           onChange={(e) => setId(e.target.value)}
// // //         />
// // //       </label>
// // //       <button onClick={fetchSalesReport} disabled={loading}>
// // //         {loading ? "Loading..." : "Generate Report"}
// // //       </button>
// // //       {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>} {/* Display error message */}
// // //       {sellerDetails && (
// // //         <div>
// // //           <h2>Seller Details:</h2>
// // //           <p>Name: {sellerDetails.name}</p>
// // //           <p>Description: {sellerDetails.description}</p>
// // //           <p>Email: {sellerDetails.email}</p>
// // //           <p>Username: {sellerDetails.username}</p>
// // //           {sellerDetails.images && sellerDetails.images.length > 0 && (
// // //             <div>
// // //               <h4>Images:</h4>
// // //               <ul>
// // //                 {sellerDetails.images.map((image, index) => (
// // //                   <li key={index}>
// // //                     <img src={image} alt={`Seller Image ${index + 1}`} style={{ width: "100px", height: "100px" }} />
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //           )}
// // //           <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
// // //           <h3>Products:</h3>
// // //           <ul>
// // //             {products.map((product, index) => (
// // //               <li key={index}>
// // //                 <h4>{product.name}</h4>
// // //                 <p>Description: {product.description}</p>
// // //                 <p>Price: ${product.price}</p>
// // //                 <p>Quantity: {product.quantity}</p>
// // //                 <p>Sales: {product.sales}</p>
// // //                 <p>Revenue: ${product.revenue.toFixed(2)}</p>
// // //                 {product.images && product.images.length > 0 && (
// // //                   <div>
// // //                     <h5>Product Images:</h5>
// // //                     <ul>
// // //                       {product.images.map((image, imgIndex) => (
// // //                         <li key={imgIndex}>
// // //                           <img src={image} alt={`Product Image ${imgIndex + 1}`} style={{ width: "100px", height: "100px" }} />
// // //                         </li>
// // //                       ))}
// // //                     </ul>
// // //                   </div>
// // //                 )}
// // //                 {product.reviews.length > 0 && (
// // //                   <div>
// // //                     <h5>Reviews:</h5>
// // //                     <ul>
// // //                       {product.reviews.map((review, reviewIndex) => (
// // //                         <li key={reviewIndex}>
// // //                           <p><strong>Tourist ID:</strong> {review.touristId}</p>
// // //                           <p><strong>Review:</strong> {review.reviewText}</p>
// // //                           <p><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
// // //                         </li>
// // //                       ))}
// // //                     </ul>
// // //                   </div>
// // //                 )}
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default SellerSalesReport;

// // import React, { useState } from 'react';

// // const SellerSalesReport = () => {
// //   const [id, setId] = useState(''); // Seller ID
// //   const [report, setReport] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const fetchReport = async () => {
// //     setLoading(true);
// //     setError(null);
// //     setReport(null);

// //     try {
// //       const response = await fetch(`/seller-sales-report?id=${id}`); // Fetch seller sales report by ID
// //       if (!response.ok) {
// //         throw new Error('Seller not found or internal server error');
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
// //       <h1>Seller Sales Report</h1>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="text"
// //           placeholder="Enter Seller ID" // Placeholder for input
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
// //           <h2>{report.message}</h2>
// //           <div>
// //             <h3>Seller Details:</h3>
// //             <p><strong>Name:</strong> {report.sellerDetails.name}</p>
// //             <p><strong>Description:</strong> {report.sellerDetails.description}</p>
// //             <p><strong>Email:</strong> {report.sellerDetails.email}</p>
// //             <p><strong>Username:</strong> {report.sellerDetails.username}</p>
// //             <div>
// //               <strong>Images:</strong>
// //               <div>
// //                 {report.sellerDetails.images && report.sellerDetails.images.map((img, index) => (
// //                   <img key={index} src={img} alt={`Seller Image ${index + 1}`} width="100" />
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           <h3>Total Revenue: ${report.totalRevenue.toFixed(2)}</h3>

// //           <h3>Products:</h3>
// //           <ul>
// //             {report.products.map((product) => (
// //               <li key={product.productId}>
// //                 <h4>{product.name}</h4>
// //                 <p><strong>Description:</strong> {product.description}</p>
// //                 <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
// //                 <p><strong>Quantity Left:</strong> {product.quantity}</p>
// //                 <p><strong>Sales:</strong> {product.sales}</p>
// //                 <p><strong>Revenue:</strong> ${product.revenue.toFixed(2)}</p>

// //                 {/* Product Images */}
// //                 {product.images && product.images.length > 0 && (
// //                   <div>
// //                     <strong>Product Images:</strong>
// //                     <div>
// //                       {product.images.map((image, imgIndex) => (
// //                         <img key={imgIndex} src={image} alt={`Product Image ${imgIndex + 1}`} width="100" />
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Reviews */}
// //                 {product.reviews.length > 0 && (
// //                   <div>
// //                     <h5>Reviews:</h5>
// //                     <ul>
// //                       {product.reviews.map((review, reviewIndex) => (
// //                         <li key={reviewIndex}>
// //                           <p><strong>Tourist ID:</strong> {review.touristId}</p>
// //                           <p><strong>Review:</strong> {review.reviewText}</p>
// //                           <p><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 )}

// //                 {/* Purchase Records */}
// //                 <div className="purchase-records">
// //                   <h4>Purchase Records</h4>
// //                   {product.purchaseRecords.map((record, index) => (
// //                     <div key={index} className="record">
// //                       <p><strong>Tourist:</strong> {record.touristUsername} ({record.touristEmail})</p>
// //                       <p><strong>Quantity Purchased:</strong> {record.quantity}</p>
// //                       <p><strong>Purchase Date:</strong> {new Date(record.purchaseDate).toLocaleDateString()}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default SellerSalesReport;
// import React, { useState } from 'react';

// const SellerSalesReport = () => {
//   const [id, setId] = useState(''); // Seller ID
//   const [report, setReport] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchReport = async () => {
//     setLoading(true);
//     setError(null);
//     setReport(null);

//     try {
//       const response = await fetch(`/seller-sales-report?id=${id}`); // Fetch seller sales report by ID
//       if (!response.ok) {
//         throw new Error('Seller not found or internal server error');
//       }
//       const data = await response.json();
//       setReport(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchReport();
//   };

//   return (
//     <div>
//       <h1>Seller Sales Report</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter Seller ID" // Placeholder for input
//           value={id}
//           onChange={(e) => setId(e.target.value)}
//           required
//         />
//         <button type="submit">Get Report</button>
//       </form>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {report && (
//         <div>
//           <h2>{report.message}</h2>
//           <div>
//             <h3>Seller Details:</h3>
//             <p><strong>Name:</strong> {report.sellerDetails.name}</p>
//             <p><strong>Description:</strong> {report.sellerDetails.description}</p>
//             <p><strong>Email:</strong> {report.sellerDetails.email}</p>
//             <p><strong>Username:</strong> {report.sellerDetails.username}</p>
//             <div>
//               <strong>Images:</strong>
//               <div>
//                 {report.sellerDetails.images && report.sellerDetails.images.map((img, index) => (
//                   <img key={index} src={img} alt={`Seller Image ${index + 1}`} width="100" />
//                 ))}
//               </div>
//             </div>
//           </div>

//           <h3>Total Revenue: ${report.totalRevenue.toFixed(2)}</h3>

//           <h3>Products:</h3>
//           <ul>
//             {report.products.map((product) => (
//               <li key={product.productId}>
//                 <h4>{product.name}</h4>
//                 <p><strong>Description:</strong> {product.description}</p>
//                 <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
//                 <p><strong>Quantity Left:</strong> {product.quantity}</p>
//                 <p><strong>Sales:</strong> {product.sales}</p>
//                 <p><strong>Revenue:</strong> ${product.revenue.toFixed(2)}</p>

//                 {/* Product Images */}
//                 {product.images && product.images.length > 0 && (
//                   <div>
//                     <strong>Product Images:</strong>
//                     <div>
//                       {product.images.map((image, imgIndex) => (
//                         <img key={imgIndex} src={image} alt={`Product Image ${imgIndex + 1}`} width="100" />
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Reviews */}
//                 {product.reviews.length > 0 && (
//                   <div>
//                     <h5>Reviews:</h5>
//                     <ul>
//                       {product.reviews.map((review, reviewIndex) => (
//                         <li key={reviewIndex}>
//                           <p><strong>Tourist ID:</strong> {review.touristId}</p>
//                           <p><strong>Review:</strong> {review.reviewText}</p>
//                           <p><strong>Created At:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Purchase Records */}
//                 <div className="purchase-records">
//                   <h4>Purchase Records</h4>
//                   {product.purchaseRecords.map((record, index) => (
//                     <div key={index} className="record">
//                       <p><strong>Tourist:</strong> {record.touristUsername} ({record.touristEmail})</p>
//                       <p><strong>Quantity Purchased:</strong> {record.quantity}</p>
//                       <p><strong>Purchase Date:</strong> {new Date(record.purchaseDate).toLocaleDateString()}</p>
//                     </div>
//                   ))}
//                 </div>
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

const SellerReport = ({ sellerId }) => { // Accept sellerId as a prop
  const [product, setProduct] = useState(""); // Filter by product name
  const [date, setDate] = useState(""); // Filter by specific date
  const [month, setMonth] = useState(""); // Filter by month
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSalesReport = async () => {
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const response = await axios.get(`/seller-sales-report`, {
        params: { id: sellerId }, // Use sellerId here
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch the report.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredReport = async () => {
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const response = await axios.get(`/filter-sales-report`, {
        params: { id: sellerId, product, date, month }, // Use sellerId here
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch the filtered report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Seller Sales Report</h1>

      {/* Seller ID Input - Removed since it's now automatic */}
      <button onClick={fetchSalesReport} disabled={loading}>
        {loading ? "Loading..." : "Get Report"}
      </button>

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
          <h2>Total Revenue: ${report.totalRevenue}</h2>
          <h3>Seller Details:</h3>
          <p>Name: {report.sellerDetails.name}</p>
          <p>Email: {report.sellerDetails.email}</p>
          <h3>Products:</h3>
          <ul>
            {report.products.map((product, index) => (
              <li key={index}>
                <h4>{product.name}</h4>
                <p>Description: {product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Quantity Remaining: {product.quantity}</p>
                <p>Revenue: ${product.revenue}</p>
                <h5>Purchase Records:</h5>
                <ul>
                  {product.purchaseRecords.map((record, recordIndex) => (
                    <li key={recordIndex}>
                      Tourist: {record.touristUsername} | Email: {record.touristEmail} | Quantity: {record.quantity} | Purchase Date:{" "}
                      {new Date(record.purchaseDate).toLocaleDateString()}
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

export default SellerReport;
