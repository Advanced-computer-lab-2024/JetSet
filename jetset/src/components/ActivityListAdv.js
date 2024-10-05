// src/components/ProfilesList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilesList = () => {
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get('/profiles');
                setProfiles(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfiles();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/deleteprofiles/${id}`);
            setProfiles(profiles.filter(profile => profile._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Profiles List</h3>
            <ul>
                {profiles.map(profile => (
                    <li key={profile._id}>
                        {profile.company_name} - {profile.email} 
                        <button onClick={() => handleDelete(profile._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfilesList;
//commit