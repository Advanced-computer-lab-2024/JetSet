import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faRoute,
  faLandmark,
  faPlane,
  faHotel,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import Guest from "./Guest";
import Navbar from "./Navbar";
import logo from "./images/logo.jpg";

const features = [
  {
    icon: faCompass,
    title: "Activities",
    description: "Discover curated activities and unforgettable experiences in every destination.",
  },
  {
    icon: faRoute,
    title: "Itineraries",
    description: "Plan perfect day-by-day itineraries tailored to your travel style.",
  },
  {
    icon: faLandmark,
    title: "Historical Places",
    description: "Explore cultural landmarks, museums, and heritage sites worldwide.",
  },
  {
    icon: faPlane,
    title: "Flight Booking",
    description: "Book flights seamlessly with the best deals and flexible options.",
  },
  {
    icon: faHotel,
    title: "Hotel Booking",
    description: "Find perfect stays from luxury resorts to cozy boutique hotels.",
  },
  {
    icon: faUserTie,
    title: "Local Guides",
    description: "Connect with expert local tour guides for authentic experiences.",
  },
];

const Home = () => {
  return (
    <div className="page-shell">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" aria-label="Hero banner">
        <div className="hero-content">
          <h1 className="hero-title">
            Explore the World with{" "}
            <span style={{ color: "var(--color-accent)" }}>JetSet</span>
          </h1>
          <p className="hero-subtitle">
            Discover activities, plan itineraries, and book unforgettable
            experiences — all in one place.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-accent btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-white btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="page-wrapper" aria-label="Platform features">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              color: "var(--color-primary-strong)",
              marginBottom: "0.75rem",
            }}
          >
            Everything You Need to Travel
          </h2>
          <p style={{ color: "var(--color-muted)", maxWidth: 560, margin: "0 auto" }}>
            From planning to booking, JetSet has every tool to make your trip extraordinary.
          </p>
        </div>

        <div className="features-grid">
          {features.map(({ icon, title, description }) => (
            <div key={title} className="feature-card">
              <span className="feature-icon">
                <FontAwesomeIcon icon={icon} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guest Browsing Section */}
      <section
        className="page-wrapper"
        style={{ paddingTop: 0 }}
        aria-label="Guest browsing"
      >
        <Guest />
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2.5rem 1.5rem",
          textAlign: "center",
          borderTop: "1px solid var(--color-line)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "0.75rem",
          }}
        >
          <img
            src={logo}
            alt=""
            style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.15rem",
              color: "var(--color-primary-strong)",
            }}
          >
            JetSet
          </span>
        </div>
        <p style={{ color: "var(--color-muted)", fontSize: "0.85rem", margin: 0 }}>
          © {new Date().getFullYear()} JetSet. All rights reserved. Plan the trip, keep the spark.
        </p>
      </footer>
    </div>
  );
};

export default Home;
