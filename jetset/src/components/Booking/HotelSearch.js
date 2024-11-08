// import React, { useState } from 'react';
// import axios from 'axios';

// const HotelSearch = () => {
//   const [formData, setFormData] = useState({
//     checkIn: '',
//     checkOut: '',
//     adults: 1,
//     children: 0,
//     destinationCode: '',
//     childrenAges: ['', ''],
//     rooms: 1,
//   });

//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [bookingStatus, setBookingStatus] = useState(null); // Store booking status here

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleChildAgeChange = (index, value) => {
//     const updatedAges = [...formData.childrenAges];
//     updatedAges[index] = value;
//     setFormData({ ...formData, childrenAges: updatedAges });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Convert adults and children to numbers to avoid string-based calculations
//     const adultsCount = parseInt(formData.adults, 10);
//     const childrenCount = parseInt(formData.children, 10);

//     // Create paxes based on adults and children
//     const paxes = [];

//     // Add adults
//     for (let i = 0; i < adultsCount; i++) {
//       paxes.push({ type: 'AD', age: 30 }); // Assuming all adults are 30 years old, adjust as necessary
//     }

//     // Add children
//     formData.childrenAges.slice(0, childrenCount).forEach((age) => {
//       if (age) {
//         paxes.push({ type: 'CH', age: parseInt(age, 10) });
//       }
//     });

//     // Debug: Log the number of adults, children, and total paxes
//     console.log("Form Data:", formData);
//     console.log("Generated Paxes:", paxes);

//     // Ensure the number of paxes matches the number of adults + children
//     if (paxes.length !== (adultsCount + childrenCount)) {
//       setError('The number of paxes does not match the number of adults and children.');
//       setResult(null);
//       console.log("Error: Paxes count mismatch");
//       return;
//     }

//     // Prepare payload
//     const payload = {
//       checkIn: formData.checkIn,
//       checkOut: formData.checkOut,
//       adults: adultsCount,
//       children: childrenCount,
//       destinationCode: formData.destinationCode,
//       occupancies: [
//         {
//           rooms: formData.rooms, // Dynamically set number of rooms
//           adults: adultsCount,
//           children: childrenCount,
//           paxes, // Pass the paxes array
//         },
//       ],
//     };

//     try {
//       const response = await axios.post('/search-hotels', payload);
//       console.log('API response:', response.data); // Debugging: Log the full response
//       setResult(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Error fetching hotels. Please try again.');
//       setResult(null);
//     }
//   };

//   const handleBookNow = async (hotelId) => {
//     try {
//       // Validate hotelId
//       if (!hotelId) {
//         setBookingStatus({ message: 'Hotel ID is required.' });
//         return;
//       }

//       // Ensure there are passenger details (adults and children)
//       const passengerDetails = [];

//       // Add children if there are any
//       const children = formData.childrenAges.slice(0, formData.children);
//       children.forEach((age) => {
//         if (age) {
//           passengerDetails.push({
//             type: 'CH',
//             age: parseInt(age, 10),
//           });
//         }
//       });

//       // Add adults, assuming all adults are 30 years old
//       const adults = Array.from({ length: formData.adults }, () => ({
//         type: 'AD',
//         age: 30,
//       }));

//       // Merge adults and children passenger details
//       const payload = {
//         hotelId,
//         passengerDetails: [...adults, ...passengerDetails],
//       };

//       console.log("Booking Payload:", payload);

//       // Sending the booking request
//       const bookingResponse = await axios.post('/book-hotel/6723896c185909fcd367634a', payload);
//       console.log('Booking Response:', bookingResponse.data);

//       // Set the booking status based on the response
//       setBookingStatus(bookingResponse.data); // Update the UI with the booking status

//     } catch (err) {
//       // Handle errors properly
//       if (err.response) {
//         // Server responded with an error
//         console.error('Error response:', err.response);
//         setBookingStatus({ message: err.response.data.message || 'An error occurred while booking.' });
//       } else {
//         // General error (network issues, etc.)
//         console.error('Error:', err);
//         setBookingStatus({ message: 'Error occurred while booking. Please try again.' });
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Hotel Search</h2>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Check-In Date:
//           <input
//             type="date"
//             name="checkIn"
//             value={formData.checkIn}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//         <label>
//           Check-Out Date:
//           <input
//             type="date"
//             name="checkOut"
//             value={formData.checkOut}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//         <label>
//           Adults:
//           <input
//             type="number"
//             name="adults"
//             min="1"
//             value={formData.adults}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//         <label>
//           Children:
//           <input
//             type="number"
//             name="children"
//             min="0"
//             value={formData.children}
//             onChange={handleInputChange}
//           />
//         </label>
//         {Array.from({ length: formData.children }).map((_, index) => (
//           <label key={index}>
//             Child {index + 1} Age:
//             <input
//               type="number"
//               min="0"
//               name={childAge${index}}
//               value={formData.childrenAges[index]}
//               onChange={(e) => handleChildAgeChange(index, e.target.value)}
//             />
//           </label>
//         ))}
//         <label>
//           Number of Rooms:
//           <input
//             type="number"
//             name="rooms"
//             min="1"
//             value={formData.rooms}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//         <label>
//           Destination Code:
//           <input
//             type="text"
//             name="destinationCode"
//             value={formData.destinationCode}
//             onChange={handleInputChange}
//             required
//           />
//         </label>
//         <button type="submit">Search Hotels</button>
//       </form>

//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {result && Array.isArray(result.hotels.hotels) ? (
//         <div>
//           <h3>Search Results</h3>
//           <div style={{ display: 'grid', gap: '1em' }}>
//             {result.hotels.hotels.map((hotel, index) => (
//               <div key={index} style={{ border: '1px solid #ddd', padding: '1em', borderRadius: '8px' }}>
//                 <h4>{hotel.name}</h4>
//                 <p><strong>Location:</strong> {hotel.destinationName}, {hotel.zoneName}</p>
//                 <p><strong>Rating:</strong> {hotel.categoryName}</p>
//                 {hotel.rooms[0]?.rates[0] && (
//                   <p><strong>Price:</strong> ${hotel.rooms[0].rates[0].net}</p>
//                 )}
//                 <p><strong>Amenities:</strong> {hotel.amenities ? hotel.amenities.join(', ') : 'N/A'}</p>
//                 <button onClick={() => handleBookNow(hotel.id)}>Book Now</button> {/* Booking button */}
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : result ? (
//         <div>
//           <h3>Unexpected Result Format</h3>
//           <pre>{JSON.stringify(result, null, 2)}</pre>
//         </div>
//       ) : null}

//       {/* Display booking status */}
//       {bookingStatus && (
//         <div>
//           <h3>Booking Status</h3>
//           <p>Booking ID: {bookingStatus.bookingId}</p>
//           <p>Status: {bookingStatus.status}</p>
//           <p>{bookingStatus.message}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HotelSearch;

import React, { useState } from "react";
import axios from "axios";

const HotelSearch = () => {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    destinationCode: "",
    childrenAges: ["", ""],
    rooms: 1,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChildAgeChange = (index, value) => {
    const updatedAges = [...formData.childrenAges];
    updatedAges[index] = value;
    setFormData({ ...formData, childrenAges: updatedAges });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure valid date range: checkIn should be before checkOut
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      setError("Check-out date must be later than check-in date.");
      setResult(null);
      return;
    }

    // Convert adults and children to numbers to avoid string-based calculations
    const adultsCount = parseInt(formData.adults, 10);
    const childrenCount = parseInt(formData.children, 10);

    // Create paxes based on adults and children
    const paxes = [];

    // Add adults (Assuming all adults are 30 years old, adjust as needed)
    for (let i = 0; i < adultsCount; i++) {
      paxes.push({ type: "AD", age: 30 });
    }

    // Add children (If ages are provided)
    formData.childrenAges.slice(0, childrenCount).forEach((age) => {
      if (age) {
        paxes.push({ type: "CH", age: parseInt(age, 10) });
      }
    });

    // Debug: Log the number of adults, children, and total paxes
    console.log("Form Data:", formData);
    console.log("Generated Paxes:", paxes);

    // Ensure the number of paxes matches the number of adults + children
    if (paxes.length !== adultsCount + childrenCount) {
      setError(
        "The number of paxes does not match the number of adults and children."
      );
      setResult(null);
      return;
    }

    // Prepare payload
    const payload = {
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      adults: adultsCount,
      children: childrenCount,
      destinationCode: formData.destinationCode,
      occupancies: [
        {
          rooms: formData.rooms,
          adults: adultsCount,
          children: childrenCount,
          paxes,
        },
      ],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/search-hotels",
        payload
      );
      console.log("API response:", response.data); // Debugging: Log the full response
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError("Error fetching hotels. Please try again.");
      setResult(null);
    }
  };

  const handleBookNow = async () => {
    // Ensure the necessary fields are prepared
    const paxes = [];

    // Add children if there are any
    formData.childrenAges.slice(0, formData.children).forEach((age) => {
      if (age) {
        paxes.push({ type: "CH", age: parseInt(age, 10) });
      }
    });

    // Add adults (Assuming all adults are 30 years old)
    const adults = Array.from({ length: formData.adults }, () => ({
      type: "AD",
      age: 30,
    }));

    // Merge adults and children passenger details
    const payload = {
      paxes: [...adults, ...paxes], // No hotelId required
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      adults: formData.adults,
      children: formData.children,
      destinationCode: formData.destinationCode,
      rooms: formData.rooms,
    };

    try {
      const bookingResponse = await axios.post(
        `http://localhost:3000/book-hotel/6723896c185909fcd367634a`,
        payload
      );
      console.log("Booking Response:", bookingResponse.data);

      // Set the booking status based on the response
      setBookingStatus(bookingResponse.data);
    } catch (err) {
      if (err.response) {
        console.error("Error response:", err.response);
        setBookingStatus({
          message:
            err.response.data.message || "An error occurred while booking.",
        });
      } else {
        console.error("Error:", err);
        setBookingStatus({
          message: "Error occurred while booking. Please try again.",
        });
      }
    }
  };

  return (
    <div>
      {/* Display booking status */}
      {bookingStatus && (
        <div>
          <h3>Booking Status</h3>
          <p>Booking ID: {bookingStatus.bookingId}</p>
          <p>Status: {bookingStatus.status}</p>
          <p>{bookingStatus.message}</p>
        </div>
      )}
      <h2>Hotel Search</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Check-In Date:
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Check-Out Date:
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Adults:
          <input
            type="number"
            name="adults"
            min="1"
            value={formData.adults}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Children:
          <input
            type="number"
            name="children"
            min="0"
            value={formData.children}
            onChange={handleInputChange}
          />
        </label>
        {Array.from({ length: formData.children }).map((_, index) => (
          <div key={index}>
            <label>
              Child {index + 1} Age:
              <input
                type="number"
                min="0"
                value={formData.childrenAges[index]}
                onChange={(e) => handleChildAgeChange(index, e.target.value)}
              />
            </label>
          </div>
        ))}
        <label>
          Number of Rooms:
          <input
            type="number"
            name="rooms"
            min="1"
            value={formData.rooms}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Destination Code:
          <input
            type="text"
            name="destinationCode"
            value={formData.destinationCode}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit">Search Hotels</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && Array.isArray(result.hotels.hotels) ? (
        <div>
          <h3>Search Results</h3>
          <div style={{ display: "grid", gap: "1em" }}>
            {result.hotels.hotels.map((hotel, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "1em",
                  borderRadius: "8px",
                }}
              >
                <h4>{hotel.name}</h4>
                <p>
                  <strong>Location:</strong> {hotel.destinationName},{" "}
                  {hotel.zoneName}
                </p>
                <p>
                  <strong>Rating:</strong> {hotel.categoryName}
                </p>
                {hotel.rooms[0]?.rates[0] && (
                  <p>
                    <strong>Price:</strong> ${hotel.rooms[0].rates[0].net}
                  </p>
                )}
                <p>
                  <strong>Amenities:</strong>{" "}
                  {hotel.amenities ? hotel.amenities.join(", ") : "N/A"}
                </p>
                <button onClick={() => handleBookNow(hotel.id)}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : result ? (
        <div>
          <h3>Unexpected Result Format</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
};

export default HotelSearch;
