import React, { useState } from "react";
import ItineraryList from "./Itinerary/ItinerariesList.js";
import TourGuideProfileForm from "./Tourguide/TourGuideProfileForm.js";
import ReadTourGuideProfileForm from "./Tourguide/ReadTourGuideProfileForm.js";
import CreateItineraryForm from "./Itinerary/CreateItineraryForm.js";
import UpdateItineraryForm from "./Itinerary/UpdateItineraryForm.js";
import DeleteItineraryForm from "./Itinerary/DeleteItineraryForm.js";
import CreateTouristItineraryForm from "./TouristItinerary/CreateTouristItineraryForm.js";
import UpdateTouristItineraryForm from "./TouristItinerary/UpdateTouristItineraryForm.js";
import DeleteTouristItineraryForm from "./TouristItinerary/DeleteTouristItineraryForm.js";
import ViewCreatedItineraries from "./Itinerary/ViewCreatedItineraries.js";
import ReadItineraryList from "./Itinerary/ReadItineraryList.js";

function TourGuide() {
  const [view, setView] = useState("itineraries"); // State to toggle between views
  const tourGuideID = "66fff1c213c1a607c2caa0c6"; // Replace with actual ID or fetch dynamically
  const itineraryID = "66fd08a45089bdf6b2ccca65";
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
