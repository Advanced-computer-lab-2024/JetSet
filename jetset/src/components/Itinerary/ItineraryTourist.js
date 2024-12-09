import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Select, Spin, Alert, Card, Typography } from "antd";
import {
  StarOutlined,
  DollarOutlined,
  CalendarOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import "font-awesome/css/font-awesome.min.css";
import "./bookmark.css";

const { Option } = Select;
const { Title, Text } = Typography;

const ItineraryList = ({ touristId }) => {
  const [itineraries, setItineraries] = useState([]);
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state variables
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tag, setTag] = useState("");
  const [language, setLanguage] = useState("");

  // Sorting state variables
  const [sortBy, setSortBy] = useState("budget");
  const [sortOrder, setSortOrder] = useState(1);

  // New state variable to toggle between showing all or only bookmarked itineraries
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Fetch all itineraries
  const fetchItineraries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/ititour");
      setItineraries(response.data);

      const touristResponse = await axios.get(`/getTourist/${touristId}`);
      setBookmarkedItineraries(
        touristResponse.data.bookmarkedItineraries || []
      );
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter itineraries
  const filterItineraries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/tourist/filter-itineraries", {
        params: {
          budget: budget || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          tag: tag || undefined,
          language: language || undefined,
        },
      });
      setItineraries(response.data);
    } catch (err) {
      setError("Error filtering itineraries: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort itineraries
  const sortItineraries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/sortitineraries", {
        params: {
          sortBy,
          sortOrder,
        },
      });

      setItineraries(response.data);
    } catch (err) {
      setError("Error fetching sorted itineraries: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bookmark or unbookmark itinerary
  const bookmarkItinerary = async (itineraryId, isBookmarked) => {
    try {
      const endpoint = isBookmarked
        ? "/api/unbookmarkItinerary"
        : "/api/bookmarkItinerary";

      const response = await axios.post(endpoint, {
        touristId,
        itineraryId,
      });

      if (response.data.message) {
        setBookmarkedItineraries((prev) =>
          isBookmarked
            ? prev.filter((id) => id !== itineraryId)
            : [...prev, itineraryId]
        );
      } else {
        alert(response.data.error || "Error updating bookmark status");
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
      alert("Error updating bookmark: " + err.message);
    }
  };

  // Fetch itineraries when the component mounts
  useEffect(() => {
    fetchItineraries();
  }, []);

  // Toggle between showing all itineraries and only bookmarked ones
  const handleToggleBookmarked = () => {
    setShowBookmarked((prev) => !prev);
  };

  // Filter itineraries to show only bookmarked ones if the flag is true
  const displayedItineraries = showBookmarked
    ? itineraries.filter((itinerary) =>
        bookmarkedItineraries.includes(itinerary._id)
      )
    : itineraries;

  return (
    <div>
      <Title level={2}>Itineraries List</Title>

      {/* Loading and Error States */}
      {loading && <Spin tip="Loading itineraries..." size="large" />}
      {error && (
        <Alert message="Error" description={error} type="error" showIcon />
      )}

      {/* Filter Inputs */}
      <div className="filters">
        <Input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          prefix={<DollarOutlined />}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          prefix={<CalendarOutlined />}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          prefix={<CalendarOutlined />}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          prefix={<TagsOutlined />}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Input
          type="text"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={filterItineraries}>
          Filter Itineraries
        </Button>
      </div>

      {/* Sort Options */}
      <div className="sort-options">
        <Title level={3}>Sort Itineraries</Title>
        <Select
          defaultValue={sortBy}
          onChange={(value) => setSortBy(value)}
          style={{ width: "200px", marginRight: "10px" }}
        >
          <Option value="budget">Sort by Budget</Option>
          <Option value="ratings">Sort by Ratings</Option>
        </Select>
        <Select
          defaultValue={sortOrder}
          onChange={(value) => setSortOrder(value)}
          style={{ width: "150px", marginRight: "10px" }}
        >
          <Option value={1}>Ascending</Option>
          <Option value={-1}>Descending</Option>
        </Select>
        <Button type="primary" onClick={sortItineraries}>
          Sort Itineraries
        </Button>
      </div>

      {/* Toggle Bookmarked Itineraries */}
      <Button
        type="link"
        onClick={handleToggleBookmarked}
        style={{ marginBottom: "20px" }}
      >
        {showBookmarked
          ? "Show All Itineraries"
          : "Show Bookmarked Itineraries"}
      </Button>

      {/* Itineraries List */}
      <div className="itineraries-list">
        {displayedItineraries.length > 0 ? (
          displayedItineraries.map((itinerary) => {
            const isBookmarked = bookmarkedItineraries.includes(itinerary._id);
            return (
              <Card
                key={itinerary._id}
                title={itinerary.name || "No Title Available"}
                style={{ marginBottom: "20px" }}
                extra={
                  <Button
                    type="link"
                    icon={
                      <i
                        className={`fa ${
                          isBookmarked ? "fa-bookmark" : "fa-bookmark-o"
                        }`}
                      />
                    }
                    onClick={() =>
                      bookmarkItinerary(itinerary._id, isBookmarked)
                    }
                  >
                    {isBookmarked ? "Unbookmark" : "Bookmark"}
                  </Button>
                }
              >
                <Text>Duration: {itinerary.duration} days</Text>
                <br />
                <Text>Budget: ${itinerary.budget}</Text>
                <br />
                <Text>
                  Tags:{" "}
                  {Array.isArray(itinerary.tags)
                    ? itinerary.tags.join(", ")
                    : "None"}
                </Text>
                <br />
                <Text>Language: {itinerary.language || "Not specified"}</Text>
              </Card>
            );
          })
        ) : (
          <Alert message="No itineraries available." type="info" />
        )}
      </div>
    </div>
  );
};

export default ItineraryList;
