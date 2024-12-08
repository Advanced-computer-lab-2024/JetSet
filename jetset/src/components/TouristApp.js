import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

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
import Book from "./tourist/ActivitiesAndItineraries";
import Transportations from "./tourist/Transportations";
import ShareItem from "./tourist/ShareItem";
import ActivityByCategory from "./Activity/ActivitiesByCategory";
import FlightBooking from "./Booking/FlightBooking";
import HotelSearch from "./Booking/HotelSearch";
import BookedItineraries from "./tourist/BookedItineraries";
import VacationGuide from "./tourist/VacationGuide";
import Cart from "./tourist/Cart";
import PaidItemsView from "./tourist/PaidItemsView";
import Wishlist from "./tourist/Wishlist";
import ViewOrders from "./tourist/vieworders";
import ViewOrderDetails from "./tourist/ViewOrderDetails";
import CancelOrder from "./tourist/CancelOrder";
import ViewRefundAmount from "./tourist/ViewRefundAmount";

import NavTourist from "./tourist/navTourist";

const Tourist = () => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const touristId = location.state?.touristId;
  const [username, setUsername] = useState("");
  const [showPurchasedProducts, setShowPurchasedProducts] = useState();

  useEffect(() => {
    const fetchTourist = async () => {
      if (touristId) {
        try {
          console.log("Fetching tourist profile for ID:", touristId);
          const response = await axios.get(
            `http://localhost:3000/getTourist/${touristId}`
          );
          console.log("Tourist data:", response.data);
          setUsername(response.data.username);
        } catch (error) {
          console.error("Error during fetch:", error);
          alert(
            error.response?.data?.message || "Error fetching tourist profile"
          );
        }
      } else {
        console.log("touristId is undefined");
      }
    };
    fetchTourist();
  }, [touristId]);

  const renderPage = () => {
    switch (currentPage) {
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
      case "Wishlist":
        return <Wishlist touristId={touristId} />;
      case "ActivityByCategory":
        return <ActivityByCategory touristId={touristId} />;
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
      case "booking":
        return <Book touristId={touristId} />;
      case "transportation":
        return <Transportations touristId={touristId} />;
      case "book":
        return <FlightBooking touristId={touristId} />;
      case "bookh":
        return <HotelSearch touristId={touristId} />;
      case "bookIti":
        return <BookedItineraries touristId={touristId} />;
      case "vacationGuide": // New case for Vacation Guide
        return <VacationGuide touristId={touristId} />;
      case "cart": // New case for Vacation Guide
        return <Cart touristId={touristId} />;
      case "viewPaid":
        return <PaidItemsView touristId={touristId} />;
      case "viewOrders":
        return <ViewOrders touristId={touristId} />;
      case "viewOrderDetails":
        return <ViewOrderDetails touristId={touristId} />;
      case "cancelOrder":
        return <CancelOrder touristId={touristId} />;
      case "viewRefundAmount":
        return <ViewRefundAmount touristId={touristId} />;
      default:
        return (
          <section className="tourist-frontend">
            <NavTourist touristId={touristId} username={username} />

            <div className="button-groups">
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
                <button onClick={() => setCurrentPage("viewPaid")}>
                  Paid Activities and Iteniraries
                </button>
              </section>

              <section>
                <h2>Products & Purchases</h2>
                <button onClick={() => setCurrentPage("productList")}>
                  View Products
                </button>
                <button onClick={() => setCurrentPage("cart")}>
                  View My Cart
                </button>
                <button onClick={() => setCurrentPage("Wishlist")}>
                  View My WishList
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
                <button onClick={() => setCurrentPage("viewOrders")}>
                  View Orders
                </button>
                <button onClick={() => setCurrentPage("viewOrderDetails")}>
                  View Order Details
                </button>
                <button onClick={() => setCurrentPage("cancelOrder")}>
                  Cancel Order
                </button>
                <button onClick={() => setCurrentPage("viewRefundAmount")}>
                  View Refund Amount
                </button>
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
