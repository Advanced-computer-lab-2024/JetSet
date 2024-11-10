import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const location = useLocation();
  const { username = "", password = "", email = "" } = location.state || {};

  const [company_name, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [hotline, setHotline] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [images, setImages] = useState([]);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle file input change for image upload
  const handleImageChange = (e) => {
    setImages(e.target.files); // Store the selected files
  };

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "company_name") setCompany(value);
    else if (name === "website") setWebsite(value);
    else if (name === "hotline") setHotline(value);
    else if (name === "companyDescription") setCompanyDescription(value);
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("company_name", company_name);
    formData.append("website", website);
    formData.append("hotline", hotline);
    formData.append("companyDescription", companyDescription);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/addprofiles",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the request is sent with the right content type for file upload
          },
        }
      );

      // On success, navigate to the SellerFrontend or wherever needed
      console.log("Profile created successfully:", response.data);
      navigate(`/createadvertiser/${response.data._id}`); // Navigate to the profile page or another page
    } catch (error) {
      console.error("Error creating the profile:", error);
      setError(
        error.response ? error.response.data.error : "Something went wrong!"
      );
    }
  };

  return (
    <div>
      <h2>Register as Advertiser</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input type="text" name="username" value={username} readOnly />
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={password} readOnly />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={email} readOnly />
        </div>

        <div>
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={company_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={website}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Hotline</label>
          <input
            type="text"
            name="hotline"
            value={hotline}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Company Description</label>
          <textarea
            name="companyDescription"
            value={companyDescription}
            onChange={handleChange}
          />
        </div>

        {/* <div>
          <label>Profile Image</label>
          <input type="file" name="image" onChange={handleImageChange} />
        </div> */}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default RegisterForm;
