import React, { useEffect, useState } from "react";
import { getAllPlaces, deletePlace, updatePlace } from "./placeService";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import CreatePlace from "./CreatePlace"; // Import the CreatePlace component
import PlaceForm from "./PlaceForm";
import TourismGovernorNav from "../TourismGovernorNav";

// import PlaceManagement from "./jetset/src/components/TourismGovernor"; 
const PlaceList = () => {
  const [places, setPlaces] = useState([]);
  const [editingPlace, setEditingPlace] = useState(null);
  const [updatedPlaceData, setUpdatedPlaceData] = useState({});
  const [showCreatePlaceForm, setShowCreatePlaceForm] = useState(false); // State to control the CreatePlace form visibility
  const [currentSection, setCurrentSection] = useState("places");

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
  const renderSectionContent = () => {
    switch (currentSection) {
      case "dashboard":
        return (
          <div>
      {/* <PlaceManagement /> */}
    </div>
        );
      case "places":
        return (
          <div className="place-list">
            <h2>Places</h2>

            <ul style={{ listStyle: "none", padding: 0 }}>
              {places.map((place) => (
                <li
                  key={place._id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {editingPlace === place._id ? (
                    <form onSubmit={handleUpdateSubmit}>
                      <div>
                        <label>
                          Name:
                          <input
                            type="text"
                            name="Name"
                            value={updatedPlaceData.Name || ""}
                            onChange={handleInputChange}
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          Description:
                          <textarea
                            name="Description"
                            value={updatedPlaceData.Description || ""}
                            onChange={handleInputChange}
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          Address:
                          <input
                            type="text"
                            name="location.address"
                            value={updatedPlaceData.location?.address || ""}
                            onChange={handleInputChange}
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          Latitude:
                          <input
                            type="number"
                            name="coordinates.lat"
                            value={updatedPlaceData.location?.coordinates?.lat || ""}
                            onChange={handleInputChange}
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label>
                          Longitude:
                          <input
                            type="number"
                            name="coordinates.lng"
                            value={updatedPlaceData.location?.coordinates?.lng || ""}
                            onChange={handleInputChange}
                            required
                          />
                        </label>
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
                      </div>
                      <div>
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setEditingPlace(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
  <div>
    <strong>Name:</strong> {place.Name}
  </div>
  <div>
    <strong>Description:</strong> {place.Description}
  </div>
  <div>
    <strong>Address:</strong> {place.location?.address || "N/A"}
  </div>
  <div>
    <strong>Latitude:</strong> {place.location?.coordinates?.lat || "N/A"}
  </div>
  <div>
    <strong>Longitude:</strong> {place.location?.coordinates?.lng || "N/A"}
  </div>
  <div>
    <strong>Pictures:</strong> {place.Pictures ? place.Pictures.join(", ") : "N/A"}
  </div>
  <div>
    <strong>Opening Hours:</strong> {place.opening_hours || "N/A"}
  </div>
  <div>
      <strong>Ticket Prices (Full): </strong>{place.TicketPricesF || "N/A"}
  </div>
  <div>
      <strong>Ticket Prices (Normal): </strong>{place.TicketPricesN || "N/A"}
  </div>
  <div>
      <strong>Ticket Prices (Student): </strong>{place.TicketPricesS || "N/A"}
  {/* </div>
    </ul> */}
  </div>
  <div>
    <strong>Managed By:</strong> {place.managed_by || "N/A"}
  </div>
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
    <a
      href="#"
      style={{
        color: "#007BFF",
        cursor: "pointer",
        textDecoration: "underline",
        marginRight: "10px",
      }}
      onClick={() => handleEditClick(place)}
    >
      Edit
    </a>
    <a
      href="#"
      style={{
        color: "#FF5733",
        cursor: "pointer",
        textDecoration: "underline",
      }}
      onClick={() => handleDelete(place._id)}
    >
      Delete
    </a>
  </div>
</div>
                  )}
                </li>
              ))}
            </ul>
            {!showCreatePlaceForm && (
              <p
                style={{
                  color: "#007BFF",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textAlign: "center",
                  marginTop: "20px",
                }}
                onClick={() => setShowCreatePlaceForm(true)}
              >
                Add a new place
              </p>
            )}
      
            {/* Show the CreatePlace form */}
            {showCreatePlaceForm && <PlaceForm />}
            {/* <button className="back-button" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button> */}
          </div>
        );
 
      case "tags":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/tags")}
            >
              ➕ Add New Tag
            </button>
          </div>
        );
      case "activities":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/activities")}
            >
              🔍 View Activities
            </button>
          </div>
        );
      case "itineraries":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/itineraries")}
            >
              📜 View Itineraries
            </button>
          </div>
        );
      case "changePassword":
        return (
          <div>
            <button
              className="action-button"
              onClick={() => navigate("/changepass")}
            >
              🔑 Change Password
            </button>
          </div>
        );
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };
  return (
    <div className="admin-frontend">
                <TourismGovernorNav  />

      <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <ul>
          <li onClick={() => navigate("/changemainTourismG")}>🏠 Dashboard</li>
          <li onClick={() => navigate("/places")}>📍 Places</li>
          <li onClick={() => navigate("/tags")}>🏷️ Tags</li>
          <li  onClick={() => navigate("/activities")}>🎭 Activities</li>
          <li onClick={() => navigate("/itineraries")}>
            📜 Itineraries</li>
         
        </ul>
      </aside>
<main className="admin-main-content">{renderSectionContent()}</main>

    </div>
    </div>
  );
}

      
 
export default PlaceList;
