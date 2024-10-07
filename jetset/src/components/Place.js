import React from "react";
import PlaceList from "./PlaceList";
import PlaceForm from "./PlaceForm";
import TagForm from "./TagForm";
import ActivitiesList from "./ActivityListAdv";

const PlaceManagement = () => {
  return (
    <div>
      <h1>Place Management</h1>
      <PlaceForm />
      <PlaceList />
      <h1>Create Tag</h1>
      <TagForm />
      <ActivitiesList />
    </div>
  );
};

export default PlaceManagement;
