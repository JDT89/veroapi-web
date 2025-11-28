import React, { useMemo, useState } from "react";
import { API_BASE_URL } from "../config";
import "./DocsPage.css";

const DOC_SECTIONS = [
  {
    slug: "getting-started",
    group: "Getting started",
    title: "Getting started with VeroAPI",
    tagline: "From zero to first request in a couple of minutes.",
    summary:
      "VeroAPI gives you a single API key that you can plug into small tools, Discord bots, cron jobs, or internal automations.",
    bullets: [
      "Create an account and generate your primary API key in the dashboard.",
      "Store the key as an environment variable, never hard-code it in your repo.",
      "Call any supported random endpoint by sending your key in the Authorization header.",
    ],
    codeBlocks: [
      {
        label: "Base URL",
        language: "text",
        code: `${API_BASE_URL}`,
      },
      {
        label: "Required headers",
        language: "bash",
        code: `Authorization: Bearer YOUR_VEROAPI_KEY
Content-Type: application/json`,
      },
    ],
  },
  {
    slug: "authentication",
    group: "Authentication",
    title: "Authentication & API keys",
    tagline: "One account, one key, clear rate limits.",
    summary:
      "Each VeroAPI account has a single primary API key. You can regenerate this key at any time — the old one stops working immediately.",
    bullets: [
      "Generate or regenerate your key from the dashboard Overview page.",
      "The key must be sent as a Bearer token in the Authorization header.",
      "Keys are tied to your account for rate limiting and abuse protection.",
    ],
    codeBlocks: [
      {
        label: "Example cURL request",
        language: "bash",
        code: `curl "${API_BASE_URL}/v1/text/scramble" \\
  -H "Authorization: Bearer YOUR_VEROAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"VeroAPI"}'`,
      },
      {
        label: "Example fetch (Node/JS)",
        language: "js",
        code: `const res = await fetch("${API_BASE_URL}/v1/text/scramble", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + process.env.VEROAPI_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ text: "VeroAPI" }),
});

const json = await res.json();`,
      },
    ],
  },
  {
    slug: "random-text",
    group: "Random endpoints",
    title: "Random text endpoints",
    tagline: "Helpers for games, bots and micro-features.",
    summary:
      "Use text endpoints to power simple game mechanics, Discord mini-games, or internal utilities without standing up your own services.",
    bullets: [
      "`POST /v1/text/scramble` — scramble a word or short phrase.",
      "`POST /v1/text/slug` — convert text into a URL-friendly slug.",
      "`POST /v1/text/pick` — pick a random item from a list.",
    ],
    codeBlocks: [
      {
        label: "Scramble example",
        language: "bash",
        code: `curl "${API_BASE_URL}/v1/text/scramble" \\
  -H "Authorization: Bearer YOUR_VEROAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"discord"}'`,
      },
      {
        label: "Slug example",
        language: "bash",
        code: `curl "${API_BASE_URL}/v1/text/slug" \\
  -H "Authorization: Bearer YOUR_VEROAPI_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"VeroAPI random tools"}'`,
      },
    ],
  },
  {
    slug: "errors-limits",
    group: "Errors & limits",
    title: "Errors & rate limits",
    tagline: "Understand how VeroAPI responds when something goes wrong.",
    summary:
      "All endpoints return JSON with a simple `{ ok, data, error }` shape and standard HTTP status codes.",
    bullets: [
      "4xx errors mean something is wrong with the request (auth, validation, etc.).",
      "5xx errors mean something went wrong on VeroAPI's side.",
      "Rate limits are applied per account based on your primary API key.",
    ],
    codeBlocks: [
      {
        label: "Example error response",
        language: "json",
        code: `{
  "ok": false,
  "error": "Missing or invalid API key"
}`,
      },
      {
        label: "Handling errors in JS",
        language: "js",
        code: `if (!res.ok) {
  const body = await res.json().catch(() => null);
  throw new Error(body?.error || "Unexpected error");
}`,
      },
    ],
  },
];

