import React, { useState, useEffect } from "react";
import axios from "axios";

const Wishlist = ({ touristId }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wishlist items on initial render
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/Wishlist/${touristId}`
      );
      setWishlist(response.data.wishlist);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("Failed to load wishlist.");
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/Wishlist/${touristId}`,{
            data: { productID: productId }
        }
      );
      alert(response.data.message); // Success message
      fetchWishlist(); // Refresh the wishlist after removal
    } catch (error) {
      console.error("Error removing product:", error);
      alert("Failed to remove from wishlist.");
    }
  };

  return (
    <div>
      <h1>Your Wishlist</h1>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.length === 0 ? (
              <tr>
                <td colSpan="3">Your wishlist is empty.</td>
              </tr>
            ) : (
              wishlist.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productId.name}</td>
                  <td>{item.productId.price}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.productId._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Wishlist;
