// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ActivitiesList = () => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Filter state variables
//   const [budget, setBudget] = useState("");
//   const [date, setDate] = useState("");
//   const [category, setCategory] = useState("");
//   const [rating, setRating] = useState("");

//   // Sorting state variables
//   const [sortBy, setSortBy] = useState("ratings"); // Default sort option
//   const [sortOrder, setSortOrder] = useState(1); // Default to ascending order

//   // Fetch all activities
//   const fetchActivities = async () => {
//     setLoading(true); // Show loading state
//     setError(null); // Reset error state

//     try {
//       const response = await axios.get("/Acttour"); // Assuming the endpoint is "/activities"
//       setActivities(response.data); // Store the activities in state
//     } catch (err) {
//       setError("Error fetching activities: " + err.message);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Filter activities based on user inputs
//   const filterActivities = async () => {
//     setLoading(true); // Show loading state
//     setError(null); // Reset error state

//     try {
//       const response = await axios.get("/filterActivity", {
//         params: {
//           budget: budget || undefined, // Send filter params only if they exist
//           date: date || undefined,
//           category: category || undefined,
//           rating: rating || undefined,
//         },
//       });
//       console.log(response.data);
//       setActivities(response.data); // Store the filtered activities in state
//     } catch (err) {
//       setError("Error filtering activities: " + err.message);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Sort activities based on user inputs
//   const sortActivities = async () => {
//     setLoading(true); // Show loading state
//     setError(null); // Reset error state

//     try {
//       const response = await axios.get("/sortactivities", {
//         params: {
//           sortBy,
//           sortOrder,
//         },
//       });

//       setActivities(response.data); // Store the sorted activities in state
//       console.log(response.data);
//     } catch (err) {
//       setError("Error fetching sorted activities: " + err.message);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Fetch all activities when the component mounts
//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div>
//       <h2>Activities List</h2>

//       {/* Loading and Error States */}
//       {loading && <div>Loading activities...</div>}
//       {error && <div>{error}</div>}

//       {/* Filter Inputs */}
//       <div className="filters">
//         <input
//           type="number"
//           placeholder="Budget"
//           value={budget}
//           onChange={(e) => setBudget(e.target.value)}
//         />
//         <input
//           type="date"
//           placeholder="Date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Category"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Rating"
//           value={rating}
//           onChange={(e) => setRating(e.target.value)}
//         />
//         <button onClick={filterActivities}>Filter Activities</button>
//       </div>

//       {/* Sort Options */}
//       <div className="sort-options">
//         <h3>Sort Activities</h3>
//         <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
//           <option value="ratings">Sort by Ratings</option>
//           <option value="budget">Sort by Budget</option>
//         </select>

//         <select
//           onChange={(e) => setSortOrder(Number(e.target.value))}
//           value={sortOrder}
//         >
//           <option value={1}>Ascending</option>
//           <option value={-1}>Descending</option>
//         </select>
//         <button onClick={sortActivities}>Sort Activities</button>
//       </div>

//       {/* Activities List */}
//       <ul>
//         {activities.length > 0 ? (
//           activities.map((activity) => (
//             <li key={activity._id}>
//               <h3>{activity.title || "No Title Available"}</h3>
//               <p>
//                 Location:{" "}
//                 {activity.location?.address || "No Location Available"}
//               </p>
//               <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
//               <p>Budget: {activity.budget || "No Budget"}</p>
//               <p>Rating: {activity.rating || "No Rating"}</p>
//               <p>Category: {activity.category || "No Category Available"}</p>
//               <p>
//                 Tags:{" "}
//                 {activity.tags.length > 0
//                   ? activity.tags.join(", ")
//                   : "No Tags"}
//               </p>
//               <p>Booking Open: {activity.booking_open ? "Yes" : "No"}</p>
//             </li>
//           ))
//         ) : (
//           <div>No activities available.</div>
//         )}
//       </ul>
//     </div>
//   );
// };

// export default ActivitiesList;

import React, { useState, useEffect } from "react";
import axios from "axios";

const ActivitiesList = ({ touristId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter state variables
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("");

  // Sorting state variables
  const [sortBy, setSortBy] = useState("ratings");
  const [sortOrder, setSortOrder] = useState(1);

  // Currency conversion state variables
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);

  // Fetch conversion rate for the selected currency
  const fetchConversionRate = async (currency) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/tourist/${touristId}/preferredCurrency`
      );
      setSelectedCurrency(response.data.preferredCurrency); // Set the currency

      setConversionRate(response.data.conversionRate); // Set the conversion rate
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  // Fetch all activities
  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/Acttour");
      setActivities(response.data);
    } catch (err) {
      setError("Error fetching activities: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on user inputs
  const filterActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const convertedBudget = Math.floor(budget / conversionRate);
      console.log(convertedBudget);
      console.log(conversionRate);
      const response = await axios.get("/filterActivity", {
        params: {
          budget: convertedBudget || undefined,
          date: date || undefined,
          category: category || undefined,
          rating: rating || undefined,
        },
      });
      setActivities(response.data);
    } catch (err) {
      setError("Error filtering activities: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sort activities based on user inputs
  const sortActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/sortactivities", {
        params: {
          sortBy,
          sortOrder,
        },
      });
      setActivities(response.data);
    } catch (err) {
      setError("Error fetching sorted activities: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all activities when the component mounts
  useEffect(() => {
    fetchActivities();
  }, []);

  // Fetch the conversion rate when the selected currency changes
  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  return (
    <div>
      <h2>Activities List</h2>

      {loading && <div>Loading activities...</div>}
      {error && <div>{error}</div>}

      {/* Filter Inputs */}
      <div className="filters">
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <button onClick={filterActivities}>Filter Activities</button>
      </div>

      {/* Sort Options */}
      <div className="sort-options">
        <h3>Sort Activities</h3>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="ratings">Sort by Ratings</option>
          <option value="budget">Sort by Budget</option>
        </select>
        <select
          onChange={(e) => setSortOrder(Number(e.target.value))}
          value={sortOrder}
        >
          <option value={1}>Ascending</option>
          <option value={-1}>Descending</option>
        </select>
        <button onClick={sortActivities}>Sort Activities</button>
      </div>

      {/* Activities List */}
      <ul>
        {activities.length > 0 ? (
          activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.title || "No Title Available"}</h3>
              <p>
                Location:{" "}
                {activity.location?.address || "No Location Available"}
              </p>
              <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              <p>
                Budget:{" "}
                {activity.budget
                  ? (activity.budget * conversionRate).toFixed(2)
                  : "No Budget"}{" "}
                {selectedCurrency}
              </p>
              <p>Rating: {activity.rating || "No Rating"}</p>
              <p>Category: {activity.category || "No Category Available"}</p>
              <p>
                Tags:{" "}
                {activity.tags.length > 0
                  ? activity.tags.join(", ")
                  : "No Tags"}
              </p>
              <p>Booking Open: {activity.booking_open ? "Yes" : "No"}</p>
            </li>
          ))
        ) : (
          <div>No activities available.</div>
        )}
      </ul>
    </div>
  );
};

export default ActivitiesList;
