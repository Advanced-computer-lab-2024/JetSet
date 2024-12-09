import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivitiesAndItineraries = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [bookedActivities, setBookedActivities] = useState([]); // Initialize as empty array
  const [bookedItineraries, setBookedItineraries] = useState([]); // Initialize as empty array
  const [wallet, setWallet] = useState(0);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesResponse = await axios.get(
          "http://localhost:3000/Acttour"
        );
        const itinerariesResponse = await axios.get(
          "http://localhost:3000/itiTour"
        );
        setActivities(activitiesResponse.data);
        setItineraries(itinerariesResponse.data);

        const touristResponse = await axios.get(
          `http://localhost:3000/getTourist/${touristId}`
        );
        setBookedActivities(touristResponse.data.bookedActivities || []); // Ensure it's an array
        setBookedItineraries(touristResponse.data.bookedItineraries || []); // Ensure it's an array
        setWallet(touristResponse.data.wallet);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [touristId]);

  const fetchConversionRate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency);
      setConversionRate(response.data.conversionRate);
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchConversionRate();
  }, [touristId]);

  const handleBookActivity = async (activityId) => {
    setSelectedActivityId(activityId);
    try {
      const response = await axios.post(
        `http://localhost:3000/book/${touristId}/activity/${activityId}`
      );
      alert(response.data.message);
      setBookedActivities((prev) => [...prev, activityId]);
    } catch (error) {
      alert(error.response ? error.response.data.message : "Booking failed!");
    } finally {
      setSelectedActivityId(null);
    }
  };

  const handleCancelActivity = async (activityId) => {
    setSelectedActivityId(activityId);
    try {
      const response = await axios.delete(
        `http://localhost:3000/cancelActivity/${touristId}/${activityId}`
      );
      alert(response.data.message);
      setBookedActivities((prev) => prev.filter((id) => id !== activityId));
      setWallet(response.data.updatedWallet);
      triggerNotification();
    } catch (error) {
      alert(
        error.response ? error.response.data.message : "Cancellation failed!"
      );
    } finally {
      setSelectedActivityId(null);
    }
  };

  const handleBookItinerary = async (itineraryId) => {
    setSelectedItineraryId(itineraryId);
    try {
      const response = await axios.post(
        `http://localhost:3000/book/${touristId}/itinerary/${itineraryId}`
      );
      alert(response.data.message);
      setBookedItineraries((prev) => [...prev, itineraryId]);
    } catch (error) {
      alert(error.response ? error.response.data.message : "Booking failed!");
    } finally {
      setSelectedItineraryId(null);
    }
  };

  const handleCancelItinerary = async (itineraryId) => {
    setSelectedItineraryId(itineraryId);
    try {
      const response = await axios.delete(
        `http://localhost:3000/c ancelItinerary/${touristId}/${itineraryId}`
      );
      alert(response.data.message);
      setBookedItineraries((prev) => prev.filter((id) => id !== itineraryId));
      setWallet(response.data.updatedWallet);
      triggerNotification();
    } catch (error) {
      alert(
        error.response ? error.response.data.message : "Cancellation failed!"
      );
    } finally {
      setSelectedItineraryId(null);
    }
  };

  return (
    <div>
      <h2>Activities</h2>
      <ul>
        {activities.map((activity) => {
          const isBooked = bookedActivities.includes(activity._id);
          return (
            <li
              key={activity._id}
              style={{
                backgroundColor:
                  selectedActivityId === activity._id
                    ? "#e0f7fa"
                    : "transparent",
              }}
            >
              {activity.title} - {(activity.budget * conversionRate).toFixed(2)}{" "}
              {selectedCurrency}
              {isBooked ? (
                <button onClick={() => handleCancelActivity(activity._id)}>
                  Cancel
                </button>
              ) : (
                <button onClick={() => handleBookActivity(activity._id)}>
                  Book
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <h2>Itineraries</h2>
      <ul>
        {itineraries.map((itinerary) => {
          const isBooked = bookedItineraries.includes(itinerary._id);
          return (
            <li
              key={itinerary._id}
              style={{
                backgroundColor:
                  selectedItineraryId === itinerary._id
                    ? "#e0f7fa"
                    : "transparent",
              }}
            >
              {itinerary.name} - Budget:{" "}
              {(itinerary.budget * conversionRate).toFixed(2)}{" "}
              {selectedCurrency}
              {isBooked ? (
                <button onClick={() => handleCancelItinerary(itinerary._id)}>
                  Cancel
                </button>
              ) : (
                <button onClick={() => handleBookItinerary(itinerary._id)}>
                  Book
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* Wallet Notification */}
      {showNotification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "15px",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          Wallet Updated: ${wallet.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default ActivitiesAndItineraries;
