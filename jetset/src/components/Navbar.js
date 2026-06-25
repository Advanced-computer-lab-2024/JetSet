import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import logo from "./images/logo.jpg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="jetset-navbar" aria-label="Primary navigation">
      <Link to="/" className="brand" style={{ textDecoration: "none" }}>
        <img src={logo} alt="JetSet logo" />
        <span>JetSet</span>
      </Link>

      <button
        type="button"
        className="navbar-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
        style={{
          display: "none",
          background: "transparent",
          border: "none",
          color: "var(--color-primary-strong)",
          fontSize: "1.35rem",
          padding: "0.5rem",
          minHeight: "auto",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      <div
        className={`nav-actions ${menuOpen ? "nav-actions--open" : ""}`}
        role="menubar"
      >
        <Link to="/register" className="nav-link-button secondary">
          Register
        </Link>
        <Link to="/login" className="nav-link-button">
          Login
        </Link>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .navbar-toggle {
            display: block !important;
          }
          .nav-actions {
            display: none !important;
            flex-direction: column;
            width: 100%;
          }
          .nav-actions--open {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
