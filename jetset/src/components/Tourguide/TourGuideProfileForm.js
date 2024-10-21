import React, { useState } from "react";
import axios from "axios";

const TourGuideProfileForm = ({ tourGuideID }) => {
  const [formData, setFormData] = useState({
    mobile_number: "",
    years_of_experience: "",
    previous_work: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/TourGuideProfile`,
        formData
      );
      setMessage(response.data.msg);
      setError(""); // Clear any previous error
    } catch (err) {
      console.log(err); // Add this line to check the actual error
      setError(
        err.response?.data?.message ||
          "An error occurred while updating the profile."
      );
      setMessage(""); // Clear success message
    }
  };

  return (
    <div>
      <h2>Create and Update Tour Guide Profile</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mobile Number:</label>
          <input
            type="text"
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TourGuideProfileForm;
