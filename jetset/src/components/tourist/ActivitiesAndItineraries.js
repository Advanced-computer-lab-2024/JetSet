import React, { useEffect, useState } from "react";
import axios from "axios";

const ActivitiesAndItineraries = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [bookedActivities, setBookedActivities] = useState([]);
  const [bookedItineraries, setBookedItineraries] = useState([]);
  const [wallet, setWallet] = useState(0); // Track tourist's wallet balance
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  const [showNotification, setShowNotification] = useState(false);



  const triggerNotification = () => {
    console.log("Triggering notification...");
    setShowNotification(true);
    setTimeout(() => {
      console.log("Hiding notification...");
      setShowNotification(false);
    }, 3000);
  };


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
        setWallet(touristResponse.data.wallet);
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
      // Update wallet balance from server response
      const updatedWallet = response.data.updatedWallet;
      setWallet(updatedWallet);
      triggerNotification();
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
      // Update wallet balance from server response
      const updatedWallet = response.data.updatedWallet;
      setWallet(updatedWallet);
      triggerNotification();
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

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ActivitiesAndItineraries = ({ touristId }) => {
//   const [activities, setActivities] = useState([]);
//   const [itineraries, setItineraries] = useState([]);
//   const [bookedActivities, setBookedActivities] = useState([]);
//   const [bookedItineraries, setBookedItineraries] = useState([]);
//   const [wallet, setWallet] = useState(0);
//   const [selectedActivityId, setSelectedActivityId] = useState(null);
//   const [selectedItineraryId, setSelectedItineraryId] = useState(null);
//   const [selectedCurrency, setSelectedCurrency] = useState("EGP");
//   const [conversionRate, setConversionRate] = useState(1);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalContent, setModalContent] = useState("");

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const activitiesResponse = await axios.get("/Acttour");
//         const itinerariesResponse = await axios.get("/itiTour");
//         const touristResponse = await axios.get(`/getTourist/${touristId}`);
        
//         setActivities(activitiesResponse.data);
//         setItineraries(itinerariesResponse.data);
//         setBookedActivities(touristResponse.data.bookedActivities);
//         setBookedItineraries(touristResponse.data.bookedItineraries);
//         setWallet(touristResponse.data.wallet);
//       } catch (error) {
//         console.error("Error fetching data", error);
//       }
//     };

//     fetchData();
//   }, [touristId]);

//   // Fetch conversion rate
//   useEffect(() => {
//     const fetchConversionRate = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/tourist/${touristId}/preferredCurrency`
//         );
//         setSelectedCurrency(response.data.preferredCurrency);
//         setConversionRate(response.data.conversionRate);
//       } catch (error) {
//         console.error("Error fetching currency data:", error);
//       }
//     };

//     fetchConversionRate();
//   }, [touristId, selectedCurrency]);

//   // Handle activity booking
//   const handleBookActivity = async (activityId) => {
//     setSelectedActivityId(activityId);
//     try {
//       const response = await axios.post(`/book/${touristId}/activity/${activityId}`);
//       setBookedActivities([...bookedActivities, activityId]);
//       setModalContent(response.data.message);
//     } catch (error) {
//       setModalContent(
//         error.response ? error.response.data.message : "Booking failed!"
//       );
//     } finally {
//       setSelectedActivityId(null);
//       setModalVisible(true);
//     }
//   };

//   // Handle activity cancellation
//   const handleCancelActivity = async (activityId) => {
//     setSelectedActivityId(activityId);
//     try {
//       const response = await axios.delete(`/cancelActivity/${touristId}/${activityId}`);
//       setBookedActivities(bookedActivities.filter((id) => id !== activityId));
//       setWallet(response.data.updatedWallet);
//       setModalContent(`Activity cancelled! Wallet updated: ${response.data.updatedWallet} ${selectedCurrency}`);
//     } catch (error) {
//       setModalContent(
//         error.response ? error.response.data.message : "Cancellation failed!"
//       );
//     } finally {
//       setSelectedActivityId(null);
//       setModalVisible(true);
//     }
//   };

//   // Handle itinerary booking
//   const handleBookItinerary = async (itineraryId) => {
//     setSelectedItineraryId(itineraryId);
//     try {
//       const response = await axios.post(`/book/${touristId}/itinerary/${itineraryId}`);
//       setBookedItineraries([...bookedItineraries, itineraryId]);
//       setModalContent(response.data.message);
//     } catch (error) {
//       setModalContent(
//         error.response ? error.response.data.message : "Booking failed!"
//       );
//     } finally {
//       setSelectedItineraryId(null);
//       setModalVisible(true);
//     }
//   };

//   // Handle itinerary cancellation
//   const handleCancelItinerary = async (itineraryId) => {
//     setSelectedItineraryId(itineraryId);
//     try {
//       const response = await axios.delete(`/cancelItinerary/${touristId}/${itineraryId}`);
//       setBookedItineraries(bookedItineraries.filter((id) => id !== itineraryId));
//       setWallet(response.data.updatedWallet);
//       setModalContent(`Itinerary cancelled! Wallet updated: ${response.data.updatedWallet} ${selectedCurrency}`);
//     } catch (error) {
//       setModalContent(
//         error.response ? error.response.data.message : "Cancellation failed!"
//       );
//     } finally {
//       setSelectedItineraryId(null);
//       setModalVisible(true);
//     }
//   };

//   return (
//     <div>
//       <h2>Activities</h2>
//       <ul>
//         {activities.map((activity) => {
//           const isBooked = bookedActivities.includes(activity._id);
//           return (
//             <li key={activity._id}>
//               {activity.title} - {(activity.budget * conversionRate).toFixed(2)} {selectedCurrency}
//               {isBooked ? (
//                 <button onClick={() => handleCancelActivity(activity._id)}>
//                   Cancel
//                 </button>
//               ) : (
//                 <button onClick={() => handleBookActivity(activity._id)}>
//                   Book
//                 </button>
//               )}
//             </li>
//           );
//         })}
//       </ul>

//       <h2>Itineraries</h2>
//       <ul>
//         {itineraries.map((itinerary) => {
//           const isBooked = bookedItineraries.includes(itinerary._id);
//           return (
//             <li key={itinerary._id}>
//               {itinerary.name} - {(itinerary.budget * conversionRate).toFixed(2)} {selectedCurrency}
//               {isBooked ? (
//                 <button onClick={() => handleCancelItinerary(itinerary._id)}>
//                   Cancel
//                 </button>
//               ) : (
//                 <button onClick={() => handleBookItinerary(itinerary._id)}>
//                   Book
//                 </button>
//               )}
//             </li>
//           );
//         })}
//       </ul>

//       {/* Modal */}
//       {modalVisible && (
//         <div style={backdropStyle}>
//           <div style={modalStyle}>
//             <p>{modalContent}</p>
//             <button onClick={() => setModalVisible(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Modal styles
// const backdropStyle = {
//   position: "fixed",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   backgroundColor: "#fff",
//   padding: "20px",
//   borderRadius: "10px",
//   boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//   width: "300px",
//   textAlign: "center",
// };

// export default ActivitiesAndItineraries;

