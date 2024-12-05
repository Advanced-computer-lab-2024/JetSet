// components/ComplaintList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const ComplaintsFilter = () => {
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState(""); // Track selected status

  // Fetch complaints based on selected filter status
  const fetchComplaints = () => {
    const url = filterStatus
      ? `http://localhost:3000/complaintfilter?state=${filterStatus}`
      : "http://localhost:3000/viewAllComplaints";

    axios
      .get(url)
      .then((response) => setComplaints(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchComplaints(); // Fetch complaints on mount or when filterStatus changes
  }, [filterStatus]);

  // Handle filter selection
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  return (
    <div>
      <h2>Complaints</h2>

      <label htmlFor="statusFilter">Filter by State: </label>
      <select
        id="statusFilter"
        value={filterStatus}
        onChange={handleFilterChange}
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>

      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id}>
            <strong>{complaint.title}</strong>: {complaint.body}
            <br />
            Date: {new Date(complaint.date).toLocaleDateString()}
            <br />
            State: {complaint.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintsFilter;
