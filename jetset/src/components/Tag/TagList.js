import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateTag from "./CreateTag"; // Assuming you have this component for creating tags

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editTagId, setEditTagId] = useState(null);
  const [editTagData, setEditTagData] = useState({
    name: "",
    type: "",
    period: "",
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [showCreateTagForm, setShowCreateTagForm] = useState(false); // State to control the form visibility

  const fetchTags = async () => {
    try {
      const response = await fetch("http://localhost:3000/getPreferancetag");
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      setTags(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag) => {
    setEditTagId(tag._id);
    setEditTagData({
      name: tag.name,
      type: tag.type,
      period: tag.period,
    });
    setUpdateMessage("");
  };

  const handleCancelEdit = () => {
    setEditTagId(null);
    setEditTagData({ name: "", type: "", period: "" });
    setUpdateMessage("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/updateTags?id=${editTagId}`,
        editTagData
      );
      setUpdateMessage(`Tag updated: ${response.data.name}`);
      fetchTags(); // Refresh the tag list after update
      setEditTagId(null);
    } catch (error) {
      setError(error.response?.data?.error || "Error updating tag");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/deletePrefTag?id=${id}`);
      fetchTags(); // Refresh the tag list after deletion
    } catch (error) {
      console.error(error); // Log the error for better debugging
      setError(error.response?.data?.error || "Error deleting tag");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="tag-list">
      <h1>Tag List</h1>
      {tags.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tags.map((tag) => (
            <li
              key={tag._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "10px",
                padding: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {editTagId === tag._id ? (
                <form onSubmit={handleUpdate}>
                  <div>
                    <label>
                      Name:
                      <input
                        type="text"
                        value={editTagData.name}
                        onChange={(e) =>
                          setEditTagData({
                            ...editTagData,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Type:
                      <input
                        type="text"
                        value={editTagData.type}
                        onChange={(e) =>
                          setEditTagData({
                            ...editTagData,
                            type: e.target.value,
                          })
                        }
                        required
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Period:
                      <input
                        type="text"
                        value={editTagData.period}
                        onChange={(e) =>
                          setEditTagData({
                            ...editTagData,
                            period: e.target.value,
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
                    <strong>Name:</strong> {tag.name} <br />
                    <strong>Type:</strong> {tag.type} <br />
                    <strong>Period:</strong> {tag.period}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href="#"
                      style={{
                        color: "#007BFF",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => handleEdit(tag)}
                    >
                      Edit
                    </a>
                    <a
                      href="#"
                      style={{
                        color: "red",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => handleDelete(tag._id)}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tags available.</p>
      )}

      {/* Center the "Add a new tag" link */}
      {!showCreateTagForm && (
        <div
          style={{
            textAlign: "center",
            margin: "20px 0",
          }}
        >
          <p
            style={{
              color: "#007BFF",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => setShowCreateTagForm(true)}
          >
            Add a new tag
          </p>
        </div>
      )}

      {/* Show the CreateTag form */}
      {showCreateTagForm && <CreateTag />}

      {updateMessage && <p style={{ color: "green" }}>{updateMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default TagList;
