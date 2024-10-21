import React, { useEffect, useState } from "react";
import axios from "axios";

// Define the ProductList component
const ProductList = () => {
  // State to store the list of products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(false); // State to control product visibility

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products"); // Adjust URL to your backend endpoint
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run only once when the component mounts

  // Display loading state
  if (loading) return <div>Loading products...</div>;

  // Display error state
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="product-list">
      <button onClick={() => setShowProducts((prev) => !prev)}>
        {showProducts ? "Hide Products" : "Show Products"}
      </button>

      {showProducts && (
        <div>
          {products.length === 0 ? (
            <div>No products available.</div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img
                  src={product.imageUrl || "default-image-url.jpg"} // Provide a default image URL if not available
                  alt={product.name || "Product image"} // Fallback alt text
                  className="product-image"
                />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price.toFixed(2)}</p> {/* Format price */}
                <p>Seller: {product.seller}</p>
                <p>Rating: {product.ratings} ⭐</p>
                <div className="reviews">
                  <h4>Reviews:</h4>
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index} className="review">
                        <strong>{review.userId?.name || "Anonymous"}</strong>:{" "}
                        {review.comment}
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
