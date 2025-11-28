import React from "react";
import Hero from "../components/landing/Hero";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      <Hero />
      {/* Any future sections (endpoint gallery, features, etc.) 
          will be added below this comment. */}
    </div>
  );
}

export default Landing;

