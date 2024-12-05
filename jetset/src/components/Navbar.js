import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.jpg";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Jetset Logo" style={styles.logo} />
        <h1 style={styles.logoText}>Jetset</h1>
      </div>
      <div style={styles.buttonContainer}>
        <Link to="/register" style={styles.registerButton}>
          Register
        </Link>
        <Link to="/login" style={styles.loginButton}>
          Login
        </Link>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "linear-gradient(45deg, #1d3557, #457b9d)", // Gradient background for a modern look
    color: "white",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Deeper shadow for more depth
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "2px solid #fff", // Thin white line at the bottom
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "45px", // Slightly bigger logo size
    height: "45px",
    marginRight: "15px",
  },
  logoText: {
    margin: 0,
    fontSize: "30px", // Increased font size for prominence
    fontFamily: "'Georgia', serif",
    fontWeight: "bold",
    letterSpacing: "2px",
    color: "#f1f1f1", // Off-white color for "Jetset"
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Subtle shadow to make text stand out
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
  },
  registerButton: {
    color: "#fff", // White text for a more modern feel
    textDecoration: "none",
    padding: "12px 30px",
    border: "2px solid #fff", // White border for contrast
    borderRadius: "25px", // More rounded button for modern appearance
    fontWeight: "bold",
    transition: "all 0.3s ease",
    backgroundColor: "transparent", // Transparent background to let the gradient shine
  },
  loginButton: {
    color: "#fff", // White text
    textDecoration: "none",
    padding: "12px 30px",
    border: "2px solid #fff",
    borderRadius: "25px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    backgroundColor: "transparent", // Transparent background for modern look
  },
  registerButtonHover: {
    backgroundColor: "#b7e0ff", // Soft blue on hover
    transform: "scale(1.05)", // Slight scale effect
  },
  loginButtonHover: {
    backgroundColor: "#b7e0ff", // Soft blue on hover
    transform: "scale(1.05)", // Slight scale effect
  },
};

export default Navbar;
