// src/CreateCategory.js

import React, { useState } from "react";
import axios from "axios";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post("http://localhost:8000/addCategory", {
        name,
      });
      setSuccess(true);
      setName("");
      console.log("Category created:", response.data);
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Category Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
      {success && <p>Category created successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CreateCategory;
