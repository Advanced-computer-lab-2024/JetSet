import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = ({ onProfileCreated }) => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        company_name: '',
        website: '',
        hotline: '',
        companyDescription: ''
    });
    
    const [statusMessage, setStatusMessage] = useState(''); // For success/error messages
    const [profileId, setProfileId] = useState(''); // For profile ID if needed for update/delete
    const [profiles, setProfiles] = useState([]); // State to store profiles
    const [isFetchingProfiles, setIsFetchingProfiles] = useState(false); // State to indicate fetching

    // Fetch profiles when the component mounts
    useEffect(() => {
        getProfiles();
    }, []);

    const getProfiles = async () => {
        setIsFetchingProfiles(true);
        try {
            const response = await axios.get('http://localhost:8000/getprofiles');
            console.log('Fetched profiles:', response.data); // Log the fetched data
            setProfiles(response.data);
            setStatusMessage('Profiles fetched successfully!');
        } catch (error) {
            console.error('Error fetching profiles:', error.response ? error.response.data : error.message);
            //setStatusMessage('Error fetching profiles. Please try again.');
        } finally {
            setIsFetchingProfiles(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', formData); 

        try {
            const response = await axios.post('http://localhost:8000/addprofiles', formData);
            console.log('API Response:', response); 

            if (response.status === 201) {
                onProfileCreated(response.data);
                setStatusMessage('Profile created successfully!'); 
                resetForm(); // Reset form data
                getProfiles(); // Refresh profiles after adding
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (error) {
            console.error('Submit error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            setStatusMessage('Error creating profile. Please try again.'); 
        }
    };

    const handleUpdateProfile = async () => {
        if (!profileId) {
            setStatusMessage('Please enter a profile ID to update.');
            return;
        }
    
        try {
            const response = await axios.put(`http://localhost:8000/updateprofiles/${profileId}`, formData);
            console.log('Update Profile Response:', response.data);
            setStatusMessage('Profile updated successfully!'); // Add success message
            getProfiles(); // Refresh profiles after updating
        } catch (error) {
            console.error('Error updating profile:', error);
            setStatusMessage('Error updating profile.'); // Add error message
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            username: '',
            password: '',
            company_name: '',
            website: '',
            hotline: '',
            companyDescription: ''
        });
        setProfileId(''); // Reset profile ID if needed
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Create Profile</h3>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" required />
                <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Website" />
                <input type="text" name="hotline" value={formData.hotline} onChange={handleChange} placeholder="Hotline" />
                <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Company Description"></textarea>
                
                <button type="submit">Add Profile</button>
                
                <button type="button" onClick={handleUpdateProfile}>Update Profile</button>
                
                <input 
                    type="text" 
                    value={profileId} 
                    onChange={(e) => setProfileId(e.target.value)} 
                    placeholder="Profile ID" 
                />
                {statusMessage && <p>{statusMessage}</p>} {/* Display the message */}
            </form>

            {/* Display the list of profiles */}
            {isFetchingProfiles ? (
                <p>Loading profiles...</p>
            ) : (
                <ul>
                    {profiles.map(profile => (
                        <li key={profile._id}>
                            <strong>{profile.username}</strong> - {profile.company_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProfileForm;
