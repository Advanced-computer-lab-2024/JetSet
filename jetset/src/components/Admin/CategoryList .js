import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false); // State to toggle category visibility

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8000/viewCategory");
      setCategories(response.data);
    } catch (error) {
      setError("Error retrieving categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategoryVisibility = () => {
    setShowCategories(!showCategories); // Toggle the visibility
  };

  return (
    <div>
      <h2>Categories</h2>
      <button onClick={toggleCategoryVisibility}>
        {showCategories ? "Hide Categories" : "Show Categories"}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showCategories && !loading && !error && (
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              {category.name} {/* Only display the name */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;
