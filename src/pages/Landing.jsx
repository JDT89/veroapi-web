import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <section className="landing">
      <div className="hero-container">

        {/* LEFT AREA */}
        <div className="hero-left">
          <h1>Fast, Simple, Scalable APIs</h1>
          <p className="hero-sub">
            Access high-speed endpoints for Discord bots, games, dashboards,
            and automation — all with one powerful key.
          </p>

          <div className="hero-actions">
            <Link to="/auth" className="btn primary">Get Started</Link>
            <Link to="/docs" className="btn outline">View Docs</Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-box">
              <h3>100ms</h3>
              <p>Avg Response Time</p>
            </div>
            <div className="hero-stat-box">
              <h3>20+</h3>
              <p>Endpoints</p>
            </div>
            <div className="hero-stat-box">
              <h3>99.99%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </div>

        {/* RIGHT AREA */}
        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-header">
              <h4>API Status</h4>
              <span className="online-dot"></span>
              <p>Operational</p>
            </div>

            <div className="hero-code">
              <pre>
                <code>
{`fetch("https://api.veroapi.com/v1/text/scramble", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_KEY" },
  body: JSON.stringify({ text: "example" })
})`}
                </code>
              </pre>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;