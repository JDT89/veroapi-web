// src/pages/Landing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-pill">
            <span className="pill-dot" />
            Production-ready APIs for your stack
          </div>

          <h1>APIs for Discord bots, games, and dashboards.</h1>

          <p className="hero-sub">
            Access high-speed endpoints for Discord bots, games, dashboards, and
            automation — all with one powerful key.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </button>
            <button
              type="button"
              className="btn outline"
              onClick={() => navigate("/docs")}
            >
              View Docs
            </button>
          </div>

          <p className="hero-note">
            1 API key, multiple endpoints — text utilities, XP helpers, rewards,
            and more.
          </p>
        </div>

        {/* Right-side preview card */}
        <div className="hero-right">
          <div className="dash-preview">
            <div className="dash-preview-header">
              <div>
                <div className="dash-preview-eyebrow">veroapi account</div>
                <div className="dash-preview-title">Primary API key</div>
              </div>
              <span className="dash-preview-plan-pill">Free • 5,000 req/day</span>
            </div>

            <div className="dash-preview-status-row">
              <span className="status-dot status-dot-ok" />
              API Status: <strong>Online</strong> • 99.99% uptime
            </div>

            <div className="dash-preview-keycard">
              <div className="dash-preview-key-top">
                <span className="dash-preview-key-label">API key</span>
                <span className="dash-preview-key-pill">Server-side only</span>
              </div>
              <div className="dash-preview-key-value">
                <span className="dash-preview-key-prefix">vero_live_</span>
                <span className="dash-preview-key-blur">sk_xxxxxxxxxxxxx</span>
              </div>
              <div className="dash-preview-key-actions">
                <span className="dash-preview-chip">Reveal</span>
                <span className="dash-preview-chip">Copy</span>
              </div>
            </div>

            <div className="dash-preview-metrics">
              <div className="dash-preview-metric">
                <div className="dash-preview-metric-value">100ms</div>
                <div className="dash-preview-metric-label">Avg latency</div>
              </div>
              <div className="dash-preview-metric">
                <div className="dash-preview-metric-value">20+</div>
                <div className="dash-preview-metric-label">Endpoints</div>
              </div>
              <div className="dash-preview-metric">
                <div className="dash-preview-metric-value">99.99%</div>
                <div className="dash-preview-metric-label">Uptime</div>
              </div>
            </div>

            <div className="dash-preview-footer">
              <span className="dash-preview-footer-pill">
                POST /v1/text/scramble • POST /v1/xp/award • more coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP (this fixes the stacked 100ms / 20+ / 99.99% issue) */}
      <section className="trust-strip">
        <div className="trust-item">
          <div className="trust-value">100ms</div>
          <div className="trust-label">Avg response time</div>
        </div>
        <div className="trust-item">
          <div className="trust-value">20+</div>
          <div className="trust-label">Endpoints in one key</div>
        </div>
        <div className="trust-item">
          <div className="trust-value">99.99%</div>
          <div className="trust-label">Measured uptime</div>
        </div>
        <div className="trust-item">
          <div className="trust-value">Global</div>
          <div className="trust-label">Any region, any stack</div>
        </div>
      </section>

      {/* You can keep your existing sections here or adjust as you like.
          Just make sure they use the same class names the CSS already styles:
          - endpoint-gallery
          - dx-strip
          - pricing
          - faq
      */}
    </div>
  );
}

export default LandingPage;