import React, { useState } from "react";
import "./styles.css";

function App() {
  return (
    <div className="app-root">
      <div className="halo-bg" />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <FeatureGrid />
        <ExperienceStrip />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

/* ===== LAYOUT COMPONENTS ===== */

function Navbar() {
  return (
    <header className="nav">
      <div className="nav-left">
        <div className="nav-logo">
          <span className="nav-logo-orbit" />
          <span className="nav-logo-dot" />
        </div>
        <span className="nav-brand">VeroAPI</span>
      </div>

      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#dx">DX</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>

      <div className="nav-actions">
        <button className="btn ghost">Sign in</button>
        <button className="btn primary">Get API key</button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-pill">
          <span className="pill-dot" />
          New • Global API layer for modern products
        </p>
        <h1>
          The dark-mode API
          <br />
          your users never see,
          <br />
          but always feel.
        </h1>
        <p className="hero-sub">
          VeroAPI routes, secures, and observes every request so your team ships
          features faster—without touching infra or glue code.
        </p>

        <div className="hero-actions">
          <button className="btn primary hero-primary">
            Start free (100k req / mo)
          </button>
          <button className="btn outline hero-secondary">View live docs</button>
        </div>
        <p className="hero-note">
          No credit card • 3-click setup • Built for high-growth teams
        </p>
      </div>

      <div className="hero-right">
        <CodePanel />
        <LatencyCard />
      </div>
    </section>
  );
}

function CodePanel() {
  const tabs = ["cURL", "Node.js", "Python"];
  const [active, setActive] = useState("cURL");

  const snippets = {
    "cURL": `curl https://api.veroapi.com/v1/events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Workspace: prod" \\
  -d '{
    "type": "user.signup",
    "user_id": "u_123",
    "source": "discord"
  }'`,
    "Node.js": `import axios from "axios";

const vero = axios.create({
  baseURL: "https://api.veroapi.com/v1",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "X-Workspace": "prod",
  },
});

await vero.post("/events", {
  type: "user.signup",
  user_id: "u_123",
  source: "discord",
});`,
    "Python": `import requests

session = requests.Session()
session.headers.update({
  "Authorization": "Bearer YOUR_API_KEY",
  "X-Workspace": "prod",
})

session.post(
  "https://api.veroapi.com/v1/events",
  json={"type": "user.signup", "user_id": "u_123", "source": "discord"},
)`,
  };

  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(snippets[active]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div className="code-panel">
      <div className="code-header">
        <div className="code-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`code-tab ${tab === active ? "active" : ""}`}
              onClick={() => setActive(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="copy-btn" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-body">
        <code>{snippets[active]}</code>
      </pre>
      <div className="code-footer">
        <span className="status-dot" />
        <span>Live edge cluster</span>
        <span>•</span>
        <span>Auto-retry &amp; idempotency</span>
      </div>
    </div>
  );
}

function LatencyCard() {
  return (
    <div className="latency-card">
      <div className="latency-main">
        <span className="latency-label">Global median latency</span>
        <span className="latency-value">82 ms</span>
      </div>
      <div className="latency-bars">
        <div className="bar-row">
          <span>US-East</span>
          <div className="bar-track">
            <span className="bar-fill short" />
          </div>
          <span className="bar-ms">47 ms</span>
        </div>
        <div className="bar-row">
          <span>EU-West</span>
          <div className="bar-track">
            <span className="bar-fill mid" />
          </div>
          <span className="bar-ms">73 ms</span>
        </div>
        <div className="bar-row">
          <span>AP-Southeast</span>
          <div className="bar-track">
            <span className="bar-fill long" />
          </div>
          <span className="bar-ms">110 ms</span>
        </div>
      </div>
    </div>
  );
}

/* ===== TRUST / FEATURES ===== */

function TrustStrip() {
  const items = [
    { label: "Requests this month", value: "3.1B+" },
    { label: "Average uptime", value: "99.99%" },
    { label: "Teams on VeroAPI", value: "2,400+" },
    { label: "Countries served", value: "90+" },
  ];
  return (
    <section className="trust-strip">
      {items.map((item) => (
        <div className="trust-item" key={item.label}>
          <div className="trust-value">{item.value}</div>
          <div className="trust-label">{item.label}</div>
        </div>
      ))}
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      icon: "🧩",
      title: "Composable REST & webhooks",
      text: "Events, commands, and scheduled jobs—modeled as simple, composable resources instead of scattered glue code.",
    },
    {
      icon: "🛰️",
      title: "Multi-region by design",
      text: "Every request is routed to the closest healthy region with built-in failover and no config to babysit.",
    },
    {
      icon: "🧬",
      title: "Schema-safe payloads",
      text: "Versioned schemas, validation, and type-safe SDKs so you never ship a breaking change by accident.",
    },
    {
      icon: "🕶️",
      title: "Secrets stay secret",
      text: "Scoped API keys, fine-grained roles, and per-project firewalls keep your data away from prying eyes.",
    },
    {
      icon: "📡",
      title: "Observability on tap",
      text: "Query logs, latency, and error codes across all tenants with a single search—no third-party tools needed.",
    },
    {
      icon: "⚙️",
      title: "Zero-downtime deploys",
      text: "Config changes roll out safely with automatic canaries and instant rollback if something looks off.",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="section-heading">
        <h2>Built to disappear into your product.</h2>
        <p>
          Your users never see VeroAPI, but they feel the speed, reliability,
          and polish in every interaction.
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
        <h2>Developer experience that respects your time.</h2>
        <p>
          Opinionated when it matters, invisible when it doesn’t. From the first
          curl command to production traffic, everything feels like it was
          designed by someone who ships code for a living.
        </p>
        <ul className="dx-list">
          <li>Copy-paste snippets for every major language & framework.</li>
          <li>Self-healing webhooks with automatic retries and signing.</li>
          <li>OpenAPI spec and generated types right in your editor.</li>
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
    { status: 202, route: "POST /v1/events", ms: 54, region: "us-east-1" },
    { status: 200, route: "GET /v1/workspaces", ms: 91, region: "eu-west-2" },
    { status: 204, route: "POST /v1/webhooks", ms: 63, region: "ap-south-1" },
    { status: 429, route: "POST /v1/events", ms: 12, region: "us-east-1" },
  ];

  return (
    <div className="logs-card">
      <div className="logs-header">
        <span className="logs-title">Live traffic</span>
        <span className="logs-pill">Streaming</span>
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
            <span className="logs-region">{row.region}</span>
            <span className="logs-ms">{row.ms} ms</span>
          </div>
        ))}
      </div>
      <p className="logs-footnote">
        Every request is searchable in under 3 seconds. No extra logging stack.
      </p>
    </div>
  );
}

/* ===== PRICING & FAQ ===== */

function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="section-heading">
        <h2>Start free. Grow without friction.</h2>
        <p>
          Developer-friendly pricing that scales with your traffic, not your
          anxiety levels.
        </p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <span className="pricing-tag">Free</span>
          <h3>Sandbox</h3>
          <p className="pricing-price">$0</p>
          <p className="pricing-sub">Perfect for prototypes & side projects.</p>
          <ul>
            <li>100k requests / month</li>
            <li>Single workspace</li>
            <li>Basic email support</li>
          </ul>
          <button className="btn outline block">Start in sandbox</button>
        </div>

        <div className="pricing-card pricing-featured">
          <span className="pricing-tag accent">Most popular</span>
          <h3>Scale</h3>
          <p className="pricing-price">$39</p>
          <p className="pricing-sub">Up to 5M requests / month.</p>
          <ul>
            <li>Unlimited workspaces</li>
            <li>Custom rate limits & routing</li>
            <li>Priority support & Slack channel</li>
          </ul>
          <button className="btn primary block">Upgrade to Scale</button>
        </div>

        <div className="pricing-card">
          <span className="pricing-tag">Enterprise</span>
          <h3>Orbit</h3>
          <p className="pricing-price">Let’s talk</p>
          <p className="pricing-sub">
            For banks, unicorns, and serious infra folks.
          </p>
          <ul>
            <li>Dedicated region & VPC peering</li>
            <li>Custom SLAs & compliance</li>
            <li>Solution architecture support</li>
          </ul>
          <button className="btn ghost block">Talk to sales</button>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "How fast can I go from signup to first request?",
      a: "Most teams send their first successful request in under 90 seconds. Create a workspace, copy your API key, and paste one of the snippets from the hero.",
    },
    {
      q: "Can I keep using my existing infra?",
      a: "Yes. VeroAPI is designed as a thin API layer on top of your existing databases, queues, and services. You control your data—VeroAPI only coordinates.",
    },
    {
      q: "What happens if I hit my rate limits?",
      a: "You’ll see 429 responses with structured error bodies and real-time alerts in the dashboard. You can raise limits instantly on paid plans.",
    },
    {
      q: "Do you support multi-tenant or white-label use cases?",
      a: "Absolutely. Workspaces and keys map cleanly to your tenants, and our audit logs keep you compliant while you scale.",
    },
  ];

  const [open, setOpen] = useState(0);

  return (
    <section className="faq" id="faq">
      <div className="section-heading">
        <h2>Questions, answered.</h2>
        <p>
          If you’re betting a product on VeroAPI, we want you to sleep extremely
          well at night.
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

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-brand">VeroAPI</span>
        <span className="footer-dot">•</span>
        <span className="footer-muted">
          © {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
      <div className="footer-links">
        <a href="#docs">Docs</a>
        <a href="#status">Status</a>
        <a href="#changelog">Changelog</a>
        <a href="#legal">Privacy</a>
      </div>
    </footer>
  );
}

export default App;

