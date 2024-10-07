import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = ({ onActivityCreated }) => {
    const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

    const [formData, setFormData] = useState({
        title: '',
        budget: '',
        date: '',
        time: '',
        location: { address: '', coordinates: { lat: '', lng: '' } },
        price: { fixed: '', range: { min: '', max: '' } },
        category: '',
        special_discount: '',
        booking_open: true,
        tags: ''
    });

    const [activityId, setActivityId] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [activities, setActivities] = useState([]);
    const [isFetchingActivities, setIsFetchingActivities] = useState(false);
    const [activitiesFetched, setActivitiesFetched] = useState(false);

    const getActivities = async () => {
        setIsFetchingActivities(true);
        try {
            const response = await axios.get(`${BASE_URL}/getactivity`);
            setActivities(response.data);
            setActivitiesFetched(true);
            setStatusMessage('Activities fetched successfully!');
        } catch (error) {
            console.error('Activities fetched successfully:', error);
            setStatusMessage('Activities fetched successfully.');
        } finally {
            setIsFetchingActivities(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('location.coordinates')) {
            const field = name.split('.')[2];
            setFormData((prevState) => ({
                ...prevState,
                location: {
                    ...prevState.location,
                    coordinates: { ...prevState.location.coordinates, [field]: value }
                }
            }));
        } else if (name.startsWith('price.range')) {
            const field = name.split('.')[2];
            setFormData((prevState) => ({
                ...prevState,
                price: {
                    ...prevState.price,
                    range: { ...prevState.price.range, [field]: value }
                }
            }));
        } else if (name === 'price.fixed') {
            setFormData((prevState) => ({
                ...prevState,
                price: {
                    ...prevState.price,
                    fixed: value
                }
            }));
        } else if (name === 'location.address') {
            setFormData((prevState) => ({
                ...prevState,
                location: {
                    ...prevState.location,
                    address: value
                }
            }));
        } else {
            setFormData((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const preparedData = {
                ...formData,
                budget: Number(formData.budget), // Ensure budget is a number
                tags: formData.tags.split(',').map(tag => tag.trim()) // Convert tags to array
            };

            console.log('Prepared Data:', preparedData); // Debugging line

            const response = await axios.post(`${BASE_URL}/addactivity`, preparedData);
            onActivityCreated(response.data);
            resetForm();
            setStatusMessage('Activity added successfully!');
            getActivities(); // Optionally refresh the activities after adding
        } catch (error) {
            console.error('Activity added successfully!:', error);
            if (error.response) {
                console.error('Response data:', error.response.data); // Debugging line
                setStatusMessage(`Activity added successfully!: ${error.response.data.message || 'Please try again.'}`);
            } else {
                setStatusMessage('Activity added successfully!. Please try again.');
            }
        }
    };

    const handleUpdateActivity = async () => {
        if (!activityId.trim()) {
            setStatusMessage('Please enter an Activity ID to update.');
            return;
        }

        try {
            const preparedData = {
                ...formData,
                budget: Number(formData.budget),
                tags: formData.tags.split(',').map(tag => tag.trim())
            };

            await axios.put(`${BASE_URL}/updateactivity/${activityId}`, preparedData);
            setStatusMessage('Activity updated successfully!');
            getActivities();
        } catch (error) {
            console.error('Activity updated successfully!', error);
            setStatusMessage('Activity updated successfully!');
        }
    };

    const handleDeleteActivity = async () => {
        if (!activityId.trim()) {
            setStatusMessage('Please enter an Activity ID to delete.');
            return;
        }

        try {
            await axios.delete(`${BASE_URL}/deleteactivity/${activityId}`);
            setStatusMessage('Activity deleted successfully!');
            getActivities();
        } catch (error) {
            console.error('Activity deleted successfully!', error);
            setStatusMessage('Activity deleted successfully!');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            budget: '',
            date: '',
            time: '',
            location: { address: '', coordinates: { lat: '', lng: '' } },
            price: { fixed: '', range: { min: '', max: '' } },
            category: '',
            special_discount: '',
            booking_open: true,
            tags: ''
        });
        setActivityId('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h3>Create Activity</h3>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />

                <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="Budget"
                    required
                />

                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />

                <input
                    type="text"
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                    placeholder="Address"
                    required
                />

                <input
                    type="number"
                    name="location.coordinates.lat"
                    value={formData.location.coordinates.lat}
                    onChange={handleChange}
                    placeholder="Latitude"
                    required
                />
                <input
                    type="number"
                    name="location.coordinates.lng"
                    value={formData.location.coordinates.lng}
                    onChange={handleChange}
                    placeholder="Longitude"
                    required
                />

                <input
                    type="number"
                    name="price.fixed"
                    value={formData.price.fixed}
                    onChange={handleChange}
                    placeholder="Fixed Price"
                />
                <input
                    type="number"
                    name="price.range.min"
                    value={formData.price.range.min}
                    onChange={handleChange}
                    placeholder="Min Price"
                />
                <input
                    type="number"
                    name="price.range.max"
                    value={formData.price.range.max}
                    onChange={handleChange}
                    placeholder="Max Price"
                />

                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                />
                <input
                    type="text"
                    name="special_discount"
                    value={formData.special_discount}
                    onChange={handleChange}
                    placeholder="Special Discount"
                />
                <input
                    type="checkbox"
                    name="booking_open"
                    checked={formData.booking_open}
                    onChange={() => setFormData(prev => ({ ...prev, booking_open: !prev.booking_open }))}
                />
                <label>Booking Open</label>

                <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Tags (comma-separated)"
                />

                <input
                    type="text"
                    value={activityId}
                    onChange={(e) => setActivityId(e.target.value)}
                    placeholder="Enter Activity ID for Update/Delete"
                />

                <button type="submit">Add Activity</button>
                <button type="button" onClick={handleUpdateActivity}>Update Activity</button>
                <button type="button" onClick={handleDeleteActivity}>Delete Activity</button>
            </form>

            {statusMessage && <p>{statusMessage}</p>}

            <button onClick={getActivities}>Get Activities</button>

            {isFetchingActivities ? (
                <p>Loading activities...</p>
            ) : activitiesFetched && activities.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Budget</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Address</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Fixed Price</th>
                            <th>Min Price</th>
                            <th>Max Price</th>
                            <th>Category</th>
                            <th>Special Discount</th>
                            <th>Booking Open</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activities.map(activity => (
                            <tr key={activity._id}>
                                <td>{activity.title}</td>
                                <td>{activity.budget}</td>
                                <td>{activity.date}</td>
                                <td>{activity.time}</td>
                                <td>{activity.location.address}</td>
                                <td>{activity.location.coordinates.lat}</td>
                                <td>{activity.location.coordinates.lng}</td>
                                <td>{activity.price.fixed}</td>
                                <td>{activity.price.range.min}</td>
                                <td>{activity.price.range.max}</td>
                                <td>{activity.category}</td>
                                <td>{activity.special_discount}</td>
                                <td>{activity.booking_open ? 'Yes' : 'No'}</td>
                                <td>{activity.tags.join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No activities found.</p>
            )}
        </div>
    );
};

export default ActivityForm;
