// // ShareItem.js
// import React, { useState } from "react";
// import axios from "axios";

// const ShareItem = () => {
//   const [itemType, setItemType] = useState("activity"); // Default to activity
//   const [shareableLink, setShareableLink] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleShareItem = async () => {
//     // Hardcoded item IDs based on item type
//     const itemId =
//       itemType === "activity"
//         ? "670d4680dcbc415cf0e18707"
//         : itemType === "itinerary"
//         ? "67163747fac80a62e078bb5f"
//         : "6703b76ffa4603592f12f6cd"; // Default for "historical"

//     try {
//       const response = await axios.post("/share", { itemId, itemType });
//       setShareableLink(response.data.link);
//       setErrorMessage("");
//     } catch (error) {
//       setErrorMessage("Error generating share link.");
//       setShareableLink("");
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h2>Share an Item</h2>
//       <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
//         <option value="activity">Activity</option>
//         <option value="itinerary">Itinerary</option>
//         <option value="historical">Historical</option>
//       </select>
//       <button onClick={handleShareItem}>Generate Share Link</button>
//       {shareableLink && <p>Shareable Link: {shareableLink}</p>}
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//     </div>
//   );
// };

// export default ShareItem;

import React, { useState, useEffect } from "react";
import axios from "axios";

const ShareItem = () => {
  const [itemType, setItemType] = useState("activity"); // Default to Activity
  const [items, setItems] = useState([]); // Store the fetched items
  const [selectedItem, setSelectedItem] = useState(null);
  const [shareableLink, setShareableLink] = useState("");
  const [error, setError] = useState("");

  // Fetch items based on selected item type (itiTour, Acttour, viewAllPlaces)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = "";
        switch (itemType) {
          case "activity":
            url = "http://localhost:3000/Acttour";
            break;
          case "itinerary":
            url = "http://localhost:3000/itiTour";
            break;
          case "historical":
            url = "http://localhost:3000/viewAllPlaces";
            break;
          default:
            url = "http://localhost:3000/Acttour";
            break;
        }

        const response = await axios.get(url);
        console.log(response.data); // Log the response
        setItems(response.data);
        setSelectedItem(null);
        setShareableLink("");
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Error fetching items.");
      }
    };

    fetchItems();
  }, [itemType]); // Re-fetch items when itemType changes

  // Handle selecting an item and generating shareable link
  const handleGenerateLink = async (itemId) => {
    console.log(itemId, itemType);

    try {
      const response = await axios.post("http://localhost:3000/share", {
        itemId,
        itemType,
      });

      setShareableLink(response.data.link);
      setError(""); // Clear any previous error
    } catch (err) {
      console.error("Error generating share link:", err);
      setError("Failed to generate shareable link.");
    }
  };

  return (
    <div>
      {/* Display shareable link if generated */}
      {shareableLink && (
        <div>
          <h3>Shareable Link:</h3>
          <a href={shareableLink} target="_blank" rel="noopener noreferrer">
            {shareableLink}
          </a>
        </div>
      )}
      <h2>Share an Item</h2>

      {/* Dropdown to select item type (Acttour, itiTour, viewAllPlaces) */}
      <div>
        <label htmlFor="itemType">Select Item Type:</label>
        <select
          id="itemType"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
        >
          <option>choose</option>
          <option value="activity">Activity</option>
          <option value="itinerary">Itinerary</option>
          <option value="historical">historical</option>
        </select>
      </div>

      {/* List of items based on selected type */}
      <div>
        <h3>Select an Item</h3>
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li
                key={item._id}
                onClick={() => handleGenerateLink(item._id)}
                style={{ cursor: "pointer", marginBottom: "10px" }}
              >
                {item.title || item.name || item.Name}{" "}
                {/* Adjust based on your data */}
              </li>
            ))
          ) : (
            <p>No items available for this category.</p>
          )}
        </ul>
      </div>

      {/* Display error if there is one */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ShareItem;
