import React, { useState } from "react";
import ItineraryList from "./Itinerary/ItinerariesList.js";
import TourGuideProfileForm from "./Tourguide/TourGuideProfileForm.js";
import ReadTourGuideProfileForm from "./Tourguide/ReadTourGuideProfileForm.js";
import CreateItineraryForm from "./Itinerary/CreateItineraryForm.js";
import UpdateItineraryForm from "./Itinerary/UpdateItineraryForm.js";
import DeleteItineraryForm from "./Itinerary/DeleteItineraryForm.js";
import ViewCreatedItineraries from "./Itinerary/ViewCreatedItineraries.js";
import Activate from "./Tourguide/Activate";
import Deactivate from "./Tourguide/Deactivate";
import ChangePasswordForm from "./Tourguide/ChangePasswordForm.js";
import DeleteAccount from "./Tourguide/DeleteAccount.js";
import { useParams } from "react-router-dom";

function TourGuide() {
  const { tourGuideID } = useParams();
  const [view, setView] = useState("itineraries");
  const [itineraryID, setItineraryID] = useState("");

  return (
    <div className="App">
      <header className="App-header">
        <h1>Itinerary App</h1>
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
            create Itinerary
          </button>
          <button onClick={() => setView("updateItinerary")}>
            Update Itinerary
          </button>
          <button onClick={() => setView("deleteItinerary")}>
            Delete Itinerary
          </button>
          <button onClick={() => setView("ViewCreatedItineraries")}>
            View My Created Itineraries
          </button>

          <button onClick={() => setView("activate")}>
            Activate Itinerary
          </button>
          <button onClick={() => setView("deactivate")}>
            Deactivate Itinerary
          </button>
          <button onClick={() => setView("ChangePassword")}>
            Change Password
          </button>
          <button onClick={() => setView("deleteAcc")}>
            Delete my account
          </button>
        </nav>

        {/* Input for itinerary ID */}
        {(view === "activate" || view === "deactivate") && (
          <div>
            <input
              type="text"
              placeholder="Enter Itinerary ID"
              value={itineraryID}
              onChange={(e) => setItineraryID(e.target.value)}
            />
          </div>
        )}

        {/* Conditional rendering based on view */}
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
        {view === "ViewCreatedItineraries" && (
          <ViewCreatedItineraries id={tourGuideID} />
        )}
        {view === "activate" && <Activate itineraryId={itineraryID} />}
        {view === "deactivate" && <Deactivate itineraryId={itineraryID} />}
        {view === "ChangePassword" && (
          <ChangePasswordForm tourGuideID={tourGuideID} />
        )}
        {view === "deleteAcc" && <DeleteAccount tourguideId={tourGuideID} />}
      </header>
    </div>
  );
}

export default TourGuide;
