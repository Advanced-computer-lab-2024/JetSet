import React, { useEffect, useState } from "react";

const ViewRefundAmount = ({ touristId }) => {
  const [refundDetails, setRefundDetails] = useState(null);

  useEffect(() => {
    const fetchRefundAmount = async () => {
      try {
        const orderId = "670d46ebdcbc415cf0e1870a"; // Hardcoded order ID (you can change this dynamically)
        const response = await fetch(
          `/viewRefundAmount/${touristId}/${orderId}`
        );
        const data = await response.json();

        if (data.message === "Refund successful") {
          setRefundDetails(data);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching refund details:", error);
      }
    };

    fetchRefundAmount();
  }, [touristId]);

  return (
    <div>
      <h2>Refund Information</h2>
      {refundDetails ? (
        <div>
          <p>Refund Amount: ${refundDetails.refundedAmount}</p>
          <p>Updated Wallet Balance: ${refundDetails.updatedWalletBalance}</p>
        </div>
      ) : (
        <p>Loading refund details...</p>
      )}
    </div>
  );
};

export default ViewRefundAmount;
