// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ActivitiesAndItineraries = ({ touristId }) => {
//   const [activities, setActivities] = useState([]);
//   const [itineraries, setItineraries] = useState([]);
//   const [selectedActivityId, setSelectedActivityId] = useState(null); // Track selected activity
//   const [selectedItineraryId, setSelectedItineraryId] = useState(null); // Track selected itinerary

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const activitiesResponse = await axios.get("/getactivity");
//         const itinerariesResponse = await axios.get("/Itineraries");
//         setActivities(activitiesResponse.data);
//         setItineraries(itinerariesResponse.data);
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleBookActivity = async (activityId) => {
//     setSelectedActivityId(activityId); // Set the selected activity ID
//     try {
//       const response = await axios.post(`/book/670d4935dcbc415cf0e18713/activity/${activityId}`);
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error booking activity", error);
//       alert(error.response ? error.response.data.message : "Booking failed!");
//     } finally {
//       setSelectedActivityId(null); // Reset selection after booking
//     }
//   };

//   const handleBookItinerary = async (itineraryId) => {
//     setSelectedItineraryId(itineraryId); // Set the selected itinerary ID
//     try {
//       const response = await axios.post(`/book/670d4935dcbc415cf0e18713/itinerary/${itineraryId}`);
//       alert(response.data.message);
//     } catch (error) {
//       console.error("Error booking itinerary", error);
//       alert(error.response ? error.response.data.message : "Booking failed!");
//     } finally {
//       setSelectedItineraryId(null); // Reset selection after booking
//     }
//   };

//   return (
//     <div>
//       <h2>Activities</h2>
//       <ul>
//         {activities.map((activity) => (
//           <li key={activity._id} style={{ backgroundColor: selectedActivityId === activity._id ? '#e0f7fa' : 'transparent' }}>
//             {activity.title} - ${activity.budget}
//             <button onClick={() => handleBookActivity(activity._id)}>Book</button>
//           </li>
//         ))}
//       </ul>

//       <h2>Itineraries</h2>
//       <ul>
//         {itineraries.map((itinerary) => (
//           <li key={itinerary._id} style={{ backgroundColor: selectedItineraryId === itinerary._id ? '#e0f7fa' : 'transparent' }}>
//             {itinerary.name} - Budget: ${itinerary.budget}
//             <button onClick={() => handleBookItinerary(itinerary._id)}>Book</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ActivitiesAndItineraries;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivitiesAndItineraries = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [bookedActivities, setBookedActivities] = useState([]);
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesResponse = await axios.get("/Acttour");
        const itinerariesResponse = await axios.get("/itiTour");
        setActivities(activitiesResponse.data);
        setItineraries(itinerariesResponse.data);

        // Fetch tourist data to get booked activities and itineraries
        const touristResponse = await axios.get(`/getTourist/${touristId}`);
        setBookedActivities(touristResponse.data.bookedActivities);
        setBookedItineraries(touristResponse.data.bookedItineraries);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [touristId]);

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

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  const handleBookActivity = async (activityId) => {
    setSelectedActivityId(activityId);
    try {
      const response = await axios.post(
        `/book/${touristId}/activity/${activityId}`
      );
      alert(response.data.message);
      // Update booked activities after booking
      setBookedActivities([...bookedActivities, activityId]);
    } catch (error) {
      console.error("Error booking activity", error);
      alert(error.response ? error.response.data.message : "Booking failed!");
    } finally {
      setSelectedActivityId(null);
    }
  };

  const handleCancelActivity = async (activityId) => {
    setSelectedActivityId(activityId);
    try {
      const response = await axios.delete(
        `/cancelActivity/${touristId}/${activityId}`
      );
      alert(response.data.message);
      // Update booked activities after cancellation
      setBookedActivities(bookedActivities.filter((id) => id !== activityId));
    } catch (error) {
      console.error("Error cancelling activity", error);
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
        `/book/${touristId}/itinerary/${itineraryId}`
      );
      alert(response.data.message);
      // Update booked itineraries after booking
      setBookedItineraries([...bookedItineraries, itineraryId]);
    } catch (error) {
      console.error("Error booking itinerary", error);
      alert(error.response ? error.response.data.message : "Booking failed!");
    } finally {
      setSelectedItineraryId(null);
    }
  };

  const handleCancelItinerary = async (itineraryId) => {
    setSelectedItineraryId(itineraryId);
    try {
      const response = await axios.delete(
        `/cancelItinerary/${touristId}/${itineraryId}`
      );
      alert(response.data.message);
      // Update booked itineraries after cancellation
      setBookedItineraries(
        bookedItineraries.filter((id) => id !== itineraryId)
      );
    } catch (error) {
      console.error("Error cancelling itinerary", error);
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
              {activity.title} - {(activity.budget * conversionRate).toFixed(2)}
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
              {(itinerary.budget * conversionRate).toFixed(2)}
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
    </div>
  );
};

export default ActivitiesAndItineraries;