const groups = [
  "Getting started",
  "Authentication",
  "Random endpoints",
  "Errors & limits",
];

function DocsPage() {
  const [activeSlug, setActiveSlug] = useState("getting-started");
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOC_SECTIONS;

    return DOC_SECTIONS.filter((section) => {
      const haystack = [
        section.title,
        section.tagline,
        section.summary,
        ...(section.bullets || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const activeSection =
    filteredSections.find((s) => s.slug === activeSlug) ||
    filteredSections[0] ||
    DOC_SECTIONS[0];

  const handleSelectSection = (slug) => {
    setActiveSlug(slug);
  };

  return (
    <section className="docs-page">
      <div className="docs-page-header">
        <div>
          <p className="docs-page-eyebrow">Documentation</p>
          <h1 className="docs-page-title">VeroAPI developer docs</h1>
          <p className="docs-page-subtitle">
            Learn how to authenticate, call random endpoints, and handle errors
            with a single account-level API key.
          </p>
        </div>
        <div className="docs-meta-card">
          <div className="docs-meta-row">
            <span className="docs-meta-label">Base URL</span>
            <code className="docs-meta-value">{API_BASE_URL}</code>
          </div>
          <div className="docs-meta-row">
            <span className="docs-meta-label">Auth</span>
            <code className="docs-meta-value">Bearer YOUR_VEROAPI_KEY</code>
          </div>
          <div className="docs-meta-row">
            <span className="docs-meta-label">Status</span>
            <span className="docs-status-pill">
              <span className="docs-status-dot" />
              API operational
            </span>
          </div>
        </div>
      </div>

      <div className="docs-layout">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-search">
            <input
              type="text"
              className="docs-search-input"
              placeholder="Search docs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="docs-groups">
            {groups.map((group) => (
              <div key={group} className="docs-group">
                <p className="docs-group-heading">{group}</p>
                <ul className="docs-link-list">
                  {filteredSections
                    .filter((s) => s.group === group)
                    .map((section) => (
                      <li key={section.slug}>
                        <button
                          type="button"
                          className={
                            section.slug === activeSection.slug
                              ? "docs-link docs-link-active"
                              : "docs-link"
                          }
                          onClick={() => handleSelectSection(section.slug)}
                        >
                          {section.title}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="docs-main">
          <article className="docs-article">
            <header className="docs-article-header">
              <div>
                <p className="docs-article-eyebrow">
                  {activeSection.group || "Section"}
                </p>
                <h2 className="docs-article-title">{activeSection.title}</h2>
                <p className="docs-article-tagline">
                  {activeSection.tagline}
                </p>
              </div>
            </header>

            <p className="docs-article-summary">{activeSection.summary}</p>

            {activeSection.bullets && activeSection.bullets.length > 0 && (
              <ul className="docs-article-list">
                {activeSection.bullets.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}

            {activeSection.codeBlocks && activeSection.codeBlocks.length > 0 && (
              <div className="docs-code-grid">
                {activeSection.codeBlocks.map((block, idx) => (
                  <section key={idx} className="docs-code-block">
                    <div className="docs-code-block-header">
                      <span className="docs-code-label">{block.label}</span>
                      <span className="docs-code-language">
                        {block.language}
                      </span>
                    </div>
                    <pre className="docs-code-pre">
                      <code>{block.code}</code>
                    </pre>
                  </section>
                ))}
              </div>
            )}

            <footer className="docs-article-footer">
              <p className="docs-article-footnote">
                Ready to try this for real? Generate your key in the{" "}
                <button
                  type="button"
                  className="docs-inline-link"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  dashboard
                </button>{" "}
                and start calling endpoints in under 2 minutes.
              </p>
            </footer>
          </article>
        </main>
      </div>
    </section>
  );
}

export default DocsPage;
