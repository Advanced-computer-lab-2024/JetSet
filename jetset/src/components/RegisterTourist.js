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
      alert(response.data.msg);
      navigate("/tourist");
    } catch (error) {
      alert(error.response.data.error);
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
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        onChange={handleChange}
      />
      <input
        type="text"
        name="nationality"
        placeholder="Nationality"
        onChange={handleChange}
      />
      <input type="date" name="dob" placeholder="DOB" onChange={handleChange} />
      <input type="text" name="job" placeholder="Job" onChange={handleChange} />
      <button type="submit">Create Tourist</button>
    </form>
  );
};

export default TouristForm;
