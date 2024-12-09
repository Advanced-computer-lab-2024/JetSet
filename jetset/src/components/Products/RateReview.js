import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Rate } from "antd"; // Import Ant Design components

const TouristProducts = ({ touristId }) => {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  // Fetch purchased products for the tourist
  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/purchased-products/${touristId}`
        );
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
      setRatings((prevRatings) => ({ ...prevRatings, [productId]: 0 }));
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
      setReviews((prevReviews) => ({ ...prevReviews, [productId]: "" }));
    } catch (error) {
      setMessage(
        error.response ? error.response.data.error : "An error occurred."
      );
    }
  };

  // Render stars for rating
  const renderStars = (productId) => {
    const productRating = ratings[productId] || 0;
    return (
      <div>
        <Rate
          value={productRating}
          onChange={(value) =>
            setRatings((prevRatings) => ({
              ...prevRatings,
              [productId]: value,
            }))
          }
        />
        <br />
        <Button
          style={{
            backgroundColor: "#1d3557",
            color: "white",
            border: "none",
            marginTop: "10px",
          }}
          onClick={(e) => handleRatingSubmit(e, productId)}
        >
          Rate
        </Button>
      </div>
    );
  };

  return (
    <div>
      <h1>Your Purchased Products</h1>
      {message && <p>{message}</p>}

      <ul>
        {products.length === 0 ? (
          <p>No purchased products available.</p>
        ) : (
          products.map((product) => (
            <li key={product._id}>
              <h2>{product.name}</h2>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {(product.price * conversionRate).toFixed(2)} {currency}
              </p>
              <p>
                <strong>Quantity Purchased:</strong> {product.sales}
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
                    value={reviews[product._id] || ""}
                    onChange={(e) =>
                      setReviews((prevReviews) => ({
                        ...prevReviews,
                        [product._id]: e.target.value,
                      }))
                    }
                  />
                </label>
                <br />
                <Button
                  style={{
                    backgroundColor: "#1d3557",
                    color: "white",
                    border: "none",
                    marginTop: "10px",
                  }}
                  type="submit"
                >
                  Submit Review
                </Button>
              </form>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TouristProducts;
