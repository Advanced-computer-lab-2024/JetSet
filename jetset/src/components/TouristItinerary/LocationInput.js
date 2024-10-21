import React, { useState } from "react";

const LocationInput = ({ onChange }) => {
  const [location, setLocation] = useState({
    address: "",
    coordinates: { lat: "", lng: "" },
  });

  // Handle the change for individual fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation((prevLocation) => {
      // Update coordinates or address based on the name
      if (name === "address") {
        return { ...prevLocation, address: value };
      } else if (name === "lat" || name === "lng") {
        return {
          ...prevLocation,
          coordinates: {
            ...prevLocation.coordinates,
            [name]: value,
          },
        };
      }
    });

    // Pass the updated location to the parent form
    onChange({
      ...location,
      [name]: value,
    });
  };

  return (
    <div className="location-input">
      <h3>Location</h3>
      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={location.address}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Latitude:</label>
        <input
          type="number"
          name="lat"
          value={location.coordinates.lat}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Longitude:</label>
        <input
          type="number"
          name="lng"
          value={location.coordinates.lng}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default LocationInput;
