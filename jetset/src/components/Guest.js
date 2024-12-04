import React, { useState, useEffect } from "react";
import axios from "axios";
import ActivityList from "./Activity/ActivitiesList";
import ItineraryList from "./Itinerary/ItineraryTourist";
import HistoricalPlaces from "./Place/HistoricalPlacesList";
import Search from "./tourist/SearchComponent.js";
import ActivityByCategory from "./Activity/ActivitiesByCategory.js";
import VacationGuestGuide from "./Guest/VacationGuestGuide.js";
import ActivitiesListGuest from "./Activity/ActivitiesListGuest.js";
import ItineraryListGuest from "./Itinerary/ItineraryListGuest.js";
// Import the new ShareItem component

const Guest = () => {
  const [currentPage, setCurrentPage] = useState("home"); // Initial page

  const renderPage = () => {
    switch (currentPage) {
      case "activityList":
        return <ActivitiesListGuest />;
      case "itineraryList":
        return <ItineraryListGuest />;
      case "historicalPlaces":
        return <HistoricalPlaces />;
      case "search":
        return <Search />;
      case "activitiesByCategory":
        return <ActivityByCategory />;
      case "vacationguestguide": // New case for Vacation Guide
        return <VacationGuestGuide />;
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
            <button onClick={() => setCurrentPage("vacationguestguide")}>
              View Guest Vacation Guide
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
