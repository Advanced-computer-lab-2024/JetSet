

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faHome,
  faTag,
  faList,
  faClipboardList,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
// import PlaceList from "./Place/PlaceList";
// import PlaceForm from "./Place/PlaceForm";
// import TagForm from "./Tag/TagForm";
// import ActivitiesList from "./Activity/ActivityListAdv";
// import ItineraryList from "./Itinerary/ItinerariesList";
// import ChangePasswordForm from "./Place/ChangePasswordForm";

const PlaceManagement = () => {
  const { tourismGovernorId } = useParams();
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("");

  const fetchTourismGovernor = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getTourismbyId/${tourismGovernorId}`
      );
      setUsername(response.data.username);
      setError("");
    } catch (err) {
      setError("Error retrieving Tourism Governor username.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTourismGovernor();
  }, []);

return (
  <div className="place-management">
  
    <section>
      <h1>
        Welcome, <strong>{username || "Loading..."}</strong>
      </h1>
    </section>
    <h2>
      <FontAwesomeIcon icon={faHome} /> Place Management
    </h2>
    <button onClick={() => navigate("/add-place")}>Add a Place</button>
    <button onClick={() => navigate("/places")}>Manage Places</button>
    <h2>
      <FontAwesomeIcon icon={faTag} /> Tags
    </h2>
    <button onClick={() => navigate("/tags")}>Add New Tag</button>
    <h2>
      <FontAwesomeIcon icon={faClipboardList} /> Activities
    </h2>
    <button onClick={() => navigate("/activities")}>View Activities</button>
    <h2>
      <FontAwesomeIcon icon={faList} /> Itineraries
    </h2>
    <button onClick={() => navigate("/itineraries")}>View Itineraries</button>
    <h2>
      <FontAwesomeIcon icon={faKey} /> Change Password
    </h2>
    <button onClick={() => navigate("/changepass")}>Change Password</button>
         <button className="back-button" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} /> Back
    </button>
    </div> 
);
};

export default PlaceManagement;
