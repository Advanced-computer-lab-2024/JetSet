import React, { useEffect, useState } from "react";
import axios from "axios";

const PaidItemsView = ({ touristId }) => {
  const [upcoming, setUpcoming] = useState({ activities: [], itineraries: [] });
  const [history, setHistory] = useState({ activities: [], itineraries: [] });
  const [error, setError] = useState("");

  const fetchUpcomingItems = async () => {
    try {
      const response = await axios.get(`/paidUpcoming/${touristId}`);
      setUpcoming({
        activities: response.data.upcomingActivities,
        itineraries: response.data.upcomingItineraries,
      });
    } catch (error) {
      setError("Error fetching upcoming items");
    }
  };

  const fetchHistoryItems = async () => {
    try {
      const response = await axios.get(`/paidHistory/${touristId}`);
      setHistory({
        activities: response.data.historyActivities,
        itineraries: response.data.historyItineraries,
      });
    } catch (error) {
      setError("Error fetching history items");
    }
  };

  useEffect(() => {
    fetchUpcomingItems();
    fetchHistoryItems();
  }, [touristId]);

  return (
    <div>
      <h2>Upcoming Items</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h3>Activities</h3>
      <ul>
        {upcoming.activities.map((activity) => (
          <li key={activity._id}>
            <h4>{activity.title}</h4>
            <p>Location: {activity.location}</p>
            <p>Date: {new Date(activity.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <h3>Itineraries</h3>
      <ul>
        {upcoming.itineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h4>{itinerary.name}</h4>
            <p>Locations: {itinerary.locations.join(", ")}</p>
            <p>Start Date: {new Date(itinerary.availability_dates[0]).toLocaleString()}</p>
          </li>
        ))}
      </ul>

      <h2>History Items</h2>
      <h3>Activities</h3>
      <ul>
        {history.activities.map((activity) => (
          <li key={activity._id}>
            <h4>{activity.title}</h4>
            <p>Location: {activity.location}</p>
            <p>Date: {new Date(activity.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <h3>Itineraries</h3>
      <ul>
        {history.itineraries.map((itinerary) => (
          <li key={itinerary._id}>
            <h4>{itinerary.name}</h4>
            <p>Locations: {itinerary.locations.join(", ")}</p>
            <p>End Date: {new Date(itinerary.availability_dates.at(-1)).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaidItemsView;
