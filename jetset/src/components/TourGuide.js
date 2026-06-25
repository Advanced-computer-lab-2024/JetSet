import React, { useState, useEffect } from "react";
import axios from "axios";
import ItineraryList from "./Itinerary/ItinerariesList.js";
import TourGuideProfileForm from "./Tourguide/TourGuideProfileForm.js";
import ReadTourGuideProfileForm from "./Tourguide/ReadTourGuideProfileForm.js";
import CreateItineraryForm from "./Itinerary/CreateItineraryForm.js";
import UpdateItineraryForm from "./Itinerary/UpdateItineraryForm.js";
import DeleteItineraryForm from "./Itinerary/DeleteItineraryForm.js";
import ViewCreatedItineraries from "./Itinerary/ViewCreatedItineraries.js";
import Activate from "./Tourguide/Activate";
import Deactivate from "./Tourguide/Deactivate";
import ChangePasswordForm from "./Tourguide/ChangePasswordForm.js";
import DeleteAccount from "./Tourguide/DeleteAccount.js";
import TourGuideSalesReport from "./Reports/TourGuideSalesReport.js";
import TourGuideReport from "./Reports/TourGuideTouristReport.js";
import NavTourGuide from "./Tourguide/navTourguide.js";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMap,
  faListAlt,
  faPlusCircle,
  faChartLine,
  faChartPie,
  faUser,
  faKey,
  faTrashAlt,
  faSignOutAlt,
  faCompass,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function TourGuide() {
  const { tourGuideID } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState("itineraries");
  const [itineraryID, setItineraryID] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`/TourGuideProfile/${tourGuideID}`);
        setUsername(response.data.username);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching username");
      }
    };
    fetchUsername();
  }, [tourGuideID]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `/notification?recipient=${username}&role=Tour Guide`
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        // Notifications fetch failed silently
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [username]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    { key: "itineraries", label: "All Itineraries", icon: faMap },
    { key: "ViewCreatedItineraries", label: "My Itineraries", icon: faListAlt },
    { key: "createItinerary", label: "New Itinerary", icon: faPlusCircle },
    { key: "salesReport", label: "Sales Report", icon: faChartLine },
    { key: "touristReport", label: "Tourist Report", icon: faChartPie },
    { key: "readtourGuideProfile", label: "My Profile", icon: faUser },
    { key: "ChangePassword", label: "Change Password", icon: faKey },
    { key: "deleteAcc", label: "Delete Account", icon: faTrashAlt },
  ];

  const renderContent = () => {
    switch (view) {
      case "salesReport":
        return <TourGuideSalesReport tourGuideID={tourGuideID} />;
      case "touristReport":
        return <TourGuideReport tourGuideID={tourGuideID} />;
      case "itineraries":
        return <ItineraryList />;
      case "ViewCreatedItineraries":
        return (
          <ViewCreatedItineraries
            id={tourGuideID}
            onEdit={(itineraryId) => {
              setItineraryID(itineraryId);
              setView("updateItinerary");
            }}
          />
        );
      case "tourGuideProfile":
        return <TourGuideProfileForm tourGuideID={tourGuideID} />;
      case "readtourGuideProfile":
        return <ReadTourGuideProfileForm tourGuideID={tourGuideID} />;
      case "createItinerary":
        return <CreateItineraryForm tourguideId={tourGuideID} />;
      case "updateItinerary":
        return <UpdateItineraryForm itineraryID={itineraryID} />;
      case "ChangePassword":
        return <ChangePasswordForm tourGuideID={tourGuideID} />;
      case "deleteAcc":
        return <DeleteAccount tourguideId={tourGuideID} />;
      default:
        return <ItineraryList />;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <FontAwesomeIcon icon={faCompass} className="sidebar-brand-icon" />
            <div>
              <span className="sidebar-brand-name">JetSet</span>
              <span className="sidebar-brand-role">Tour Guide</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar-link${view === item.key ? " active" : ""}`}
              onClick={() => {
                setView(item.key);
                setSidebarOpen(false);
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="sidebar-link-icon" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {username ? username.charAt(0).toUpperCase() : "T"}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{username || "Tour Guide"}</span>
              <span className="sidebar-user-role">Guide Partner</span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="content-header">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <NavTourGuide
            username={username}
            tourGuideId={tourGuideID}
            onEdit={() => setView("readtourGuideProfile")}
          />
        </header>
        <div style={{ padding: "24px 0" }}>
          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#b91c1c",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}
          <div className="fade-in">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
}

export default TourGuide;
