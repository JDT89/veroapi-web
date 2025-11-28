import React, { useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import "./EndpointsPage.css";

const ENDPOINTS = [
  {
    id: "text-scramble",
    name: "Scramble text",
    method: "POST",
    path: "/v1/text/scramble",
    description: "Scramble a word or short phrase for games and challenges.",
    category: "Text tools",
    status: "live",
    useCase: "Discord bots, mini-games",
  },
  {
    id: "text-slug",
    name: "Slugify text",
    method: "POST",
    path: "/v1/text/slug",
    description: "Convert any string into a clean URL-friendly slug.",
    category: "Text tools",
    status: "live",
    useCase: "Web apps, SEO helpers",
  },
  {
    id: "text-pick",
    name: "Pick random item",
    method: "POST",
    path: "/v1/text/pick",
    description: "Pick a random item from an array of options.",
    category: "Randomness",
    status: "beta",
    useCase: "Giveaways, randomizers",
  },
  {
    id: "number-rng",
    name: "Random integer",
    method: "POST",
    path: "/v1/number/range",
    description: "Return a random integer between min and max (inclusive).",
    category: "Randomness",
    status: "planned",
    useCase: "Games, raffle systems",
  },
  {
    id: "id-ulid",
    name: "Generate ULID",
    method: "POST",
    path: "/v1/id/ulid",
    description: "Generate ULIDs for user IDs, sessions, or orders.",
    category: "Utility",
    status: "planned",
    useCase: "Databases, tracking",
  },
];

const CATEGORIES = ["All", "Text tools", "Randomness", "Utility", "Coming soon"];

function EndpointsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEndpoints = useMemo(() => {
    if (activeCategory === "All") return ENDPOINTS;
    if (activeCategory === "Coming soon") {
      return ENDPOINTS.filter((ep) => ep.status === "planned");
    }
    return ENDPOINTS.filter((ep) => ep.category === activeCategory);
  }, [activeCategory]);

  const liveCount = ENDPOINTS.filter((ep) => ep.status === "live").length;
  const plannedCount = ENDPOINTS.filter((ep) => ep.status === "planned").length;

  return (
    <section className="ep-page">
      <header className="ep-header">
        <div>
          <p className="ep-eyebrow">Endpoints</p>
          <h1 className="ep-title">Explore VeroAPI endpoints</h1>
          <p className="ep-subtitle">
            Plug in ready-made random endpoints to power Discord bots, small tools,
            and internal automations — all with a single account-level API key.
          </p>
          <div className="ep-stats-row">
            <span className="ep-pill">
              <span className="ep-pill-dot" />
              {liveCount} live endpoint{liveCount === 1 ? "" : "s"}
            </span>
            <span className="ep-pill-soft">
              {plannedCount} planned / coming soon
            </span>
          </div>
        </div>

        <div className="ep-meta-card">
          <div className="ep-meta-row">
            <span className="ep-meta-label">Base URL</span>
            <code className="ep-meta-value">{API_BASE_URL}</code>
          </div>
          <div className="ep-meta-row">
            <span className="ep-meta-label">Auth</span>
            <code className="ep-meta-value">Bearer YOUR_VEROAPI_KEY</code>
          </div>
          <div className="ep-meta-row">
            <span className="ep-meta-label">Docs</span>
            <button
              type="button"
              className="ep-link"
              onClick={() => (window.location.href = "/docs")}
            >
              View usage examples →
            </button>
          </div>
        </div>
      </header>

      {/* Category tabs */}
      <div className="ep-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={
              cat === activeCategory ? "ep-tab ep-tab-active" : "ep-tab"
            }
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Endpoint grid */}
      <div className="ep-grid">
        {filteredEndpoints.map((ep) => (
          <article
            key={ep.id}
            className={
              ep.status === "planned"
                ? "ep-card ep-card-planned"
                : "ep-card"
            }
          >
            <div className="ep-card-head">
              <div className="ep-method-pill">
                <span className={`ep-method ep-method-${ep.method.toLowerCase()}`}>
                  {ep.method}
                </span>
                <code className="ep-path">{ep.path}</code>
              </div>
              <span className="ep-status-pill">
                {ep.status === "live" && (
                  <>
                    <span className="ep-status-dot ep-status-dot-live" />
                    Live
                  </>
                )}
                {ep.status === "beta" && (
                  <>
                    <span className="ep-status-dot ep-status-dot-beta" />
                    Beta
                  </>
                )}
                {ep.status === "planned" && (
                  <>
                    <span className="ep-status-dot ep-status-dot-planned" />
                    Planned
                  </>
                )}
              </span>
            </div>

            <h2 className="ep-name">{ep.name}</h2>
            <p className="ep-desc">{ep.description}</p>

            <div className="ep-meta-line">
              <span className="ep-chip">{ep.category}</span>
              {ep.useCase && <span className="ep-chip-soft">{ep.useCase}</span>}
            </div>

            <div className="ep-code-hint">
              <span className="ep-code-label">Quick hint</span>
              <code className="ep-code-inline">
                curl {API_BASE_URL}
                {ep.path} -H "Authorization: Bearer YOUR_VEROAPI_KEY"
              </code>
            </div>
          </article>
        ))}

        {filteredEndpoints.length === 0 && (
          <div className="ep-empty">
            <p>No endpoints match this category yet.</p>
            <p className="ep-empty-sub">
              Switch to <strong>All</strong> to see everything available today.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default EndpointsPage;
