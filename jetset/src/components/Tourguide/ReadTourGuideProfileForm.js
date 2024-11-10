import React, { useEffect, useState } from "react";
import axios from "axios";

const TourGuideProfile = ({ tourGuideID }) => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    mobile_number: "",
    years_of_experience: "",
    previous_work: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  console.log(tourGuideID);
  // Define the fetchProfile function
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/TourGuideProfile/${tourGuideID}`
      );
      setProfile(response.data.myProfile);
      setFormData({
        mobile_number: response.data.myProfile.mobile_number,
        years_of_experience: response.data.myProfile.years_of_experience,
        previous_work: response.data.myProfile.previous_work,
        image: null, // Reset image as it's not fetched
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile(); // Call fetchProfile when the component mounts
  }, [tourGuideID]);

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

    // Append only fields that are changed or updated
    for (const key in formData) {
      if (formData[key] !== "" && formData[key] !== null) {
        form.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/updateTourGuide/${tourGuideID}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.msg);
      setIsEditing(false); // Exit edit mode after submission
      fetchProfile(); // Refresh the profile data after update
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  if (!profile) return <div>Loading...</div>; // Show loading state

  return (
    <div>
      <h1>Tour Guide Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Mobile Number:</label>
            <input
              type="tel"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder={profile.mobile_number} // Show current value as placeholder
            />
          </div>
          <div>
            <label>Years of Experience:</label>
            <input
              type="number"
              name="years_of_experience"
              value={formData.years_of_experience}
              onChange={handleChange}
              placeholder={profile.years_of_experience} // Show current value as placeholder
            />
          </div>
          <div>
            <label>Previous Work:</label>
            <textarea
              name="previous_work"
              value={formData.previous_work}
              onChange={handleChange}
              placeholder={profile.previous_work} // Show current value as placeholder
            />
          </div>
          <div>
            <label>Profile Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Mobile Number:</strong> {profile.mobile_number}
          </p>
          <p>
            <strong>Years of Experience:</strong> {profile.years_of_experience}
          </p>
          <p>
            <strong>Previous Work:</strong> {profile.previous_work}
          </p>
          {profile.images && (
            <img
              src={`http://localhost:3000/uploads/${profile.images}`}
              alt="Profile"
            />
          )}
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default TourGuideProfile;
