import React, { useState, useEffect } from "react";
import axios from "axios";
import ActivityForm from "../Activity/ActivityProfileAdv"; // Import ActivityForm
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccount from "./DeleteAccount";

const ProfileForm = ({ onProfileCreated }) => {
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3000";

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    company_name: "",
    website: "",
    hotline: "",
    companyDescription: "",
  });

  const id = "6701a375077eb6e57b56802f";
  const [advertiser, setAdvertiser] = useState(null); // State to hold advertiser data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null);

  const [statusMessage, setStatusMessage] = useState(""); // For success/error messages
  const [profileId, setProfileId] = useState(""); // For profile ID if needed for update/delete
  const [profiles, setProfiles] = useState([]); // State to store profiles
  const [isFetchingProfiles, setIsFetchingProfiles] = useState(false); // State to indicate fetching
  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState(null); // For selected advertiser ID
  const [showChangePassword, setShowChangePassword] = useState(false); // State to toggle ChangePasswordForm

  // Fetch profiles when the component mounts
  useEffect(() => {
    getProfiles();
  }, []);

  const getProfiles = async () => {
    setIsFetchingProfiles(true);
    try {
      const response = await axios.get(`${BASE_URL}/profiles`);
      console.log("Fetched profiles:", response.data); // Log the fetched data
      setProfiles(response.data);
      setStatusMessage("Profiles fetched successfully!");
    } catch (error) {
      console.error(
        "Error fetching profiles:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setIsFetchingProfiles(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);

    try {
      const response = await axios.post(`${BASE_URL}/addprofiles`, formData);
      console.log("API Response:", response);

      if (response.status === 201) {
        onProfileCreated(response.data);
        setStatusMessage("Profile created successfully!");
        resetForm(); // Reset form data
        getProfiles(); // Refresh profiles after adding
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatusMessage("Profile created successfully");
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileId) {
      setStatusMessage("Please enter a profile ID to update.");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/updateprofiles/${profileId}`,
        formData
      );
      console.log("Update Profile Response:", response.data);
      setStatusMessage("Profile updated successfully!");
      getProfiles(); // Refresh profiles after updating
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatusMessage("Error updating profile.");
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      company_name: "",
      website: "",
      hotline: "",
      companyDescription: "",
    });
    setProfileId(""); // Reset profile ID if needed
    setSelectedAdvertiserId(null); // Reset selected advertiser ID
  };

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/getAdv/${id}`); // Adjust the API endpoint as needed
        setAdvertiser(response.data.adv); // Assuming your response is structured like this
      } catch (err) {
        setError(
          err.response
            ? err.response.data.message
            : "Error fetching advertiser profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertiser();
  }, []);

  if (loading) return <p>Loading...</p>; // Show loading state
  if (error) return <p>Error: {error}</p>; // Show error message if any

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Create Profile</h3>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="Company Name"
          required
        />
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="Website"
        />
        <input
          type="text"
          name="hotline"
          value={formData.hotline}
          onChange={handleChange}
          placeholder="Hotline"
        />
        <textarea
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleChange}
          placeholder="Company Description"
        ></textarea>
        <button type="submit">Add Profile</button>
        <button type="button" onClick={handleUpdateProfile}>
          Update Profile
        </button>
        <input
          type="text"
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          placeholder="Profile ID"
        />
        {statusMessage && <p>{statusMessage}</p>}
      </form>

      {/* Display the list of profiles */}
      <div>
        <h1>Advertiser Profile</h1>
        {advertiser ? (
          <div>
            <h2>{advertiser.username}</h2> {/* Displaying username */}
            <p>Email: {advertiser.email}</p> {/* Displaying email */}
            <p>Company Name: {advertiser.company_name}</p>{" "}
            {/* Displaying company name */}
            <p>
              Website:{" "}
              <a
                href={advertiser.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {advertiser.website}
              </a>
            </p>{" "}
            {/* Displaying website */}
            <p>Hotline: {advertiser.hotline}</p> {/* Displaying hotline */}
            <p>Company Description: {advertiser.companyDescription}</p>{" "}
            {/* Displaying company description */}
          </div>
        ) : (
          <div>No advertiser found.</div>
        )}
      </div>

      {/* Integrate ActivityForm component */}
      <ActivityForm
        onActivityCreated={(activity) => {
          console.log("Activity created:", activity);
        }}
      />

      {/* Button to toggle ChangePasswordForm */}
      <button onClick={() => setShowChangePassword(!showChangePassword)}>
        {showChangePassword ? "Hide Change Password" : "Change Password"}
      </button>

      {/* Conditionally render the ChangePasswordForm */}
      {showChangePassword && <ChangePasswordForm />}

    <DeleteAccount advertiserId="6707bb596d08e5f1f78e31f1" />

    </div>
  );
};

export default ProfileForm;
