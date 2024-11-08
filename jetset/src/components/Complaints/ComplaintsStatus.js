// components/ComplaintList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
//import { updateComplaintStatus } from '../../../../src/Routes/adminController';

const ComplaintsStatus = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/viewAllComplaints")
      .then((response) => setComplaints(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Automatically pass complaint ID from the button's event
  const handleStatusChange = (id, newState) => {
    axios
      .put(`http://localhost:3000/complaints/${id}/state`, { state: newState })
      .then((response) => {
        setComplaints(
          complaints.map((complaint) =>
            complaint._id === id ? response.data.complaint : complaint
          )
        );
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Complaints</h2>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id}>
            <strong>{complaint.title}</strong>: {complaint.body}
            <br />
            State: {complaint.state}
            <button
              onClick={() => handleStatusChange(complaint._id, "pending")}
            >
              Mark as Pending
            </button>
            <button
              onClick={() => handleStatusChange(complaint._id, "resolved")}
            >
              Mark as Resolved
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintsStatus;
