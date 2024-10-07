import React, { useState } from "react";
import axios from "axios";

const UpdateTag = ({ tags }) => {
  const [selectedTagId, setSelectedTagId] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("");
  const [newPeriod, setNewPeriod] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:3000/updateTags?id=${selectedTagId}`,
        {
          name: newName,
          type: newType,
          period: newPeriod,
        }
      );
      setMessage(
        `Tag updated: ${response.data.name} (ID: ${response.data._id})`
      );
      setNewName("");
      setNewType("");
      setNewPeriod("");
      setSelectedTagId("");
    } catch (error) {
      setError(error.response?.data?.error || "Error updating tag");
    }
  };

  return (
    <div>
      <h2>Update Tag</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>
            Select Tag:
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
        <div>
          <label>
            New Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            New Type:
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            New Period:
            <input
              type="text"
              value={newPeriod}
              onChange={(e) => setNewPeriod(e.target.value)}
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

export default UpdateTag;
