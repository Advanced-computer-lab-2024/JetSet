import React, { useState } from 'react';
import ProfileForm from './components/ProfileAdvertiser';
import ActivityForm from './components/ActivityProfileAdv';
import ProfileList from './components/ProfileLIstAdv';
import ActivityList from './components/ActivityListAdv';
import axios from 'axios';

const App = () => {
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleProfileSubmit = async (data) => {
        try {
            if (selectedProfile) {
                await axios.put(`/updateprofiles/${selectedProfile._id}`, data);
            } else {
                await axios.post('/addprofiles', data);
            }
            setSelectedProfile(null);
            // Optionally refresh the profile list
        } catch (error) {
            console.error('Error submitting profile:', error);
        }
    };

    const handleActivitySubmit = async (data) => {
        try {
            if (selectedActivity) {
                await axios.put(`/updateactivity/${selectedActivity._id}`, data);
            } else {
                await axios.post('/addactivity', data);
            }
            setSelectedActivity(null);
            // Optionally refresh the activity list
        } catch (error) {
            console.error('Error submitting activity:', error);
        }
    };

    return (
        <div>
            <h1>Advertiser Management</h1>
            <ProfileForm profile={selectedProfile} onSubmit={handleProfileSubmit} />
            <ActivityForm activity={selectedActivity} onSubmit={handleActivitySubmit} />
            <ProfileList />
            <ActivityList />
        </div>
    );
};

export default App;
