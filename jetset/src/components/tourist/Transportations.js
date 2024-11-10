import React, { useEffect, useState } from "react";
import axios from "axios";

const Transportations = ({ touristId }) => {
  const [transportations, setTransportations] = useState([]);
  const [bookedTransportations, setBookedTransportations] = useState([]);
  const [selectedTransportationId, setSelectedTransportationId] =
    useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch activities, itineraries, and transportations
        const transportationsResponse = await axios.get("/gettrans");
        const touristResponse = await axios.get(`/getTourist/${touristId}`);
        setTransportations(transportationsResponse.data.transportation);

        // Set booked transportations from tourist data
        setBookedTransportations(touristResponse.data.bookedTransportations);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [touristId]);

  const handleBookTransportation = async (transportationId) => {
    setSelectedTransportationId(transportationId);
    try {
      const response = await axios.post(
        `/bookTransportation/${touristId}/${transportationId}`
      );
      alert(response.data.message);

      // Update booked transportations after booking
      setBookedTransportations([...bookedTransportations, transportationId]);
    } catch (error) {
      console.error("Error booking transportation", error);
      alert(error.response ? error.response.data.message : "Booking failed!");
    } finally {
      setSelectedTransportationId(null);
    }
  };

  return (
    <div>
      <h2>Transportations</h2>
      <ul>
        {transportations.map((transportation) => {
          const isBooked = bookedTransportations.includes(transportation._id);
          return (
            <li
              key={transportation._id}
              style={{
                backgroundColor:
                  selectedTransportationId === transportation._id
                    ? "#e0f7fa"
                    : "transparent",
              }}
            >
              {transportation.type} by {transportation.company} - $
              {transportation.price}
              <br />
              From {transportation.pickup_location} to{" "}
              {transportation.dropoff_location} on{" "}
              {new Date(transportation.availability).toLocaleDateString()}
              {isBooked ? (
                <span style={{ marginLeft: "10px", color: "green" }}>
                  Already Booked
                </span>
              ) : (
                <button
                  onClick={() => handleBookTransportation(transportation._id)}
                >
                  Book
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Transportations;
