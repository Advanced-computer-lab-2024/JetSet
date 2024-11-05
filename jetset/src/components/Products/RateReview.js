import React, { useEffect, useState } from "react";
import axios from "axios";

const TouristProducts = ({ touristId }) => {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({}); // Store ratings for each product
  const [reviews, setReviews] = useState({}); // Store reviews for each product
  const [message, setMessage] = useState("");

  // Fetch purchased products for the tourist
  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        const response = await axios.get(`/purchased-products/${touristId}`);
        setProducts(response.data.products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPurchasedProducts();
  }, [touristId]);

  // Handle rating submission
  const handleRatingSubmit = async (e, productId) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/rate/${productId}`, {
        rating: ratings[productId],
      });
      setMessage(response.data.message || "Rating submitted successfully.");
      setRatings((prevRatings) => ({ ...prevRatings, [productId]: 0 })); // Clear rating after submission
    } catch (error) {
      setMessage(
        error.response ? error.response.data.error : "An error occurred."
      );
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e, productId) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/review/${productId}`, {
        touristId,
        reviewText: reviews[productId],
      });
      setMessage(response.data.message || "Review submitted successfully.");
      setReviews((prevReviews) => ({ ...prevReviews, [productId]: "" })); // Clear review text after submission
    } catch (error) {
      setMessage(
        error.response ? error.response.data.error : "An error occurred."
      );
    }
  };

  // Render stars for rating
  const renderStars = (productId) => {
    const productRating = ratings[productId] || 0; // Get rating for this product
    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() =>
              setRatings((prevRatings) => ({
                ...prevRatings,
                [productId]: star, // Set rating only for this product
              }))
            }
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: star <= productRating ? "gold" : "gray",
            }}
          >
            ★
          </span>
        ))}
        <br />
        <button onClick={(e) => handleRatingSubmit(e, productId)}>Rate</button>
      </div>
    );
  };

  return (
    <div>
      <h1>Your Purchased Products</h1>
      {message && <p>{message}</p>}
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h2>{product.name}</h2>
            <p>
              <strong>Description:</strong> {product.description}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Quantity Purchased:</strong> {product.sales}
            </p>
            <p>
              <strong>Seller:</strong> {product.seller_id?.username}
            </p>
            <p>
              <strong>Average Rating:</strong>{" "}
              {product.ratings?.toFixed(1) || "N/A"}
            </p>
            <div>
              <label>Rate this product:</label>
              {renderStars(product._id)}
            </div>

            <form onSubmit={(e) => handleReviewSubmit(e, product._id)}>
              <label>
                <strong>Review:</strong>
                <textarea
                  value={reviews[product._id] || ""} // Get review text for this product
                  onChange={(e) =>
                    setReviews((prevReviews) => ({
                      ...prevReviews,
                      [product._id]: e.target.value, // Set review text only for this product
                    }))
                  }
                />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristProducts;
