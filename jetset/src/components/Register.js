import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      navigate("/registerAst"); // Stay on the seller registration page
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "450px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            color: "#1d3557", // Using the shade of blue you provided
            marginBottom: "30px",
            fontWeight: "bold",
          }}
        >
          Choose Your Role
        </h2>

        {/* Role selection */}
        <div style={{ marginBottom: "30px" }}>
          <button
            onClick={() => handleRoleSelection("tourist")}
            style={{
              background: "linear-gradient(45deg, #1d3557, #457b9d)", // Gradient for the button
              color: "white",
              border: "none",
              padding: "14px 35px",
              fontSize: "18px",
              margin: "10px",
              cursor: "pointer",
              borderRadius: "8px",
              width: "220px",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.98)"; // Slight press effect
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Tourist
          </button>
          <button
            onClick={() => handleRoleSelection("seller")}
            style={{
              background: "linear-gradient(45deg, #1d3557, #457b9d)", // Gradient for the button
              color: "white",
              border: "none",
              padding: "14px 35px",
              fontSize: "18px",
              margin: "10px",
              cursor: "pointer",
              borderRadius: "8px",
              width: "220px",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseDown={(e) => {
              e.target.style.transform = "scale(0.98)"; // Slight press effect
            }}
            onMouseUp={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Tour Guide / Advertiser / Seller
          </button>
        </div>

        {/* Display message */}
        {message && (
          <p
            style={{
              color: "red",
              fontSize: "16px",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
