import React, { useState, useEffect } from "react";
import axios from "axios";

const CancelOrder = ({ touristId }) => {
  const hardcodedOrderId = "670d46ebdcbc415cf0e1870a"; // Hardcoded Order ID
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);
  const [cancelMessage, setCancelMessage] = useState(null); // State for cancellation response

  // Fetch order details when the component mounts
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

  // Handle order cancellation
  const handleCancelOrder = async () => {
    setCancelMessage(null);
    setError(null);

    try {
      const response = await axios.delete(
        `/cancelorder/${touristId}/${hardcodedOrderId}`
      );
      setCancelMessage(response.data.message);
      setOrderDetails(null); // Clear order details after successful cancellation
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order.");
    }
  };

  return (
    <section>
      <h2>Order Details</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {cancelMessage && <p style={{ color: "green" }}>{cancelMessage}</p>}

      {orderDetails ? (
        <div>
          <h3>Details for Order ID: {hardcodedOrderId}</h3>
          <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
          <button
            onClick={handleCancelOrder}
            style={{
              marginTop: "10px",
              color: "white",
              backgroundColor: "red",
            }}
          >
            Cancel Order
          </button>
        </div>
      ) : (
        <p>No order details available.</p>
      )}
    </section>
  );
};

export default CancelOrder;
