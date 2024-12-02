import React, { useState } from "react";
import axios from "axios";

const AddProduct = ({ sellerId, adminId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]); // State to store image files
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("quantity", quantity);

    // Only append seller_id if it's valid
    if (sellerId) {
      formData.append("seller_id", sellerId);
    }
    if (adminId) {
      formData.append("admin_id", adminId);
    }
    formData.append("rating", Number(rating));

    reviews.forEach((review, index) => {
      formData.append(`reviews[${index}]`, review);
    });

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/createproducts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      setMessage("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error.response?.data);
      setError(
        "Error creating product: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  // Function to handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setImages(files); // Set the selected image files in state
  };

  // Function to handle adding reviews
  const handleAddReview = () => {
    const reviewText = prompt("Enter your review:");
    if (reviewText) {
      setReviews([...reviews, reviewText]);
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
          type="number"
          placeholder="Rating (0-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="0"
          max="5"
        />

        {/* File input for images
        <input
          type="file"
          onChange={handleImageChange}
          multiple // Allow multiple file selection
        />
        <div>
          <strong>Selected Images:</strong>{" "}
          {images.length > 0
            ? images.map((image) => image.name).join(", ")
            : "No images selected."}
        </div> */}

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
