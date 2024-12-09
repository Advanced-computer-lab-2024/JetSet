import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Checkbox,
  Button,
  Row,
  Col,
  notification,
  Spin,
} from "antd";

const UpdatePreferencesForm = ({ touristId }) => {
  const [preferences, setPreferences] = useState({
    historicAreas: false,
    beaches: false,
    familyFriendly: false,
    shopping: false,
    budget: 0,
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state for better UX

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getTourist/${touristId}`
        );
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
        notification.error({
          message: "Error",
          description: "Error fetching tourist information",
        });
      } finally {
        setLoading(false); // Set loading to false once data is fetched
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:3000/tourist/preferences/${touristId}`,
        { preferences }
      );
      notification.success({
        message: "Preferences Updated",
        description: `Preferences updated successfully: ${JSON.stringify(
          response.data
        )}`,
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      notification.error({
        message: "Error",
        description: error.response?.data.message || "Something went wrong",
      });
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Update Tourist Preferences
      </h2>
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <>
          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            Username: {username}
          </p>

          <Form onSubmit={handleSubmit} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Historic Areas">
                  <Checkbox
                    name="historicAreas"
                    checked={preferences.historicAreas}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Beaches">
                  <Checkbox
                    name="beaches"
                    checked={preferences.beaches}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Family Friendly">
                  <Checkbox
                    name="familyFriendly"
                    checked={preferences.familyFriendly}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Shopping">
                  <Checkbox
                    name="shopping"
                    checked={preferences.shopping}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Budget">
              <Input
                type="number"
                name="budget"
                value={preferences.budget}
                onChange={handleChange}
                min="0"
                placeholder="Enter your budget"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "#1d3557",
                  borderColor: "#1d3557",
                  color: "white",
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  borderRadius: "8px",
                }}
              >
                Update Preferences
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
};

export default UpdatePreferencesForm;
