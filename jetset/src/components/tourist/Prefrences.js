import React, { useState } from 'react';
import axios from 'axios';

const UpdatePreferencesForm = () => {
    const touristId = "672635325490518dc4cd46cc"; // Hard-coded tourist ID
    const [preferences, setPreferences] = useState({
        historicAreas: false,
        beaches: false,
        familyFriendly: false,
        shopping: false,
        budget: 0,
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setPreferences((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Updated the URL to match the backend route
            const response = await axios.put(`http://localhost:3000/tourist/preferences/${touristId}`, {
                preferences,
            });
            setMessage(`Preferences updated successfully: ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error("Error updating preferences:", error);
            setMessage(error.response?.data.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Update Tourist Preferences</h1>

            <p>Tourist ID: {touristId}</p> {/* Display the hard-coded ID */}

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
