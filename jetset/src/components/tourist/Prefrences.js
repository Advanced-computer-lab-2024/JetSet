import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Checkbox, Button, message } from "antd";

const UpdatePreferencesForm = ({ touristId }) => {
  const [preferences, setPreferences] = useState({
    historicAreas: false,
    beaches: false,
    familyFriendly: false,
    shopping: false,
    budget: 0,
  });
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getTourist/${touristId}`
        );
        setUsername(response.data.username);
      } catch (error) {
        message.error("Error fetching tourist information");
      }
    };
    fetchTouristData();
  }, [touristId]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/tourist/preferences/${touristId}`,
        { preferences: values }
      );
      message.success("Preferences updated successfully");
    } catch (error) {
      message.error(error.response?.data.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f4f4f4", // Light background to highlight the form
        borderRadius: "10px",
      }}
    >
      <h1 style={{ color: "#1d3557" }}>Update Tourist Preferences</h1>
      <p style={{ color: "#1d3557" }}>Username: {username}</p>
      <Form
        initialValues={preferences}
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item name="historicAreas" valuePropName="checked">
          <Checkbox onChange={handleChange}>Historic Areas</Checkbox>
        </Form.Item>

        <Form.Item name="beaches" valuePropName="checked">
          <Checkbox onChange={handleChange}>Beaches</Checkbox>
        </Form.Item>

        <Form.Item name="familyFriendly" valuePropName="checked">
          <Checkbox onChange={handleChange}>Family Friendly</Checkbox>
        </Form.Item>

        <Form.Item name="shopping" valuePropName="checked">
          <Checkbox onChange={handleChange}>Shopping</Checkbox>
        </Form.Item>

        <Form.Item name="budget" label="Budget">
          <Input
            type="number"
            onChange={handleChange}
            min={0}
            value={preferences.budget}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{
              backgroundColor: "#1d3557",
              borderColor: "#1d3557",
              fontWeight: "bold",
            }}
          >
            Update Preferences
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePreferencesForm;
