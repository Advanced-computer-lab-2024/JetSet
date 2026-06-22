import React, { useState } from "react";
import HistoricalPlaces from "./Place/HistoricalPlacesList";
import Search from "./tourist/SearchComponent.js";
import ActivityByCategory from "./Activity/ActivitiesByCategory.js";
import VacationGuestGuide from "./Guest/VacationGuestGuide.js";
import ActivitiesListGuest from "./Activity/ActivitiesListGuest.js";
import ItineraryListGuest from "./Itinerary/ItineraryListGuest.js";
// Import the new ShareItem component

const Guest = () => {
  const [currentPage, setCurrentPage] = useState("home"); // Initial page
  const guestActions = [
    ["activityList", "View Activities"],
    ["itineraryList", "View Itineraries"],
    ["historicalPlaces", "View Historical Places"],
    ["search", "Search"],
    ["activitiesByCategory", "Filter Activities by Category"],
    ["vacationguestguide", "View Guest Vacation Guide"],
  ];

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
          <div className="button-grid">
            {guestActions.map(([page, label]) => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)}>
                {label}
              </button>
            ))}
          </div>
        );
    }
  };
  return (
    <main className="App" aria-live="polite">
      {renderPage()} {/* Render the current page */}
    </main>
  );
};

export default Guest;
