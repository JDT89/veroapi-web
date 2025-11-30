import React, { useMemo, useState } from "react";
import { 
  Book, 
  Search, 
  Copy, 
  Check, 
  ChevronRight, 
  Key, 
  AlertCircle,
  Code,
  Terminal,
  Zap
} from "lucide-react";
import { API_BASE_URL } from "../config";
import "./DocsPage.css";

const DOC_SECTIONS = [
  {
    slug: "getting-started",
    group: "Getting started",
    icon: Zap,
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
    icon: Key,
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
    icon: Code,
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
    icon: AlertCircle,
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

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
    setMobileNavOpen(false);
    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const Icon = activeSection.icon;

  return (
    <section className="docs-page-redesign">
      {/* Header */}
      <div className="docs-header-redesign">
        <div className="docs-header-content">
          <div className="docs-badge">
            <Book size={14} />
            <span>Documentation</span>
          </div>
          <h1 className="docs-main-title">Developer Documentation</h1>
          <p className="docs-main-subtitle">
            Everything you need to integrate VeroAPI into your applications
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="docs-quick-info">
          <div className="quick-info-card">
            <span className="quick-info-label">Base URL</span>
            <code className="quick-info-value">{API_BASE_URL}</code>
          </div>
          <div className="quick-info-card">
            <span className="quick-info-label">Auth Type</span>
            <span className="quick-info-value">Bearer Token</span>
          </div>
          <div className="quick-info-card">
            <span className="quick-info-label">Format</span>
            <span className="quick-info-value">JSON</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Toggle */}
      <button 
        className="docs-mobile-nav-toggle"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        <Terminal size={18} />
        <span>{activeSection.title}</span>
        <ChevronRight size={18} className={mobileNavOpen ? 'rotated' : ''} />
      </button>

      <div className="docs-layout-redesign">
        {/* Sidebar Navigation */}
        <aside className={`docs-nav-redesign ${mobileNavOpen ? 'open' : ''}`}>
          <div className="docs-nav-header">
            <Search size={18} />
            <input
              type="text"
              className="docs-search-redesign"
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <nav className="docs-nav-content">
            {groups.map((group) => {
              const sections = filteredSections.filter((s) => s.group === group);
              if (sections.length === 0) return null;

              return (
                <div key={group} className="docs-nav-group">
                  <h3 className="docs-nav-group-title">{group}</h3>
                  <ul className="docs-nav-list">
                    {sections.map((section) => {
                      const SectionIcon = section.icon;
                      return (
                        <li key={section.slug}>
                          <button
                            className={`docs-nav-link ${
                              section.slug === activeSection.slug ? 'active' : ''
                            }`}
                            onClick={() => handleSelectSection(section.slug)}
                          >
                            <SectionIcon size={18} />
                            <span>{section.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="docs-content-redesign">
          <article className="docs-article-redesign">
            {/* Article Header */}
            <header className="docs-article-header-redesign">
              <div className="docs-article-icon">
                <Icon size={28} />
              </div>
              <div>
                <div className="docs-article-category">{activeSection.group}</div>
                <h2 className="docs-article-title-redesign">{activeSection.title}</h2>
                <p className="docs-article-tagline-redesign">{activeSection.tagline}</p>
              </div>
            </header>

            {/* Summary */}
            <div className="docs-summary-box">
              <p>{activeSection.summary}</p>
            </div>

            {/* Key Points */}
            {activeSection.bullets && activeSection.bullets.length > 0 && (
              <div className="docs-key-points">
                <h3 className="docs-section-heading">Key Points</h3>
                <ul className="docs-bullet-list">
                  {activeSection.bullets.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Code Examples */}
            {activeSection.codeBlocks && activeSection.codeBlocks.length > 0 && (
              <div className="docs-code-section">
                <h3 className="docs-section-heading">Code Examples</h3>
                <div className="docs-code-blocks-grid">
                  {activeSection.codeBlocks.map((block, idx) => (
                    <div key={idx} className="docs-code-card">
                      <div className="docs-code-card-header">
                        <div className="docs-code-card-info">
                          <Terminal size={16} />
                          <span className="docs-code-card-label">{block.label}</span>
                        </div>
                        <div className="docs-code-card-actions">
                          <span className="docs-code-language-badge">
                            {block.language}
                          </span>
                          <button
                            className="docs-copy-button"
                            onClick={() => handleCopyCode(block.code, idx)}
                            title="Copy code"
                          >
                            {copiedIndex === idx ? (
                              <Check size={16} />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <pre className="docs-code-content">
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer CTA */}
            <footer className="docs-article-footer-redesign">
              <div className="docs-footer-cta">
                <h3>Ready to get started?</h3>
                <p>Generate your API key and start building in minutes</p>
                <button 
                  className="btn primary"
                  onClick={() => (window.location.href = '/dashboard')}
                >
                  Go to Dashboard
                  <ChevronRight size={18} />
                </button>
              </div>
            </footer>
          </article>

          {/* Table of Contents - Desktop Only */}
          <aside className="docs-toc">
            <h4 className="docs-toc-title">On this page</h4>
            <ul className="docs-toc-list">
              <li>
                <a href="#summary" className="docs-toc-link">Summary</a>
              </li>
              {activeSection.bullets && activeSection.bullets.length > 0 && (
                <li>
                  <a href="#key-points" className="docs-toc-link">Key Points</a>
                </li>
              )}
              {activeSection.codeBlocks && activeSection.codeBlocks.length > 0 && (
                <li>
                  <a href="#code-examples" className="docs-toc-link">Code Examples</a>
                </li>
              )}
            </ul>
          </aside>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div 
          className="docs-mobile-overlay"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
    </section>
  );
}

export default DocsPage;