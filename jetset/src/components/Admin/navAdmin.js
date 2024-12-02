import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Admin = ({ adminUsername }) => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  //const [adminUsername, setAdminUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState();
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const notifications = await axios.get(
        `http://localhost:3000/unread?recipient=${adminUsername}&role=Admin`
      ); // Example API
      setUnreadCount(notifications.data.unreadCount);
      console.log(notifications.data.unreadCount);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!adminUsername) return; // Wait until username is set
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/notification?recipient=${adminUsername}&role=Admin`
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [adminUsername]);

  const toggleProfileMenu = () => {
    setProfileMenuVisible((prev) => !prev);
  };

  const handleGetProfile = () => {
    navigate(`/admin/change-password/${adminId}`);
  };

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // New function to handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="admin-frontend">
      <header>
        <nav className="navbar">
          <div className="navbar-left" onClick={handleBack}>
            <i className="back-icon">←</i>{" "}
          </div>
          <div className="navbar-right">
            <div className="notifications" onClick={toggleNotifications}>
              <i className="notification-icon">🔔</i>
              <span className="notification-count">{unreadCount}</span>
            </div>
            <div className="admin-info">
              <span className="username">Welcome, {adminUsername}</span>
              <div className="profile-icon" onClick={toggleProfileMenu}>
                👤
              </div>
              {profileMenuVisible && (
                <div className="profile-menu">
                  <button onClick={handleGetProfile}>My Profile</button>
                  <button onClick={handleLogOut}>Log Out</button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {showNotifications && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading && <p>Loading notifications...</p>}
          {!loading && !error && notifications.length === 0 && (
            <p>No notifications found.</p>
          )}
          {!loading && !error && notifications.length > 0 && (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>
                  <p>{notification.message}</p>
                  <p>
                    <small>
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
