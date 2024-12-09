
import React, { useState } from "react";
import axios from "axios";

const SellerReport = () => {
  const [id, setId] = useState(""); // Seller ID
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
        params: { id },
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
      const response = await axios.get(`/filter-seller-sales-report`, {
        params: { id, product, date, month },
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

      {/* Seller ID Input */}
      <div>
        <label htmlFor="id">Seller ID:</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={fetchSalesReport} disabled={loading}>
          {loading ? "Loading..." : "Get Report"}
        </button>
      </div>

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