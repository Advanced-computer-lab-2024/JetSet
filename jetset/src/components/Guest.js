import React, { useState, useEffect } from "react";
import axios from "axios";
import ActivityList from "./Activity/ActivitiesList.js";
import ItineraryList from "./Itinerary/ItineraryList.js";
import HistoricalPlaces from "./Place/HistoricalPlacesList.js";
import Search from "./tourist/SearchComponent.js";
import ActivityByCategory from "./Activity/ActivitiesByCategory.js";
// Import the new ShareItem component

import "./styles.css";

const Guest = () => {
  const [currentPage, setCurrentPage] = useState("home"); // Initial page

  const renderPage = () => {
    switch (currentPage) {
      case "activityList":
        return <ActivityList />;
      case "itineraryList":
        return <ItineraryList />;
      case "historicalPlaces":
        return <HistoricalPlaces />;
      case "search":
        return <Search />;
      case "activitiesByCategory":
        return <ActivityByCategory />;
      default:
        return (
          <div>
            <button onClick={() => setCurrentPage("activityList")}>
              View Activities
            </button>
            <button onClick={() => setCurrentPage("itineraryList")}>
              View Itineraries
            </button>
            <button onClick={() => setCurrentPage("historicalPlaces")}>
              View Historical Places
            </button>
            <button onClick={() => setCurrentPage("search")}>Search</button>
            <button onClick={() => setCurrentPage("activitiesByCategory")}>
              Filter Activities by Category
            </button>
          </div>
        );
    }
  };
  return (
    <div className="App">
      {renderPage()} {/* Render the current page */}
    </div>
  );
};

export default Guest;
