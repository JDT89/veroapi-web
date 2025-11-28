import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-shell">
      <div className="hero-inner">
        {/* LEFT SIDE */}
        <div className="hero-left">
          {/* API status pill */}
          <div className="hero-status-pill">
            <span className="hero-status-dot" />
            <span>API status: Online</span>
          </div>

          <h1 className="hero-title">
            Random-but-useful APIs
            <br />
            for bots, tools &amp; automations.
          </h1>

          <p className="hero-sub">
            VeroAPI gives you a single key for a growing collection of
            ready-made endpoints — from text utilities to game helpers — so
            you can ship features, not glue code.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn hero-btn-primary"
              onClick={() => {
                window.location.href = "/auth";
              }}
            >
              Get your API key
            </button>

            <button
              type="button"
              className="btn hero-btn-outline"
              onClick={() => {
                window.location.href = "/docs";
              }}
            >
              View docs
            </button>
          </div>

          <p className="hero-footnote">
            No credit card required. One API key per account • Rate limits per
            user.
          </p>

          {/* Metrics strip */}
          <div className="hero-metrics">
            <div className="hero-metric-card">
              <div className="hero-metric-value">100ms</div>
              <div className="hero-metric-label">Avg response time</div>
            </div>
            <div className="hero-metric-card">
              <div className="hero-metric-value">20+</div>
              <div className="hero-metric-label">Planned endpoints</div>
            </div>
            <div className="hero-metric-card">
              <div className="hero-metric-value">99.99%</div>
              <div className="hero-metric-label">Targeted uptime</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hero-right">
          <div className="hero-usecase-card">
            <div className="hero-usecase-header">
              <span className="hero-usecase-pill">Use cases</span>
              <span className="hero-usecase-eyebrow">
                Drop-in APIs for your stack
              </span>
            </div>

            <ul className="hero-usecase-list">
              <li>
                <strong>Discord bots</strong> — XP helpers, reward systems,
                streaks, randomizers and more without writing custom endpoints.
              </li>
              <li>
                <strong>Internal tools</strong> — back-office scripts,
                dashboards, admin panels and CLIs that just call a single HTTPS
                API.
              </li>
              <li>
                <strong>Automation &amp; cron</strong> — scheduled jobs,
                webhooks and background workers powered by one reusable API
                key.
              </li>
            </ul>

            <p className="hero-usecase-footer">
              Start with one key, then plug VeroAPI into bots, dashboards or
              automations as you grow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
