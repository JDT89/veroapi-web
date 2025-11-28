import React, { useMemo, useState } from "react";
import "./DocsPage.css";

const docsSections = [
  {
    id: "getting-started",
    group: "Getting started",
    title: "Getting started",
    tagline: "Spin up VeroAPI in minutes, not days.",
    description:
      "VeroAPI is a small, focused API service designed for bots, tools, and internal apps. You sign up, grab a single primary API key, and call random utility endpoints from any environment.",
    bullets: [
      "Create an account and sign in to the dashboard.",
      "Generate your primary API key (1 key per account).",
      "Store the key as an environment variable in your app or bot.",
      "Call any supported endpoint with a simple Authorization header.",
    ],
    codeTitle: "Basic request with curl",
    code: `curl https://api.veroapi.com/v1/text/scramble \\
  -H "Authorization: Bearer YOUR_VEROAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "text": "VeroAPI" }'`,
    note: "All endpoints share the same base URL and auth pattern. Swap only the path and body payload.",
  },
  {
    id: "auth",
    group: "Core concepts",
    title: "Authentication",
    tagline: "A single primary key per account.",
    description:
      "Authentication is intentionally simple: each VeroAPI account owns exactly one primary API key. That key is used for every request, regardless of which endpoint you call.",
    bullets: [
      "One key per account keeps management simple and rotation predictable.",
      "You can regenerate your key at any time from the dashboard.",
      "Regeneration immediately revokes the old key.",
      "Use HTTPS everywhere and never expose the key in client-side code.",
    ],
    codeTitle: "Auth header example",
    code: `POST /v1/text/scramble HTTP/1.1
Host: api.veroapi.com
Authorization: Bearer YOUR_VEROAPI_KEY
Content-Type: application/json`,
    note: "If a request is missing or using an invalid key, VeroAPI responds with HTTP 401 and a short JSON error body.",
  },
  {
    id: "random-text",
    group: "Endpoints",
    title: "Random text endpoints",
    tagline: "Helpers for bots, games, and internal tools.",
    description:
      "VeroAPI ships with random and text-focused utilities that are easy to drop into your bot or app. These endpoints are stateless and tuned for low latency.",
    bullets: [
      "Scramble or transform user-provided text.",
      "Generate small random values for quests, rewards, or cooldowns.",
      "Use responses directly in Discord messages, dashboards, or logs.",
    ],
    codeTitle: "Example: scramble text",
    code: `curl https://api.veroapi.com/v1/text/scramble \\
  -H "Authorization: Bearer YOUR_VEROAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "text": "discord-bot" }'`,
    note: "The exact payload and response format for each endpoint is documented on the Endpoints page.",
  },
  {
    id: "rate-limits",
    group: "Core concepts",
    title: "Rate limiting",
    tagline: "Per-account limits, simple and predictable.",
    description:
      "Rate limits are tied to your VeroAPI account, not to individual projects. This makes it easy to share one key across multiple small apps while keeping abuse under control.",
    bullets: [
      "Every request counts toward your account’s rolling window.",
      "Free plans are tuned for development and low-volume workloads.",
      "If you routinely hit the limit, you can back off or upgrade when plans are available.",
    ],
    codeTitle: "Handling 429 responses",
    code: `if (response.status === 429) {
  // Back off before retrying
  const retryAfter = response.headers.get("Retry-After");
  // Respect retryAfter or add your own delay
}`,
    note: "Your dashboard will surface high-level request counts so you can see when you’re approaching limits.",
  },
];

function DocsPage() {
  const [activeId, setActiveId] = useState(docsSections[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) return docsSections;
    const q = searchTerm.toLowerCase();
    return docsSections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const activeSection =
    filteredSections.find((s) => s.id === activeId) || filteredSections[0];

  const groups = useMemo(() => {
    const map = new Map();
    filteredSections.forEach((s) => {
      if (!map.has(s.group)) map.set(s.group, []);
      map.get(s.group).push(s);
    });
    return Array.from(map.entries());
  }, [filteredSections]);

  return (
    <section className="docs-page">
      <div className="docs-shell">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-title">Documentation</div>

          {groups.map(([groupName, sections]) => (
            <div className="docs-sidebar-group" key={groupName}>
              <div className="docs-sidebar-heading">{groupName}</div>
              <ul className="docs-sidebar-list">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(section.id)}
                      className={
                        section.id === activeId
                          ? "docs-sidebar-link docs-sidebar-link-active"
                          : "docs-sidebar-link"
                      }
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <div className="docs-main">
          <header className="docs-main-header">
            <div>
              <div className="docs-main-eyebrow">VeroAPI docs</div>
              <h1 className="docs-main-title">
                {activeSection ? activeSection.title : "Docs"}
              </h1>
              <p className="docs-main-subtitle">
                {activeSection
                  ? activeSection.tagline
                  : "Lightweight docs for building with VeroAPI."}
              </p>
            </div>

            <div className="docs-main-search">
              <input
                type="text"
                className="docs-search-input"
                placeholder="Search sections…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {activeSection && (
            <article className="docs-article">
              <h2 className="docs-section-title">{activeSection.title}</h2>
              <p className="docs-section-tagline">{activeSection.tagline}</p>

              <p className="docs-section-description">
                {activeSection.description}
              </p>

              {activeSection.bullets && (
                <ul className="docs-list">
                  {activeSection.bullets.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}

              {activeSection.code && (
                <>
                  <div className="docs-code-heading">
                    {activeSection.codeTitle || "Example request"}
                  </div>
                  <pre className="docs-code-block">
                    <code>{activeSection.code}</code>
                  </pre>
                </>
              )}

              {activeSection.note && (
                <p className="docs-note">{activeSection.note}</p>
              )}
            </article>
          )}
        </div>
      </div>
    </section>
  );
}

export default DocsPage;
