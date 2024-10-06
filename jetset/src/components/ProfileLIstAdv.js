import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReadAdvertiserProfileForm = ({ advertiserID }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch the advertiser profile
    const fetchAdvertiserProfile = async (advertiserID) => {
        setLoading(true); // Set loading state before fetching
        try {
            const response = await axios.get(`http://localhost:8000/AdvertiserProfile/${advertiserID}`);
            setProfile(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching advertiser profile:', err); // Log the full error
            setError(err.response?.data?.message || 'Error fetching the profile');
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (advertiserID) {
            fetchAdvertiserProfile(advertiserID);
        }
    }, [advertiserID]);

    // Display loading or error states
    if (loading) return <div>Loading profile...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Advertiser Profile</h2>
            {profile ? (
                <div>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Company Name:</strong> {profile.company_name}</p>
                    <p><strong>Website:</strong> {profile.website}</p>
                    <p><strong>Hotline:</strong> {profile.hotline}</p>
                    <p><strong>Description:</strong> {profile.companyDescription}</p>
                </div>
            ) : (
                <div>No profile data found.</div>
            )}
        </div>
    );
};

export default ReadAdvertiserProfileForm;
