import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./navLogin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faChevronLeft,
  faSignOutAlt,
  faKey,
} from "@fortawesome/free-solid-svg-icons";

const Admin = ({ adminUsername }) => {
  const navigate = useNavigate();
  const { adminId } = useParams();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (adminUsername) {
      const fetchData = async () => {
        const notifications = await axios.get(
          `http://localhost:3000/unread?recipient=${adminUsername}&role=Admin`
        );
        setUnreadCount(notifications.data.unreadCount);
      };

      fetchData();
    }
  }, [adminUsername]);

  useEffect(() => {
    if (adminUsername) {
      const fetchNotifications = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:3000/notification?recipient=${adminUsername}&role=Admin`
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="admin-frontend">
      <header>
        <nav className="navbar">
          <div className="navbar-left" onClick={handleBack}>
            <FontAwesomeIcon icon={faChevronLeft} className="back-icon" />
          </div>
          <div className="navbar-center">
            <span className="app-title">Admin Dashboard</span>
          </div>
          <div className="navbar-right">
            <div className="notifications" onClick={toggleNotifications}>
              <FontAwesomeIcon icon={faBell} className="notification-icon" />
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </div>
            <div className="admin-info">
              <span className="username">Hi, {adminUsername}</span>
              <FontAwesomeIcon
                icon={faUser}
                className="profile-icon"
                onClick={toggleProfileMenu}
              />
              {profileMenuVisible && (
                <div className="profile-menu">
                  <button onClick={handleGetProfile}>
                    <FontAwesomeIcon icon={faKey} className="menu-icon" />
                    My Profile
                  </button>
                  <button onClick={handleLogOut}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="menu-icon"
                    />
                    Log Out
                  </button>
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
                <li key={index} className="notification-item">
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
