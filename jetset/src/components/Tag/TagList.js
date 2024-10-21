import React, { useEffect, useState } from "react";

const TagList = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTags, setShowTags] = useState(false); // State to toggle tag visibility

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

  useEffect(() => {
    fetchTags();
  }, []);

  const toggleTagVisibility = () => {
    setShowTags(!showTags); // Toggle the visibility
  };

  return (
    <div className="tag-list">
      <h1>Tag List</h1>
      <button onClick={toggleTagVisibility}>
        {showTags ? "Hide Tags" : "Show Tags"}
      </button>

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}

      {showTags && !loading && !error && (
        <>
          {tags.length > 0 ? (
            <ul>
              {tags.map((tag) => (
                <li key={tag._id}>
                  <strong>Name:</strong> {tag.name} <br />
                  <strong>Type:</strong> {tag.type} <br />
                  <strong>Period:</strong> {tag.period}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tags found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TagList;
