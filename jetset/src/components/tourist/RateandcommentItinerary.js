import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RatingForm.css"; // Include your CSS file for styling

const StarRating = ({ rating, setRating }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={`star ${star <= rating ? "filled" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const RateandcommentItinerary = ({ touristId }) => {
  const [itineraryId, setItineraryId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [itineraryIds, setItineraryIds] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItineraryIds = async () => {
      try {
        const response = await axios.get("http://localhost:3000/itiTour");
        setItineraryIds(response.data);
      } catch (error) {
        console.error("Error fetching itinerary IDs:", error);
        setMessage("Failed to load itinerary IDs");
      }
    };

    fetchItineraryIds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itineraryId || rating === 0) {
      setMessage("Please select an itinerary and provide a rating.");
      return;
    }

    const rateandcommentItinerary = { itineraryId, rating, comment };
    console.log("Submitting:", rateandcommentItinerary);

    try {
      const response = await axios.post(
        `http://localhost:3000/rateandcommentItinerary/${itineraryId}`,
        rateandcommentItinerary
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error during submission:", error.response || error);
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div>
      <h2>Rate and Comment on an Itinerary</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="itinerarySelect">Select Itinerary:</label>
        <select
          id="itinerarySelect"
          value={itineraryId}
          onChange={(e) => setItineraryId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select an itinerary
          </option>
          {itineraryIds.map(({ _id, name }) => (
            <option key={_id} value={_id}>
              {name}
            </option>
          ))}
        </select>

        <label>Rating:</label>
        <StarRating rating={rating} setRating={setRating} />

        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          placeholder="Leave your comment here"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RateandcommentItinerary;
