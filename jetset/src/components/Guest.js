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
    <main
      className="App"
      aria-live="polite"
      style={{ border: "none", boxShadow: "none", background: "transparent" }}
    >
      {isSubPage && (
        <button
          type="button"
          onClick={() => setCurrentPage("home")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "transparent",
            color: "var(--color-primary)",
            border: "none",
            padding: "0.5rem 0",
            marginBottom: "1.5rem",
            fontWeight: 600,
            cursor: "pointer",
            minHeight: "auto",
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
          <div className="button-grid" style={{ gap: "1.25rem" }}>
            {guestActions.map(({ key, label, description, icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentPage(key)}
                aria-label={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "2rem 1.25rem",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-line)",
                  borderRadius: "var(--radius-lg)",
                  color: "var(--color-ink)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,76,129,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                  }}
                >
                  <FontAwesomeIcon icon={icon} />
                </span>
                <span style={{ fontWeight: 700, fontSize: "1.05rem" }}>{label}</span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--color-muted)",
                    lineHeight: 1.4,
                  }}
                >
                  {description}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Guest;
