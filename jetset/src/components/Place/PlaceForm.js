import React, { useState } from "react";
import { createPlace } from "./placeService";

const PlaceForm = () => {
  const [updatedPlaceData, setUpdatedPlaceData] = useState({
    Name: "",
    Description: "",
    location: {
      address: "",
      coordinates: {
        lat: "",
        lng: "",
      },
    },
    Pictures: "",
    opening_hours: "",
    TicketPricesF: "",
    TicketPricesN: "",
    TicketPricesS: "",
    managed_by: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("coordinates.")) {
      const coordName = name.split(".")[1];
      setUpdatedPlaceData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          coordinates: {
            ...prevState.location.coordinates,
            [coordName]: value,
          },
        },
      }));
    } else if (name === "location.address") {
      setUpdatedPlaceData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          address: value,
        },
      }));
    } else if (name === "Pictures") {
      setUpdatedPlaceData((prevState) => ({
        ...prevState,
        Pictures: value,
      }));
    } else {
      setUpdatedPlaceData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPlace(updatedPlaceData);
      alert("Place created successfully!"); // Provide feedback to the user
      setUpdatedPlaceData({
        Name: "",
        Description: "",
        location: {
          address: "",
          coordinates: {
            lat: "",
            lng: "",
          },
        },
        Pictures: "",
        opening_hours: "",
        TicketPricesF: "",
        TicketPricesN: "",
        TicketPricesS: "",
        managed_by: "",
      });
    } catch (error) {
      alert("Error creating place: " + error.message); // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        name="Name"
        value={updatedPlaceData.Name || ""}
        onChange={handleInputChange}
        required
      />

      <label>Description:</label>
      <textarea
        name="Description"
        value={updatedPlaceData.Description || ""}
        onChange={handleInputChange}
      />

      <label>Address:</label>
      <input
        name="location.address"
        value={updatedPlaceData.location.address || ""}
        onChange={handleInputChange}
        required
      />

      <label>Latitude:</label>
      <input
        type="number"
        name="coordinates.lat"
        value={updatedPlaceData.location.coordinates.lat || ""}
        onChange={handleInputChange}
      />

      <label>Longitude:</label>
      <input
        type="number"
        name="coordinates.lng"
        value={updatedPlaceData.location.coordinates.lng || ""}
        onChange={handleInputChange}
      />

      <label>Pictures (comma-separated URLs):</label>
      <input
        name="Pictures"
        value={updatedPlaceData.Pictures || ""}
        onChange={handleInputChange}
      />

      <label>Opening Hours:</label>
      <input
        name="opening_hours"
        value={updatedPlaceData.opening_hours || ""}
        onChange={handleInputChange}
      />

      <label>Ticket Prices (Full):</label>
      <input
        type="number"
        name="TicketPricesF"
        value={updatedPlaceData.TicketPricesF || ""}
        onChange={handleInputChange}
        required
      />

      <label>Ticket Prices (Normal):</label>
      <input
        type="number"
        name="TicketPricesN"
        value={updatedPlaceData.TicketPricesN || ""}
        onChange={handleInputChange}
        required
      />

      <label>Ticket Prices (Student):</label>
      <input
        type="number"
        name="TicketPricesS"
        value={updatedPlaceData.TicketPricesS || ""}
        onChange={handleInputChange}
        required
      />

      <label>Managed By (Tourism Governor ID):</label>
      <input
        name="managed_by"
        value={updatedPlaceData.managed_by || ""}
        onChange={handleInputChange}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default PlaceForm;
