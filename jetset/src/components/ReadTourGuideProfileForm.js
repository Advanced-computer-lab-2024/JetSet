import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReadTourGuideProfileForm = ({ tourGuideID }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the tour guide profile
  const fetchTourGuideProfile = async (tourGuideID) => {
    try {
      const response = await axios.get(`http://localhost:5000/TourGuideProfile/${tourGuideID}`);
      setProfile(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching tour guide profile:', err); // Log the full error
      setError(err.response?.data?.message || 'Error fetching the profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourGuideID) {
      fetchTourGuideProfile(tourGuideID);
    }
  }, [tourGuideID]);

  // Display loading or error states
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Tour Guide Profile</h2>
      {profile ? (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile Number:</strong> {profile.mobile_number}</p>
          <p><strong>Years of Experience:</strong> {profile.years_of_experience}</p>
          <p><strong>Previous Work:</strong> {profile.previous_work}</p>
        </div>
      ) : (
        <div>No profile data found.</div>
      )}
    </div>
  );
};

export default ReadTourGuideProfileForm;
