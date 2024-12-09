import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Select, Button, Card, List, Spin, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const SearchComponent = ({ touristId }) => {
  const [searchType, setSearchType] = useState("place"); // Default search type
  const [query, setQuery] = useState({ name: "", category: "", tags: "" });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchConversionRate = async (currency) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency); // Set the currency
      setConversionRate(response.data.conversionRate); // Set the conversion rate
    } catch (error) {
      console.error("Error fetching currency data:", error);
      message.error("Failed to fetch currency data.");
    }
  };

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setError(null); // Reset any previous errors
    setLoading(true);
    try {
      let response;
      if (searchType === "place") {
        response = await axios.get(`http://localhost:3000/searchplace`, {
          params: query,
        });
      } else if (searchType === "activity") {
        response = await axios.get(`http://localhost:3000/searchactivity`, {
          params: query,
        });
      } else if (searchType === "itinerary") {
        response = await axios.get(`http://localhost:3000/searchitinerary`, {
          params: query,
        });
      }
      setResults(response.data);
    } catch (err) {
      setError(err.message);
      message.error("Search failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Search</h1>
      <div style={{ marginBottom: "20px" }}>
        <label>Search Type:</label>
        <Select
          value={searchType}
          onChange={(value) => setSearchType(value)}
          style={{ width: 200, marginLeft: 10 }}
        >
          <Option value="place">Place</Option>
          <Option value="activity">Activity</Option>
          <Option value="itinerary">Itinerary</Option>
        </Select>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <Input
          name="name"
          placeholder="Name"
          value={query.name}
          onChange={handleChange}
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          name="category"
          placeholder="Category"
          value={query.category}
          onChange={handleChange}
          style={{ width: 200, marginRight: 10 }}
        />
        <Input
          name="tags"
          placeholder="Tags (comma separated)"
          value={query.tags}
          onChange={handleChange}
          style={{ width: 200, marginRight: 10 }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          loading={loading}
          style={{ marginTop: 10 }}
        >
          Search
        </Button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <h2>Results:</h2>
      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={results}
          renderItem={(result) => (
            <List.Item>
              <Card
                title={result.name || result.title || result.Name}
                style={{ width: "100%" }}
              >
                {/* Common Info */}
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(result.createdAt).toLocaleDateString()}
                </p>

                {/* Dynamic Info Based on Result Type */}
                {result.Name && (
                  <div>
                    <h4>Place</h4>
                    <p>
                      <strong>Description:</strong>{" "}
                      {result.Description || "N/A"}
                    </p>
                    <p>
                      <strong>Ticket Prices (Family):</strong>
                      {(result.TicketPricesF * conversionRate).toFixed(2)}{" "}
                      {selectedCurrency}
                    </p>
                    <p>
                      <strong>Tags:</strong>{" "}
                      {Array.isArray(result.tags) && result.tags.length > 0
                        ? result.tags.join(", ")
                        : "N/A"}
                    </p>
                  </div>
                )}

                {result.title && (
                  <div>
                    <h4>Activity</h4>
                    <p>
                      <strong>Budget:</strong>{" "}
                      {(result.budget * conversionRate).toFixed(2)}{" "}
                      {selectedCurrency}
                    </p>
                    <p>
                      <strong>Time:</strong> {result.time || "N/A"}
                    </p>
                    <p>
                      <strong>Location:</strong> {result.location || "N/A"}
                    </p>
                  </div>
                )}

                {result.name && (
                  <div>
                    <h4>Itinerary</h4>
                    <p>
                      <strong>Budget:</strong>{" "}
                      {(result.budget * conversionRate).toFixed(2)}{" "}
                      {selectedCurrency}
                    </p>
                    <p>
                      <strong>Locations:</strong>{" "}
                      {result.locations.join(", ") || "N/A"}
                    </p>
                  </div>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchComponent;
