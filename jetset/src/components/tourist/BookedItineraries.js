import React, { useEffect, useState } from "react";
import axios from "axios";

const BookedItineraries = ({ touristId }) => {
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  const fetchConversionRate = async (currency) => {
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

  // Fetch booked itineraries on component mount
  useEffect(() => {
    const fetchBookedItineraries = async () => {
      try {
        const response = await axios.get(`/bookedIti/${touristId}`);
        setBookedItineraries(response.data.bookedItineraries);
      } catch (error) {
        setError("Error fetching booked itineraries");
      }
    };
    fetchBookedItineraries();
  }, [touristId]);

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  // Cancel itinerary booking
  const cancelBooking = async (itineraryId) => {
    try {
      const response = await axios.delete(
        `/cancelItinerary/${touristId}/${itineraryId}`
      );
      alert(response.data.message);
      // Refresh itineraries after cancellation
      setBookedItineraries((prevItineraries) =>
        prevItineraries.filter((itinerary) => itinerary._id !== itineraryId)
      );
    } catch (error) {
      setError(error.response?.data?.message || "Error cancelling booking");
    }
  };

  return (
    <div>
      <h2>Booked Itineraries</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {bookedItineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h3>{itinerary.name}</h3>
            <p>{itinerary.description}</p>
            <button onClick={() => cancelBooking(itinerary._id)}>
              Cancel Booking
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookedItineraries;
