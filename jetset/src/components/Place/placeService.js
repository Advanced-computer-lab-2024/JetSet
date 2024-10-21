import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust the URL as needed

export const getAllPlaces = async () => {
  try {
    const response = await axios.get(`${API_URL}/viewAllPlaces`);
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
  }
};

export const createPlace = async (placeData) => {
  try {
    const response = await axios.post(`${API_URL}/addPlace`, placeData);
    return response.data;
  } catch (error) {
    console.error('Error creating place:', error);
  }
};

export const updatePlace = async (id, updatedPlace) => {
  try {
    const response = await axios.put(`${API_URL}/updatePlace/${id}`, updatedPlace);
    return response.data;
  } catch (error) {
    console.error('Error updating place:', error);
  }
};

export const deletePlace = async (id) => {
  try {
    await axios.delete(`${API_URL}/deletePlace/${id}`);
  } catch (error) {
    console.error('Error deleting place:', error);
  }
};
