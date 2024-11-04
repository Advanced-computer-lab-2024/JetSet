// src/DeleteAccount.js
import React from 'react';
import axios from 'axios';

const DeleteAccount = ({ sellerId }) => {
  
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/deleteAccSeller/670307388ee1a9de350b6b1e`);
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