import React, { useEffect, useState } from 'react';
import { getAllPlaces, deletePlace, updatePlace } from "./placeService";

const PlaceList = () => {
    const [places, setPlaces] = useState([]);
    const [editingPlace, setEditingPlace] = useState(null);
    const [updatedPlaceData, setUpdatedPlaceData] = useState({});

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const data = await getAllPlaces();
                setPlaces(data || []);  // If data is undefined, fallback to empty array
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
        setUpdatedPlaceData({ ...place });
    };

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
                        [coordName]: value
                    }
                }
            }));
        } else if (name === "location.address") {
            setUpdatedPlaceData((prevState) => ({
                ...prevState,
                location: {
                    ...prevState.location,
                    address: value
                }
            }));
        } else {
            setUpdatedPlaceData({ ...updatedPlaceData, [name]: value });
        }
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
                            {editingPlace === place._id ? (
                                <form onSubmit={handleUpdateSubmit}>
                                    <input
                                        name="Name"
                                        value={updatedPlaceData.Name || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <textarea
                                        name="Description"
                                        value={updatedPlaceData.Description || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        name="location.address"
                                        value={updatedPlaceData.location?.address || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="coordinates.lat"
                                        value={updatedPlaceData.location?.coordinates?.lat || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="coordinates.lng"
                                        value={updatedPlaceData.location?.coordinates?.lng || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        name="Pictures"
                                        value={updatedPlaceData.Pictures || ''}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        name="opening_hours"
                                        value={updatedPlaceData.opening_hours || ''}
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="number"
                                        name="TicketPricesF"
                                        value={updatedPlaceData.TicketPricesF || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="TicketPricesN"
                                        value={updatedPlaceData.TicketPricesN || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="TicketPricesS"
                                        value={updatedPlaceData.TicketPricesS || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <input
                                        name="managed_by"
                                        value={updatedPlaceData.managed_by || ''}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button type="submit">Update</button>
                                </form>
                            ) : (
                                <>
                                    {place.Name}
                                    
                                    <button onClick={() => handleEditClick(place)}>Edit</button>
                                    <button onClick={() => handleDelete(place._id)}>Delete</button>
                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No places found</li>
                )}
            </ul>
        </div>
    );
};

export default PlaceList;
