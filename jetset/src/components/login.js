import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./styles.css";

const Register = () => {
  const [role, setRole] = useState("seller"); // Start with 'seller' by default for this page
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Handle role selection (Tourist, Admin, Seller, Tour Guide, Advertisor)
  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setMessage(null); // Clear any previous messages

    // Navigate to the appropriate page based on role selection
    if (selectedRole === "tourist") {
      navigate("/tourist"); // Navigate to Tourist register page
    } else if (selectedRole === "admin") {
      navigate("/admin"); // Navigate to Admin page
    } else if (selectedRole === "seller") {
      navigate("/sellerfrontend/6702863c31289d63abe313af"); // Stay on the seller registration page
    } else if (selectedRole === "tourism governor") {
      navigate("/place");
    } else if (selectedRole === "tour guide") {
      navigate("/tourguide/66fff1c213c1a607c2caa0c6"); // Navigate to Tour Guide registration page
    } else if (selectedRole === "advertisor") {
      navigate("/createadvertiser/6701a52d077eb6e57b568035"); // Navigate to Advertisor registration page
    }
  };

  return (
    <div className="App">
      {/* Role selection */}
      <div className="role-selection">
        <button onClick={() => handleRoleSelection("tourist")}>Tourist</button>
        <button onClick={() => handleRoleSelection("admin")}>Admin</button>
        <button onClick={() => handleRoleSelection("seller")}>Seller</button>
        <button onClick={() => handleRoleSelection("tour guide")}>
          Tour Guide
        </button>
        <button onClick={() => handleRoleSelection("advertisor")}>
          Advertisor
        </button>
        <button onClick={() => handleRoleSelection("tourism governor")}>
          Tourism Governor
        </button>
      </div>
    </div>
  );
};

export default Register;
