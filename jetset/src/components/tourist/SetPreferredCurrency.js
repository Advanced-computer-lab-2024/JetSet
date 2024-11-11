// src/SetPreferredCurrency.js
import React, { useState } from "react";
import axios from "axios";

const SetPreferredCurrency = ({ touristId }) => {
  const [currency, setCurrency] = useState("");
  const [message, setMessage] = useState("");

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const updatePreferredCurrency = async () => {
    if (!currency) {
      setMessage("Please select a currency.");
      return;
    }

    try {
      const response = await axios.put(`/cpTourist/${touristId}/currency`, {
        currency,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error updating preferred currency.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Set Preferred Currency</h2>
      <select value={currency} onChange={handleCurrencyChange}>
        <option value="">Select Currency</option>
        <option value="EGP">Egyptian Pound (EGP)</option>
        <option value="USD">US Dollar (USD)</option>
        <option value="EUR">Euro (EUR)</option>
        <option value="SAR">Saudi Riyal (SAR)</option>
        <option value="AED">Emirati Dirham (AED)</option>
        <option value="KWD">Kuwaiti Dinar (KWD)</option>
        <option value="TRY">Turkish Lira (TRY)</option>
        <option value="GBP">British Pound (GBP)</option>
        {/* Add more options as needed */}
      </select>

      <button onClick={updatePreferredCurrency}>Set Currency</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SetPreferredCurrency;
