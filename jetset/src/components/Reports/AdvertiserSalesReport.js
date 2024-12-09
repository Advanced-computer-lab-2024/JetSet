import React, { useState } from "react";
import axios from "axios";

const AdvertiserSalesReport = () => {
  const [id, setId] = useState(""); // Advertiser ID
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activityDetails, setActivityDetails] = useState([]); // State for general activity details
  const [filterParams, setFilterParams] = useState({ activity: "", date: "", month: "" }); // Filter inputs
  const [filteredRevenue, setFilteredRevenue] = useState(0);
  const [filteredDetails, setFilteredDetails] = useState([]); // State for filtered activity details
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSalesReport = async () => {
    try {
      const response = await axios.get("/advertiser-sales-report", { params: { id } });
      setTotalRevenue(response.data.totalRevenue);
      setActivityDetails(response.data.activityDetails);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred while fetching the report.");
      setTotalRevenue(0);
      setActivityDetails([]);
    }
  };

  const fetchFilteredReport = async () => {
    try {
      const response = await axios.get("/filter-advertiser-sales-report", {
        params: { id, ...filterParams },
      });
      setFilteredRevenue(response.data.totalRevenue);
      setFilteredDetails(response.data.filteredActivityDetails);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "An error occurred while fetching the filtered report.");
      setFilteredRevenue(0);
      setFilteredDetails([]);
    }
  };

  return (
    <div>
      <h1>Advertiser Sales Report</h1>
      <label>
        Advertiser ID:
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
      </label>
      <button onClick={fetchSalesReport}>Generate Report</button>
      {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>}
      <h2>Total Revenue: ${totalRevenue.toFixed(2)}</h2>
      {activityDetails.length > 0 && (
        <div>
          <h3>Activity Details:</h3>
          <ul>
            {activityDetails.map((activity, index) => (
              <li key={index}>
                <h4>{activity.name}</h4>
                <p>Budget: ${activity.budget}</p>
                <p>Location: {activity.location}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>Filter Sales Report</h2>
      <label>
        Activity Name:
        <input
          type="text"
          value={filterParams.activity}
          onChange={(e) => setFilterParams({ ...filterParams, activity: e.target.value })}
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          value={filterParams.date}
          onChange={(e) => setFilterParams({ ...filterParams, date: e.target.value })}
        />
      </label>
      <label>
        Month (1-12):
        <input
          type="number"
          min="1"
          max="12"
          value={filterParams.month}
          onChange={(e) => setFilterParams({ ...filterParams, month: e.target.value })}
        />
      </label>
      <button onClick={fetchFilteredReport}>Filter Report</button>

      <h2>Filtered Revenue: ${filteredRevenue.toFixed(2)}</h2>
      {filteredDetails.length > 0 && (
        <div>
          <h3>Filtered Activity Details:</h3>
          <ul>
            {filteredDetails.map((activity, index) => (
              <li key={index}>
                <h4>{activity.name}</h4>
                <p>Budget: ${activity.budget}</p>
                <p>Location: {activity.location}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvertiserSalesReport;
