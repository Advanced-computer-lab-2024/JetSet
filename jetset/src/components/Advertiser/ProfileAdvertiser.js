import React, { useState, useEffect } from "react";
import axios from "axios";
import ActivityForm from "../Activity/ActivityProfileAdv";
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
    image: null,
  });

  const id = "6701a52d077eb6e57b568035";
  const [advertiser, setAdvertiser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false); // State to toggle ChangePasswordForm

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/addprofiles`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        onProfileCreated(response.data);
        setStatusMessage("Profile created successfully!");
        resetForm();
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatusMessage("Error creating profile.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Create a FormData object to hold the updated fields and image
    const formDataToSend = new FormData();

    // Only append fields that have been changed and are not empty
    if (formData.email) formDataToSend.append("email", formData.email);
    if (formData.username) formDataToSend.append("username", formData.username);
    if (formData.password) formDataToSend.append("password", formData.password);
    if (formData.company_name)
      formDataToSend.append("company_name", formData.company_name);
    if (formData.website) formDataToSend.append("website", formData.website);
    if (formData.hotline) formDataToSend.append("hotline", formData.hotline);
    if (formData.companyDescription)
      formDataToSend.append("companyDescription", formData.companyDescription);
    if (formData.image) formDataToSend.append("image", formData.image); // Append the image if it exists

    try {
      const response = await axios.put(
        `${BASE_URL}/updateprofiles/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data); // Log response data for debugging
      setStatusMessage("Profile updated successfully!");
      setAdvertiser(response.data); // Update advertiser with the response data
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
      image: null,
    });
  };

  useEffect(() => {
    const fetchAdvertiser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getAdv/${id}`);
        setAdvertiser(response.data.adv);
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
  }, [BASE_URL, id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Create Profile</h3>
        {/* Input fields */}
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
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />
        {formData.image && (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Uploaded Preview"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        )}
        <button type="submit">Add Profile</button>
        <button type="button" onClick={handleUpdateProfile}>
          Update Profile
        </button>
        {statusMessage && <p>{statusMessage}</p>}
      </form>

      <div>
        <h1>Advertiser Profile</h1>
        {advertiser ? (
          <div>
            {advertiser.images && advertiser.images.length > 0 && (
              <img
                src={`http://localhost:3000/uploads/${advertiser.images}`}
                alt={`${advertiser.username} Profile`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
            <h2>{advertiser.username}</h2>
            <p>Email: {advertiser.email}</p>
            <p>Company Name: {advertiser.company_name}</p>
            <p>
              Website:{" "}
              <a
                href={advertiser.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {advertiser.website}
              </a>
            </p>
            <p>Hotline: {advertiser.hotline}</p>
            <p>Company Description: {advertiser.companyDescription}</p>
          </div>
        ) : (
          <div>No advertiser found.</div>
        )}
      </div>

      <ActivityForm
        onActivityCreated={(activity) =>
          console.log("Activity created:", activity)
        }
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
