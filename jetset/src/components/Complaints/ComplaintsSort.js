// components/ComplaintList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const ComplaintsSort = () => {
  const [complaints, setComplaints] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // Default to descending

  // Fetch complaints with selected sort order
  const fetchComplaints = () => {
    axios
      .get(`http://localhost:3000/complaintSort?order=${sortOrder}`)
      .then((response) => setComplaints(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchComplaints(); // Fetch sorted complaints on component mount or when sortOrder changes
  }, [sortOrder]);

  // Toggle between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div>
      <h2>Complaints</h2>
      <button onClick={toggleSortOrder}>
        Sort by Date: {sortOrder === "asc" ? "Ascending" : "Descending"}
      </button>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id}>
            <strong>{complaint.title}</strong>: {complaint.body}
            <br />
            Date: {new Date(complaint.date).toLocaleDateString()}
            <br />
            Status: {complaint.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintsSort;
