import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [error, setError] = useState(null);

  // Fetch guest data from the backend
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/guest");
        setGuests(response.data.users);
      } catch (err) {
        setError("Error retrieving guest data.");
      }
    };

    fetchGuests();
  }, []);

  // Accept guest function
  const acceptGuest = async (guestId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/acceptguest/${guestId}`
      );
      alert(response.data.message);
      // Optionally refresh the guest list after acceptance
      setGuests(guests.filter((guest) => guest._id !== guestId));
    } catch (err) {
      console.error("Error accepting guest:", err.response.data);
      alert("Error accepting guest.");
    }
  };

  // Reject guest function
  const rejectGuest = async (guestId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/rejectguest/${guestId}`
      );
      alert(response.data.message);
      // Optionally refresh the guest list after rejection
      setGuests(guests.filter((guest) => guest._id !== guestId));
    } catch (err) {
      console.error("Error rejecting guest:", err.response.data);
      alert("Error rejecting guest.");
    }
  };

  return (
    <div className="guest-list">
      <h2>Guests</h2>
      {error && <p className="error-message">{error}</p>}

      {guests.length > 0 ? (
        <table className="guest-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Documents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest._id}>
                <td>{guest.username}</td>
                <td>{guest.email}</td>
                <td>{guest.role}</td>
                <td>
                  {guest.document && guest.document.length > 0 ? (
                    <ul>
                      {guest.document.map((doc, idx) => (
                        <li key={idx}>
                          <a
                            href={`http://localhost:3000/uploads/${doc}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No documents uploaded"
                  )}
                </td>
                <td>
                  <button
                    className="accept-button"
                    onClick={() => acceptGuest(guest._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => rejectGuest(guest._id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No guests found.</p>
      )}
    </div>
  );
};

export default GuestList;
