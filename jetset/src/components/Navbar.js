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
      <Link to="/register" style={styles.registerButton}>
        Register
      </Link>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#FFCFB3",
    color: "white",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "40px",
    height: "40px",
    marginRight: "10px",
  },
  logoText: {
    margin: 0,
    fontSize: "24px",
  },
  registerButton: {
    color: "white",
    textDecoration: "none",
    padding: "10px 20px",
    border: "1px solid white",
    borderRadius: "5px",
    transition: "background-color 0.5s",
  },
};

export default Navbar;
