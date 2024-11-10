import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdatePreferencesForm = ({ touristId }) => {
  const [preferences, setPreferences] = useState({
    historicAreas: false,
    beaches: false,
    familyFriendly: false,
    shopping: false,
    budget: 0,
  });
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTouristData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getTourist/${touristId}`
        );
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching tourist data:", error);
        setMessage("Error fetching tourist information");
      }
    };
    fetchTouristData();
  }, [touristId]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:3000/tourist/preferences/${touristId}`,
        { preferences }
      );
      setMessage(
        `Preferences updated successfully: ${JSON.stringify(response.data)}`
      );
    } catch (error) {
      console.error("Error updating preferences:", error);
      setMessage(error.response?.data.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Update Tourist Preferences</h1>
      <p>Username: {username}</p> {/* Display the username */}
      <label>
        Historic Areas:
        <input
          type="checkbox"
          name="historicAreas"
          checked={preferences.historicAreas}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Beaches:
        <input
          type="checkbox"
          name="beaches"
          checked={preferences.beaches}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Family Friendly:
        <input
          type="checkbox"
          name="familyFriendly"
          checked={preferences.familyFriendly}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Shopping:
        <input
          type="checkbox"
          name="shopping"
          checked={preferences.shopping}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Budget:
        <input
          type="number"
          name="budget"
          value={preferences.budget}
          onChange={handleChange}
          min="0"
        />
      </label>
      <br />
      <button type="submit">Update Preferences</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UpdatePreferencesForm;
