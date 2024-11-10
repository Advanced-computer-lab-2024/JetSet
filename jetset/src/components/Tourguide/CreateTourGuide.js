import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTourGuideProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username = "", password = "", email = "" } = location.state || {};

  const [mobile_number, setMobile] = useState("");
  const [years_of_experience, setYears] = useState("");
  const [previous_work, setWork] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages(e.target.files); // Store the selected files
  };

  // Define the handleChange function to update state based on input name
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "mobile_number":
        setMobile(value);
        break;
      case "years_of_experience":
        setYears(value);
        break;
      case "previous_work":
        setWork(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("mobile_number", mobile_number);
    formData.append("years_of_experience", years_of_experience);
    formData.append("previous_work", previous_work);
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/TourGuideProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.msg);
      const newTourGuideId = response.data.user._id;
      navigate(`/tourguide/${newTourGuideId}`); // Navigate to TourGuideFrontend with the new ID
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Create Tour Guide Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="mobile_number"
            value={mobile_number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Years of Experience:</label>
          <input
            type="number"
            name="years_of_experience"
            value={years_of_experience}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Previous Work:</label>
          <textarea
            name="previous_work"
            value={previous_work}
            onChange={handleChange}
          />
        </div>
        {/* <div>
          <label>Profile Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div> */}
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateTourGuideProfile;
