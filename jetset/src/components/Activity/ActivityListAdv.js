import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faTag,
  faList,
  faClipboardList,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import TourismGovernorNav from "../TourismGovernorNav";

import { Button, Table, Spin, Alert, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
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
    <div className="admin-frontend">
          <TourismGovernorNav  />

      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <ul>
            <li onClick={() => navigate("/changemainTourismG")}>🏠 Dashboard</li>
            <li onClick={() => navigate("/places")}>📍 Places</li>
            <li onClick={() => navigate("/tags")}>🏷️ Tags</li>
            <li onClick={() => navigate("/activities")}>🎭 Activities</li>
            <li onClick={() => navigate("/itineraries")}>📜 Itineraries</li>
            {/* <li onClick={() => navigate("/changepass")}>🔑 Change Password</li> */}
          </ul>
        </aside>

        <main className="admin-main-content">
          <div className="activities-list-container">
            <h3>Activities List</h3>
            
            <button onClick={getActivities}>Get Activities</button>
            {/* <button className="back-button" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button> */}
            
            {isFetchingActivities ? (
              <p>Loading activities...</p>
            ) : activitiesFetched && activities.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Budget</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Category</th>
                    <th>Special Discount</th>
                    <th>Booking Open</th>
                    <th>Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity._id}>
                      <td>{activity.title || "N/A"}</td>
                      <td>{activity.budget || "N/A"}</td>
                      <td>{activity.date || "N/A"}</td>
                      <td>{activity.time || "N/A"}</td>
                      <td>{activity.location?.coordinates?.lat || "N/A"}</td>
                      <td>{activity.location?.coordinates?.lng || "N/A"}</td>
                      <td>{activity.category || "N/A"}</td>
                      <td>{activity.specialDiscount || "N/A"}</td>
                      <td>{activity.bookingOpen ? "Yes" : "No"}</td>
                      <td>{activity.tags?.join(", ") || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              activitiesFetched && <p>No activities available.</p>
            )}

            {/* {statusMessage && <p>{statusMessage}</p>} */}
          </div>
        </main>
      </div>

    </div>
  );
};

export default ActivitiesList;
