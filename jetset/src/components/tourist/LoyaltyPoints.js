import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoyaltyPointsForm = () => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(null);
  const [level, setLevel] = useState(null);
  const [badge, setBadge] = useState(''); // Initialize the badge state

  // Example function to update the badge
 
//   const [touristId, setTouristId] = useState('');

  // On component mount, get touristId from local storage if it exists
//   useEffect(() => {
//     const storedTouristId = localStorage.getItem('touristId');
//     if (storedTouristId) {
//       setTouristId(storedTouristId);
//     }
//   }, []);
const touristId="672495d97330ef8196c0859b";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedPaymentAmount = parseFloat(paymentAmount);

    if (isNaN(parsedPaymentAmount) || parsedPaymentAmount <= 0) {
      setMessage('Payment amount must be a valid positive number.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/addLoyaltyPoints/${touristId}`, {
        paymentAmount: parsedPaymentAmount,
      });

      setMessage(response.data.message);
      setLoyaltyPoints(response.data.loyaltyPoints);
      setBadge(response.data.badge);

      setLevel(response.data.level);
    } catch (error) {
      console.error('Error adding loyalty points:', error.response ? error.response.data : error.message);
      setMessage('Failed to add loyalty points: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div>
      <h2>Add Loyalty Points</h2>
      <form onSubmit={handleSubmit}>
        
         
        <label>
          Payment Amount:
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
      {loyaltyPoints !== null && (
        <div>
          <p>    Loyalty Points: {loyaltyPoints}</p>
          <p>    Level: {level}</p>
          <p>    Badge: {badge}</p>
        </div>
      )}
    </div>
  );
};

export default LoyaltyPointsForm;

// import React, { useState } from 'react';
// import axios from 'axios';

// //this should be integrated with req 58
// // import React, { useState } from 'react';
// // import axios from 'axios';

// const LoyaltyPointsForm = () => {
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [message, setMessage] = useState('');
//   const [loyaltyPoints, setLoyaltyPoints] = useState(null);
//   const [level, setLevel] = useState(null);
//   const [touristId, setTouristId] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const storedTouristId =localStorage.getItem('touristId');
//     try {
//       const response = await axios.post(`http://localhost:3000/addLoyaltyPoints/${storedTouristId}`, {
//         paymentAmount: parseFloat(paymentAmount), 
//       });

//       setMessage(response.data.message);
//       setLoyaltyPoints(response.data.loyaltyPoints);
//       setLevel(response.data.level);
//     } catch (error) {
//       console.error('Error adding loyalty points:', error);
//       setMessage('Failed to add loyalty points');
//     }
//   };

//   return (
//     <div>
//       <h2>Add Loyalty Points</h2>
//       <form onSubmit={handleSubmit}>
//                <label>
//           Payment Amount:
//           <input
//             type="number"
//             value={paymentAmount}
//             onChange={(e) => setPaymentAmount(e.target.value)}
//             required
//           />
//         </label>
//         <button type="submit">Submit</button>
//       </form>

//       {message && <p>{message}</p>}
//       {loyaltyPoints !== null && (
//         <div>
//           <p>Loyalty Points: {loyaltyPoints}</p>
//           <p>Level: {level}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoyaltyPointsForm;
