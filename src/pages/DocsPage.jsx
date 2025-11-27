import React, { useState } from "react";
import { API_BASE_URL } from "../config";

function DocsPage() {
  const baseUrl = `${API_BASE_URL}/v1`;

  const curlExample = `curl ${baseUrl}/text/scramble \\
  -H "Authorization: Bearer vero_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"word":"veroapi"}'`;

  const snippetsNode = `import axios from "axios";

const vero = axios.create({
  baseURL: "${baseUrl}",
  headers: {
    Authorization: "Bearer vero_live_xxx",
  },
});

const { data } = await vero.post("/text/scramble", {
  word: "veroapi",
});`;

  const sections = {
    "getting-started": {
      title: "Getting started",
      tagline: "Create an account, grab your one API key, and call an endpoint.",
      render: () => (
        <>
          <p className="docs-section-description">
            VeroAPI is a toolbox of HTTP endpoints for builders and bot devs.
            Every account gets a single primary API key that works across the
            whole API. No workspaces, no environments, no extra concepts.
          </p>
          <ol className="docs-list">
            <li>
              <strong>Create an account</strong> – click{" "}
              <em>Get API key</em> on the homepage and sign up.
            </li>
            <li>
              <strong>Open the dashboard</strong> – sign in and generate your
              primary API key.
            </li>
            <li>
              <strong>Store the key safely</strong> – in an env var or secret
              manager.
            </li>
            <li>
              <strong>Call a sample endpoint</strong> – like{" "}
              <code>POST /text/scramble</code>.
            </li>
          </ol>

          <div className="docs-keyline">Base URL</div>
          <pre className="code-body">
            <code>{baseUrl}</code>
          </pre>

          <p className="docs-note">
            All endpoints live under <code>/v1</code>. You send JSON and get
            JSON back—all over HTTPS.
          </p>
        </>
      ),
    },
    auth: {
      title: "Authentication",
      tagline: "Use your single account-level API key with a Bearer header.",
      render: () => (
        <>
          <p className="docs-section-description">
            Every user gets exactly one primary API key. You can regenerate it
            from the dashboard, but you’ll never have to manage multiple keys,
            workspaces, or environments.
          </p>

          <div className="docs-keyline">Authorization header</div>
          <pre className="code-body">
            <code>{`Authorization: Bearer vero_live_xxx`}</code>
          </pre>

          <ul className="docs-list">
            <li>Keys are tied directly to your account.</li>
            <li>
              When you regenerate a key, the old one stops working immediately.
            </li>
            <li>Never put the key in client-side code; keep it server-side.</li>
          </ul>

          <p className="docs-note">
            The dashboard is where you’ll generate and rotate your key. Treat it
            like a password for your API usage.
          </p>
        </>
      ),
    },
    "rate-limits": {
      title: "Rate limits",
      tagline: "Usage is tracked per account, not per workspace or project.",
      render: () => (
        <>
          <p className="docs-section-description">
            Rate limits are attached to <strong>your account</strong>. It
            doesn’t matter which endpoints you call—the same quota applies.
          </p>

          <ul className="docs-list">
            <li>
              Free tier: generous per-minute and per-day limits suitable for
              testing and small bots.
            </li>
            <li>
              Paid tiers: higher ceilings, with the same simple “per account”
              model.
            </li>
          </ul>

          <p className="docs-note">
            If you hit a limit, VeroAPI will return <code>429</code> with a
            JSON error body. Upgrade your plan or back off requests.
          </p>
        </>
      ),
    },
    "sample-endpoints": {
      title: "Sample endpoints",
      tagline: "A taste of the kind of helpers VeroAPI provides.",
      render: () => (
        <>
          <p className="docs-section-description">
            Endpoints are intentionally small and focused. You wire them into
            your app or bot wherever you’d normally write one-off helpers.
          </p>

          <div className="docs-keyline">POST /text/scramble</div>
          <pre className="code-body">
            <code>{curlExample}</code>
          </pre>

          <div className="docs-keyline">Node.js example</div>
          <pre className="code-body">
            <code>{snippetsNode}</code>
          </pre>

          <p className="docs-section-description">Example response:</p>
          <pre className="code-body">
            <code>{`{
  "ok": true,
  "word": "veroapi",
  "scrambled": "eorivap"
}`}</code>
          </pre>

          <p className="docs-note">
            As you add more endpoints (Discord helpers, game math, fun
            utilities), you’ll document them here in the same style.
          </p>
        </>
      ),
    },
  };

  const navGroups = [
    {
      heading: "Introduction",
      items: [{ id: "getting-started", label: "Getting started" }],
    },
    {
      heading: "Account & auth",
      items: [
        { id: "auth", label: "Authentication" },
        { id: "rate-limits", label: "Rate limits" },
      ],
    },
    {
      heading: "API reference",
      items: [{ id: "sample-endpoints", label: "Sample endpoints" }],
    },
  ];

  const [activeId, setActiveId] = useState("getting-started");
  const activeSection = sections[activeId];

  return (
    <section className="docs">
      <div className="docs-shell">
        <aside className="docs-sidebar">
          <div className="docs-sidebar-title">VeroAPI docs</div>
          {navGroups.map((group) => (
            <div className="docs-sidebar-group" key={group.heading}>
              <div className="docs-sidebar-heading">{group.heading}</div>
              <ul className="docs-sidebar-list">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`docs-sidebar-link ${
                        activeId === item.id ? "docs-sidebar-link-active" : ""
                      }`}
                      onClick={() => setActiveId(item.id)}
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <div className="docs-main">
          <div className="docs-main-header">
            <div>
              <div className="docs-main-eyebrow">Documentation</div>
              <h1 className="docs-main-title">{activeSection.title}</h1>
              <p className="docs-main-subtitle">{activeSection.tagline}</p>
            </div>
            <div className="docs-search">
              <input
                className="docs-search-input"
                placeholder="Search (coming soon)…"
                disabled
              />
            </div>
          </div>

          <article className="docs-article">
            <h2 className="docs-section-title">{activeSection.title}</h2>
            <p className="docs-section-tagline">
              {activeSection.tagline}
            </p>
            {activeSection.render()}
          </article>
        </div>
      </div>
    </section>
  );
}

export default DocsPage;
