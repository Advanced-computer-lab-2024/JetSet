import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import RegisterASt from "./components/RegisterAST";
import AdminFrontend from "./components/AdminFrontend";
import RegisterTourist from "./components/tourist/RegisterTourist";
import CreateSeller from "./components/Seller/CreateSeller";
import SellerFrontend from "./components/SellerFrontend";
import ProfileForm from "./components/Advertiser/ProfileAdvertiser";
import Place from "./components/TourismGovernor";
import Tourist from "./components/TouristApp"; // Ensure the correct case here
import TourGuide from "./components/TourGuide";
import Login from "./components/login"; // Use consistent case for component import

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/touristregister" element={<RegisterTourist />} />
        <Route path="/tourist" element={<Tourist />} />
        <Route path="/admin" element={<AdminFrontend />} />
        <Route path="/registerAST" element={<RegisterASt />} />
        <Route path="/createseller" element={<CreateSeller />} />
        <Route path="/sellerfrontend" element={<SellerFrontend />} />
        <Route path="/createadvertiser" element={<ProfileForm />} />
        <Route path="/place" element={<Place />} />
        <Route path="/tourguide" element={<TourGuide />} />
        <Route path="/login" element={<Login />} />{" "}
        {/* Consistent casing here */}
      </Routes>
    </Router>
  );
};

export default App;
