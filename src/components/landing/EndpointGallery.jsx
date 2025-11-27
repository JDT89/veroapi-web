import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-pill">
          <span className="pill-dot" />
          New • API utilities for builders & bot devs
        </p>
        <h1>
          One API key.
          <br />
          Dozens of endpoints.
          <br />
          Zero infrastructure.
        </h1>
        <p className="hero-sub">
          VeroAPI gives you a single account-level key and a growing library of
          “random” but ridiculously useful endpoints for apps and Discord bots.
        </p>

        <div className="hero-actions">
          <Link to="/auth" className="btn primary hero-primary nav-btn-link">
            Start free (1 key per account)
          </Link>
          <Link to="/docs" className="btn outline hero-secondary nav-btn-link">
            Read the docs
          </Link>
        </div>
        <p className="hero-note">
          No card • One key per user • Rate limits per account, not per project.
        </p>
      </div>

      <div className="hero-right">
        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="dash-preview">
      <div className="dash-preview-header">
        <div>
          <div className="dash-preview-eyebrow">VeroAPI dashboard</div>
          <div className="dash-preview-title">Primary API key</div>
        </div>
        <div className="dash-preview-plan">
          <span className="dash-preview-plan-pill">Playground</span>
        </div>
      </div>

      <div className="dash-preview-status-row">
        <span className="status-dot status-dot-ok" />
        <span className="dash-preview-status-text">
          API online • per-account rate limiting
        </span>
      </div>

      <div className="dash-preview-keycard">
        <div className="dash-preview-key-top">
          <span className="dash-preview-key-label">Account key</span>
          <span className="dash-preview-key-pill">1 key per user</span>
        </div>
        <div className="dash-preview-key-value">
          <span className="dash-preview-key-prefix">vero_live_</span>
          <span className="dash-preview-key-blur">xxxxxxxxxxxx</span>
        </div>
        <div className="dash-preview-key-actions">
          <span className="dash-preview-chip">Reveal</span>
          <span className="dash-preview-chip">Copy</span>
        </div>
      </div>

      <div className="dash-preview-metrics">
        <div className="dash-preview-metric">
          <div className="dash-preview-metric-value">3</div>
          <div className="dash-preview-metric-label">Endpoints live</div>
        </div>
        <div className="dash-preview-metric">
          <div className="dash-preview-metric-value">20+</div>
          <div className="dash-preview-metric-label">Planned helpers</div>
        </div>
        <div className="dash-preview-metric">
          <div className="dash-preview-metric-value">Per account</div>
          <div className="dash-preview-metric-label">Rate limiting</div>
        </div>
      </div>

      <div className="dash-preview-footer">
        <span className="dash-preview-footer-pill">
          JSON in • JSON out • No SDK required
        </span>
      </div>
    </div>
  );
}

export default Hero;
