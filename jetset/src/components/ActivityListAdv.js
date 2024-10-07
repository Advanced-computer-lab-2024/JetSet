// src/components/ProfilesList.js
/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivitiesList = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:8000/getactivities');
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
            {activities.length === 0 ? (
                <p>No activities available. Add an activity to get started!</p>
            ) : (
                <ul>
                    {activities.map(activity => (
                        <li key={activity._id}>
                            {activity.location} - {activity.date}
                            <button onClick={() => handleDelete(activity._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProfilesList;
//commit
*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivitiesList = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/getactivities`);
                setActivities(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchActivities();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/deleteprofiles/${id}`);
            setActivities(activities.filter(activity => activity._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Activities List</h3>
            {activities.length === 0 ? (
                <p>No activities available. Add an activity to get started!</p>
            ) : (
                <ul>
                    {activities.map(activity => (
                        <li key={activity._id}>
                            {activity.location} - {activity.date}
                            <button onClick={() => handleDelete(activity._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ActivitiesList;