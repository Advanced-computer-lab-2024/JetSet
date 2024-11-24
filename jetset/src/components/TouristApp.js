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
import SetPreferredCurrency from "./tourist/SetPreferredCurrency";
import ShareItem from "./tourist/ShareItem";
import ActivityByCategory from "./Activity/ActivitiesByCategory";
import FlightBooking from "./Booking/FlightBooking";
import HotelSearch from "./Booking/HotelSearch";
import BookedItineraries from "./tourist/BookedItineraries";
import VacationGuide from "./tourist/VacationGuide";

import "./styles.css";

const Tourist = () => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const touristId = location.state?.touristId;
  const [showPurchasedProducts, setShowPurchasedProducts] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "touristProfile":
        return <TouristProfile touristId={touristId} />;
      case "productList":
        return <ProductList touristId={touristId} />;
      case "activityList":
        return <ActivityList touristId={touristId} />;
      case "itineraryList":
        return <ItineraryList touristId={touristId} />;
      case "historicalPlaces":
        return <HistoricalPlaces touristId={touristId} />;
      case "search":
        return <Search touristId={touristId} />;
      case "touristProduct":
        return <TouristProducts touristId={touristId} />;
      case "ActivityByCategory":
        return <ActivityByCategory touristId={touristId} />;
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
      case "vacationGuide": // New case for Vacation Guide
        return <VacationGuide touristId={touristId} />;

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
                <button onClick={() => setCurrentPage("historicalPlaces")}>
                  View Place
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
                <button onClick={() => setCurrentPage("vacationGuide")}>
                  View Vacation Guide
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
