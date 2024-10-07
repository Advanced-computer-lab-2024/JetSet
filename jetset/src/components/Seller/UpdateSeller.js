import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateSeller = ({ sellerId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);

  // Fetch current seller profile to pre-fill form
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/seller/${sellerId}`
        );

        const { seller_name, seller_description } = response.data;
        setName(seller_name);
        setDescription(seller_description);
      } catch (error) {
        console.error("Error fetching seller details.", error);
      }
    };

    fetchSeller();
  }, [sellerId]); // Ensure sellerId is in the dependency array

  // Handle seller profile update
  const handleUpdateSeller = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/updateSeller/${sellerId}`, {
        seller_name: name,
        seller_description: description,
      });
      setMessage("Profile updated successfully!");
    } catch (err) {
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
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      ></textarea>
      <button type="submit">Update Profile</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UpdateSeller;
