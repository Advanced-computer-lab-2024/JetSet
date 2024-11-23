import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const Register = () => {
  const [role, setRole] = useState("seller"); // Start with 'seller' by default for this page
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Handle role selection (Tourist, Admin, Seller)
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setMessage(null); // Clear any previous messages

    // Navigate to the appropriate page based on role selection
    if (selectedRole === "tourist") {
      navigate("/touristregister"); // Navigate to Tourist register page
    } else if (selectedRole === "seller") {
      // Stay on the current page for the Seller role
      navigate("/registerAst"); // Stay on the seller registration page
    }
  };

  return (
    <div className="App">
      {/* Role selection */}
      <div className="role-selection">
        <button onClick={() => handleRoleSelection("tourist")}>Tourist</button>
        <button onClick={() => handleRoleSelection("seller")}>
          {" "}
          tour guide/ advertiser/ seller
        </button>
      </div>
    </div>
  );
};

export default Register;
