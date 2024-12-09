import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TouristForm = () => {
  const navigate = useNavigate();
  const [tourist, setTourist] = useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
    nationality: "",
    dob: "",
    job: "",
  });

  const handleChange = (e) => {
    setTourist({ ...tourist, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/addTourist", tourist);
      alert(response.data.msg); // Show success message
      // Navigate to the Tourist component after registration
      navigate(`/tourist`, { state: { touristId: response.data.touristId } });
      console.log(response.data.touristId);
    } catch (error) {
      alert(error.response.data.error); // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Tourist</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="nationality"
        placeholder="Nationality"
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="dob"
        placeholder="DOB"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="job"
        placeholder="Job"
        onChange={handleChange}
        required
      />
      <button type="submit">Create Tourist</button>
    </form>
  );
};

export default TouristForm;
