import React, { useEffect, useState } from "react";
import axios from "axios";

const SearchProduct = () => {
  // State to store the search query (product name) and the search result (product details)
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]); // Change to an array to store multiple products
  const [loading, setLoading] = useState(false); // To show loading spinner
  const [error, setError] = useState(null); // To handle any errors

  // Function to handle searching a product by name
  const searchProduct = async () => {
    setLoading(true); // Set loading to true while fetching data
    setError(null); // Reset error state

    try {
      const response = await axios.get(
        "http://localhost:8000/searchProductSeller",
        {
          params: { name: searchQuery }, // Send the search query (product name) to the backend
        }
      );
      setProducts(response.data); // Set the product result (array of products)
      setLoading(false); // Set loading to false once the fetch is done
    } catch (err) {
      setError(err.message); // Set error message if there's any issue
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  return (
    <div className="search-product">
      <h1>Search for a Product</h1>
      {/* Search input bar */}
      <input
        type="text"
        placeholder="Enter product name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query state when input changes
        className="search-bar"
      />
      {/* Search button */}
      <button onClick={searchProduct} className="search-button">
        Search
      </button>

      {/* Display loading message if data is being fetched */}
      {loading && <div>Loading...</div>}

      {/* Display error message if there's an error */}
      {error && <div>Error: {error}</div>}

      {/* Display the products if any are found */}
      {products.length > 0 && (
        <div className="product-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Seller: {product.seller}</p>
              <p>Rating: {product.ratings} ⭐</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
