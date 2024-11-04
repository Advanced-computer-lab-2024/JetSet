// src/DeleteAccount.js
import React from 'react';
import axios from 'axios';

const DeleteAccount = ({ touristId }) => {
  
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/deleteAccTourist/672398fc87d64e4709f43cde`);
      alert(response.data.message); // Show success message
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred"); // Show error message
    }
  };

  return (
    <div>
      <button onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default DeleteAccount;