import React from "react";
import PlaceList from "./Place/PlaceList";
import PlaceForm from "./Place/PlaceForm";
import TagForm from "./Tag/TagForm";
import ActivitiesList from "./Activity/ActivityListAdv";
import ItineraryList from "./Itinerary/ItinerariesList";

const PlaceManagement = () => {
  return (
    <div>
      <h1>Place Management</h1>
      <PlaceForm />
      <PlaceList />
      <h1>Create Tag</h1>
      <TagForm />
      <ActivitiesList />
      <ItineraryList />
    </div>
  );
};

export default PlaceManagement;
