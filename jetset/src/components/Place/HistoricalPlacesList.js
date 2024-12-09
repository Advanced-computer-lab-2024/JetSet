import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, List, Typography, Row, Col, Space } from "antd"; // Import Ant Design components
const { Title, Text } = Typography;

const HistoricalPlacesList = ({ touristId }) => {
  const [places, setPlaces] = useState([]);
  const [tag, setTag] = useState(""); // Only tracking tag for filtering
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  // Fetch all historical places initially
  const fetchAllPlaces = async () => {
    try {
      const response = await axios.get("/viewAllPlaces");
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching historical places:", error);
    }
  };

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
    fetchAllPlaces();
  }, []); // Only fetch once on component mount

  // Fetch filtered historical places based on the tag
  useEffect(() => {
    const fetchFilteredPlaces = async () => {
      if (tag) {
        try {
          const response = await axios.get("/filterHistoricalTags", {
            params: { tag },
          });
          console.log("Filtered places response:", response.data); // Log the response
          setPlaces(response.data);
        } catch (error) {
          console.error("Error fetching filtered historical places:", error);
        }
      } else {
        fetchAllPlaces(); // Fetch all places if no tag is provided
      }
    };

    fetchFilteredPlaces();
  }, [tag]);

  const handleChange = (e) => {
    setTag(e.target.value); // Update tag state directly
    console.log("Current tag:", e.target.value); // Log current tag
  };

  const handleClearFilter = () => {
    setTag(""); // Clear the tag filter
    fetchAllPlaces(); // Fetch all places again
  };

  return (
    <div>
      <Title level={2}>Historical Places</Title>
      <Title level={3}>Filter Historical Places by Tag</Title>
      <Row gutter={16}>
        <Col span={16}>
          <Input
            placeholder="Enter Tag"
            value={tag}
            onChange={handleChange}
            style={{ width: "80%" }}
          />
        </Col>
        <Col span={8}>
          <Space>
            <Button onClick={handleClearFilter} type="primary">
              Clear Filter
            </Button>
          </Space>
        </Col>
      </Row>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={places}
        renderItem={(place) => (
          <List.Item key={place._id}>
            <List.Item.Meta
              title={<Text strong>{place.Name}</Text>}
              description={place.Description}
            />
            <Row>
              <Col span={12}>
                <Text strong>Location:</Text> {place.location?.address || "N/A"}
              </Col>
              <Col span={12}>
                <Text strong>Coordinates:</Text>{" "}
                {place.location?.coordinates
                  ? `${place.location.coordinates.lat}, ${place.location.coordinates.lng}`
                  : "N/A"}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Opening Hours:</Text> {place.opening_hours}
              </Col>
              <Col span={12}>
                <Text strong>Managed By:</Text> {place.managed_by || "N/A"}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Ticket Price (Family):</Text>{" "}
                {(place.TicketPricesF * conversionRate).toFixed(2)}{" "}
                {selectedCurrency}
              </Col>
              <Col span={12}>
                <Text strong>Ticket Price (Normal):</Text>{" "}
                {(place.TicketPricesN * conversionRate).toFixed(2)}{" "}
                {selectedCurrency}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Ticket Price (Student):</Text>{" "}
                {(place.TicketPricesS * conversionRate).toFixed(2)}{" "}
                {selectedCurrency}
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Text strong>Tags:</Text>{" "}
                {place.tags.length > 0 ? place.tags.join(", ") : "None"}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Text strong>Created At:</Text>{" "}
                {new Date(place.createdAt).toLocaleDateString()}
              </Col>
              <Col span={12}>
                <Text strong>Updated At:</Text>{" "}
                {new Date(place.updatedAt).toLocaleDateString()}
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default HistoricalPlacesList;
