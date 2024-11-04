import React, { useState } from "react";
import TouristProfile from "./tourist/TouristProfile";
import { useLocation } from "react-router-dom";
import ActivityList from "./Activity/ActivitiesList";
import ItineraryList from "./Itinerary/ItineraryList";
import HistoricalPlaces from "./Place/HistoricalPlacesList";
import Search from "./tourist/SearchComponent";
import ProductList from "./Products/productTourist";
import TouristProducts from "./Products/RateReview";
import "./styles.css";

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
