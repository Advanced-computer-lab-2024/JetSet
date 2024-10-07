import React, { useState } from "react";
import axios from "axios";

const FilterProducts = () => {
  const [limit, setLimit] = useState(""); // State to hold the price limit
  const [products, setProducts] = useState([]); // State to hold the filtered products
  const [loading, setLoading] = useState(false); // State to handle loading spinner
  const [error, setError] = useState(null); // State to handle errors

  const filterProducts = async () => {
    console.log("Button clicked, filterProducts called");
    console.log("Filtering with limit:", limit); // Log the limit value for debugging
    setLoading(true);
    setError(null); // Reset error state before request

    try {
      const response = await axios.get("http://localhost:8000/filterProduct", {
        params: { limit }, // Send the limit as a query parameter
      });
      console.log("Response from backend:", response.data); // Log the response from backend
      console.log("Number of products received:", response.data.length);

      setProducts(response.data); // Store the returned products in state
      setLoading(false);
    } catch (err) {
      setError(err.message); // Store the error message
      setLoading(false);
    }
  };

  return (
    <div className="filter-products">
      <h1>Filter Products by Price</h1>
      {/* Input field for price limit */}
      <input
        type="number"
        placeholder="Enter price limit"
        value={limit}
        onChange={(e) => setLimit(e.target.value)} // Update limit state when input changes
        className="price-limit-input"
      />
      {/* Button to trigger filter function */}
      <button onClick={filterProducts} className="filter-button">
        Filter
      </button>

      {/* Loading message */}
      {loading && <div>Loading...</div>}
      {/* Error message */}
      {error && <div>Error: {error}</div>}

      {/* Display filtered products */}
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Seller: {product.seller}</p>
            <p>Rating: {product.ratings} ⭐</p>
          </div>
        ))
      ) : (
        <div>No products found within this price range.</div>
      )}
    </div>
  );
};

export default FilterProducts;
