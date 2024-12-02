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
import { useParams } from "react-router-dom";

function TourGuide() {
  const { tourGuideID } = useParams();
  const [view, setView] = useState("itineraries");
  const [itineraryID, setItineraryID] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  // Fetch the username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`/TourGuideProfile/${tourGuideID}`);
        setUsername(response.data.username); // Set the fetched username
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching username");
      }
    };

    fetchUsername();
  }, [tourGuideID]);

  // Fetch notifications after the username is available
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) return; // Wait until username is set
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/notification?recipient=${username}&role=Tour Guide`
        );
        setNotifications(response.data.notifications);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [username]); // Run this effect when the username changes

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome, {username || "Tour Guide"}!</h1>{" "}
        {/* Display the username */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <h1>Itinerary App</h1>
        <nav>
          <button onClick={() => setView("itineraries")}>
            View Itineraries
          </button>
          <button onClick={() => setView("tourGuideProfile")}>
            Create and Update Tour Guide Profile
          </button>
          <button onClick={() => setView("readtourGuideProfile")}>
            My Profile
          </button>
          <button onClick={() => setView("createItinerary")}>
            Create Itinerary
          </button>
          <button onClick={() => setView("updateItinerary")}>
            Update Itinerary
          </button>
          <button onClick={() => setView("deleteItinerary")}>
            Delete Itinerary
          </button>
          <button onClick={() => setView("ViewCreatedItineraries")}>
            View My Created Itineraries
          </button>
          <button onClick={() => setView("activate")}>
            Activate Itinerary
          </button>
          <button onClick={() => setView("deactivate")}>
            Deactivate Itinerary
          </button>
          <button onClick={() => setView("ChangePassword")}>
            Change Password
          </button>
          <button onClick={() => setView("deleteAcc")}>
            Delete my account
          </button>
          <button onClick={() => setView("notifications")}>
            View Notifications
          </button>
        </nav>
        {/* Input for itinerary ID */}
        {(view === "activate" || view === "deactivate") && (
          <div>
            <input
              type="text"
              placeholder="Enter Itinerary ID"
              value={itineraryID}
              onChange={(e) => setItineraryID(e.target.value)}
            />
          </div>
        )}
        {/* Conditional rendering based on view */}
        {view === "itineraries" && <ItineraryList />}
        {view === "tourGuideProfile" && (
          <TourGuideProfileForm tourGuideID={tourGuideID} />
        )}
        {view === "readtourGuideProfile" && (
          <ReadTourGuideProfileForm tourGuideID={tourGuideID} />
        )}
        {view === "createItinerary" && <CreateItineraryForm />}
        {view === "updateItinerary" && (
          <UpdateItineraryForm itineraryID={itineraryID} />
        )}
        {view === "deleteItinerary" && <DeleteItineraryForm />}
        {view === "ViewCreatedItineraries" && (
          <ViewCreatedItineraries id={tourGuideID} />
        )}
        {view === "activate" && <Activate itineraryId={itineraryID} />}
        {view === "deactivate" && <Deactivate itineraryId={itineraryID} />}
        {view === "ChangePassword" && (
          <ChangePasswordForm tourGuideID={tourGuideID} />
        )}
        {view === "deleteAcc" && <DeleteAccount tourguideId={tourGuideID} />}
        {view === "notifications" && (
          <div>
            <h2>Notifications</h2>
            {loading && <p>Loading notifications...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && notifications.length === 0 && (
              <p>No notifications found.</p>
            )}
            {!loading && notifications.length > 0 && (
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
      </header>
    </div>
  );
}

export default TourGuide;
