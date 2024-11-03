import React, { useState } from "react";
// import axios from "axios";
import TouristProfile from "./tourist/TouristProfile"; // Ensure the casing matches the file
import ActivityList from "./Activity/ActivitiesList"; // Ensure the casing matches the file
import ItineraryList from "./Itinerary/ItineraryList"; // Ensure the casing matches the file
import HistoricalPlaces from "./Place/HistoricalPlacesList"; // Ensure the casing matches the file
import Search from "./tourist/SearchComponent"; // Ensure the casing matches the file
import SearchProduct from "./Products/SearchProduct"; // Ensure the casing matches the file
import ProductList from "./Products/ProductList"; // Ensure the casing matches the file
import FilterProducts from "./Products/FilterProducts"; // Ensure the casing matches the file
import SortProducts from "./Products/SortProducts"; // Ensure the casing matches the file
import LoyaltyPointsForm from "./tourist/LoyaltyPoints";
import ComplaintForm from "./tourist/complaintForm";
import MyComplaintList from "./tourist/myComplaintsList";

// import ComplaintForm from "./tourist/complaintForm";
// import viewComplaint from "./tourist/viewComplaints";

import "./styles.css";

const touristId="672635325490518dc4cd46cc";
const Tourist = () => {
  const [currentPage, setCurrentPage] = useState("home"); // Initial page

  const renderPage = () => {
    switch (currentPage) {
      case "touristProfile":
        return <TouristProfile />;
      case "productList":
        return <ProductList />;
      case "activityList":
        return <ActivityList />;
      case "itineraryList":
        return <ItineraryList />;
      case "historicalPlaces":
        return <HistoricalPlaces />;
      case "search":
        return <Search />;
      case "searchProduct":
        return <SearchProduct />;
      case "FilterProduct":
        return <FilterProducts />;
      case "SortProduct":
        return <SortProducts />;
      case "loyaltyPoints":
        return <LoyaltyPointsForm />;
      case "ComplaintForm":
        return <ComplaintForm touristId={touristId}/>;
      case "MyComplaintsList":
        return <MyComplaintList touristID={touristId}/>
      
      default:
        return (
          <div>
            <h1>Welcome to JetSet</h1>
            <button onClick={() => setCurrentPage("touristProfile")}>
              View Tourist Profile
            </button>
            <button onClick={() => setCurrentPage("productList")}>
              View Products
            </button>
            <button onClick={() => setCurrentPage("activityList")}>
              View Activities
            </button>
            <button onClick={() => setCurrentPage("itineraryList")}>
              View Itineraries
            </button>
            <button onClick={() => setCurrentPage("historicalPlaces")}>
              View Historical Places
            </button>
            <button onClick={() => setCurrentPage("loyaltyPoints")}>
              Loyalty Points 
            </button>
            <button onClick={() => setCurrentPage("search")}>Search</button>
            <button onClick={() => setCurrentPage("SortProduct")}>
              Sort Product
            </button>
            <button onClick={() => setCurrentPage("FilterProduct")}>
              Filter Product
            </button>
            <button onClick={() => setCurrentPage("searchProduct")}>
              Search Products
            </button>
            <button onClick={() => setCurrentPage("ComplaintForm")}>
              File Your Complaints
            </button>
            <button onClick={() => setCurrentPage("MyComplaintsList")}>
              View All My Complaints
            </button>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {renderPage()} {/* Render the current page */}
    </div>
  );
};

export default Tourist;