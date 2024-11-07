// ShareItem.js
import React, { useState } from "react";
import axios from "axios";

const ShareItem = () => {
  const [itemType, setItemType] = useState("activity"); // Default to activity
  const [shareableLink, setShareableLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleShareItem = async () => {
    // Hardcoded item IDs based on item type
    const itemId =
      itemType === "activity"
        ? "670d4680dcbc415cf0e18707"
        : itemType === "itinerary"
        ? "67163747fac80a62e078bb5f"
        : "6703b76ffa4603592f12f6cd"; // Default for "historical"

    try {
      const response = await axios.post("/share", { itemId, itemType });
      setShareableLink(response.data.link);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error generating share link.");
      setShareableLink("");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Share an Item</h2>
      <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
        <option value="activity">Activity</option>
        <option value="itinerary">Itinerary</option>
        <option value="historical">Historical</option>
      </select>
      <button onClick={handleShareItem}>Generate Share Link</button>
      {shareableLink && <p>Shareable Link: {shareableLink}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default ShareItem;
