// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";

// import TouristProfile from "./tourist/TouristProfile";
// import ActivityList from "./Activity/ActivitiesList";
// import ItineraryList from "./Itinerary/ItineraryTourist";
// import HistoricalPlaces from "./Place/HistoricalPlacesList";
// import Search from "./tourist/SearchComponent";
// import ProductList from "./Products/productTourist";
// import TouristProducts from "./Products/RateReview";
// import LoyaltyPointsForm from "./tourist/LoyaltyPoints";
// import ComplaintForm from "./tourist/complaintForm";
// import MyComplaintList from "./tourist/myComplaintsList";
// import RatingForm from "./tourist/RatingForm";
// import RateandcommentActivity from "./tourist/RateandcommentActivity";
// import RateandcommentItinerary from "./tourist/RateandcommentItinerary";
// import UpdatePreferencesForm from "./tourist/Prefrences";
// import ChangePassword from "./tourist/ChangePasswordForm";
// import Book from "./tourist/ActivitiesAndItineraries";
// import Transportations from "./tourist/Transportations";
// import DeleteAccount from "./tourist/DeleteAccount";
// import SearchProduct from "./Products/SearchProduct"; // Ensure this import is correct
// import FilterProducts from "./Products/FilterProducts"; // Ensure this import is correct
// import SortProducts from "./Products/SortProducts"; // Ensure this import is correct
// import SetPreferredCurrency from "./tourist/SetPreferredCurrency";
// import ShareItem from "./tourist/ShareItem"; // Import the new ShareItem component
// import ActivityByCategory from "./Activity/ActivitiesByCategory.js"; // Import the new ShareItem component
// import FlightBooking from "./Booking/FlightBooking.js";
// import HotelSearch from "./Booking/HotelSearch";

// import "./styles.css";

// const Tourist = () => {
//   const [currentPage, setCurrentPage] = useState(""); // State for managing current page
//   const [showTouristProfile, setShowTouristProfile] = useState(false);
//   const [showActivityList, setShowActivityList] = useState(false);
//   const [showItineraryList, setShowItineraryList] = useState(false);
//   const [showHistoricalPlaces, setShowHistoricalPlaces] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [showProductList, setShowProductList] = useState(false);
//   const [showPurchasedProducts, setShowPurchasedProducts] = useState(false);

//   const location = useLocation();
//   const touristId = location.state?.touristId || "6723896c185909fcd367634a";

//   const renderPage = () => {
//     switch (currentPage) {
//       case "touristProfile":
//         return <TouristProfile />;
//       case "productList":
//         return <ProductList />;
//       case "activityList":
//         return <ActivityList />;
//       case "itineraryList":
//         return <ItineraryList />;
//       case "historicalPlaces":
//         return <HistoricalPlaces />;
//       case "search":
//         return <Search />;
//       case "searchProduct":
//         return <SearchProduct />;
//       case "FilterProduct":
//         return <FilterProducts />;
//       case "SortProduct":
//         return <SortProducts />;
//       case "ActivityByCategory":
//         return <ActivityByCategory />;
//       case "SetPreferredCurrency":
//         return <SetPreferredCurrency touristId={touristId} />;
//       case "ShareItem": // Add the new case for the ShareItem component
//         return <ShareItem />;
//       case "loyaltyPoints":
//         return <LoyaltyPointsForm />;
//       case "ComplaintForm":
//         return <ComplaintForm touristId={touristId} />;
//       case "MyComplaintsList":
//         return <MyComplaintList touristID={touristId} />;
//       case "ratingForm":
//         return <RatingForm touristId={touristId} />;
//       case "RateandcommentActivity":
//         return <RateandcommentActivity touristId={touristId} />;
//       case "RateandcommentItinerary":
//         return <RateandcommentItinerary touristId={touristId} />;
//       case "updatePreferences":
//         return <UpdatePreferencesForm touristId={touristId} />;
//       case "changepassword":
//         return <ChangePassword />;
//       case "booking":
//         return <Book />;
//       case "transportation":
//         return <Transportations />;
//       case "deleteAcc":
//         return <DeleteAccount />;
//       case "book":
//         return <FlightBooking />;
//       case "bookh":
//         return <HotelSearch />;
//       default:
//         return (
//           <div className="tourist-frontend">
//             <h1>Welcome to JetSet</h1>

