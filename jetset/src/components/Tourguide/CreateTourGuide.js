import React, { useState } from "react";
import axios from "axios";

const CreateTourGuideProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    mobile_number: "",
    years_of_experience: "",
    previous_work: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/TourGuideProfile",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.msg);
      // Optionally reset the form or redirect the user
      setFormData({
        username: "",
        password: "",
        email: "",
        mobile_number: "",
        years_of_experience: "",
        previous_work: "",
        image: null,
      });
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
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Years of Experience:</label>
          <input
            type="number"
            name="years_of_experience"
            value={formData.years_of_experience}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Previous Work:</label>
          <textarea
            name="previous_work"
            value={formData.previous_work}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Profile Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
};

export default CreateTourGuideProfile;
