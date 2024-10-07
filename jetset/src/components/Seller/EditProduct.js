import React, { useEffect, useState } from "react";
import axios from "axios";

const EditProduct = () => {
  const [products, setProducts] = useState([]); // State to store products
  const [selectedProductId, setSelectedProductId] = useState(""); // State for selected product ID
  const [newPrice, setNewPrice] = useState(""); // State for new price
  const [newDescription, setNewDescription] = useState(""); // State for new description
  const [newRatings, setNewRatings] = useState(""); // State for new ratings
  const [newReviews, setNewReviews] = useState(""); // State for new reviews
  const [newQuantity, setNewQuantity] = useState(""); // State for new quantity
  const [message, setMessage] = useState(null); // State for success/error messages
  const [error, setError] = useState(null); // State for error messages

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products"); // Adjust this endpoint as necessary
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error fetching products");
      }
    };

    fetchProducts();
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:8000/editproduct/${selectedProductId}`,
        {
          price: newPrice,
          description: newDescription,
          ratings: newRatings,
          reviews: newReviews,
          quantity: newQuantity,
        }
      );
      setMessage(
        `Product updated: ${response.data.product.name} (ID: ${response.data.product._id})`
      );
      // Clear form fields after successful update
      setNewPrice("");
      setNewDescription("");
      setNewRatings("");
      setNewReviews("");
      setNewQuantity("");
      setSelectedProductId("");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating product");
    }
  };

  return (
    <div>
      <h1>Edit Product Details</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label>
            Select Product:
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} (ID: {product._id})
                </option>
              ))}
            </select>
          </label>
        </div>
        <input
          type="number"
          placeholder="New Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="New Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="New Ratings"
          value={newRatings}
          onChange={(e) => setNewRatings(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Reviews"
          value={newReviews}
          onChange={(e) => setNewReviews(e.target.value)}
        />
        <input
          type="number"
          placeholder="New Quantity"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
        <button type="submit">Update Product</button>
      </form>

      {/* Display success/error message */}
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default EditProduct;
