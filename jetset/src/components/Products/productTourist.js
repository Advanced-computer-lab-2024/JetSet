import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductList = ({ touristId }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("ratings");
  const [sortOrder, setSortOrder] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceLimit, setPriceLimit] = useState(100);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const [currency, setCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  // Fetch products on initial render
  useEffect(() => {
    fetchProducts();
    fetchCurrencyData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const fetchCurrencyData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      ); // Use actual tourist ID here
      setCurrency(response.data.preferredCurrency);
      setConversionRate(response.data.conversionRate);
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  const handleSort = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/sortproductTourist",
        {
          params: {
            sortBy: "ratings", // Always sort by ratings
            sortOrder,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error sorting products:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/searchProductTourist`,
        {
          params: { name: searchTerm },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleFilter = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/filterProductTourist`,
        {
          params: { limit: priceLimit / conversionRate },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  const handleBuyProduct = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/buyProduct/${touristId}`,
        {
          productId: selectedProduct._id,
          purchaseQuantity,
        }
      );
      alert(response.data.message);
      fetchProducts(); // Refresh products list after purchase
      setSelectedProduct(null); // Reset selected product after purchase
    } catch (error) {
      console.error("Error purchasing product:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/addToCart/${touristId}`,
        {
          item: product._id,
        }
      );
      alert(response.data.message);
      // fetchCart(); 
      setSelectedProduct(null); 
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert(error.response?.data?.error || "An error occurred while adding the item to the cart");
    }};

  const handleAddToWishlist = async (product) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/Wishlist/${touristId}`,
        {
          productID: product._id,
        }
      );
      alert(response.data.message); // Show a success message
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Failed to add product to wishlist.");
    }
  };
  return (
    <div>
      <h1>Product List</h1>

      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div>
        <label>Sort By:</label>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="ratings">Ratings</option>
        </select>
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
        >
          <option value={-1}>Descending</option>
          <option value={1}>Ascending</option>
        </select>
        <button onClick={handleSort}>Sort</button>
      </div>

      <div>
        <input
          type="number"
          placeholder="Price Limit"
          value={priceLimit}
          onChange={(e) => setPriceLimit(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Images</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price ({currency.toUpperCase()})</th>
            <th>Seller</th>
            <th>Quantity</th>
            <th>Sales</th>
            <th>Rating</th>
            <th>Archive</th>
            <th>Reviews</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="11">No products available.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.images && product.images.length > 0 ? (
                    product.images.map((img, index) => {
                      // Use string manipulation instead of path.basename
                      const imageName = img.split("/").pop(); // Get the filename from the image path
                      return (
                        <img
                          key={index}
                          src={`http://localhost:3000/uploads/${imageName}`} // Change here
                          alt={product.name || "Product image"}
                          className="product-image"
                          style={{ width: "50px", height: "50px" }}
                        />
                      );
                    })
                  ) : (
                    <p>No image available</p>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>
                  {(product.price * conversionRate).toFixed(2)}{" "}
                  {currency.toUpperCase()}
                </td>
                <td>{product.seller_id?.username}</td>
                <td>{product.quantity}</td>
                <td>{product.sales}</td>
                <td>{product.ratings} ⭐</td>
                <td>{product.archive ? "Yes" : "No"}</td>
                <td>
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div key={index}>
                        <strong>
                          {review.touristId?.username || "Anonymous"}
                        </strong>
                        : {review.reviewText}
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </td>
                <td>
                  <button onClick={() => setSelectedProduct(product)}>
                    Want to Buy?
                  </button>
                  <button onClick={() => handleAddToWishlist(product)}>Add to Wishlist</button>
                </td>
                <td>
                <button onClick={() => {
    // setSelectedProduct(product);
    handleAddToCart(product);
  }}
>
  Add to Cart
</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Modal or input prompt for purchase quantity */}
      {selectedProduct && (
        <div className="purchase-modal">
          <h2>Purchase {selectedProduct.name}</h2>
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            max={selectedProduct.quantity}
            value={purchaseQuantity}
            onChange={(e) => setPurchaseQuantity(parseInt(e.target.value))}
          />
          
          <button onClick={handleBuyProduct}>Buy</button>
          <button onClick={() => setSelectedProduct(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
export default ProductList;
