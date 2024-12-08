import React, { useState } from "react";
import axios from "axios";
import { Typography, Button, notification, Card } from "antd";

const { Title, Text } = Typography;

const LoyaltyPointsForm = ({ touristId }) => {
  const [redeemMessage, setRedeemMessage] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(null);

  const handleRedeem = async () => {
    setRedeemMessage(""); // Clear previous message
    try {
      const response = await axios.put(
        `http://localhost:3000/redeemMyPoints/${touristId}`
      );
      const result = response.data;

      if (response.status === 200) {
        setRedeemMessage(
          "Points redeemed successfully! 100 EGP added to your wallet."
        );
        setLoyaltyPoints(result.tourist.loyaltyPoints);

        notification.success({
          message: "Points Redeemed",
          description: "100 EGP has been added to your wallet!",
        });
      } else {
        setRedeemMessage(result.error || "An unknown error occurred.");
        notification.warning({
          message: "Redemption Warning",
          description: result.error || "Failed to redeem points.",
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error === "Not Enough Points"
          ? "You do not have enough points to redeem."
          : "An error occurred while redeeming points. Please try again.";

      setRedeemMessage(errorMessage);

      notification.error({
        message: "Failed to Redeem Points",
        description: errorMessage,
      });
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Card>
        <Title level={3} style={{ textAlign: "center", color: "#1d3557" }}>
          Loyalty Points Management
        </Title>

        <div>
          <Text strong style={{ fontSize: "16px" }}>
            Redeem Loyalty Points
          </Text>
          <Text type="secondary" style={{ display: "block", marginTop: "8px" }}>
            Redeem 10,000 points for 100 EGP.
          </Text>
          <Button
            type="primary"
            block
            style={{
              backgroundColor: "#1d3557",
              borderColor: "#1d3557",
              marginTop: "12px",
            }}
            onClick={handleRedeem}
          >
            Redeem Points
          </Button>
        </div>

        {redeemMessage && (
          <Text
            type={redeemMessage.includes("successfully") ? "success" : "danger"}
            style={{ marginTop: "16px", display: "block" }}
          >
            {redeemMessage}
          </Text>
        )}

        {loyaltyPoints !== null && (
          <Text
            strong
            style={{
              display: "block",
              marginTop: "12px",
              fontSize: "16px",
              color: "#1d3557",
            }}
          >
            Remaining Loyalty Points: {loyaltyPoints}
          </Text>
        )}
      </Card>
    </div>
  );
};

export default LoyaltyPointsForm;
