import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import TouristProfile from "./tourist/TouristProfile";
import ActivityList from "./Activity/ActivitiesList";
import ItineraryList from "./Itinerary/ItineraryTourist";
import HistoricalPlaces from "./Place/HistoricalPlacesList";
import Search from "./tourist/SearchComponent";
import ProductList from "./Products/productTourist";
import TouristProducts from "./Products/RateReview";
import LoyaltyPointsForm from "./tourist/LoyaltyPoints";
import ComplaintForm from "./tourist/complaintForm";
import MyComplaintList from "./tourist/myComplaintsList";
import RatingForm from "./tourist/RatingForm";
import RateandcommentActivity from "./tourist/RateandcommentActivity";
import RateandcommentItinerary from "./tourist/RateandcommentItinerary";
import UpdatePreferencesForm from "./tourist/Prefrences";
import ChangePassword from "./tourist/ChangePasswordForm";
import Book from "./tourist/ActivitiesAndItineraries";
import Transportations from "./tourist/Transportations";
import DeleteAccount from "./tourist/DeleteAccount";
import SearchProduct from "./Products/SearchProduct"; // Ensure this import is correct
import FilterProducts from "./Products/FilterProducts"; // Ensure this import is correct
import SortProducts from "./Products/SortProducts"; // Ensure this import is correct

import "./styles.css";

const Tourist = () => {
  const [currentPage, setCurrentPage] = useState(""); // State for managing current page
  const [showTouristProfile, setShowTouristProfile] = useState(false);
  const [showActivityList, setShowActivityList] = useState(false);
  const [showItineraryList, setShowItineraryList] = useState(false);
  const [showHistoricalPlaces, setShowHistoricalPlaces] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showPurchasedProducts, setShowPurchasedProducts] = useState(false);

  const location = useLocation();
  const touristId = location.state?.touristId || "6723896c185909fcd367634a";

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
        return <ComplaintForm touristId={touristId} />;
      case "MyComplaintsList":
        return <MyComplaintList touristID={touristId} />;
      case "ratingForm":
        return <RatingForm touristId={touristId} />;
      case "RateandcommentActivity":
        return <RateandcommentActivity touristId={touristId} />;
      case "RateandcommentItinerary":
        return <RateandcommentItinerary touristId={touristId} />;
      case "updatePreferences":
        return <UpdatePreferencesForm touristId={touristId} />;
      case "changepassword":
        return <ChangePassword />;
      case "booking":
        return <Book />;
      case "transportation":
        return <Transportations />;
      case "deleteAcc":
        return <DeleteAccount />;
      default:
        return (
          <div className="tourist-frontend">
            <h1>Welcome to JetSet</h1>

            <button onClick={() => setShowTouristProfile(!showTouristProfile)}>
              {showTouristProfile
                ? "Hide Tourist Profile"
                : "View Tourist Profile"}
            </button>
            {showTouristProfile && <TouristProfile touristId={touristId} />}

            <button onClick={() => setShowActivityList(!showActivityList)}>
              {showActivityList ? "Hide Activities" : "View Activities"}
            </button>
            {showActivityList && <ActivityList />}

            <button onClick={() => setShowItineraryList(!showItineraryList)}>
              {showItineraryList ? "Hide Itineraries" : "View Itineraries"}
            </button>
            {showItineraryList && <ItineraryList />}

            <button
              onClick={() => setShowHistoricalPlaces(!showHistoricalPlaces)}
            >
              {showHistoricalPlaces
                ? "Hide Historical Places"
                : "View Historical Places"}
            </button>
            {showHistoricalPlaces && <HistoricalPlaces />}

            <button onClick={() => setShowSearch(!showSearch)}>
              {showSearch ? "Cancel Search" : "Search"}
            </button>
            {showSearch && <Search />}

            <button onClick={() => setShowProductList(!showProductList)}>
              {showProductList ? "Hide Products" : "Products"}
            </button>
            {showProductList && <ProductList />}

            <button
              onClick={() => setShowPurchasedProducts(!showPurchasedProducts)}
            >
              {showPurchasedProducts
                ? "Hide Purchased Products"
                : "View Purchased Products"}
            </button>
            {showPurchasedProducts && <TouristProducts touristId={touristId} />}

            <button onClick={() => setCurrentPage("loyaltyPoints")}>
              Loyalty Points
            </button>
            <button onClick={() => setCurrentPage("search")}>Search</button>
            <button onClick={() => setCurrentPage("ComplaintForm")}>
              File Your Complaints
            </button>
            <button onClick={() => setCurrentPage("MyComplaintsList")}>
              View All My Complaints
            </button>
            <button onClick={() => setCurrentPage("ratingForm")}>
              Rate a Tour Guide
            </button>
            <button onClick={() => setCurrentPage("changepassword")}>
              Change Password
            </button>
            <button onClick={() => setCurrentPage("booking")}>
              Book/Cancel Activity&Itenirary
            </button>
            <button onClick={() => setCurrentPage("transportation")}>
              Book Transportation
            </button>
            <button onClick={() => setCurrentPage("deleteAcc")}>
              Delete My account
            </button>
            <button onClick={() => setCurrentPage("RateandcommentActivity")}>
              Rate and comment your activities
            </button>
            <button onClick={() => setCurrentPage("RateandcommentItinerary")}>
              Rate and comment your itineraries
            </button>
            <button onClick={() => setCurrentPage("updatePreferences")}>
              Update Preferences
            </button>
          </div>
        );
    }
  };
  return <div className="tourist-frontend">{renderPage()}</div>;
};

export default Tourist;
