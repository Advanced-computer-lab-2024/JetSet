import React, { useState, useEffect } from "react";
import axios from "axios";

const TouristProfile = ({ touristId }) => {
  const [tourist, setTourist] = useState(null);
  const [updateFields, setUpdateFields] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  const fetchConversionRate = async (currency) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency); // Set the currency

      setConversionRate(response.data.conversionRate); // Set the conversion rate
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    const fetchTourist = async () => {
      if (touristId) {
        try {
          const response = await axios.get(`/getTourist/${touristId}`);
          setTourist(response.data);
        } catch (error) {
          alert(
            error.response?.data?.message || "Error fetching tourist profile"
          );
        }
      }
    };
    fetchTourist();
  }, [touristId]);

  const handleUpdateChange = (e) => {
    setUpdateFields({ ...updateFields, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/updateTourist/${touristId}`,
        updateFields
      );
      setTourist(response.data);
      alert("Tourist profile updated!");
    } catch (error) {
      alert(error.response?.data?.message || "Error updating tourist profile");
    }
  };

  return (
    <div>
      <h2>Tourist Profile</h2>
      {tourist ? (
        <div>
          <h3>{tourist.username}</h3>
          <p>Email: {tourist.email}</p>
          <p>Nationality: {tourist.nationality}</p>
          <p>Job: {tourist.job}</p>
          <p>Mobile: {tourist.mobile_number}</p>
          <p>DOB: {tourist.DOB}</p>
          <p>
            Wallet Balance: {(tourist.wallet * conversionRate).toFixed(2)}
            {selectedCurrency}
          </p>
          <p>Loyalty Points: {tourist.loyaltyPoints}</p>
          <p>Badge: {tourist.badge}</p>
          <p>Level: {tourist.level}</p>

          <h3>Update Profile</h3>
          <form onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              name="mobile"
              placeholder="New Mobile"
              onChange={handleUpdateChange}
            />
            <input
              type="text"
              name="job"
              placeholder="New Job"
              onChange={handleUpdateChange}
            />
            <input
              type="number"
              name="wallet"
              placeholder="Wallet Balance"
              onChange={handleUpdateChange}
            />
            <input
              type="number"
              name="loyaltyPoints"
              placeholder="Loyalty Points"
              onChange={handleUpdateChange}
            />
            <button type="submit">Update</button>
          </form>
        </div>
      ) : (
        <p>No profile found. Please register.</p>
      )}
    </div>
  );
};

export default TouristProfile;
