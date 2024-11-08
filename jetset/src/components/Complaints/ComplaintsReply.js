// components/ComplaintList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const ComplaintsReply = () => {
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState(""); // State to store reply text
  const [selectedComplaintId, setSelectedComplaintId] = useState(null); // Track selected complaint for reply

  useEffect(() => {
    axios
      .get("http://localhost:3000/viewAllComplaints")
      .then((response) => setComplaints(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = (id) => {
    axios
      .put(`http://localhost:3000/complaints/${id}/reply`, { reply: replyText })
      .then((response) => {
        setComplaints(
          complaints.map((complaint) =>
            complaint._id === id ? response.data.complaint : complaint
          )
        );
        setReplyText(""); // Clear the reply input after submission
        setSelectedComplaintId(null); // Deselect the complaint
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
            <br />
            Reply: {complaint.reply || "No reply yet"}
            <button onClick={() => setSelectedComplaintId(complaint._id)}>
              Reply to Complaint
            </button>
            {/* Display reply form for selected complaint */}
            {selectedComplaintId === complaint._id && (
              <div>
                <textarea
                  value={replyText}
                  onChange={handleReplyChange}
                  placeholder="Write your reply here"
                />
                <button onClick={() => handleReplySubmit(complaint._id)}>
                  Submit Reply
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintsReply;
