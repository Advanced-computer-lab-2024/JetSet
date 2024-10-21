// components/CreateTourGuide.js
import React, { useState } from "react";
import axios from "axios";

const CreateTourGuide = () => {
  const [formData, setFormData] = useState({
    mobile_number: "",
    years_of_experience: "",
    previous_work: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tour-guides", formData);
      alert("Tour Guide created successfully");
    } catch (error) {
      console.error(error);
      alert("Error creating Tour Guide");
    }
  };

  return (
    <div>
      <h2>Create Tour Guide</h2>
      <form onSubmit={handleSubmit}>
        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
        />
        <label>Years of Experience:</label>
        <input
          type="text"
          name="years_of_experience"
          value={formData.years_of_experience}
          onChange={handleChange}
        />
        <label>Previous Work:</label>
        <textarea
          name="previous_work"
          value={formData.previous_work}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateTourGuide;
