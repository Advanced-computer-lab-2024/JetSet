import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const createTag = async (tagData) => {
  try {
    const response = await axios.post(`${API_URL}/addTag`, tagData);
    return response.data;
  } catch (error) {
    console.error('Error creating tag:', error);
  }
};
