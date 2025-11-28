import React from "react";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-pill">
            <span className="hero-pill-dot" />
            <span>New • Random-but-useful API utilities</span>
          </div>

          <h1>
            The dark-mode API layer
            <br />
            for bots, games & dashboards.
          </h1>

          <p className="hero-sub">
            VeroAPI gives you one account-level key and a growing library of
            “random” endpoints that save you from spinning up yet another
            micro-service.
          </p>

          <div className="hero-actions">
            <a href="/auth" className="hero-primary-link">
              <button className="btn primary" type="button">
                Get started free
              </button>
            </a>
            <a href="/docs">
              <button className="btn outline" type="button">
                View docs
              </button>
            </a>
          </div>

          <div className="hero-metadata">
            <span>100ms median latency</span>
            <span>20+ endpoints planned</span>
            <span>Per-account rate limiting</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card">
            <div className="hero-card-header">
              <span className="hero-card-pill">cURL example</span>
              <span className="hero-card-status">
                <span className="hero-card-dot" />
                Live
              </span>
            </div>

            <pre className="hero-code">
{`curl https://api.veroapi.com/v1/text/scramble \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "example",
    "mode": "hard"
  }'`}
            </pre>

            <div className="hero-code-meta">
              <span>Single key for all endpoints</span>
              <span>Timeouts & retries handled for you</span>
            </div>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
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

      {/* You can keep your existing sections (endpoint gallery, features, etc.)
          below here – we’ll restyle them in the next phase. */}
    </div>
  );
}

export default Landing;
