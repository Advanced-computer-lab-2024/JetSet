import React from "react";
import Guest from "./Guest";
import Navbar from "./Navbar";
import logo from "./images/logo.jpg";

const Home = () => {
  return (
    <div className="page-shell">
      <Navbar />
      <section className="hero">
        <div>
          <h1 className="hero-title">Plan the trip, keep the spark.</h1>
          <p className="hero-copy">
            Explore activities, itineraries, cultural places, and travel
            services from one clean dashboard.
          </p>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <img src={logo} alt="" />
        </div>
      </section>
      <Guest />
    </div>
  );
};

export default Home;
