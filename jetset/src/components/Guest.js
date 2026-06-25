import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faRoute,
  faLandmark,
  faSearch,
  faFilter,
  faMap,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import HistoricalPlaces from "./Place/HistoricalPlacesList";
import Search from "./tourist/SearchComponent.js";
import ActivityByCategory from "./Activity/ActivitiesByCategory.js";
import VacationGuestGuide from "./Guest/VacationGuestGuide.js";
import ActivitiesListGuest from "./Activity/ActivitiesListGuest.js";
import ItineraryListGuest from "./Itinerary/ItineraryListGuest.js";

const guestActions = [
  {
    key: "activityList",
    label: "Activities",
    description: "Browse curated activities and experiences",
    icon: faCompass,
  },
  {
    key: "itineraryList",
    label: "Itineraries",
    description: "Explore ready-made travel itineraries",
    icon: faRoute,
  },
  {
    key: "historicalPlaces",
    label: "Historical Places",
    description: "Discover landmarks and cultural sites",
    icon: faLandmark,
  },
  {
    key: "search",
    label: "Search",
    description: "Find activities, places, and more",
    icon: faSearch,
  },
  {
    key: "activitiesByCategory",
    label: "Filter by Category",
    description: "Filter activities by interest category",
    icon: faFilter,
  },
  {
    key: "vacationguestguide",
    label: "Vacation Guide",
    description: "Get personalized vacation recommendations",
    icon: faMap,
  },
];

const Guest = () => {
  const [currentPage, setCurrentPage] = useState("home");

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
      case "vacationguestguide":
        return <VacationGuestGuide />;
      default:
        return null;
    }
  };

  const isSubPage = currentPage !== "home";

  return (
    <main aria-live="polite">
      {isSubPage && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setCurrentPage("home")}
          style={{
            padding: "0.5rem 0",
            marginBottom: "1.5rem",
            fontWeight: 600,
          }}
          aria-label="Back to browsing options"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Explore
        </button>
      )}

      {isSubPage ? (
        renderPage()
      ) : (
        <>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "2rem",
                color: "var(--color-primary-strong)",
                marginBottom: "0.5rem",
              }}
            >
              Explore as a Guest
            </h2>
            <p style={{ color: "var(--color-muted)", maxWidth: 520, margin: "0 auto" }}>
              Browse activities, itineraries, and historical places without an account.
            </p>
          </div>
          <div className="card-grid">
            {guestActions.map(({ key, label, description, icon }) => (
              <button
                key={key}
                type="button"
                className="feature-card"
                onClick={() => setCurrentPage(key)}
                aria-label={label}
                style={{
                  cursor: "pointer",
                  border: "1px solid var(--color-line)",
                  width: "100%",
                  height: "100%",
                }}
              >
                <span className="feature-icon">
                  <FontAwesomeIcon icon={icon} />
                </span>
                <h3>{label}</h3>
                <p>{description}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Guest;