//             <button onClick={() => setShowTouristProfile(!showTouristProfile)}>
//               {showTouristProfile
//                 ? "Hide Tourist Profile"
//                 : "View Tourist Profile"}
//             </button>
//             {showTouristProfile && <TouristProfile touristId={touristId} />}

//             <button onClick={() => setShowActivityList(!showActivityList)}>
//               {showActivityList ? "Hide Activities" : "View Activities"}
//             </button>
//             {showActivityList && <ActivityList />}

//             <button onClick={() => setShowItineraryList(!showItineraryList)}>
//               {showItineraryList ? "Hide Itineraries" : "View Itineraries"}
//             </button>
//             {showItineraryList && <ItineraryList />}

//             <button
//               onClick={() => setShowHistoricalPlaces(!showHistoricalPlaces)}
//             >
//               {showHistoricalPlaces
//                 ? "Hide Historical Places"
//                 : "View Historical Places"}
//             </button>
//             {showHistoricalPlaces && <HistoricalPlaces />}

//             <button onClick={() => setShowSearch(!showSearch)}>
//               {showSearch ? "Cancel Search" : "Search"}
//             </button>
//             {showSearch && <Search />}

//             <button onClick={() => setShowProductList(!showProductList)}>
//               {showProductList ? "Hide Products" : "Products"}
//             </button>
//             {showProductList && <ProductList />}

//             <button
//               onClick={() => setShowPurchasedProducts(!showPurchasedProducts)}
//             >
//               {showPurchasedProducts
//                 ? "Hide Purchased Products"
//                 : "View Purchased Products"}
//             </button>
//             {showPurchasedProducts && <TouristProducts touristId={touristId} />}
//             <button onClick={() => setCurrentPage("ActivityByCategory")}>
//               Activity by category
//             </button>
//             <button onClick={() => setCurrentPage("SetPreferredCurrency")}>
//               Set Preferred Currency
//             </button>
//             <button onClick={() => setCurrentPage("ShareItem")}>
//               Share an Item
//             </button>

//             <button onClick={() => setCurrentPage("loyaltyPoints")}>
//               Loyalty Points
//             </button>
//             <button onClick={() => setCurrentPage("search")}>Search</button>
//             <button onClick={() => setCurrentPage("ComplaintForm")}>
//               File Your Complaints
//             </button>
//             <button onClick={() => setCurrentPage("MyComplaintsList")}>
//               View All My Complaints
//             </button>
//             <button onClick={() => setCurrentPage("ratingForm")}>
//               Rate a Tour Guide
//             </button>
//             <button onClick={() => setCurrentPage("changepassword")}>
//               Change Password
//             </button>
//             <button onClick={() => setCurrentPage("booking")}>
//               Book/Cancel Activity&Itenirary
//             </button>
//             <button onClick={() => setCurrentPage("transportation")}>
//               Book Transportation
//             </button>
//             <button onClick={() => setCurrentPage("deleteAcc")}>
//               Delete My account
//             </button>
//             <button onClick={() => setCurrentPage("RateandcommentActivity")}>
//               Rate and comment your activities
//             </button>
//             <button onClick={() => setCurrentPage("RateandcommentItinerary")}>
//               Rate and comment your itineraries
//             </button>
//             <button onClick={() => setCurrentPage("updatePreferences")}>
//               Update Preferences
//             </button>
//             <button onClick={() => setCurrentPage("book")}>Book Flight </button>
//             <button onClick={() => setCurrentPage("bookh")}> Book Hotel</button>
//           </div>
//         );
//     }
//   };
//   return <div className="tourist-frontend">{renderPage()}</div>;
// };

// export default Tourist;

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
import SearchProduct from "./Products/SearchProduct";
import FilterProducts from "./Products/FilterProducts";
import SortProducts from "./Products/SortProducts";
import SetPreferredCurrency from "./tourist/SetPreferredCurrency";
import ShareItem from "./tourist/ShareItem";
import ActivityByCategory from "./Activity/ActivitiesByCategory";
import FlightBooking from "./Booking/FlightBooking";
import HotelSearch from "./Booking/HotelSearch";
import BookedItineraries from "./tourist/BookedItineraries";

import "./styles.css";

