import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sellerUsername, setSellerUsername] = useState(""); // Changed from sellerId to sellerUsername
  const [images, setImages] = useState([]); // State to store images
  const [rating, setRating] = useState(""); // State to store rating
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [message, setMessage] = useState(""); // State to store success message
  const [error, setError] = useState(""); // State to store error message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Reset message on form submission
    setError(""); // Reset error message

    try {
      const response = await axios.post("http://localhost:3000/createproduct", {
        name,
        description,
        price,
        quantity,
        seller_username: sellerUsername, // Changed to seller_username
        images, // Send images array
        rating: Number(rating), // Send rating as a number
        reviews, // Send reviews array
      });
      console.log(response.data); // Log the response from the server
      setMessage("Product created successfully!"); // Set success message
    } catch (error) {
      console.error("Error creating product:", error.response.data); // Handle errors
      setError(
        "Error creating product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Function to handle adding reviews
  const handleAddReview = () => {
    const reviewText = prompt("Enter your review:"); // Basic prompt for adding reviews
    if (reviewText) {
      setReviews([...reviews, reviewText]); // Add new review to reviews array
    }
  };

  // Function to handle adding image URLs
  const handleAddImage = () => {
    const imageUrl = prompt("Enter image URL:");
    if (imageUrl) {
      setImages([...images, imageUrl]); // Add new image to images array
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Seller Username" // Changed label to "Seller Username"
          value={sellerUsername}
          onChange={(e) => setSellerUsername(e.target.value)} // Changed from setSellerId to setSellerUsername
        />
        <input
          type="number"
          placeholder="Rating (0-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="0"
          max="5"
        />

        {/* Button to add image URLs */}
        <button type="button" onClick={handleAddImage}>
          Add Image
        </button>
        <div>
          <strong>Images:</strong> {images.join(", ")}
        </div>

        {/* Button to add reviews */}
        <button type="button" onClick={handleAddReview}>
          Add Review
        </button>
        <div>
          <strong>Reviews:</strong> {reviews.join(", ")}
        </div>

        <button type="submit">Add Product</button>
      </form>

      {/* Display success message */}
      {message && <div className="success-message">{message}</div>}

      {/* Display error message */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default AddProduct;
