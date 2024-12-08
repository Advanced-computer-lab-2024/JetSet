import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Select, Spin, Alert, Card, Typography } from "antd";
import { StarOutlined, DollarOutlined, CalendarOutlined, TagsOutlined } from "@ant-design/icons";
import "font-awesome/css/font-awesome.min.css";
import "./bookmark.css";

const { Option } = Select;
const { Title, Text } = Typography;

const ActivitiesList = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [bookmarkedActivities, setBookmarkedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state variables
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");

  // Sorting state variables
  const [sortBy, setSortBy] = useState("ratings");
  const [sortOrder, setSortOrder] = useState(1);

  // New state variable to toggle between showing all or only bookmarked activities
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Fetch all activities
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const activityResponse = await axios.get("/getactivity");
      setActivities(activityResponse.data);

      const touristResponse = await axios.get(`/getTourist/${touristId}`);
      setBookmarkedActivities(touristResponse.data.bookmarkedActivities || []);
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities
  const filterActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/filterActivity", {
        params: {
          budget: budget || undefined,
          date: date || undefined,
          category: category || undefined,
          rating: rating || undefined,
        },
      });
      setActivities(response.data);
    } catch (err) {
      setError("Error filtering activities: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort activities
  const sortActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/sortactivities", {
        params: {
          sortBy,
          sortOrder,
        },
      });

      setActivities(response.data);
    } catch (err) {
      setError("Error fetching sorted activities: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bookmark or unbookmark activity
  const bookmarkActivity = async (activityId, isBookmarked) => {
    try {
      const endpoint = isBookmarked ? "/api/unbookmarkActivity" : "/api/bookmarkActivity";

      const response = await axios.post(endpoint, {
        touristId,
        activityId,
      });

      if (response.data.message) {
        setBookmarkedActivities((prev) =>
          isBookmarked ? prev.filter((id) => id !== activityId) : [...prev, activityId]
        );
      } else {
        alert(response.data.error || "Error updating bookmark status");
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
      alert("Error updating bookmark: " + err.message);
    }
  };

  // Fetch activities when the component mounts
  useEffect(() => {
    fetchActivities();
  }, []);

  // Toggle between showing all activities and only bookmarked ones
  const handleToggleBookmarked = () => {
    setShowBookmarked((prev) => !prev);
  };

  // Filter activities to show only bookmarked ones if the flag is true
  const displayedActivities = showBookmarked
    ? activities.filter((activity) => bookmarkedActivities.includes(activity._id))
    : activities;

  return (
    <div>
      <Title level={2}>Activities List</Title>

      {/* Loading and Error States */}
      {loading && <Spin tip="Loading activities..." size="large" />}
      {error && <Alert message="Error" description={error} type="error" showIcon />}

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
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          prefix={<CalendarOutlined />}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          prefix={<TagsOutlined />}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          prefix={<StarOutlined />}
          style={{ width: "200px", marginRight: "10px" }}
        />
        <Button type="primary" onClick={filterActivities}>Filter Activities</Button>
      </div>

      {/* Sort Options */}
      <div className="sort-options">
        <Title level={3}>Sort Activities</Title>
        <Select
          defaultValue={sortBy}
          onChange={(value) => setSortBy(value)}
          style={{ width: "200px", marginRight: "10px" }}
        >
          <Option value="ratings">Sort by Ratings</Option>
          <Option value="budget">Sort by Budget</Option>
        </Select>
        <Select
          defaultValue={sortOrder}
          onChange={(value) => setSortOrder(value)}
          style={{ width: "150px", marginRight: "10px" }}
        >
          <Option value={1}>Ascending</Option>
          <Option value={-1}>Descending</Option>
        </Select>
        <Button type="primary" onClick={sortActivities}>Sort Activities</Button>
      </div>

      {/* Toggle Bookmarked Activities */}
      <Button
        type="link"
        onClick={handleToggleBookmarked}
        style={{ marginBottom: "20px" }}
      >
        {showBookmarked ? "Show All Activities" : "Show Bookmarked Activities"}
      </Button>

      {/* Activities List */}
      <div className="activities-list">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity) => {
            const isBookmarked = bookmarkedActivities.includes(activity._id);
            return (
              <Card
                key={activity._id}
                title={activity.title || "No Title Available"}
                style={{ marginBottom: "20px" }}
                extra={
                  <Button
                    type="link"
                    icon={
                      <i className={`fa ${isBookmarked ? "fa-bookmark" : "fa-bookmark-o"}`} />
                    }
                    onClick={() => bookmarkActivity(activity._id, isBookmarked)}
                  >
                    {isBookmarked ? "Unbookmark" : "Bookmark"}
                  </Button>
                }
              >
                <Text>Location: {activity.location?.address || "No Location"}</Text>
                <br />
                <Text>Date: {new Date(activity.date).toLocaleDateString()}</Text>
                <br />
                <Text>Budget: {activity.budget || "No Budget"}</Text>
                <br />
                <Text>Rating: {activity.rating || "No Rating"}</Text>
                <br />
                <Text>Category: {activity.category || "No Category"}</Text>
                <br />
                <Text>Tags: {activity.tags.length > 0 ? activity.tags.join(", ") : "No Tags"}</Text>
                <br />
                <Text>Booking Open: {activity.booking_open ? "Yes" : "No"}</Text>
              </Card>
            );
          })
        ) : (
          <Alert message="No activities available." type="info" />
        )}
      </div>
    </div>
  );
};

export default ActivitiesList;
