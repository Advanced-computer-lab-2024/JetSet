import React, { useState } from "react";
import axios from "axios";

const SortProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortProductsByRatings = async (sortOrder) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3000/sortProducts", {
        params: {
          sortBy: "ratings",
          sortOrder,
        },
      });
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="sort-products">
      <h1>Sort Products by Ratings</h1>

      <div>
        {/* Buttons to trigger sorting in ascending or descending order */}
        <button onClick={() => sortProductsByRatings(-1)}>Sort</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {/* Display sorted products */}
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            <h2>{product.name}</h2>
            <p>Price: {product.price}</p>
            <p>Seller: {product.seller}</p>
            <p>Rating: {product.ratings} ⭐</p>
          </div>
        ))
      ) : (
        <div>No products available.</div>
      )}
    </div>
  );
};

export default SortProducts;
