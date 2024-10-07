// mport React from "react";

// App.js;

// // const App = () => {
// //   return (
// //     <div>
// //       <h1>Tourism App</h1>
// //       <PlaceForm />
// //       <PlaceList />
// //       <TagForm />
// //     </div>
// //   );
// // };

// const App = () => {
//   const [selectedProfile, setSelectedProfile] = useState(null);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [profiles, setProfiles] = useState([]); // State to hold profiles
//   const [activities, setActivities] = useState([]); // State to hold activities
//   const [isFetchingProfiles, setIsFetchingProfiles] = useState(false); // Loading state for profiles
//   const [isFetchingActivities, setIsFetchingActivities] = useState(false); // Loading state for activities

//   // Fetch profiles
//   const getProfiles = async () => {
//     setIsFetchingProfiles(true);
//     try {
//       const response = await axios.get("http://localhost:3000/profiles");
//       setProfiles(response.data); // Set fetched profiles to state
//     } catch (error) {
//       console.error("Error fetching profiles:", error);
//     } finally {
//       setIsFetchingProfiles(false);
//     }
//   };

//   // Fetch activities
//   const getActivities = async () => {
//     setIsFetchingActivities(true);
//     try {
//       const response = await axios.get("http://localhost:3000/getactivities");
//       setActivities(response.data); // Set fetched activities to state
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//     } finally {
//       setIsFetchingActivities(false);
//     }
//   };

//   // Handle profile submission
//   const handleProfileSubmit = async (data) => {
//     try {
//       if (selectedProfile) {
//         await axios.put(
//           `http://localhost:3000/updateprofiles/${selectedProfile._id}`,
//           data
//         );
//       } else {
//         await axios.post("http://localhost:3000/addprofiles", data);
//       }
//       setSelectedProfile(null);
//       getProfiles(); // Refresh profiles after submission
//     } catch (error) {
//       console.error("Error submitting profile:", error);
//     }
//   };

//   // Handle activity submission
//   const handleActivitySubmit = async (data) => {
//     try {
//       if (selectedActivity) {
//         await axios.put(
//           `http://localhost:3000/updateactivity/${selectedActivity._id}`,
//           data
//         );
//       } else {
//         await axios.post("http://localhost:3000/getactivity", data);
//       }
//       setSelectedActivity(null);
//       getActivities(); // Refresh activities after submission
//     } catch (error) {
//       console.error("Error submitting activity:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Tourism App</h1>
//       <PlaceForm />
//       <PlaceList />
//       <TagForm />
//       <h1>Advertiser Management</h1>

//       {/* Profile Management */}
//       <ProfileForm
//         profile={selectedProfile}
//         onProfileCreated={handleProfileSubmit}
//       />

//       <button onClick={getProfiles}>Get Profiles</button>
//       {isFetchingProfiles ? (
//         <p>Loading profiles...</p>
//       ) : (
//         <ul>
//           {profiles.map((profile) => (
//             <li key={profile._id}>
//               <strong>{profile.username}</strong> - {profile.company_name}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Activity Management */}
//       <ActivityForm
//         activity={selectedActivity}
//         onActivityCreated={handleActivitySubmit}
//       />
//     </div>
//   );
// };

// export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import HomePage from "./components/HomePage";
// import Register from "./components/Register";
// import RegisterASt from "./components/RegisterAST";
// import AdminFrontend from "./components/AdminFrontend";
// import RegisterTourist from "./components/RegisterTourist";
// import CreateSeller from "./components/Seller/CreateSeller";
// import SellerFrontend from "./components/SellerFrontend";

// const App = () => {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/touristregister" element={<RegisterTourist />} />
//         <Route path="/admin" element={<AdminFrontend />} />
//         <Route path="/registerAST" element={<RegisterASt />} />
//         <Route path="/createseller" element={<CreateSeller />} />
//         <Route path="/sellerfrontend" element={<SellerFrontend />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
