import React, { useState } from "react";
import axios from "axios";

const AdvertiserTouristReport = () => {
  const [id, setId] = useState(""); // Advertiser ID
  const [month, setMonth] = useState(""); // Month filter
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the full report
  const fetchReport = async () => {
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const response = await axios.get("/advertiser-tourist-report", {
        params: { id },
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch the report.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to fetch filtered report
  const applyFilters = async () => {
    setLoading(true);
    setError(""); // Clear previous error
    try {
      const response = await axios.get("/filter-advertiser-tourist-report", {
        params: { id, month },
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to apply filters.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Advertiser Tourist Report</h1>
      <div>
        <label htmlFor="id">Advertiser ID:</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={fetchReport} disabled={loading}>
          {loading ? "Loading..." : "Get Report"}
        </button>
      </div>

      <h2>Apply Filters</h2>
      <label htmlFor="month">Month:</label>
      <input
        type="month"
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <button onClick={applyFilters} disabled={loading}>
        {loading ? "Loading..." : "Apply Filters"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {report && (
        <div>
          <h2>Total Tourists: {report.totalTourists}</h2>
          <h3>Activities:</h3>
          <ul>
            {report.activityDetails.map((activity, index) => (
              <li key={index}>
                <h4>{activity.name}</h4>
                <p>Total Tourists: {activity.totalTourists}</p>
                <p>Budget: ${activity.budget}</p>
                <p>Location: {activity.location}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                <h5>Tourists:</h5>
                <ul>
                  {activity.tourists.map((tourist, touristIndex) => (
                    <li key={touristIndex}>
                      Tourist: {tourist.touristName}, Email: {tourist.touristEmail}, Mobile: {tourist.touristMobile}, Booking Date: {new Date(tourist.bookingDate).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvertiserTouristReport;
