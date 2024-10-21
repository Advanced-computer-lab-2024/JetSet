import React, { useState, useEffect } from "react";
import axios from "axios";

const ItineraryList = () => {
  const [itineraries, setItineraries] = useState([]);
  const [filters, setFilters] = useState({
    budget: "",
    startDate: "",
    endDate: "",
    tag: "",
    language: "",
  });
  const [sortBy, setSortBy] = useState("budget");
  const [sortOrder, setSortOrder] = useState(1);

  // Fetch itineraries based on sorting
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("/SortItineraries", {
          params: { sortBy, sortOrder },
        });
        setItineraries(response.data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, [sortBy, sortOrder]); // Only fetch when sorting changes

  // Fetch filtered itineraries
  useEffect(() => {
    const fetchFilteredItineraries = async () => {
      try {
        const response = await axios.get("/tourist/filter-itineraries", {
          params: { ...filters }, // Send filters as query params
        });
        setItineraries(response.data);
      } catch (error) {
        console.error("Error fetching filtered itineraries:", error);
      }
    };

    // Fetch only if any filter is applied
    if (
      filters.budget ||
      filters.startDate ||
      filters.endDate ||
      filters.tag ||
      filters.language
    ) {
      fetchFilteredItineraries();
    }
  }, [filters]); // Only fetch when filters change

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({
      budget: "",
      startDate: "",
      endDate: "",
      tag: "",
      language: "",
    });
    // Re-fetch itineraries without filters
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("/itineraries", {
          params: { sortBy, sortOrder },
        });
        setItineraries(response.data);
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };
    fetchItineraries();
  };

  return (
    <div>
      <h2>Itineraries</h2>
      <input
        type="number"
        name="budget"
        placeholder="Budget"
        value={filters.budget}
        onChange={handleChange}
      />
      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={handleChange}
      />
      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={handleChange}
      />
      <input
        type="text"
        name="tag"
        placeholder="Tags (comma separated)"
        value={filters.tag}
        onChange={handleChange}
      />
      <input
        type="text"
        name="language"
        placeholder="Language"
        value={filters.language}
        onChange={handleChange}
      />
      <button onClick={handleClearFilters}>Clear Filters</button>
      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="budget">budget</option>
        <option value="ratings">Ratings</option>
      </select>
      <select onChange={(e) => setSortOrder(e.target.value)}>
        <option value={1}>Ascending</option>
        <option value={-1}>Descending</option>
      </select>
      <ul>
        {itineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <strong>Title:</strong> {itinerary.name}
            <br />
            <strong>Locations:</strong>{" "}
            {itinerary.locations ? itinerary.locations.join(", ") : "N/A"}
            <br />
            <strong>Timeline:</strong> {itinerary.timeline}
            <br />
            <strong>Duration:</strong> {itinerary.duration} days
            <br />
            <strong>Language:</strong> {itinerary.language}
            <br />
            <strong>Budget:</strong> ${itinerary.budget}
            <br />
            <strong>Availability Dates:</strong>{" "}
            {itinerary.availability_dates
              ? itinerary.availability_dates.join(", ")
              : "N/A"}
            <br />
            <strong>Pickup Location:</strong> {itinerary.pickup_location}
            <br />
            <strong>Dropoff Location:</strong> {itinerary.dropoff_location}
            <br />
            <strong>Accessibility:</strong> {itinerary.accessibility}
            <br />
            <strong>Tags:</strong>{" "}
            {Array.isArray(itinerary.tags) && itinerary.tags.length > 0
              ? itinerary.tags.join(", ")
              : "None"}
            <br />
            <strong>Created By:</strong> {itinerary.created_by}
            <br />
            <strong>Created At:</strong>{" "}
            {new Date(itinerary.createdAt).toLocaleDateString()}
            <br />
            <strong>Updated At:</strong>{" "}
            {new Date(itinerary.updatedAt).toLocaleDateString()}
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItineraryList;
