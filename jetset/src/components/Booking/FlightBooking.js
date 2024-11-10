// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './FlightBooking.css'; // Optional CSS for styling

// const FlightBooking = () => {
//     const [origin, setOrigin] = useState('');
//     const [destination, setDestination] = useState('');
//     const [departureDate, setDepartureDate] = useState('');
//     const [returnDate, setReturnDate] = useState('');
//     const [adults, setAdults] = useState(1);
//     const [flights, setFlights] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [bookingMessage, setBookingMessage] = useState('');
//     const [touristId, setTouristId] = useState(''); // Assume you get this from somewhere (e.g., user login)

//     // Optionally, you can fetch the touristId based on the logged-in user
//     useEffect(() => {
//         // Fetch touristId from an authentication API or context
//         // For example:
//         setTouristId('6723896c185909fcd367634a');
//     }, []);

//     const searchFlights = async () => {
//         setLoading(true);
//         setBookingMessage('');
//         try {
//             const response = await axios.post('http://localhost:3000/search-flights', {
//                 origin,
//                 destination,
//                 departureDate,
//                 returnDate,
//                 adults
//             });
//             setFlights(response.data.data); // Adjust based on response structure
//         } catch (error) {
//             console.error('Error fetching flights:', error);
//             setBookingMessage('Error fetching flights. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleBook = async (flightId) => {
//         if (!touristId) {
//             setBookingMessage('Please log in to book a flight.');
//             return;
//         }

//         setLoading(true);
//         setBookingMessage('');
//         try {
//             const response = await axios.post('http://localhost:3000/book-flight', {
//                 flightId,
//                 touristId // Include the touristId from the state
//             });
//             console.log('Booking response:', response.data);
//             setBookingMessage(Flight booked successfully! Booking ID: ${response.data.bookingId});
//         } catch (error) {
//             console.error('Error booking flight:', error);
//             setBookingMessage('Error booking flight. Please try again.');
//         } finally {
//             setLoading(false); // Stop loading regardless of the outcome
//         }
//     };

//     return (
//         <div>
//             <h1>Flight Booking</h1>

//             {/* Display booking message at the top of the screen */}
//             {bookingMessage && (
//                 <div className="booking-message">
//                     {bookingMessage}
//                 </div>
//             )}

//             <input
//                 type="text"
//                 placeholder="Origin"
//                 value={origin}
//                 onChange={(e) => setOrigin(e.target.value)}
//             />
//             <input
//                 type="text"
//                 placeholder="Destination"
//                 value={destination}
//                 onChange={(e) => setDestination(e.target.value)}
//             />
//             <input
//                 type="date"
//                 value={departureDate}
//                 onChange={(e) => setDepartureDate(e.target.value)}
//             />
//             <input
//                 type="date"
//                 value={returnDate}
//                 onChange={(e) => setReturnDate(e.target.value)}
//             />
//             <input
//                 type="number"
//                 value={adults}
//                 onChange={(e) => setAdults(Number(e.target.value))}
//                 min="1"
//             />
//             <button onClick={searchFlights} disabled={loading}>
//                 {loading ? 'Searching...' : 'Search Flights'}
//             </button>

//             {flights.length > 0 && (
//                 <div>
//                     <h2>Available Flights</h2>
//                     <ul>
//                         {flights.map((flight) => (
//                             <li key={flight.id}>
//                                 <h3>Flight Offer ID: {flight.id}</h3>
//                                 <p>Price: {flight.price.total} {flight.price.currency}</p>
//                                 <p>Departure: {flight.itineraries[0].segments[0].departure.at} ({flight.itineraries[0].segments[0].departure.iataCode})</p>
//                                 <p>Arrival: {flight.itineraries[0].segments[0].arrival.at} ({flight.itineraries[0].segments[0].arrival.iataCode})</p>
//                                 <p>Duration: {flight.itineraries[0].duration}</p>
//                                 <p>Carrier: {flight.itineraries[0].segments[0].carrierCode}</p>
//                                 <p>Flight Number: {flight.itineraries[0].segments[0].number}</p>
//                                 <p>Stops: {flight.itineraries[0].segments[0].numberOfStops}</p>
//                                 <button onClick={() => handleBook(flight.id)} disabled={loading}>
//                                     {loading ? 'Booking...' : 'Book Flight'}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FlightBooking;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FlightBooking.css"; // Optional CSS for styling