const Tourist = () => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const touristId = location.state?.touristId || "6723896c185909fcd367634a";
  const [showPurchasedProducts, setShowPurchasedProducts] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "touristProfile":
        return <TouristProfile touristId={touristId} />;
      case "productList":
        return <ProductList touristId={touristId} />;
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
      case "touristProduct":
        return <TouristProducts touristId={touristId} />;
      case "ActivityByCategory":
        return <ActivityByCategory />;
      case "SetPreferredCurrency":
        return <SetPreferredCurrency touristId={touristId} />;
      case "ShareItem":
        return <ShareItem />;
      case "loyaltyPoints":
        return <LoyaltyPointsForm touristId={touristId} />;
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
        return <ChangePassword touristId={touristId} />;
      case "booking":
        return <Book touristId={touristId} />;
      case "transportation":
        return <Transportations touristId={touristId} />;
      case "deleteAcc":
        return <DeleteAccount touristId={touristId} />;
      case "book":
        return <FlightBooking touristId={touristId} />;
      case "bookh":
        return <HotelSearch touristId={touristId} />;
      case "bookIti":
        return <BookedItineraries touristId={touristId} />;
      default:
        return (
          <section className="tourist-frontend">
            <h1>Welcome to JetSet</h1>

            <div className="button-groups">
              <section>
                <h2>Profile & Preferences</h2>
                <button onClick={() => setCurrentPage("touristProfile")}>
                  View Tourist Profile
                </button>
                <button onClick={() => setCurrentPage("updatePreferences")}>
                  Update Preferences
                </button>
                <button onClick={() => setCurrentPage("SetPreferredCurrency")}>
                  Set Preferred Currency
                </button>
                <button onClick={() => setCurrentPage("changepassword")}>
                  Change Password
                </button>
                <button onClick={() => setCurrentPage("deleteAcc")}>
                  Delete My Account
                </button>
              </section>

              <section>
                <h2>Activities & Itineraries</h2>
                <button onClick={() => setCurrentPage("activityList")}>
                  View Activities
                </button>
                <button onClick={() => setCurrentPage("itineraryList")}>
                  View Itineraries
                </button>
                <button onClick={() => setCurrentPage("ActivityByCategory")}>
                  Activities by Category
                </button>
                <button onClick={() => setCurrentPage("search")}>Search</button>
                <button onClick={() => setCurrentPage("booking")}>
                  Book/Cancel Activity & Itinerary
                </button>
                <button
                  onClick={() => setCurrentPage("RateandcommentActivity")}
                >
                  Rate & Comment on Activities
                </button>
                <button
                  onClick={() => setCurrentPage("RateandcommentItinerary")}
                >
                  Rate & Comment on Itineraries
                </button>
                <button onClick={() => setCurrentPage("bookIti")}>
                  Booked itineraries
                </button>
              </section>

              <section>
                <h2>Products & Purchases</h2>
                <button onClick={() => setCurrentPage("productList")}>
                  View Products
                </button>
                <button onClick={() => setCurrentPage("searchProduct")}>
                  Search Products
                </button>
                <button onClick={() => setCurrentPage("FilterProduct")}>
                  Filter Products
                </button>
                <button onClick={() => setCurrentPage("SortProduct")}>
                  Sort Products
                </button>
                <button
                  onClick={() =>
                    setShowPurchasedProducts(!showPurchasedProducts)
                  }
                >
                  {showPurchasedProducts
                    ? "Hide Purchased Products"
                    : "View Purchased Products"}
                </button>{" "}
                {showPurchasedProducts && (
                  <TouristProducts touristId={touristId} />
                )}
              </section>

              <section>
                <h2>Bookings & Travel</h2>
                <button onClick={() => setCurrentPage("book")}>
                  Book Flight
                </button>
                <button onClick={() => setCurrentPage("bookh")}>
                  Book Hotel
                </button>
                <button onClick={() => setCurrentPage("transportation")}>
                  Book Transportation
                </button>
              </section>

              <section>
                <h2>Complaints & Ratings</h2>
                <button onClick={() => setCurrentPage("ComplaintForm")}>
                  File a Complaint
                </button>
                <button onClick={() => setCurrentPage("MyComplaintsList")}>
                  View My Complaints
                </button>
                <button onClick={() => setCurrentPage("ratingForm")}>
                  Rate a Tour Guide
                </button>
              </section>

              <section>
                <h2>Extras</h2>
                <button onClick={() => setCurrentPage("loyaltyPoints")}>
                  Loyalty Points
                </button>
                <button onClick={() => setCurrentPage("ShareItem")}>
                  Share an Item
                </button>
              </section>
            </div>
          </section>
        );
    }
  };

  return <div className="tourist-frontend">{renderPage()}</div>;
};

export default Tourist;
