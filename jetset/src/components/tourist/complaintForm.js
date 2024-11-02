import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = ({touristId}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const complaintData = {
      title,
      body,
      date,
    };

    try {
      const response = await axios.post(`http://localhost:3000/complaints/${touristId}`, complaintData);
      setMessage(response.data.message);
      // Clear the form after submission
      setTitle('');
      setBody('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      setMessage('Failed to file a complaint: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>File a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Your Complain:
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Complaint</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ComplaintForm;
