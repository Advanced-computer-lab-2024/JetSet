import React, { useState } from "react";

import TouristProfile from "./tourist/TouristProfile";
import { useLocation } from "react-router-dom";
import ActivityList from "./Activity/ActivitiesList";
import ItineraryList from "./Itinerary/ItineraryList";
import HistoricalPlaces from "./Place/HistoricalPlacesList";
import Search from "./tourist/SearchComponent";
import ProductList from "./Products/productTourist";
import TouristProducts from "./Products/RateReview";
import LoyaltyPointsForm from "./tourist/LoyaltyPoints";
import ComplaintForm from "./tourist/complaintForm";
import MyComplaintList from "./tourist/myComplaintsList";
import RatingForm from "./tourist/RatingForm"; // Import the new RatingForm
import RateandcommentActivity from "./tourist/RateandcommentActivity";
import RateandcommentItinerary from "./tourist/RateandcommentItinerary";
import UpdatePreferencesForm from "./tourist/Prefrences"; // Import the preferences update form

import "./styles.css";

const touristId = "672635325490518dc4cd46cc";

const Tourist = () => {
  const [showTouristProfile, setShowTouristProfile] = useState(false);
  const [showActivityList, setShowActivityList] = useState(false);
  const [showItineraryList, setShowItineraryList] = useState(false);
  const [showHistoricalPlaces, setShowHistoricalPlaces] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showPurchasedProducts, setShowPurchasedProducts] = useState(false);

  const location = useLocation();
  const touristId = location.state?.touristId || "6723896c185909fcd367634a"; // Use passed ID or hardcoded ID// Hardcoded ID for logged-in user
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
      case "updatePreferences": // New case for updating preferences
        return <UpdatePreferencesForm touristId={touristId} />;

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
            <button onClick={() => setCurrentPage("ratingForm")}>
              Rate a Tour Guide
            </button>
            <button onClick={() => setCurrentPage("RateandcommentActivity")}>
              Rate and comment your activities
            </button>
            <button onClick={() => setCurrentPage("RateandcommentItinerary")}>
              Rate and comment your itinerraries
            </button>
            <button onClick={() => setCurrentPage("updatePreferences")}>
              Update Preferences
            </button>{" "}
            {/* New button for updating preferences */}
          </div>
        );
    }
  };

  return (
    <div className="tourist-frontend">
      <h1>Welcome to JetSet</h1>

      <button onClick={() => setShowTouristProfile(!showTouristProfile)}>
        {showTouristProfile ? "Hide Tourist Profile" : "View Tourist Profile"}
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

      <button onClick={() => setShowHistoricalPlaces(!showHistoricalPlaces)}>
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

      <button onClick={() => setShowPurchasedProducts(!showPurchasedProducts)}>
        {showPurchasedProducts
          ? "Hide Purchased Products"
          : "View Purchased Products"}
      </button>
      {showPurchasedProducts && <TouristProducts touristId={touristId} />}
    </div>
  );
};

export default Tourist;
