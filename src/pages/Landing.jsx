import React from "react";
import Hero from "../components/landing/Hero";
import EndpointGallery from "../components/landing/EndpointGallery";

function LandingPage() {
  return (
    <>
      <Hero />
      <EndpointGallery />
      <FeatureGrid />
      <ExperienceStrip />
      <Pricing />
      <FAQ />
    </>
  );
}

/* ===== Existing sections from the old App.jsx ===== */

function FeatureGrid() {
  const features = [
    {
      icon: "🔑",
      title: "One key, all endpoints",
      text: "Forget juggling workspaces or environments. Every account gets one primary key that works across the entire API.",
    },
    {
      icon: "📦",
      title: "Random but useful",
      text: "Scramble words, compute XP, generate prompts, and more. Add VeroAPI wherever you’d normally write boring utility code.",
    },
    {
      icon: "🧱",
      title: "Perfect for bots",
      text: "Drop HTTP calls into your Discord bots or apps. Offload heavy or repetitive logic to VeroAPI and keep your codebase slim.",
    },
    {
      icon: "📊",
      title: "Per-account rate limits",
      text: "Limits are attached to your account, not environments. Easy to reason about, easy to upgrade later.",
    },
    {
      icon: "🚀",
      title: "Fast to integrate",
      text: "Copy a snippet, paste your key, hit deploy. No SDK mandatory, just clean JSON over HTTPS.",
    },
    {
      icon: "⚙️",
      title: "Backend handled for you",
      text: "We worry about infra, you just hit endpoints. When you’re ready to scale, swap plans instead of rewriting glue code.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="section-heading">
        <h2>Turn “random helpers” into a real API layer.</h2>
        <p>
          Every time you almost write a helper function, consider replacing it
          with a VeroAPI endpoint instead.
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
  return (
    <section className="dx-strip" id="dx">
      <div className="dx-left">
        <h2>Developer experience that feels like cheating.</h2>
        <p>
          No dashboards full of noisy charts. Just your account, one API key,
          simple docs, and endpoints that do exactly what they promise.
        </p>
        <ul className="dx-list">
          <li>One-click key generation &amp; regeneration from your dashboard.</li>
          <li>Copy-paste examples for your language or framework.</li>
          <li>Clear errors with human-readable messages.</li>
        </ul>
      </div>
      <div className="dx-right">
        <FakeLogs />
      </div>
    </section>
  );
}

function FakeLogs() {
  const rows = [
    { status: 200, route: "POST /v1/text/scramble", ms: 47 },
    { status: 200, route: "POST /v1/discord/xp/next-level", ms: 63 },
    { status: 429, route: "POST /v1/text/scramble", ms: 11 },
    { status: 200, route: "GET /v1/fun/prompt", ms: 92 },
  ];

  return (
    <div className="logs-card">
      <div className="logs-header">
        <span className="logs-title">Live account traffic</span>
        <span className="logs-pill">Sample stream</span>
      </div>
      <div className="logs-table">
        {rows.map((row, i) => (
          <div className="logs-row" key={i}>
            <span
              className={`logs-status ${
                row.status >= 400 ? "error" : "ok"
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
  );
}

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="section-heading">
        <h2>Simple plans. No per-environment math.</h2>
        <p>
          Every plan includes exactly one API key per account. Upgrade when you
          need more throughput, not more complexity.
        </p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <span className="pricing-tag">Free</span>
          <h3>Playground</h3>
          <p className="pricing-price">$0</p>
          <p className="pricing-sub">Test the waters and prototype bots.</p>
          <ul>
            <li>1 API key per account</li>
            <li>Generous per-account rate limit</li>
            <li>Core endpoints</li>
          </ul>
          <a href="/auth" className="btn outline block">
            Start in Playground
          </a>
        </div>

        <div className="pricing-card pricing-featured">
          <span className="pricing-tag accent">Most popular</span>
          <h3>Builder</h3>
          <p className="pricing-price">$19</p>
          <p className="pricing-sub">For serious apps &amp; Discord bots.</p>
          <ul>
            <li>1 API key per account</li>
            <li>Higher rate limits</li>
            <li>Priority on new endpoint requests</li>
          </ul>
          <a href="/auth" className="btn primary block">
            Upgrade to Builder
          </a>
        </div>

        <div className="pricing-card">
          <span className="pricing-tag">Custom</span>
          <h3>Studio</h3>
          <p className="pricing-price">Let’s talk</p>
          <p className="pricing-sub">
            Need custom endpoints or dedicated capacity?
          </p>
          <ul>
            <li>Tailored endpoints for your product</li>
            <li>Custom per-account quota</li>
            <li>Slack/Discord support</li>
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
      a: "It keeps everything simple: one key to manage, one key to rotate, one place to apply rate limits. You can regenerate it at any time from the dashboard.",
    },
    {
      q: "How is rate limiting applied?",
      a: "All limits are attached to your account, regardless of which endpoints you use. This means you don’t have to think about environments, workspaces, or projects.",
    },
    {
      q: "Can I use VeroAPI with multiple bots or apps?",
      a: "Yes. Use the same key across all your bots and services, or keep it backend-only and proxy requests from wherever you need.",
    },
    {
      q: "What kind of endpoints will you add?",
      a: "We’re focusing on random-but-useful building blocks: text utilities, Discord/bot helpers, game math, and other pieces you’d rather not reinvent.",
    },
  ];

  const [open, setOpen] = React.useState(0);

  return (
    <section className="faq" id="faq">
      <div className="section-heading">
        <h2>Questions, answered.</h2>
        <p>
          VeroAPI is designed to feel lightweight for solo builders and still
          make sense at scale.
        </p>
      </div>

      <div className="faq-list">
        {items.map((item, i) => (
          <FaqItem
            key={item.q}
            item={item}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
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
