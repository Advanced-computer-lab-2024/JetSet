import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerProfile = ({ sellerId }) => {
  const [seller, setSeller] = useState(null); // State to store the fetched seller
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImages] = useState(null); // Hold a single image for simplicity
  const [loading, setLoading] = useState(false); // State to handle loading
  const [error, setError] = useState(null); // State for error messages
  const [message, setMessage] = useState(null); // State for success message

  // Fetch seller data on component load
  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/getSellerById/${sellerId}`
        );
        setSeller(response.data.seller); // Assuming response.data.seller contains seller info
        setName(response.data.seller.seller_name);
        setDescription(response.data.seller.seller_description);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        setError("Error retrieving seller profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

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

      // Update seller info with the latest data
      const updatedSeller = await axios.get(
        `http://localhost:3000/getSellerById/${sellerId}`
      );
      setSeller(updatedSeller.data.seller);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("Error updating profile.");
    }
  };

  return (
    <div>
      <h1>Seller Profile</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {seller && (
        <div>
          <h2>{seller.username}</h2>
          <p>Email: {seller.email}</p>
          <p>Name: {seller.seller_name}</p>
          <p>Description: {seller.seller_description}</p>

          {seller.images && seller.images.length > 0 && (
            <div>
              <h3>Images:</h3>
              {seller.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:3000/uploads/${image}`} // Adjust this path based on your setup
                  alt={`Seller image ${index + 1}`}
                  style={{ width: "200px", height: "auto", margin: "5px" }}
                />
              ))}
            </div>
          )}
        </div>
      )}

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
    </div>
  );
};

export default SellerProfile;
