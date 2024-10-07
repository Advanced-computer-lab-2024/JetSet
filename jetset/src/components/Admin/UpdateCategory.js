// src/UpdateCategory.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateCategory = ({ categories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:3000/updateCategory/${selectedCategoryId}, { name: newName }`
      );
      setMessage(
        `Category updated: ${response.data.name} (ID: ${response.data._id})`
      );
      setNewName("");
      setSelectedCategoryId("");
    } catch (error) {
      setError(error.response?.data?.message || "Error updating category");
    }
  };

  return (
    <div>
      <h2>Update Category</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>
            Select Category:
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
        <div>
          <label>
            New Category Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Update</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpdateCategory;
