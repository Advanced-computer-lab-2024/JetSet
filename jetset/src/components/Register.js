import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Handle role selection (Tourist, Admin, Seller)
  const handleRoleSelection = (selectedRole) => {
    setMessage(null); // Clear any previous messages

    // Navigate to the appropriate page based on role selection
    if (selectedRole === "tourist") {
      navigate("/touristregister"); // Navigate to Tourist register page
    } else if (selectedRole === "seller") {
      navigate("/registerAst"); // Stay on the seller registration page
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Choose Your Role</h2>

        {/* Role selection */}
        <div className="form-stack">
          <button type="button" onClick={() => handleRoleSelection("tourist")}>
            Tourist
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => handleRoleSelection("seller")}
          >
            Tour Guide / Advertiser / Seller
          </button>
        </div>

        {/* Display message */}
        {message && (
          <p className="message error" role="alert">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
