import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import TourismGovernorNav from "./TourismGovernorNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faMapMarkerAlt,
  faTags,
  faTheaterMasks,
  faRoute,
  faKey,
  faSignOutAlt,
  faCompass,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

function PlaceManagement() {
  const { tourismGovernorId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchTourismGovernor = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/getTourismbyId/${tourismGovernorId}`
      );
      setUsername(response.data.username);
      setError("");
    } catch (err) {
      setError("Error retrieving Tourism Governor username.");
      setUsername("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourismGovernor();
  }, [tourismGovernorId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: faTachometerAlt,
      action: () => setCurrentSection("dashboard"),
    },
    {
      key: "places",
      label: "Places",
      icon: faMapMarkerAlt,
      action: () => navigate("/places"),
    },
    {
      key: "tags",
      label: "Tags",
      icon: faTags,
      action: () => navigate("/tags"),
    },
    {
      key: "activities",
      label: "Activities",
      icon: faTheaterMasks,
      action: () => navigate("/activities"),
    },
    {
      key: "itineraries",
      label: "Itineraries",
      icon: faRoute,
      action: () => navigate("/itineraries"),
    },
    {
      key: "changePassword",
      label: "Change Password",
      icon: faKey,
      action: () => navigate("/changepass"),
    },
  ];

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
              <span className="sidebar-brand-role">Governor Panel</span>
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
              className={`sidebar-link${currentSection === item.key ? " active" : ""}`}
              onClick={() => {
                item.action();
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
              {username ? username.charAt(0).toUpperCase() : "G"}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{username || "Governor"}</span>
              <span className="sidebar-user-role">Tourism Governor</span>
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
        <header className="content-header" style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <TourismGovernorNav />
        </header>
        <div style={{ padding: "24px 0" }} className="fade-in">
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : error ? (
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
          ) : (
            <div className="card slide-up">
              <h1 style={{ fontSize: "1.5rem", marginBottom: "8px", color: "var(--color-ink)" }}>
                Welcome, {username || "Governor"}!
              </h1>
              <p className="text-muted">
                Use the sidebar to navigate through place management options.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default PlaceManagement;
