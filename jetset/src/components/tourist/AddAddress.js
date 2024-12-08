// src/AddAddress.js
import React, { useState } from "react";
import axios from "axios";
import { Input, Button, notification, Spin } from "antd"; // Importing Ant Design components

const AddAddress = ({ touristId }) => {
  const [addresses, setAddresses] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (index, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = value;
    setAddresses(updatedAddresses);
  };

  const addNewAddressField = () => {
    setAddresses([...addresses, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addresses.some((address) => !address.trim())) {
      notification.error({
        message: "Validation Error",
        description: "All address fields must be filled.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/addTouristAddress/${touristId}`, {
        addresses,
      });
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      setAddresses([""]); // Reset the address fields
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.response?.data?.error || "Failed to add addresses.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add New Addresses</h2>

      {loading ? (
        <Spin size="large" />
      ) : (
        <form onSubmit={handleSubmit}>
          {addresses.map((address, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <Input
                placeholder={`Address ${index + 1}`}
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
              />
            </div>
          ))}
          <Button
            type="default"
            onClick={addNewAddressField}
            style={{ marginBottom: "20px", marginRight: "10px" }}
          >
            Add Another Address
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#1d3557", // Apply specified color
              borderColor: "#1d3557", // Match the border color
              color: "white", // White text color
            }}
            disabled={loading}
          >
            Submit Addresses
          </Button>
        </form>
      )}
    </div>
  );
};

export default AddAddress;
