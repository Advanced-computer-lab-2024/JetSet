import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RatingForm.css'; // Include CSS for star ratings

const RatingForm = () => {
    const [tourGuideId, setTourGuideId] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [tourGuides, setTourGuides] = useState([]); // Store tour guides
    const touristId = "672635325490518dc4cd46cc"; // Hard-coded tourist ID

    useEffect(() => {
        const fetchTourGuides = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tourGuides');
                setTourGuides(response.data); // Store the tour guide data
            } catch (error) {
                console.error("Error fetching tour guides:", error);
            }
        };
        
        fetchTourGuides();
    }, []);

    const handleStarClick = (star) => {
        setRating(star);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { tourGuideId, rating, comment }; // Exclude touristId from payload

        console.log("Submitting payload:", payload); // Log the payload
        
        try {
            // Use the correct endpoint with the tour guide ID
            const response = await axios.post(`http://localhost:3000/comment/${tourGuideId}`, payload);
            console.log("Response from server:", response.data);
            alert(response.data.message || 'Submission successful');
        } catch (error) {
            console.error("Error submitting form:", error);
            console.error("Response from backend:", error.response); // Log backend response
            alert(error.response?.data.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Rate a Tour Guide</h1>
            <label>
                Tour Guide:
                <select
                    value={tourGuideId}
                    onChange={(e) => setTourGuideId(e.target.value)}
                    required
                >
                    <option value="">Select a Tour Guide</option>
                    {tourGuides.map(guide => (
                        <option key={guide._id} value={guide._id}>
                            {guide.username}
                        </option>
                    ))}
                </select>
            </label>
            <br />

            <label>
                Rating:
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'filled' : ''}`}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </label>
            <br />

            <label>
                Comment:
                <textarea
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </label>
            <br />

            <button type="submit">Submit Rating and Comment</button>
        </form>
    );
};

export default RatingForm;
