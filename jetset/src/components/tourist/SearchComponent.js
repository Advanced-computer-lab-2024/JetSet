import React, { useState } from "react";

const SearchComponent = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      // Construct the search API URL with query parameters
      const response = await fetch(
        `/search?query=${encodeURIComponent(
          query
        )}&category=${encodeURIComponent(category)}&tag=${encodeURIComponent(
          tag
        )}`
      );

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      // Parse the JSON data
      const data = await response.json();
      console.log("Search results:", data); // Log the response data

      // Check if the data is an array
      if (Array.isArray(data)) {
        setResults(data); // Set results only if data is an array
      } else {
        setResults([]); // Reset to empty array if the response is not an array
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("An error occurred while fetching search results.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category..."
      />
      <input
        type="text"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Tags (comma separated)..."
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Results</h2>
      <div>
        {results.length > 0 ? (
          results.map((result) => (
            <div
              key={result._id}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <h3>{result.title || "No Title Available"}</h3>{" "}
              {/* Title or fallback */}
              <p>
                <strong>Location: </strong>
                {result.location?.address || "No Location Available"}{" "}
                {/* Location field */}
              </p>
              <p>Date: {new Date(result.date).toLocaleDateString()}</p>
              <p>Time: {result.time}</p>
              <p>
                <strong>Price: </strong>
                {result.price?.fixed !== undefined
                  ? `$${result.price.fixed}`
                  : `${result.price?.range?.min} - ${result.price?.range?.max}`}
              </p>
              <p>
                <strong>Rating: </strong>
                {result.rating || "No Rating"}
              </p>
              <p>
                <strong>Category: </strong>
                {result.category
                  ? result.category.name
                  : "No Category Available"}
              </p>
              <p>
                <strong>Tags: </strong>
                {result.tags.length > 0 ? result.tags.join(", ") : "No Tags"}
              </p>
              <p>
                <strong>Booking Open: </strong>
                {result.booking_open ? "Yes" : "No"}
              </p>
            </div>
          ))
        ) : (
          <p>No results available</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
