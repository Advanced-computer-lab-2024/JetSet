import React, { useState, useEffect } from "react";
import axios from "axios";
import { notification, Table, Button } from "antd";

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
      notification.success({
        message: "Success",
        description: response.data.message,
      });
      fetchWishlist(); // Refresh the wishlist after removal
    } catch (error) {
      console.error("Error removing product:", error);
      notification.error({
        message: "Error",
        description: "Failed to remove from wishlist.",
      });
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
      notification.success({
        message: "Success",
        description: response.data.message,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      notification.error({
        message: "Error",
        description:
          error.response?.data?.error ||
          "An error occurred while adding the item to the cart",
      });
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: ["productId", "name"],
      key: "name",
    },
    {
      title: "Price",
      dataIndex: ["productId", "price"],
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            onClick={() => handleRemoveFromWishlist(record.productId._id)}
            style={{ marginRight: "10px" }}
          >
            Remove
          </Button>
          <Button
            type="primary"
            onClick={() => handleAddToCart(record.productId._id)}
          >
            Add To Cart
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Your Wishlist</h1>
      {loading ? (
        <p>Loading wishlist...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Table
          dataSource={wishlist}
          columns={columns}
          rowKey={(record) => record.productId._id}
          pagination={false}
        />
      )}
    </div>
  );
};

export default Wishlist;
