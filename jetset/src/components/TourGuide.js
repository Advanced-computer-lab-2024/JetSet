// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import ItineraryList from "./Itinerary/ItinerariesList.js";
// import TourGuideProfileForm from "./Tourguide/TourGuideProfileForm.js";
// import ReadTourGuideProfileForm from "./Tourguide/ReadTourGuideProfileForm.js";
// import CreateItineraryForm from "./Itinerary/CreateItineraryForm.js";
// import UpdateItineraryForm from "./Itinerary/UpdateItineraryForm.js";
// import DeleteItineraryForm from "./Itinerary/DeleteItineraryForm.js";
// import ViewCreatedItineraries from "./Itinerary/ViewCreatedItineraries.js";
// import Activate from "./Tourguide/Activate";
// import Deactivate from "./Tourguide/Deactivate";
// import ChangePasswordForm from "./Tourguide/ChangePasswordForm.js";
// import DeleteAccount from "./Tourguide/DeleteAccount.js";
// import { useParams } from "react-router-dom";

// function TourGuide() {
//   const { tourGuideID } = useParams();
//   const [view, setView] = useState("itineraries");
//   const [itineraryID, setItineraryID] = useState("");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [username, setUsername] = useState("");
//   const [section,setCurrentSection]= useState("");

//   // Fetch the username
//   useEffect(() => {
//     const fetchUsername = async () => {
//       try {
//         const response = await axios.get(`/TourGuideProfile/${tourGuideID}`);
//         setUsername(response.data.username); // Set the fetched username
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching username");
//       }
//     };

//     fetchUsername();
//   }, [tourGuideID]);

