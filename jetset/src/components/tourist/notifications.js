import React, { useEffect, useState } from "react";
import { List, Card, Spin, Alert, Typography, Badge } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavTourist from "./navTourist";
const { Text } = Typography;

const Notifications = () => {
  const { touristId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchTourist = async () => {
      if (touristId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/getTourist/${touristId}`
          );
          setUsername(response.data.username);
        } catch (error) {
          console.error("Error during fetch:", error);
          alert(
            error.response?.data?.message || "Error fetching tourist profile"
          );
        }
      }
    };
    fetchTourist();
  }, [touristId]);

  useEffect(() => {
    if (username) {
      const fetchNotifications = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3000/notification?recipient=${username}&role=Tourist`
          );
          setNotifications(response.data.notifications);
        } catch (err) {
          setError(
            err.response?.data?.message || "Error fetching notifications"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
    }
  }, [username]);

  const handleNotificationClick = async (id) => {
    try {
      // Mark notification as read in the backend
      await axios.put(`http://localhost:3000/read/${id}`);

      // Update the notification list by setting the selected one to read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setSelectedNotification(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <NavTourist touristId={touristId} username={username} />
      <Card
        title="Notifications"
        bordered
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        {loading && (
          <Spin tip="Loading notifications..." style={{ display: "block" }} />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginBottom: "20px" }}
          />
        )}

        {!loading && !error && notifications.length === 0 && (
          <Text>No notifications available.</Text>
        )}

        {!loading && !error && notifications.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedNotification === item._id ? "#e8f5e9" : "#ffffff",
                  transition: "background-color 0.3s ease",
                  boxShadow:
                    selectedNotification === item._id
                      ? "0 2px 4px rgba(0, 128, 0, 0.3)"
                      : "none",
                }}
                onClick={() => handleNotificationClick(item._id)}
              >
                <List.Item.Meta
                  title={
                    <Badge
                      count={item.read ? 0 : 1} // Show a red dot for unread notifications
                      style={{
                        backgroundColor: item.read ? "#52c41a" : "#f5222d", // Green for read, red for unread
                      }}
                    />
                  }
                  description={item.message || "No additional details."}
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Notifications;
