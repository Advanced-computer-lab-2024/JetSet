// src/components/ActivitiesList.js
//empty commit
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivitiesList = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('/getactivity');
                setActivities(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchActivities();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/deleteactivity/${id}`);
            setActivities(activities.filter(activity => activity._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Activities List</h3>
            <ul>
                {activities.map(activity => (
                    <li key={activity._id}>
                        {activity.location} - {activity.date} 
                        <button onClick={() => handleDelete(activity._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivitiesList;
