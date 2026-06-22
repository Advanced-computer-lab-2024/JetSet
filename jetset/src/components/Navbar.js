import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.jpg";

const Navbar = () => {
  return (
    <nav className="jetset-navbar" aria-label="Primary navigation">
      <div className="brand">
        <img src={logo} alt="Jetset" />
        <span>Jetset</span>
      </div>
      <div className="nav-actions">
        <Link to="/register" className="nav-link-button secondary">
          Register
        </Link>
        <Link to="/login" className="nav-link-button">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
