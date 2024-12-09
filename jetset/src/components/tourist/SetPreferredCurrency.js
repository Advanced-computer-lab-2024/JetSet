// src/SetPreferredCurrency.js
import React, { useState } from "react";
import axios from "axios";
import { Select, Button, Typography, notification } from "antd";

const { Option } = Select;
const { Title } = Typography;

const SetPreferredCurrency = ({ touristId }) => {
  const [currency, setCurrency] = useState("");

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  const updatePreferredCurrency = async () => {
    if (!currency) {
      notification.warning({
        message: "Currency Not Selected",
        description: "Please select a currency before proceeding.",
      });
      return;
    }

    try {
      const response = await axios.put(`/cpTourist/${touristId}/currency`, {
        currency,
      });
      notification.success({
        message: "Currency Updated",
        description:
          response.data.message || "Preferred currency updated successfully.",
      });
    } catch (error) {
      notification.error({
        message: "Update Failed",
        description:
          "An error occurred while updating the preferred currency. Please try again later.",
      });
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <Title level={3}>Set Preferred Currency</Title>
      <Select
        value={currency}
        onChange={handleCurrencyChange}
        placeholder="Select Currency"
        style={{ width: "100%", marginBottom: "16px" }}
      >
        <Option value="EGP">Egyptian Pound (EGP)</Option>
        <Option value="USD">US Dollar (USD)</Option>
        <Option value="EUR">Euro (EUR)</Option>
        <Option value="SAR">Saudi Riyal (SAR)</Option>
        <Option value="AED">Emirati Dirham (AED)</Option>
        <Option value="KWD">Kuwaiti Dinar (KWD)</Option>
        <Option value="TRY">Turkish Lira (TRY)</Option>
        <Option value="GBP">British Pound (GBP)</Option>
        {/* Add more options as needed */}
      </Select>
      <Button
        type="primary"
        onClick={updatePreferredCurrency}
        block
        style={{ backgroundColor: "#1d3557", borderColor: "#1d3557" }}
      >
        Set Currency
      </Button>
    </div>
  );
};

export default SetPreferredCurrency;
