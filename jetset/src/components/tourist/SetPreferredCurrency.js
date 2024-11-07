// src/SetPreferredCurrency.js
import React, { useState } from "react";
import axios from "axios";

const SetPreferredCurrency = () => {
  const touristId = "6723896c185909fcd367634a"; // Hardcoded tourist ID
  const [currency, setCurrency] = useState(""); // State for currency
  const [message, setMessage] = useState(""); // State for feedback message

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value); // Update the currency state
  };

  const updatePreferredCurrency = async () => {
    if (!currency) {
      setMessage("Please enter a valid currency.");
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
      <input
        type="text"
        placeholder="Enter Currency"
        value={currency}
        onChange={handleCurrencyChange}
      />
      <button onClick={updatePreferredCurrency}>Set Currency</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SetPreferredCurrency;
