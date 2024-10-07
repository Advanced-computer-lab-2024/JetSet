import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust to your backend URL

export const getPlaces = async () => {
    const response = await axios.get(`${API_URL}/Places`);
    return response.data;
};

export const createPlace = async (placeData) => {
    const response = await axios.post(`${API_URL}/addPlace`, placeData);
    return response.data;
};

export const updatePlace = async (id, placeData) => {
    const response = await axios.put(`${API_URL}/updatePlace/${id}`, placeData);
    return response.data;
};

export const deletePlace = async (id) => {
    const response = await axios.delete(`${API_URL}/deletePlace/${id}`);
    return response.data;
};

export const createTag = async (tagData) => {
    try {
        const response = await fetch(`${API_URL}/createTag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tagData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating tag:', error);
        return { error: 'Failed to create tag' };
    }
};
