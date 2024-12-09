import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Spin, message } from "antd"; // Import Ant Design components

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
        `http://localhost:3000/Wishlist/${touristId}`,
        {
          data: { productID: productId },
        }
      );
      message.success(response.data.message); // Display success message
      fetchWishlist(); // Refresh the wishlist after removal
    } catch (error) {
      console.error("Error removing product:", error);
      message.error("Failed to remove from wishlist."); // Display error message
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/addToCart/${touristId}`,
        {
          item: productId,
        }
      );
      message.success(response.data.message); // Display success message
    } catch (error) {
      console.error("Error adding item to cart:", error);
      message.error(
        error.response?.data?.error ||
          "An error occurred while adding the item to the cart"
      ); // Display error message
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="danger"
            onClick={() => handleRemoveFromWishlist(record.productId._id)}
            style={{
              backgroundColor: "#1d3557", // Custom background color
              color: "white", // White text color for contrast
              border: "none", // Remove default border
              marginRight: 10,
            }}
          >
            Remove
          </Button>
          <Button
            type="primary"
            onClick={() => handleAddToCart(record.productId._id)}
            style={{
              backgroundColor: "#1d3557", // Custom background color
              color: "white", // White text color for contrast
              border: "none", // Remove default border
            }}
          >
            Add to Cart
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1>Your Wishlist</h1>

      {loading ? (
        <Spin tip="Loading Wishlist..." />
      ) : error ? (
        <message.error>{error}</message.error> // Use message component instead of Alert for errors
      ) : (
        <Table
          columns={columns}
          dataSource={wishlist.map((item) => ({
            key: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            productId: item,
          }))}
          pagination={false}
        />
      )}
    </div>
  );
};

export default Wishlist;
