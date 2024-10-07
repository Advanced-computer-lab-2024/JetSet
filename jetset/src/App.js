import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import RegisterASt from "./components/RegisterAST";
import AdminFrontend from "./components/AdminFrontend";
import RegisterTourist from "./components/RegisterTourist";
import CreateSeller from "./components/Seller/CreateSeller";
import SellerFrontend from "./components/SellerFrontend";
import ProfileForm from "./components/ProfileAdvertiser";
import Place from "./components/Place";
import Tourist from "./components/TouristApp"; // Ensure the correct case here
import TourGuide from "./components/TourGuide";

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
      </Routes>
    </Router>
  );
};

export default App;
