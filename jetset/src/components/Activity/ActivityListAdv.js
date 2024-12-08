import React, { useState } from "react";
import axios from "axios";
import { Button, Table, Spin, Alert, Card, Typography } from "antd";

const { Title, Text } = Typography;

const ActivitiesList = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

  const [activities, setActivities] = useState([]);
  const [isFetchingActivities, setIsFetchingActivities] = useState(false);
  const [activitiesFetched, setActivitiesFetched] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

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

  // Define columns for Ant Design's Table component
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => text || "N/A",
    },
    {
      title: "Budget",
      dataIndex: "budget",
      key: "budget",
      render: (text) => text || "N/A",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => text || "N/A",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text) => text || "N/A",
    },
    {
      title: "Latitude",
      dataIndex: "location",
      key: "latitude",
      render: (location) => location?.coordinates?.lat || "N/A",
    },
    {
      title: "Longitude",
      dataIndex: "location",
      key: "longitude",
      render: (location) => location?.coordinates?.lng || "N/A",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => text || "N/A",
    },
    {
      title: "Special Discount",
      dataIndex: "specialDiscount",
      key: "specialDiscount",
      render: (text) => text || "N/A",
    },
    {
      title: "Booking Open",
      dataIndex: "bookingOpen",
      key: "bookingOpen",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (tags && tags.length > 0 ? tags.join(", ") : "N/A"),
    },
  ];

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", fontSize: "16px" }}>
      <Card
        title={<Title level={2}>Activities List</Title>}
        style={{
          marginBottom: "30px",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Button
          type="primary"
          onClick={getActivities}
          loading={isFetchingActivities}
          style={{ marginBottom: "20px", fontSize: "16px" }}
        >
          Get Activities
        </Button>

        {isFetchingActivities ? (
          <Spin tip="Loading activities..." />
        ) : activitiesFetched && activities.length > 0 ? (
          <Table
            columns={columns}
            dataSource={activities}
            rowKey={(record) => record._id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
            }}
            style={{ marginTop: "20px" }}
          />
        ) : (
          activitiesFetched && (
            <Alert
              message="No activities available"
              type="info"
              style={{ marginTop: "20px" }}
            />
          )
        )}

        {statusMessage && (
          <Alert
            message={statusMessage}
            type={statusMessage.includes("Error") ? "error" : "success"}
            style={{ marginTop: "20px" }}
          />
        )}
      </Card>
    </div>
    
  );
};

export default ActivitiesList;
