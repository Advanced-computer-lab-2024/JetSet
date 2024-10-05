import React, { useState } from 'react';
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting:', formData); 

        try {
            const response = await axios.post('http://localhost:8000/addprofiles', formData);
            console.log('API Response:', response); // Log the full response

            // Check if the status is 201 (Created)
            if (response.status === 201) {
                onProfileCreated(response.data);
                setStatusMessage('Profile created successfully!'); // Success message
                // Reset form data
                setFormData({
                    email: '',
                    username: '',
                    password: '',
                    company_name: '',
                    website: '',
                    hotline: '',
                    companyDescription: ''
                });
            } else {
                // Handle unexpected status
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (error) {
            console.error('Submit error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data); // Log the response data
            }
            setStatusMessage('Error creating profile. Please try again.'); // Error message
        }
        setStatusMessage('Profile created successfully!');
    };

    return (
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
            {statusMessage && <p>{statusMessage}</p>} {/* Display the message */}
        </form>
    );
};

export default ProfileForm;
