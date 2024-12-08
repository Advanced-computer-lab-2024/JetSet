import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Checkbox, Select, Table, Spin, Alert, Card, Typography } from "antd";

const { Title, Text } = Typography;

const ActivityForm = ({ onActivityCreated }) => {
  const BASE_URL = "http://localhost:3000";

  const [formData, setFormData] = useState({
    title: "",
    budget: "",
    date: "",
    time: "",
    location: "",
    category: "",
    special_discount: "",
    booking_open: true,
    tags: "",
  });

  const [activityId, setActivityId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [activities, setActivities] = useState([]);
  const [isFetchingActivities, setIsFetchingActivities] = useState(false);
  const [activitiesFetched, setActivitiesFetched] = useState(false);

  useEffect(() => {
    getActivities();
  }, []);

  const getActivities = async () => {
    setIsFetchingActivities(true);
    try {
      const response = await axios.get(`${BASE_URL}/getactivity`);
      setActivities(response.data);
      setActivitiesFetched(true);
      setStatusMessage("Activities fetched successfully!");
    } catch (error) {
      console.error("Error fetching activities:", error);
      setStatusMessage("Error fetching activities. Please try again.");
    } finally {
      setIsFetchingActivities(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const preparedData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      const response = await axios.post(`${BASE_URL}/addactivity`, preparedData);
      onActivityCreated(response.data);
      resetForm();
      setStatusMessage("Activity added successfully!");
      getActivities();
    } catch (error) {
      console.error("Error adding activity:", error);
      setStatusMessage("Error adding activity. Please try again.");
    }
  };

  const handleUpdateActivity = async () => {
    if (!activityId.trim()) {
      setStatusMessage("Please select an Activity ID to update.");
      return;
    }

    const preparedData = {};

    if (formData.title) preparedData.title = formData.title;
    if (formData.budget) preparedData.budget = formData.budget;
    if (formData.date) preparedData.date = formData.date;
    if (formData.time) preparedData.time = formData.time;
    if (formData.location) preparedData.location = formData.location;
    if (formData.category) preparedData.category = formData.category;
    if (formData.special_discount)
      preparedData.special_discount = formData.special_discount;
    if (formData.booking_open !== undefined)
      preparedData.booking_open = formData.booking_open;
    if (formData.tags)
      preparedData.tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

    if (Object.keys(preparedData).length === 0) {
      setStatusMessage("Please fill in at least one field to update.");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/updateactivity/${activityId}`, preparedData);
      setStatusMessage("Activity updated successfully!");
      getActivities();
    } catch (error) {
      console.error("Error updating activity:", error);
      setStatusMessage("Error updating activity. Please try again.");
    }
  };

  const handleDeleteActivity = async () => {
    if (!activityId.trim()) {
      setStatusMessage("Please select an Activity ID to delete.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/deleteactivity/${activityId}`);
      setStatusMessage("Activity deleted successfully!");
      getActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      setStatusMessage("Error deleting activity. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      budget: "",
      date: "",
      time: "",
      location: "",
      category: "",
      special_discount: "",
      booking_open: true,
      tags: "",
    });
    setActivityId("");
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Budget", dataIndex: "budget", key: "budget" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Special Discount", dataIndex: "special_discount", key: "special_discount" },
    { title: "Booking Open", dataIndex: "booking_open", key: "booking_open", render: (text) => (text ? "Yes" : "No") },
    { title: "Tags", dataIndex: "tags", key: "tags", render: (tags) => tags?.join(", ") || "N/A" },
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", fontSize: "16px" }}>
      <Card
        title={<Title level={2}>Create Activity</Title>}
        style={{ marginBottom: "30px", padding: "30px", borderRadius: "10px", boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)" }}
      >
        <form onSubmit={handleSubmit} style={{ fontSize: "16px" }}>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
            required
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location (Address)"
            required
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category ID"
            required
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Input
            type="text"
            name="special_discount"
            value={formData.special_discount}
            onChange={handleChange}
            placeholder="Special Discount"
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Checkbox
            name="booking_open"
            checked={formData.booking_open}
            onChange={handleChange}
            style={{ marginBottom: "15px", fontSize: "16px" }}
          >
            Booking Open
          </Checkbox>
          <Input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
            style={{ marginBottom: "15px", fontSize: "16px", padding: "10px" }}
          />
          <Select
            value={activityId}
            onChange={(value) => setActivityId(value)}
            style={{ width: "100%", marginBottom: "15px", fontSize: "16px" }}
            placeholder="Select Activity to Update/Delete"
          >
            <Select.Option value="">Select an Activity</Select.Option>
            {activities.map((activity) => (
              <Select.Option key={activity._id} value={activity._id}>
                {activity.title} (ID: {activity._id})
              </Select.Option>
            ))}
          </Select>
          <Button type="primary" htmlType="submit" style={{ marginTop: 15, marginRight: 15, fontSize: "16px" }}>
            Add Activity
          </Button>
          <Button type="default" onClick={handleUpdateActivity} style={{ marginTop: 15, marginRight: 15, fontSize: "16px" }}>
            Update Activity
          </Button>
          <Button type="danger" onClick={handleDeleteActivity} style={{ marginTop: 15, fontSize: "16px" }}>
            Delete Activity
          </Button>
        </form>
      </Card>

      {statusMessage && (
        <Alert
          message={statusMessage}
          type={statusMessage.includes("Error") ? "error" : "success"}
          style={{ marginTop: 20 }}
        />
      )}

      <Button onClick={getActivities} style={{ marginTop: 20, fontSize: "16px" }}>
        Get Activities
      </Button>

      {isFetchingActivities ? (
        <Spin tip="Loading activities..." />
      ) : activitiesFetched && activities.length > 0 ? (
        <Table
          columns={columns}
          dataSource={activities}
          rowKey={(record) => record._id}
          pagination={false}
          style={{ marginTop: 30 }}
        />
      ) : (
        <Text>No activities found.</Text>
      )}
    </div>
  );
};

export default ActivityForm;
