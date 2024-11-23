import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import PlaceList from "./Place/PlaceList";
import PlaceForm from "./Place/PlaceForm";
import TagForm from "./Tag/TagForm";
import ActivitiesList from "./Activity/ActivityListAdv";
import ItineraryList from "./Itinerary/ItinerariesList";
import ChangePasswordForm from "./Place/ChangePasswordForm";
import { useParams } from "react-router-dom";

const PlaceManagement = () => {
  const { tourismGovernorId } = useParams();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div>
      <section>
        <h1>
          Welcome, <strong>{username || "Loading..."}</strong>
        </h1>
      </section>
      <h1>Place Management</h1>
      <PlaceForm />
      <PlaceList />
      <h1>Create Tag</h1>
      <TagForm />
      <ActivitiesList />
      <ItineraryList />
      <h1>Change Password</h1>
      <ChangePasswordForm />
    </div>
  );
};

export default PlaceManagement;
