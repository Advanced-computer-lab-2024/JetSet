import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewOrderDetails = ({ touristId }) => {
  const hardcodedOrderId = "670d46ebdcbc415cf0e1870a"; // Hardcoded Order ID
  const [orderDetails, setOrderDetails] = useState(null); // State for fetched order details
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setError(null);
      setOrderDetails(null);

      try {
        const response = await axios.get(
          `/vieworder/${touristId}/${hardcodedOrderId}`
        );
        setOrderDetails(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch order details."
        );
      }
    };

    fetchOrderDetails();
  }, [touristId]);

  return (
    <section>
      <h2>Order Details</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {orderDetails && (
        <div>
          <h3>Details for Order ID: {hardcodedOrderId}</h3>
          <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
        </div>
      )}
    </section>
  );
};

export default ViewOrderDetails;
