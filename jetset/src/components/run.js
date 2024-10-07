import React from "react";
import AdminFrontend from "./components/AdminFrontend";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <AdminFrontend />
    </div>
  );
};

export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Register from "./components/Register";
// import CreateSeller from "./components/Seller/CreateSeller";
// import SellerFrontend from "./components/SellerFrontend";

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/register" />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/createseller" element={<CreateSeller />} />
//         <Route path="/sellerfrontend" element={<SellerFrontend />} />
//         {/* Add more routes as needed */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// import SellerFrontend from "./components/SellerFrontend"; // Correct import for SellerFrontend

// const App = () => {
//   return (
//     <div className="App">
//       <SellerFrontend />
//     </div>
//   );
// };

// export default App;
