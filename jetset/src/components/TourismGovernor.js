import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminFrontend.css"; // Apply AdminFrontend.css styling
import TourismGovernorNav from "./TourismGovernorNav";

function PlaceManagement() {
  const { tourismGovernorId } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState("dashboard");

  // Fetch Tourism Governor Data
  const fetchTourismGovernor = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/getTourismbyId/${tourismGovernorId}`
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

  // Render Content Based on Selected Section
  const renderSectionContent = () => {
    switch (currentSection) {
      case "dashboard":
        return (
          <div>

          <section>
          <h1>
            Welcome!
          </h1>
        </section>
            <p>Use the sidebar to navigate through place management options.</p>
          </div>
        );
      case "places":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/add-place")}
            >
              ➕ Add a Place
            </button>
            <button
              className="action-button"
              onClick={() => navigate("/places")}
              style={{ marginLeft: "10px" }}
            >
              🗂 Manage Places
            </button>
          </div>
        );
      case "tags":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/tags")}
            >
              ➕ Add New Tag
            </button>
          </div>
        );
      case "activities":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/activities")}
            >
              🔍 View Activities
            </button>
          </div>
        );
      case "itineraries":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/itineraries")}
            >
              📜 View Itineraries
            </button>
          </div>
        );
      case "changePassword":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/changepass")}
            >
              🔑 Change Password
            </button>
          </div>
        );
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="admin-frontend">
    <TourismGovernorNav />

      <div className="admin-container">
      {/* Sidebar */}

      <aside className="admin-sidebar">
        <ul>
        <li onClick={() =>  setCurrentSection("dashboard")}>🏠 Dashboard</li>
        <li onClick={() => navigate("/places")}>📍 Places</li>
          <li onClick={() => navigate("/tags")}>🏷️ Tags</li>
          <li  onClick={() => navigate("/activities")}>🎭 Activities</li>
          <li onClick={() => navigate("/itineraries")}>
            📜 Itineraries</li>
        
        </ul>
      </aside>

      {/* Main Content */}
      {/* <main className="admin-main-content">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          renderSectionContent()
        )}
      </main> */}
              <main className="admin-main-content">{renderSectionContent()}</main>

    </div>
    </div>
  );
}

export default PlaceManagement;
