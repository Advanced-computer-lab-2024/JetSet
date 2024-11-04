// src/DeleteAccount.js
import React from 'react';
import axios from 'axios';

const DeleteAccount = ({ tourguideId }) => {
  
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/deleteAccTourguide/6728fc73fe820b19a48d6fbd`);
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