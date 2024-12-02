import React, { useState, useEffect } from "react";
import axios from "axios";
import "./bookmark.css";
import "font-awesome/css/font-awesome.min.css";

const ItineraryList = ({ touristId }) => {
  const [itineraries, setItineraries] = useState([]);
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]); // Store bookmarked itineraries
  // Toggle between showing all or only bookmarked itineraries
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [filters, setFilters] = useState({
    budget: "",
    startDate: "",
    endDate: "",
    tag: "",
    language: "",
  });
  const [sortBy, setSortBy] = useState("budget");
  const [sortOrder, setSortOrder] = useState(1);

  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
 


  const fetchConversionRate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency); // Set the currency
      setConversionRate(response.data.conversionRate); // Set the conversion rate
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  // Fetch itineraries based on sorting
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get("/SortItineraries", {
          params: { sortBy, sortOrder },
        });
        setItineraries(response.data);
        const touristResponse = await axios.get(`/getTourist/${touristId}`);
      setBookmarkedItineraries(
        touristResponse.data.bookmarkedItineraries || []
      );
      } catch (error) {
        console.error("Error fetching itineraries:", error);
      }
    };

    fetchItineraries();
  }, [sortBy, sortOrder]); // Only fetch when sorting changes
  // Bookmark or unbookmark an itinerary
  const bookmarkItinerary = async (itineraryId, isBookmarked) => {
    try {
      const endpoint = isBookmarked
        ? "/api/unbookmarkItinerary"
        : "/api/bookmarkItinerary";

      const response = await axios.post(endpoint, {
        touristId,
        itineraryId,
      });

      if (response.data.message) {
        setBookmarkedItineraries((prevBookmarked) =>
          isBookmarked
            ? prevBookmarked.filter((id) => id !== itineraryId)
            : [...prevBookmarked, itineraryId]
        );
      } else {
        alert(response.data.error || "Error updating bookmark status");
      }
    } catch (err) {
      console.error("Error updating bookmark:", err);
      alert("Error updating bookmark: " + err.message);
    }
  };

  // Fetch filtered itineraries
  useEffect(() => {
    const fetchFilteredItineraries = async () => {
      try {
        if (filters.budget) {
          filters.budget = Math.floor(filters.budget / conversionRate);
        }

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

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  // Toggle between showing all itineraries and only bookmarked ones
  const handleToggleBookmarked = () => {
    setShowBookmarked((prev) => !prev);
  };

  // Filter itineraries to show only bookmarked ones if the flag is true
  const displayedItineraries = showBookmarked
    ? itineraries.filter((itinerary) =>
        bookmarkedItineraries.includes(itinerary._id)
      )
    : itineraries;

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
      {/* Toggle Bookmarked Itineraries Button */}
      <div className="toggle-bookmarked">
        <button
          className="toggle-btn"
          onClick={handleToggleBookmarked}
        >
          {showBookmarked
            ? "Show All Itineraries"
            : "Show Bookmarked Itineraries"}
        </button>
      </div>
      {/* Itineraries List */}
      <ul>
  {displayedItineraries.length > 0 ? (
    displayedItineraries.map((itinerary) => {
      const isBookmarked = bookmarkedItineraries.includes(itinerary._id);
      return (
        <li key={itinerary._id} className="itinerary-item">
          <h3>{itinerary.name || "No Title Available"}</h3>
          <p>Duration: {itinerary.duration} days</p>
          <p>Budget: ${itinerary.budget}</p>
          <p>Tags: {Array.isArray(itinerary.tags) ? itinerary.tags.join(", ") : "None"}</p>
          <p>Language: {itinerary.language || "Not specified"}</p>
          <button
            className="bookmark-button"
            onClick={() => bookmarkItinerary(itinerary._id, isBookmarked)}
          >
            <i
              className={`fa ${
                isBookmarked ? "fa-bookmark" : "fa-bookmark-o"
              }`}
            ></i>
            {isBookmarked ? " Unbookmark" : " Bookmark"}
          </button>
        </li>
      );
    })
  ) : (
    <div>No itineraries available.</div>
  )}
</ul>

    </div>
  );
};

export default ItineraryList;
