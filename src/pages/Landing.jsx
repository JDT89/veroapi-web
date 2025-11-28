import React from "react";
import "./Landing.css";
import Hero from "../components/landing/Hero";

function Landing() {
  return (
    <div className="landing">
      {/* Shared hero component */}
      <Hero />

      {/* STAT STRIP – kept the same */}
      <section className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-value">100ms</div>
          <div className="hero-stat-label">Avg response time</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">20+</div>
          <div className="hero-stat-label">Planned endpoints</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">99.99%</div>
          <div className="hero-stat-label">Targeted uptime</div>
        </div>
      </section>

      {/* Any other landing sections (endpoint gallery, features, etc.) 
          can stay below this comment – we don't need to touch them. */}
    </div>
  );
}

export default Landing;

