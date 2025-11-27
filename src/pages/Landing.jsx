// src/pages/Landing.jsx
import React, { useState } from "react";
import Hero from "../components/landing/Hero";
import EndpointGallery from "../components/landing/EndpointGallery";

function LandingPage() {
  return (
    <>
      <Hero />
      <EndpointGallery />
      <ExperienceStrip />
      <FeatureGrid />
      <Pricing />
      <FAQ />
    </>
  );
}

/* ===== Landing sections ===== */

function FeatureGrid() {
  const features = [
    {
      icon: "🔑",
      title: "One key, all endpoints",
      text: "Forget juggling workspaces or environments. Every account gets a single primary key that works across the entire API.",
    },
    {
      icon: "📦",
      title: "Random but useful",
      text: "Scramble words, compute XP, generate prompts and more. Replace boring helper utilities with a hosted endpoint instead.",
    },
    {
      icon: "🧱",
      title: "Perfect for bots & games",
      text: "Call VeroAPI from your Discord bots, games or tools and offload repetitive or heavy logic to us.",
    },
    {
      icon: "📊",
      title: "Per-account rate limits",
      text: "Limits attach to your account, not to specific workspaces or environments. Easy to reason about, easy to upgrade.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="section-heading">
        <h2>Turn helper functions into a real API layer.</h2>
        <p>
          Any time you almost write a little utility function, consider routing it
          through VeroAPI instead and keep your codebase focused.
        </p>
      </div>
      <div className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceStrip() {
  const rows = [
    { status: "200", route: "/v1/text/scramble", ms: 42 },
    { status: "200", route: "/v1/fun/word", ms: 35 },
    { status: "429", route: "/v1/discord/rewards/roll", ms: 4 },
    { status: "200", route: "/v1/text/slugify", ms: 31 },
  ];

  return (
    <section className="dx-strip" id="dx">
      <div className="dx-left">
        <h2>Developer experience that feels like cheating.</h2>
        <p>
          No noisy dashboards. Just your account, one API key, simple docs and endpoints
          that do exactly what they promise.
        </p>
        <ul className="dx-list">
          <li>One-click key generation &amp; regeneration from your dashboard.</li>
          <li>Copy-paste examples for your language or framework.</li>
          <li>Clear errors with human-readable messages.</li>
        </ul>
      </div>
      <div className="dx-right">
        <div className="logs-card">
          <div className="logs-header">
            <div className="logs-title">Recent requests</div>
            <span className="logs-pill">Live tail</span>
          </div>
          <div className="logs-table">
            {rows.map((row, idx) => (
              <div className="logs-row" key={idx}>
                <span
                  className={`logs-status ${
                    row.status === "200" ? "ok" : "error"
                  }`}
                >
                  {row.status}
                </span>
                <span className="logs-route">{row.route}</span>
                <span className="logs-region">account-limit</span>
                <span className="logs-ms">{row.ms} ms</span>
              </div>
            ))}
          </div>
          <p className="logs-footnote">
            Rate limiting is applied per account, not per workspace or environment.
          </p>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="section-heading">
        <h2>Simple plans. No per-environment math.</h2>
        <p>
          Every plan includes exactly one API key per account. Upgrade when you need
          more throughput, not more complexity.
        </p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <span className="pricing-tag">Free</span>
          <h3>Playground</h3>
          <p className="pricing-price">$0</p>
          <p className="pricing-sub">Test the waters and prototype bots or games.</p>
          <ul>
            <li>1 API key per account</li>
            <li>Generous free monthly requests</li>
            <li>Access to core endpoints</li>
          </ul>
          <button className="btn outline block">Start free</button>
        </div>

        <div className="pricing-card pricing-featured">
          <span className="pricing-tag accent">Most popular</span>
          <h3>Pro</h3>
          <p className="pricing-price">$19</p>
          <p className="pricing-sub">
            For serious bots, games and small SaaS projects.
          </p>
          <ul>
            <li>Higher per-account rate limits</li>
            <li>Priority access to new endpoints</li>
            <li>Email / Discord support</li>
          </ul>
          <button className="btn primary block">Upgrade to Pro</button>
        </div>

        <div className="pricing-card">
          <span className="pricing-tag">Custom</span>
          <h3>Scale</h3>
          <p className="pricing-price">Let’s talk</p>
          <p className="pricing-sub">
            Need custom endpoints or dedicated capacity for your product?
          </p>
          <ul>
            <li>Tailored endpoints for your use case</li>
            <li>Custom per-account quotas</li>
            <li>Slack / Discord support channel</li>
          </ul>
          <button className="btn ghost block">Contact us</button>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Why only one API key per account?",
      a: "It keeps everything simple: one key to manage, one key to secure, one place for limits. You can regenerate it any time from the dashboard.",
    },
    {
      q: "How is rate limiting applied?",
      a: "All limits are attached to your account, regardless of how many bots, games, or tools call the API. You don’t have to think about environments or workspaces.",
    },
    {
      q: "Can I use VeroAPI with multiple bots or apps?",
      a: "Yes. Use the same key across all your bots and services. Just keep it backend-only and never expose it in client-side code.",
    },
    {
      q: "What kind of endpoints will you add?",
      a: "We’re focused on random-but-useful building blocks: text utilities, helper math for XP and rewards, and tooling for games and bots.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq" id="faq">
      <div className="section-heading">
        <h2>Questions, answered.</h2>
        <p>
          If you’re not sure whether VeroAPI fits your stack, these should help. Still
          unsure? Reach out and we’ll talk it through.
        </p>
      </div>
      <div className="faq-list">
        {items.map((item, idx) => (
          <FaqItem
            key={item.q}
            item={item}
            open={openIndex === idx}
            onToggle={() =>
              setOpenIndex(openIndex === idx ? -1 : idx)
            }
          />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-question" onClick={onToggle}>
        <span>{item.q}</span>
        <span className="faq-toggle">{open ? "–" : "+"}</span>
      </button>
      {open && <p className="faq-answer">{item.a}</p>}
    </div>
  );
}

export default LandingPage;

