import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RatingForm.css'; // Create this CSS file for styling

const RateandcommentActivity = ({ touristId }) => {
  const [activityId, setActivityId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/activities');
        console.log("Fetched Activities:", response.data); // Log the fetched activities
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setMessage('Failed to load activities');
      }
    };

    fetchActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rateandcommentactivity = { activityId, rating, comment };
    try {
      const response = await axios.post(`http://localhost:3000/rateandcommentactivity/${activityId}`, rateandcommentactivity);
      setMessage(response.data.message);
      // Reset fields after submission
      setActivityId('');
      setRating(0);
      setComment('');
      setIsFormVisible(false); // Hide form after submission
    } catch (error) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Rate and Comment on an Activity</h2>
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? 'Hide Form' : 'Rate an Activity'}
      </button>
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <label>
            Select Activity:
            <select 
              value={activityId} 
              onChange={(e) => setActivityId(e.target.value)} 
              required
            >
              <option value="" disabled>Select an activity</option>
              {activities.length > 0 ? (
                activities.map(({ _id, title }) => (
                  <option key={_id} value={_id}>
                    {title}
                  </option>
                ))
              ) : (
                <option disabled>No activities available</option>
              )}
            </select>
          </label>
          <label>
            Rating:
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={`star ${star <= rating ? 'filled' : ''}`} 
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </label>
          <label>
            Comment:
            <textarea 
              placeholder="Your Comment" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
            />
          </label>
          <button type="submit">Submit Rating</button>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default RateandcommentActivity;
