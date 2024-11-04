import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/productsAdmin");
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleArchive = async (productId, currentStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/archieve/${productId}`,
        {
          archiveStatus: !currentStatus,
        }
      );

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, archive: !currentStatus }
              : product
          )
        );
      } else {
        alert("Failed to update archive status. Please try again.");
      }
    } catch (err) {
      console.error("Error toggling archive status:", err);
      alert("Failed to update archive status. Please try again.");
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="product-list">
      <button onClick={() => setShowProducts((prev) => !prev)}>
        {showProducts ? "Hide Products" : "Show Products"}
      </button>

      {showProducts && (
        <table className="product-table">
          <thead>
            <tr>
              <th>Images</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
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
                  <td>${product.price}</td>
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
                    <button
                      onClick={() =>
                        toggleArchive(product._id, product.archive)
                      }
                      className={
                        product.archive ? "unarchive-btn" : "archive-btn"
                      }
                    >
                      {product.archive ? "Unarchive" : "Archive"}
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

export default ProductList;
