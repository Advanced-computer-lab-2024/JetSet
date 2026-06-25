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

const heroDecorationStyles = {
  circle1: {
    position: "absolute",
    top: "-80px",
    right: "-60px",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background: "rgba(42, 157, 143, 0.15)",
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  circle2: {
    position: "absolute",
    bottom: "-100px",
    left: "-40px",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "rgba(15, 76, 129, 0.12)",
    filter: "blur(80px)",
    pointerEvents: "none",
  },
  circle3: {
    position: "absolute",
    top: "50%",
    left: "60%",
    width: 160,
    height: 160,
    borderRadius: "50%",
    background: "rgba(42, 157, 143, 0.08)",
    filter: "blur(50px)",
    pointerEvents: "none",
  },
};

const Home = () => {
  return (
    <div className="page-shell">
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0b3559 0%, #0f4c81 40%, #1a6fb5 100%)",
          padding: "6rem max(1.5rem, calc((100vw - 1120px) / 2)) 5rem",
          textAlign: "center",
        }}
        aria-label="Hero banner"
      >
        <div style={heroDecorationStyles.circle1} aria-hidden="true" />
        <div style={heroDecorationStyles.circle2} aria-hidden="true" />
        <div style={heroDecorationStyles.circle3} aria-hidden="true" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              color: "#fff",
              lineHeight: 1.12,
              marginBottom: "1.25rem",
              fontWeight: 800,
            }}
          >
            Explore the World with{" "}
            <span style={{ color: "var(--color-accent)" }}>JetSet</span>
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "rgba(255,255,255,0.75)",
              maxWidth: 600,
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Discover activities, plan itineraries, and book unforgettable
            experiences — all in one place.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/register"
              className="btn"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), #1fb89e)",
                border: "none",
                padding: "0.9rem 2.25rem",
                fontSize: "1.05rem",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.35)",
                color: "#fff",
                padding: "0.9rem 2.25rem",
                fontSize: "1.05rem",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "5rem max(1.5rem, calc((100vw - 1120px) / 2))",
        }}
        aria-label="Platform features"
      >
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map(({ icon, title, description }) => (
            <div
              key={title}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-line)",
                borderRadius: "var(--radius-lg)",
                padding: "2rem 1.5rem",
                textAlign: "center",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,76,129,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                  display: "inline-grid",
                  placeItems: "center",
                  color: "#fff",
                  fontSize: "1.35rem",
                  marginBottom: "1.25rem",
                }}
              >
                <FontAwesomeIcon icon={icon} />
              </span>
              <h3
                style={{
                  fontSize: "1.15rem",
                  color: "var(--color-primary-strong)",
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Guest Browsing Section */}
      <section
        style={{
          padding: "0 max(1.5rem, calc((100vw - 1120px) / 2)) 4rem",
        }}
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
