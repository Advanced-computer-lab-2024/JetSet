import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateSeller = ({ sellerId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const [image, setImages] = useState(null); // Changed to hold a single image for simplicity

  // Handle image selection
  const handleImageChange = (e) => {
    setImages(e.target.files[0]); // Store the first selected file
  };

  // Handle seller profile update
  const handleUpdateSeller = async (e) => {
    e.preventDefault();

    // Create a FormData object to hold the updated fields and image
    const formData = new FormData();
    if (name) formData.append("seller_name", name);
    if (description) formData.append("seller_description", description);
    if (image) formData.append("image", image); // Append the image

    try {
      const response = await axios.put(
        `http://localhost:3000/updateSeller/${sellerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data); // Log response data for debugging
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile.");
    }
  };

  return (
    <form onSubmit={handleUpdateSeller}>
      <h2>Update Seller Profile</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* File input for image uploads */}
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*" // Accept only image files
      />

      <button type="submit">Update Profile</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UpdateSeller;
