import React, { useState } from "react";
import axios from "axios";

const SearchComponent = () => {
  const [searchType, setSearchType] = useState("place"); // Default search type
  const [query, setQuery] = useState({ name: "", category: "", tags: "" });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setError(null); // Reset any previous errors
    try {
      let response;
      if (searchType === "place") {
        response = await axios.get(`http://localhost:3000/searchplace`, {
          params: query,
        });
      } else if (searchType === "activity") {
        response = await axios.get(`http://localhost:3000/searchactivity`, {
          params: query,
        });
      } else if (searchType === "itinerary") {
        response = await axios.get(`http://localhost:3000/searchitinerary`, {
          params: query,
        });
      }
      setResults(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <div>
        <label>
          Search Type:
          <select
            onChange={(e) => setSearchType(e.target.value)}
            value={searchType}
          >
            <option value="place">Place</option>
            <option value="activity">Activity</option>
            <option value="itinerary">Itinerary</option>
          </select>
        </label>
      </div>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={query.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={query.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={query.tags}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        <h2>Results:</h2>
        <ul>
          {results.map((result) => (
            <li key={result._id}>
              {/* Check if the result is a Place */}
              {result.Name ? (
                <div>
                  <h3>Place: {result.Name}</h3>
                  <p>
                    <strong>Description:</strong> {result.Description || "N/A"}
                  </p>
                  <p>
                    <strong>Opening Hours:</strong>{" "}
                    {result.opening_hours || "N/A"}
                  </p>
                  <p>
                    <strong>Ticket Prices (Family):</strong> $
                    {result.TicketPricesF || "N/A"}
                  </p>
                  <p>
                    <strong>Ticket Prices (Normal):</strong> $
                    {result.TicketPricesN || "N/A"}
                  </p>
                  <p>
                    <strong>Ticket Prices (Student):</strong> $
                    {result.TicketPricesS || "N/A"}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {Array.isArray(result.tags) && result.tags.length > 0
                      ? result.tags.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : null}

              {/* Check if the result is an Activity */}
              {result.title ? (
                <div>
                  <h3>Activity: {result.title}</h3>
                  <p>
                    <strong>Budget:</strong> ${result.budget || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(result.date).toLocaleDateString() || "N/A"}
                  </p>
                  <p>
                    <strong>Time:</strong> {result.time || "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong> {result.location || "N/A"}
                  </p>
                  <p>
                    <strong>Category:</strong> {result.category || "N/A"}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {Array.isArray(result.tags) && result.tags.length > 0
                      ? result.tags.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Special Discount:</strong>{" "}
                    {result.special_discount || "N/A"}
                  </p>
                  <p>
                    <strong>Rating:</strong> {result.rating || "N/A"}
                  </p>
                  <p>
                    <strong>Booking Open:</strong>{" "}
                    {result.booking_open ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : null}

              {/* Check if the result is an Itinerary */}
              {result.name ? (
                <div>
                  <h3>Itinerary: {result.name}</h3>
                  <p>
                    <strong>Budget:</strong> ${result.budget || "N/A"}
                  </p>
                  <p>
                    <strong>Locations:</strong>{" "}
                    {Array.isArray(result.locations) &&
                    result.locations.length > 0
                      ? result.locations.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Timeline:</strong> {result.timeline || "N/A"}
                  </p>
                  <p>
                    <strong>Duration:</strong> {result.duration || "N/A"}
                  </p>
                  <p>
                    <strong>Language:</strong> {result.language || "N/A"}
                  </p>
                  <p>
                    <strong>Pickup Location:</strong>{" "}
                    {result.pickup_location || "N/A"}
                  </p>
                  <p>
                    <strong>Dropoff Location:</strong>{" "}
                    {result.dropoff_location || "N/A"}
                  </p>
                  <p>
                    <strong>Accessibility:</strong>{" "}
                    {result.accessibility || "N/A"}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {Array.isArray(result.tags) && result.tags.length > 0
                      ? result.tags.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(result.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;
