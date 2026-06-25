import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import logo from "./images/logo.jpg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="jetset-navbar" aria-label="Primary navigation">
      <Link to="/" className="brand">
        <img src={logo} alt="JetSet logo" />
        <span>JetSet</span>
      </Link>

      <button
        type="button"
        className="navbar-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      <div
        className={`nav-actions${menuOpen ? " open" : ""}`}
        role="menubar"
      >
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
