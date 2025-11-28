import React, { useState } from "react";
import "./Endpoints.css";

const ENDPOINTS = [
  {
    id: "scramble",
    name: "Scramble text",
    method: "POST",
    path: "/v1/text/scramble",
    description: "Return one or more scrambled variants of a given word or phrase.",
    category: "text",
    status: "live",
    tag: "Text helper"
  },
  {
    id: "slugify",
    name: "Slugify",
    method: "POST",
    path: "/v1/text/slugify",
    description: "Convert any string into a URL-safe slug with sensible defaults.",
    category: "text",
    status: "planned",
    tag: "Text helper"
  },
  {
    id: "xp-award",
    name: "XP award",
    method: "POST",
    path: "/v1/discord/xp/award",
    description: "Central XP award endpoint for bots, with anti-spam helpers.",
    category: "bot",
    status: "planned",
    tag: "Bot helpers"
  },
  {
    id: "cooldown-check",
    name: "Cooldown check",
    method: "POST",
    path: "/v1/discord/cooldown/check",
    description: "Single endpoint to check and update per-user or per-guild cooldowns.",
    category: "bot",
    status: "planned",
    tag: "Bot helpers"
  },
  {
    id: "rng-int",
    name: "Random integer",
    method: "GET",
    path: "/v1/random/int",
    description: "Crypto-safe integer in a range, with optional per-user idempotency.",
    category: "fun",
    status: "planned",
    tag: "Utility"
  },
  {
    id: "rng-choice",
    name: "Random choice",
    method: "POST",
    path: "/v1/random/choice",
    description: "Pick a random item from an array — weighted choices supported.",
    category: "fun",
    status: "planned",
    tag: "Utility"
  }
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "text", label: "Text APIs" },
  { id: "bot", label: "Bot helpers" },
  { id: "fun", label: "Fun / misc" },
  { id: "planned", label: "Planned only" }
];

function EndpointsPage() {
  const [filter, setFilter] = useState("all");

  const filteredEndpoints = ENDPOINTS.filter((ep) => {
    if (filter === "all") return true;
    if (filter === "planned") return ep.status === "planned";
    return ep.category === filter;
  });

  const liveCount = ENDPOINTS.filter((e) => e.status === "live").length;
  const plannedCount = ENDPOINTS.filter((e) => e.status === "planned").length;

  return (
    <div className="endpoints-page">
      {/* Header / hero strip */}
      <header className="endpoints-hero">
        <div className="endpoints-hero-left">
          <div className="endpoints-pill">
            <span className="endpoints-pill-dot" />
            <span>One key • Many small helpers</span>
          </div>
          <h1>Endpoints</h1>
          <p className="endpoints-sub">
            A growing library of small, focused endpoints designed for Discord
            bots, dashboards, and games. No extra infrastructure — just your
            account-level VeroAPI key.
          </p>

          <div className="endpoints-meta">
            <span>{ENDPOINTS.length} endpoints listed</span>
            <span>{liveCount} live</span>
            <span>{plannedCount} planned</span>
          </div>
        </div>

        <div className="endpoints-hero-right">
          <div className="endpoints-hero-card">
            <div className="endpoints-hero-card-header">
              <span className="endpoints-hero-card-title">How it works</span>
              <span className="endpoints-hero-card-pill">Single API key</span>
            </div>
            <ol className="endpoints-hero-steps">
              <li>Sign in and generate your primary key.</li>
              <li>Store it as an environment variable in your app or bot.</li>
              <li>Call any endpoint on this page with the same key.</li>
            </ol>
            <p className="endpoints-hero-note">
              All endpoints live under <code>https://api.veroapi.com/v1</code>.
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="endpoints-filter-row">
        <div className="endpoints-filter-tabs" aria-label="Filter endpoints">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={
                filter === f.id
                  ? "endpoints-filter-tab endpoints-filter-tab-active"
                  : "endpoints-filter-tab"
              }
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of cards */}
      <section className="endpoints-grid-section">
        {filteredEndpoints.length === 0 ? (
          <div className="endpoints-empty">
            No endpoints match this filter yet.
          </div>
        ) : (
          <div className="endpoints-grid">
            {filteredEndpoints.map((ep) => (
              <article
                key={ep.id}
                className={
                  ep.status === "planned"
                    ? "endpoint-card endpoint-card-planned"
                    : "endpoint-card"
                }
              >
                <div className="endpoint-card-top">
                  <span
                    className={`endpoint-method endpoint-method-${ep.method.toLowerCase()}`}
                  >
                    {ep.method}
                  </span>
                  <span className="endpoint-tag">{ep.tag}</span>
                </div>

                <h2 className="endpoint-name">{ep.name}</h2>
                <p className="endpoint-path">
                  <code>{ep.path}</code>
                </p>
                <p className="endpoint-description">{ep.description}</p>

                <div className="endpoint-meta-row">
                  <span className={`endpoint-status endpoint-status-${ep.status}`}>
                    {ep.status === "live"
                      ? "Live"
                      : ep.status === "beta"
                      ? "Beta"
                      : "Planned"}
                  </span>
                  <span className={`endpoint-category endpoint-category-${ep.category}`}>
                    {ep.category === "text"
                      ? "Text"
                      : ep.category === "bot"
                      ? "Bot helper"
                      : "Fun / misc"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default EndpointsPage;
