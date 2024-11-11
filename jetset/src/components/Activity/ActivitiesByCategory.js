import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryAndActivity = ({ touristId }) => {
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("EGP");
  const [conversionRate, setConversionRate] = useState(1);
  // Fetch categories from the backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

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

  useEffect(() => {
    fetchConversionRate(selectedCurrency);
  }, [selectedCurrency]);

  // Fetch activities based on selected category
  const fetchActivities = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/activities/by-category?category=${categoryId}`
      );
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchActivities(categoryId); // Fetch activities when category changes
  };

  return (
    <div>
      <h1>Select a Category</h1>
      <select onChange={handleCategoryChange} value={selectedCategory}>
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <h2>Activities</h2>
      {activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.title}</h3>
              <p>
                <strong>Budget:</strong>{" "}
                {(activity.budget * conversionRate).toFixed(2)}
                {selectedCurrency}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Location:</strong> {activity.location}
              </p>
              <p>
                <strong>Special Discount:</strong> {activity.special_discount}
              </p>
              <p>
                <strong>Booking Open:</strong>{" "}
                {activity.bookingOpen ? "Yes" : "No"}
              </p>
              {activity.ratings.length > 0 ? (
                <div>
                  <h4>Ratings:</h4>
                  {activity.ratings.map((rating, index) => (
                    <p key={index}>
                      {rating.touristId} - {rating.rating} stars -{" "}
                      {rating.comment}
                    </p>
                  ))}
                </div>
              ) : (
                <p>No ratings yet.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found for this category.</p>
      )}
    </div>
  );
};

export default CategoryAndActivity;
