// src/components/DeleteCategory.js

import React, { useState } from "react";
import axios from "axios";

const DeleteCategory = ({ categories, setCategories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.delete(
        `http://localhost:3000/deleteCategory/${selectedCategoryId}`
      );
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== response.data._id)
      );
      setMessage(
        `Category deleted: ${response.data.name} (ID: ${response.data._id})`
      );
      setSelectedCategoryId("");
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting category");
    }
  };

  return (
    <div>
      <h2>Delete Category</h2>
      <form onSubmit={handleDelete}>
        <div>
          <label>
            Select Category to Delete:
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name} (ID: {category._id})
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Delete</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteCategory;