const FlightBooking = ({ touristId }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  //const [touristId, setTouristId] = useState(''); // Assume you get this from somewhere (e.g., user login)
  const [passengerDetails, setPassengerDetails] = useState({
    name: "",
    passportNumber: "",
    email: "",
    phone: "",
  });

  // Optionally, you can fetch the touristId based on the logged-in user
  // useEffect(() => {
  //     // Fetch touristId from an authentication API or context
  //     // For example:
  //     setTouristId('6723896c185909fcd367634a');
  // }, []);

  const searchFlights = async () => {
    setLoading(true);
    setBookingMessage("");
    try {
      const response = await axios.post(
        "http://localhost:3000/search-flights",
        {
          origin,
          destination,
          departureDate,
          returnDate,
          adults,
        }
      );
      setFlights(response.data.data); // Adjust based on response structure
    } catch (error) {
      console.error("Error fetching flights:", error);
      setBookingMessage("Error fetching flights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (flightId) => {
    // if (!touristId) {
    //     setBookingMessage('Please log in to book a flight.');
    //     return;
    // }

    if (
      !passengerDetails.name ||
      !passengerDetails.passportNumber ||
      !passengerDetails.email ||
      !passengerDetails.phone
    ) {
      setBookingMessage("Please complete passenger details.");
      return;
    }

    setLoading(true);
    setBookingMessage("");
    try {
      const response = await axios.post(
        `http://localhost:3000/book-flight/${touristId}`,
        {
          flightId,
          origin,
          destination,
          departureDate,
          returnDate,
          adults,
          maxPrice: 500, // Optional max price, can be set dynamically if needed
          passengerDetails, // Send passenger details in the request
        }
      );
      console.log("Booking response:", response.data);
      setBookingMessage(
        `Flight booked successfully! Booking ID: ${response.data.bookingDetails.bookingReference}`
      );
    } catch (error) {
      console.error("Error booking flight:", error);
      setBookingMessage("Error booking flight. Please try again.");
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <div>
      <h1>Flight Booking</h1>

      {/* Display booking message at the top of the screen */}
      {bookingMessage && (
        <div className="booking-message">{bookingMessage}</div>
      )}

      <input
        type="text"
        placeholder="Origin"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="date"
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
      />
      <input
        type="date"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
      />
      <input
        type="number"
        value={adults}
        onChange={(e) => setAdults(Number(e.target.value))}
        min="1"
      />
      <button onClick={searchFlights} disabled={loading}>
        {loading ? "Searching..." : "Search Flights"}
      </button>

      {/* Passenger Details */}
      <div>
        <h3>Passenger Details</h3>
        <input
          type="text"
          placeholder="Name"
          value={passengerDetails.name}
          onChange={(e) =>
            setPassengerDetails({ ...passengerDetails, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Passport Number"
          value={passengerDetails.passportNumber}
          onChange={(e) =>
            setPassengerDetails({
              ...passengerDetails,
              passportNumber: e.target.value,
            })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={passengerDetails.email}
          onChange={(e) =>
            setPassengerDetails({ ...passengerDetails, email: e.target.value })
          }
        />
        <input
          type="tel"
          placeholder="Phone"
          value={passengerDetails.phone}
          onChange={(e) =>
            setPassengerDetails({ ...passengerDetails, phone: e.target.value })
          }
        />
      </div>

      {flights.length > 0 && (
        <div>
          <h2>Available Flights</h2>
          <ul>
            {flights.map((flight) => (
              <li key={flight.id}>
                <h3>Flight Offer ID: {flight.id}</h3>
                <p>
                  Price: {flight.price.total} {flight.price.currency}
                </p>
                <p>
                  Departure: {flight.itineraries[0].segments[0].departure.at} (
                  {flight.itineraries[0].segments[0].departure.iataCode})
                </p>
                <p>
                  Arrival: {flight.itineraries[0].segments[0].arrival.at} (
                  {flight.itineraries[0].segments[0].arrival.iataCode})
                </p>
                <p>Duration: {flight.itineraries[0].duration}</p>
                <p>Carrier: {flight.itineraries[0].segments[0].carrierCode}</p>
                <p>Flight Number: {flight.itineraries[0].segments[0].number}</p>
                <p>Stops: {flight.itineraries[0].segments[0].numberOfStops}</p>
                <button
                  onClick={() => handleBook(flight.id)}
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Book Flight"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FlightBooking;
