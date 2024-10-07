import React, { useState } from "react";
import axios from "axios";

const DeleteTag = ({ tags, setTags }) => {
  const [selectedTagId, setSelectedTagId] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.delete(
        `http://localhost:3000/deletePrefTag?id=${selectedTagId}`
      );
      setTags((prevTags) =>
        prevTags.filter((tag) => tag._id !== selectedTagId)
      );
      setMessage(`Tag deleted successfully (ID: ${selectedTagId})`);
      setSelectedTagId("");
    } catch (error) {
      setError(error.response?.data?.error || "Error deleting tag");
    }
  };

  return (
    <div>
      <h2>Delete Tag</h2>
      <form onSubmit={handleDelete}>
        <div>
          <label>
            Select Tag to Delete:
            <select
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a tag
              </option>
              {tags.map((tag) => (
                <option key={tag._id} value={tag._id}>
                  {tag.name} (ID: {tag._id})
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

export default DeleteTag;
