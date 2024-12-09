import React, { useState } from "react";
import { Button } from "antd"; // Import Ant Design Button
import FlightBooking from "./Booking/FlightBooking";
import HotelSearch from "./Booking/HotelSearch";
import Transportations from "./tourist/Transportations";
import Book from "./tourist/ActivitiesAndItineraries";

const BookSection = ({ touristId }) => {
  // State to track the active component
  const [activeComponent, setActiveComponent] = useState("");

  // Function to render the component based on the active state
  const renderComponent = () => {
    switch (activeComponent) {
      case "flight":
        return <FlightBooking touristId={touristId} />;
      case "hotel":
        return <HotelSearch touristId={touristId} />;
      case "transport":
        return <Transportations touristId={touristId} />;
      case "book":
        return <Book touristId={touristId} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        {/* Ant Design buttons to switch between components */}
        <Button
          type="primary"
          onClick={() => setActiveComponent("flight")}
          style={{ margin: "5px" }}
        >
          Flight Booking
        </Button>
        <Button
          type="primary"
          onClick={() => setActiveComponent("hotel")}
          style={{ margin: "5px" }}
        >
          Hotel Search
        </Button>
        <Button
          type="primary"
          onClick={() => setActiveComponent("transport")}
          style={{ margin: "5px" }}
        >
          Transportation
        </Button>
        <Button
          type="primary"
          onClick={() => setActiveComponent("book")}
          style={{ margin: "5px" }}
        >
          Book
        </Button>
      </div>

      {/* Conditionally render the active component */}
      {renderComponent()}
    </div>
  );
};

export default BookSection;
