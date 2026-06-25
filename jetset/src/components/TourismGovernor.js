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
} from "@fortawesome/free-solid-svg-icons";

function PlaceManagement() {
  const { tourismGovernorId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState("dashboard");

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
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FontAwesomeIcon
              icon={faCompass}
              style={{ fontSize: "1.5rem", color: "var(--color-primary-strong)" }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-ink)" }}>
                JetSet
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-muted)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Governor Panel
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`sidebar-link${currentSection === item.key ? " active" : ""}`}
              onClick={item.action}
            >
              <FontAwesomeIcon icon={item.icon} style={{ width: "18px" }} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: "16px 20px",
            borderTop: "1px solid var(--color-line)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-primary-strong)",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              {username ? username.charAt(0).toUpperCase() : "G"}
            </div>
            <span style={{ fontSize: "0.9rem", color: "var(--color-ink)", fontWeight: 500 }}>
              {username || "Governor"}
            </span>
          </div>
          <button
            className="sidebar-link"
            onClick={handleLogout}
            style={{ color: "var(--color-danger)" }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={{ width: "18px" }} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <TourismGovernorNav />
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
