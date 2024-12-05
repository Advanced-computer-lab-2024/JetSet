import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateCategory from "./CreateCategory"; // Assuming you have this component for creating categories

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryData, setEditCategoryData] = useState({ name: "" });
  const [updateMessage, setUpdateMessage] = useState("");
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false); // State to control the form visibility

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3000/viewCategory");
      setCategories(response.data);
    } catch (error) {
      setError("Error retrieving categories");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditCategoryId(category._id);
    setEditCategoryData({ name: category.name });
    setUpdateMessage("");
  };

  const handleCancelEdit = () => {
    setEditCategoryId(null);
    setEditCategoryData({ name: "" });
    setUpdateMessage("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/updateCategory/${editCategoryId}`,
        editCategoryData
      );
      setUpdateMessage(`Category updated: ${response.data.name}`);
      fetchCategories(); // Refresh the category list after update
      setEditCategoryId(null);
    } catch (error) {
      setError(error.response?.data?.error || "Error updating category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/deleteCategory/${id}`);
      fetchCategories(); // Refresh the category list after deletion
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "Error deleting category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-list">
      <h2>Categories</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Always display the category list */}
      {!loading && !error && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {categories.map((category) => (
            <li
              key={category._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {editCategoryId === category._id ? (
                <form onSubmit={handleUpdate}>
                  <div>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={editCategoryData.name}
                        onChange={(e) =>
                          setEditCategoryData({
                            ...editCategoryData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                  <button type="submit">Save</button>
                  <button type="button" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                </form>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>Name:</strong> {category.name}
                  </div>
                  <div>
                    <a
                      href="#"
                      style={{
                        color: "#007BFF",
                        cursor: "pointer",
                        textDecoration: "underline",
                        marginRight: "10px",
                      }}
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      style={{
                        color: "#FF5733",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Display link to create a new category */}
      {!showCreateCategoryForm && (
        <p
          style={{
            color: "#007BFF",
            cursor: "pointer",
            textDecoration: "underline",
            textAlign: "center",
            marginTop: "20px",
          }}
          onClick={() => setShowCreateCategoryForm(true)}
        >
          Add a new category
        </p>
      )}

      {/* Show the CreateCategory form */}
      {showCreateCategoryForm && <CreateCategory />}

      {updateMessage && <p style={{ color: "green" }}>{updateMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CategoryList;
