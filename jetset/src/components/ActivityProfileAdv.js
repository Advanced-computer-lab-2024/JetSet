// src/components/ActivityForm.js
//commit 
import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = ({ onActivityCreated }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: '',
        price: '',
        category: '',
        specialDiscount: '',
        bookingOpen: '',
        tags: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/addactivity', formData);
            onActivityCreated(response.data);
            setFormData({
                date: '',
                time: '',
                location: '',
                price: '',
                category: '',
                specialDiscount: '',
                bookingOpen: '',
                tags: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create Activity</h3>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
            <input type="text" name="specialDiscount" value={formData.specialDiscount} onChange={handleChange} placeholder="Special Discount" />
            <input type="text" name="bookingOpen" value={formData.bookingOpen} onChange={handleChange} placeholder="Booking Open" />
            <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags" />
            <button type="submit">Add Activity</button>
        </form>
    );
};

export default ActivityForm;
