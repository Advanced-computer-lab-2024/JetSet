import React, { useEffect, useState } from "react";
import axios from "axios";

const Transportations = ({ touristId }) => {
  const [transportations, setTransportations] = useState([]);
  const [bookedTransportations, setBookedTransportations] = useState([]); // Initialize as empty array
  const [selectedTransportationId, setSelectedTransportationId] =
    useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  const fetchConversionRate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency); // Set the currency
      setConversionRate(response.data.conversionRate); // Set the conversion rate
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, [touristId]); // Fetch conversion rate when touristId changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transportations
        const transportationsResponse = await axios.get(
          "http://localhost:3000/gettrans"
        );
        const touristResponse = await axios.get(
          `http://localhost:3000/getTourist/${touristId}`
        );

        setTransportations(transportationsResponse.data.transportation || []); // Ensure it's an array
        setBookedTransportations(
          touristResponse.data.bookedTransportations || []
        ); // Ensure it's an array
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
        `http://localhost:3000/bookTransportation/${touristId}/${transportationId}`
      );
      alert(response.data.message);

      // Update booked transportations after booking
      setBookedTransportations((prev) => [...prev, transportationId]);
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
              {transportation.type} by {transportation.company} -
              {(transportation.price * conversionRate).toFixed(2)}{" "}
              {selectedCurrency}
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
