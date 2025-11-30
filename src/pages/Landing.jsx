import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Guides",
      description: "Learn how to authenticate, call endpoints, and handle errors with our comprehensive documentation.",
      icon: "📖",
      path: "/docs",
      accent: true,
    },
    {
      title: "API Reference",
      description: "Explore all available endpoints, parameters, and response schemas in detail.",
      icon: "🔌",
      path: "/endpoints",
      accent: false,
    },
    {
      title: "Changelog",
      description: "Stay updated with the latest features, improvements, and API changes.",
      icon: "📝",
      path: "/docs",
      accent: false,
    },
    {
      title: "Support",
      description: "Get help with integration, troubleshooting, and best practices.",
      icon: "💬",
      path: "/docs",
      accent: false,
    },
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-status">
          <span className="hero-status-dot" />
          <span>API Status: Online</span>
        </div>

        <h1 className="hero-title">
          Random-but-useful APIs<br />
          for bots, tools &amp; automations.
        </h1>

        <p className="hero-subtitle">
          VeroAPI gives you a single key for a growing collection of ready-made endpoints — 
          from text utilities to game helpers — so you can ship features, not glue code.
        </p>

        <div className="hero-actions">
          <button 
            type="button" 
            className="btn primary"
            onClick={() => navigate("/auth")}
          >
            Get your API key
          </button>
          <button 
            type="button" 
            className="btn outline"
            onClick={() => navigate("/docs")}
          >
            View documentation
          </button>
        </div>

        <p className="hero-note">
          No credit card required • One API key per account • Rate limits per user
        </p>
      </section>

      {/* Quick Links Grid */}
      <section className="quick-links">
        <h2 className="section-title">Quick Links</h2>
        <div className="quick-links-grid">
          {quickLinks.map((link) => (
            <button
              key={link.title}
              type="button"
              className={`quick-link-card ${link.accent ? "accent" : ""}`}
              onClick={() => navigate(link.path)}
            >
              <span className="quick-link-icon">{link.icon}</span>
              <h3 className="quick-link-title">{link.title}</h3>
              <p className="quick-link-desc">{link.description}</p>
              <span className="quick-link-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why VeroAPI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-metric">100ms</div>
            <div className="feature-label">Avg Response Time</div>
          </div>
          <div className="feature-card">
            <div className="feature-metric">20+</div>
            <div className="feature-label">Planned Endpoints</div>
          </div>
          <div className="feature-card">
            <div className="feature-metric">99.99%</div>
            <div className="feature-label">Targeted Uptime</div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="use-cases">
        <h2 className="section-title">Use Cases</h2>
        <div className="use-cases-grid">
          <div className="use-case-card">
            <h3>Discord Bots</h3>
            <p>XP helpers, reward systems, streaks, randomizers and more without writing custom endpoints.</p>
          </div>
          <div className="use-case-card">
            <h3>Internal Tools</h3>
            <p>Back-office scripts, dashboards, admin panels and CLIs that just call a single HTTPS API.</p>
          </div>
          <div className="use-case-card">
            <h3>Automation &amp; Cron</h3>
            <p>Scheduled jobs, webhooks and background workers powered by one reusable API key.</p>
          </div>
        </div>
      </section>

      {/* Code Sample */}
      <section className="code-sample">
        <h2 className="section-title">Quick Start</h2>
        <div className="code-card">
          <div className="code-header">
            <span className="code-lang">bash</span>
          </div>
          <pre className="code-content">
{`curl "https://veroapi-api.onrender.com/v1/text/scramble" \\
  -H "Authorization: Bearer YOUR_VEROAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"VeroAPI"}'`}
          </pre>
        </div>
      </section>
    </div>
  );
}

export default Landing;

