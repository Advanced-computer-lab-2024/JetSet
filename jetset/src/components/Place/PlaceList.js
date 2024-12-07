import React, { useEffect, useState } from "react";
import { getAllPlaces, deletePlace, updatePlace } from "./placeService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const PlaceList = () => {
  const [places, setPlaces] = useState([]);
  const [editingPlace, setEditingPlace] = useState(null);
  const [updatedPlaceData, setUpdatedPlaceData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getAllPlaces();
        setPlaces(data || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };
    fetchPlaces();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePlace(id);
      setPlaces(places.filter((place) => place._id !== id));
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const handleEditClick = (place) => {
    setEditingPlace(place._id);
    setUpdatedPlaceData({
      ...place,
      location: {
        address: place.location?.address || "",
        coordinates: {
          lat: place.location?.coordinates?.lat || "",
          lng: place.location?.coordinates?.lng || "",
        },
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUpdatedPlaceData((prevState) => {
      if (name.startsWith("coordinates.")) {
        const coordName = name.split(".")[1];
        return {
          ...prevState,
          location: {
            ...prevState.location,
            coordinates: {
              ...prevState.location?.coordinates,
              [coordName]: value,
            },
          },
        };
      } else if (name === "location.address") {
        return {
          ...prevState,
          location: {
            ...prevState.location,
            address: value,
          },
        };
      } else {
        return { ...prevState, [name]: value };
      }
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePlace(editingPlace, updatedPlaceData);
      setEditingPlace(null);
      const updatedPlaces = await getAllPlaces();
      setPlaces(updatedPlaces);
    } catch (error) {
      console.error("Error updating place:", error);
    }
  };

  return (
    <div>
      <h2>Places</h2>
      <ul>
        {places.length > 0 ? (
          places.map((place) => (
            <li key={place._id}>
              <label>Name:</label>
              {editingPlace === place._id ? (
                <form onSubmit={handleUpdateSubmit}>
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
                    required
                  />
                  <label>Address:</label>
                  <input
                    name="location.address"
                    value={updatedPlaceData.location?.address || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Latitude:</label>
                  <input
                    type="number"
                    name="coordinates.lat"
                    value={updatedPlaceData.location?.coordinates?.lat || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <label>Longitude:</label>
                  <input
                    type="number"
                    name="coordinates.lng"
                    value={updatedPlaceData.location?.coordinates?.lng || ""}
                    onChange={handleInputChange}
                    required
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
                    required
                  />
                  <button type="submit">Update</button>
                </form>
              ) : (
                <>
                  {place.Name}
                  <button onClick={() => handleEditClick(place)}>Edit</button>
                  <button onClick={() => handleDelete(place._id)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <li>No places found</li>
        )}
      </ul>
      <button className="back-button" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} /> Back
    </button>
    </div>
  );
};

export default PlaceList;
