import React, { useState } from "react";
import ItineraryList from "./ItinerariesList.js";
import TourGuideProfileForm from "./TourGuideProfileForm.js";
import ReadTourGuideProfileForm from "./ReadTourGuideProfileForm.js";
import CreateItineraryForm from "./CreateItineraryForm.js";
import UpdateItineraryForm from "./UpdateItineraryForm.js";
import DeleteItineraryForm from "./DeleteItineraryForm.js";
import CreateTouristItineraryForm from "./CreateTouristItineraryForm.js";
import UpdateTouristItineraryForm from "./UpdateTouristItineraryForm.js";
import DeleteTouristItineraryForm from "./DeleteTouristItineraryForm.js";
import ViewCreatedItineraries from "./ViewCreatedItineraries.js";
import ReadItineraryList from "./ReadItineraryList.js";

function TourGuide() {
  const [view, setView] = useState("itineraries"); // State to toggle between views
  const tourGuideID = "66fff1c213c1a607c2caa0c6"; // Replace with actual ID or fetch dynamically
  const itineraryID = "66fd3b7c4cbb146dc4da1afb";
  const TouristitineraryID = "6702626ec741235c6ae2d87c";

  return (
    <div className="App">
      <header className="App-header">
        <h1>Itinerary App</h1>
        {/* Buttons to toggle views */}
        <nav>
          <button onClick={() => setView("itineraries")}>
            View Itineraries
          </button>
          <button onClick={() => setView("tourGuideProfile")}>
            Create and Update Tour Guide Profile
          </button>
          <button onClick={() => setView("readtourGuideProfile")}>
            My Profile
          </button>
          <button onClick={() => setView("createItinerary")}>
            Create Itinerary
          </button>
          <button onClick={() => setView("updateItinerary")}>
            Update Itinerary
          </button>
          <button onClick={() => setView("deleteItinerary")}>
            Delete Itinerary
          </button>
          <button onClick={() => setView("createTouristItinerary")}>
            Create Tourist Itinerary
          </button>
          <button onClick={() => setView("updateTouristItinerary")}>
            Update Tourist Itinerary
          </button>
          <button onClick={() => setView("deleteTouristItinerary")}>
            Delete Tourist Itinerary
          </button>
          <button onClick={() => setView("ViewCreatedItineraries")}>
            View My Created Itineraries
          </button>
          <button onClick={() => setView("ReadTouristItinerary")}>
            Read Tourist Itinerary
          </button>
        </nav>

        {/* Conditionally render components based on the view */}
        {view === "itineraries" && <ItineraryList />}
        {view === "tourGuideProfile" && (
          <TourGuideProfileForm tourGuideID={tourGuideID} />
        )}
        {view === "readtourGuideProfile" && (
          <ReadTourGuideProfileForm tourGuideID={tourGuideID} />
        )}
        {view === "createItinerary" && <CreateItineraryForm />}
        {view === "updateItinerary" && (
          <UpdateItineraryForm itineraryID={itineraryID} />
        )}
        {view === "deleteItinerary" && <DeleteItineraryForm />}
        {view === "createTouristItinerary" && (
          <CreateTouristItineraryForm id={tourGuideID} />
        )}
        {view === "ReadTouristItinerary" && <ReadItineraryList />}
        {view === "updateTouristItinerary" && (
          <UpdateTouristItineraryForm TouristitineraryID={TouristitineraryID} />
        )}
        {view === "deleteTouristItinerary" && (
          <DeleteTouristItineraryForm TouristitineraryID={TouristitineraryID} />
        )}
        {view === "ViewCreatedItineraries" && (
          <ViewCreatedItineraries id={tourGuideID} />
        )}
      </header>
    </div>
  );
}

export default TourGuide;