//   // Fetch notifications after the username is available
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!username) return; // Wait until username is set
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/notification?recipient=${username}&role=Tour Guide`
//         );
//         setNotifications(response.data.notifications);
//       } catch (err) {
//         setError(err.response?.data?.message || "Error fetching notifications");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, [username]); // Run this effect when the username changes

//   useEffect(() => {
//     switch (section) {
//       case "itinerary":
//         setView("itineraries");
//         break;
//       case "profile":
//         setView("readtourGuideProfile");
//         break;
//       case "password":
//         setView("ChangePassword");
//         break;
//       case "notifications":
//         setView("notifications");
//         break;
//       case "account":
//         setView("deleteAcc");
//         break;
//       case "createItinerary":
//         setView("createItinerary");
//         break;
//       default:
//         setView("itineraries");
//         break;
//     }
//   }, [section]);
//   const renderSectionContent = () => {
//     return(
//     <div className="App">
//           <header className="App-header">
//             <h1>Welcome, {username || "Tour Guide"}!</h1>{" "}
//             {/* Display the username */}
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {/* <nav>
//               <button onClick={() => setView("itineraries")}>
//                 View Itineraries (done)
//               </button>
//               <button onClick={() => setView("tourGuideProfile")}>
//                 Create and Update Tour Guide Profile
//               </button>
//               <button onClick={() => setView("readtourGuideProfile")}>
//                 My Profile (done)
//               </button>
//               <button onClick={() => setView("createItinerary")}>
//                 Create Itinerary (done)
//               </button>
//               <button onClick={() => setView("updateItinerary")}>
//                 Update Itinerary
//               </button>
//               <button onClick={() => setView("deleteItinerary")}>
//                 Delete Itinerary (done)
//               </button>
//               <button onClick={() => setView("ViewCreatedItineraries")}>
//                 View My Created Itineraries (done)
//               </button>
//               <button onClick={() => setView("activate")}>
//                 Activate Itinerary
//               </button>
//               <button onClick={() => setView("deactivate")}>
//                 Deactivate Itinerary
//               </button>
//               <button onClick={() => setView("ChangePassword")}>
//                 Change Password (done)
//               </button>
//               <button onClick={() => setView("deleteAcc")}>
//                 Delete my account (done)
//               </button>
//               <button onClick={() => setView("notifications")}>
//                 View Notifications (done)
//               </button>
//             </nav> */}
//             {/* Input for itinerary ID */}
//             {(view === "activate" || view === "deactivate") && (
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Enter Itinerary ID"
//                   value={itineraryID}
//                   onChange={(e) => setItineraryID(e.target.value)}
//                 />
//               </div>
//             )}
//             {/* Conditional rendering based on view */}
//             {view === "itineraries" && (
//               <div>
//                 <div>
//                   <button onClick={() => setView("itineraries")}>
//                     All Itineraries
//                   </button>
//                   <button onClick={() => setView("ViewCreatedItineraries")}>
//                     My Created Itineraries
//                   </button>
//                 </div>
//                 <ItineraryList />
//               </div>
//             )}

//             {view === "ViewCreatedItineraries" && (
//               <div>
//                 <div>
//                   <button onClick={() => setView("itineraries")}>
//                     All Itineraries
//                   </button>
//                   <button onClick={() => setView("ViewCreatedItineraries")}>
//                     My Created Itineraries
//                   </button>
//                 </div>
//                 <ViewCreatedItineraries id={tourGuideID} />
//               </div>
//             )}
//             {view === "tourGuideProfile" && (
//               <TourGuideProfileForm tourGuideID={tourGuideID} />
//             )}
//             {view === "readtourGuideProfile" && (
//               <ReadTourGuideProfileForm tourGuideID={tourGuideID} />
//             )}
//             {view === "createItinerary" && <CreateItineraryForm />}
//             {view === "updateItinerary" && (
//               <UpdateItineraryForm itineraryID={itineraryID} />
//             )}
//             {view === "ChangePassword" && (
//               <ChangePasswordForm tourGuideID={tourGuideID} />
//             )}
//             {view === "deleteAcc" && <DeleteAccount tourguideId={tourGuideID} />}
//             {view === "notifications" && (
//               <div>
//                 <h2>Notifications</h2>
//                 {loading && <p>Loading notifications...</p>}
//                 {error && <p style={{ color: "red" }}>{error}</p>}
//                 {!loading && !error && notifications.length === 0 && (
//                   <p>No notifications found.</p>
//                 )}
//                 {!loading && notifications.length > 0 && (
//                   <ul>
//                     {notifications.map((notification, index) => (
//                       <li key={index}>
//                         <p>{notification.message}</p>
//                         <p>
//                           <small>
//                             {new Date(notification.createdAt).toLocaleString()}
//                           </small>
//                         </p>
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </header>
//         </div>
//     );
//   };

//   return (
//     <div>
//       <div className="admin-container">
//         {/* Sidebar Navigation */}
//         <aside className="admin-sidebar">
//           <ul>
//             <li onClick={() => setCurrentSection("itinerary")}>🗺️ My Itineraries</li>
//             <li onClick={() => setCurrentSection("createItinerary")}>🖌️ New Itinerary</li>
//             <li onClick={() => setCurrentSection("profile")}>👤 My Profile</li>
//             <li onClick={() => setCurrentSection("password")}>
//             🔑 Change Password
//             </li>
//             <li onClick={() => setCurrentSection("notifications")}>
//               ⚠️ Notifications
//             </li>
//             <li onClick={() => setCurrentSection("account")}>🗑️ Delete My Account</li>
//           </ul>
//         </aside>

//         {/* Main Content */}
//         <main className="admin-main-content">{renderSectionContent()}</main>
//       </div>
//     </div>
//   );
// }


// export default TourGuide;
import React, { useState, useEffect } from "react";
import axios from "axios";
import ItineraryList from "./Itinerary/ItinerariesList.js";
import TourGuideProfileForm from "./Tourguide/TourGuideProfileForm.js";
import ReadTourGuideProfileForm from "./Tourguide/ReadTourGuideProfileForm.js";
import CreateItineraryForm from "./Itinerary/CreateItineraryForm.js";
import UpdateItineraryForm from "./Itinerary/UpdateItineraryForm.js";
import DeleteItineraryForm from "./Itinerary/DeleteItineraryForm.js";
import ViewCreatedItineraries from "./Itinerary/ViewCreatedItineraries.js";
import Activate from "./Tourguide/Activate";
import Deactivate from "./Tourguide/Deactivate";
import ChangePasswordForm from "./Tourguide/ChangePasswordForm.js";
import DeleteAccount from "./Tourguide/DeleteAccount.js";

import TourGuideSalesReport from "./Reports/TourGuideSalesReport"; // Import the sales report component
import TourGuideReport from "./Reports/TourGuideTouristReport"; // Import the tourist report component

import NavTourGuide from "./Tourguide/navTourguide.js";

import { useParams } from "react-router-dom";

function TourGuide() {
  const { tourGuideID } = useParams();
  const [view, setView] = useState("itineraries");
  const [itineraryID, setItineraryID] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [section, setCurrentSection] = useState("");

  // Fetch the username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`/TourGuideProfile/${tourGuideID}`);
        setUsername(response.data.username); // Set the fetched username
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching username");
      }
    };

    fetchUsername();
  }, [tourGuideID]);

  // Fetch notifications after the username is available
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!username) return; // Wait until username is set
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/notification?recipient=${username}&role=Tour Guide`);
        setNotifications(response.data.notifications);
      } catch (err) {
        //setError(err.response?.data?.message || "Error fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [username]); // Run this effect when the username changes

  useEffect(() => {
    switch (section) {
      case "itinerary":
        setView("itineraries");
        break;
      case "ViewCreatedItineraries":
        setView("ViewCreatedItineraries");
        break;
      case "profile":
        setView("readtourGuideProfile");
        break;
      case "password":
        setView("ChangePassword");
        break;
      // case "notifications":
      //   setView("notifications");
      //   break;
      case "account":
        setView("deleteAcc");
        break;
      case "createItinerary":
        setView("createItinerary");
        break;
      case "salesReport":
        setView("salesReport");
        break;
      case "touristReport":
        setView("touristReport");
        break;
      default:
        setView("itineraries");
        break;
    }
  }, [section]);

  const renderSectionContent = () => {

    return(
    <div className="App">
          <header className="App-header">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* <nav>
              <button onClick={() => setView("itineraries")}>
                View Itineraries (done)
              </button>
              <button onClick={() => setView("tourGuideProfile")}>
                Create and Update Tour Guide Profile
              </button>
              <button onClick={() => setView("readtourGuideProfile")}>
                My Profile (done)
              </button>
              <button onClick={() => setView("createItinerary")}>
                Create Itinerary (done)
              </button>
              <button onClick={() => setView("updateItinerary")}>
                Update Itinerary
              </button>
              <button onClick={() => setView("deleteItinerary")}>
                Delete Itinerary (done)
              </button>
              <button onClick={() => setView("ViewCreatedItineraries")}>
                View My Created Itineraries (done)
              </button>
              <button onClick={() => setView("activate")}>
                Activate Itinerary
              </button>
              <button onClick={() => setView("deactivate")}>
                Deactivate Itinerary
              </button>
              <button onClick={() => setView("ChangePassword")}>
                Change Password (done)
              </button>
              <button onClick={() => setView("deleteAcc")}>
                Delete my account (done)
              </button>
              <button onClick={() => setView("notifications")}>
                View Notifications (done)
              </button>
            </nav> */}
            {/* Input for itinerary ID */}
            {(view === "activate" || view === "deactivate") && (
              <div>
                <input
                  type="text"
                  placeholder="Enter Itinerary ID"
                  value={itineraryID}
                  onChange={(e) => setItineraryID(e.target.value)}
                />
              </div>
            )}
            {/* Conditional rendering based on view */}
            {view === "itineraries" && (
                <ItineraryList
                onEdit={(itineraryId) => {
                  setItineraryID(itineraryId); // Set the ID of the itinerary to be updated
                  setView("updateItinerary");
                }} />
            )}

            {view === "ViewCreatedItineraries" && (
                <ViewCreatedItineraries id={tourGuideID}
                onEdit={(itineraryId) => {
                setItineraryID(itineraryId); // Set the ID of the itinerary to be updated
                setView("updateItinerary");
              }} />
            )}
            {view === "tourGuideProfile" && (
              <TourGuideProfileForm tourGuideID={tourGuideID} />
            )}
            {view === "readtourGuideProfile" && (
              <ReadTourGuideProfileForm tourGuideID={tourGuideID} />
            )}
            {view === "createItinerary" && <CreateItineraryForm tourguideId={tourGuideID}/>}
            {view === "updateItinerary" && (
              <UpdateItineraryForm itineraryID={itineraryID} />
            )}
            {view === "ChangePassword" && (
              <ChangePasswordForm tourGuideID={tourGuideID} />
            )}
            {view === "deleteAcc" && <DeleteAccount tourguideId={tourGuideID} />}
            {/* {view === "notifications" && (
              <div>
                <h2>Notifications</h2>
                {loading && <p>Loading notifications...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {!loading && !error && notifications.length === 0 && (
                  <p>No notifications found.</p>
                )}
                {!loading && notifications.length > 0 && (
                  <ul>
                    {notifications.map((notification, index) => (
                      <li key={index}>
                        <p>{notification.message}</p>
                        <p>
                          <small>
                            {new Date(notification.createdAt).toLocaleString()}
                          </small>
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )} */}
          </header>
        </div>

    );
  };

  return (
    <div>
      <NavTourGuide username={username} tourGuideId={tourGuideID} 
      onEdit={(tourGuideID) => {
        setView("readtourGuideProfile")
         }} />
      <div className="admin-container">
        <aside className="admin-sidebar">
          <ul>
            <li onClick={() => setCurrentSection("itineraries")}>🗺️ All Itineraries</li>
            <li onClick={() => setCurrentSection("ViewCreatedItineraries")}>🗺️ My Itineraries</li>
            <li onClick={() => setCurrentSection("createItinerary")}>🖌️ New Itinerary</li>

            <li onClick={() => setCurrentSection("profile")}>👤 My Profile</li>
            <li onClick={() => setCurrentSection("password")}> 🔑 Change Password </li>
            <li onClick={() => setCurrentSection("notifications")}> ⚠️ Notifications </li>

            <li onClick={() => setCurrentSection("account")}>🗑️ Delete My Account</li>
          </ul>
        </aside>
        <main className="admin-main-content">{renderSectionContent()}</main>
      </div>
    </div>
  );
}

export default TourGuide; 
