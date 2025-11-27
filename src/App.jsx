import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./styles.css";

// Point this at your Fastify backend (Render URL or custom domain)
const API_BASE_URL = "https://veroapi-api.onrender.com";

/* ========= ROOT APP ========= */

function App() {
  return (
    <div className="app-root">
      <div className="halo-bg" />
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<LandingLayout />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<DocsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

/* ========= NAVBAR ========= */

function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="nav-brand-link">
            <div className="nav-logo">
              <span className="nav-logo-orbit" />
              <span className="nav-logo-dot" />
            </div>
            <span className="nav-brand">VeroAPI</span>
          </Link>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#dx">DX</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <Link to="/docs">Docs</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/auth" className="btn ghost nav-btn-link">
            Sign in
          </Link>
          <Link to="/auth" className="btn primary nav-btn-link">
            Get API key
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ========= LANDING LAYOUT ========= */

function LandingLayout() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <FeatureGrid />
      <ExperienceStrip />
      <Pricing />
      <FAQ />
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <p className="hero-pill">
          <span className="pill-dot" />
          New • API utilities for builders & bot devs
        </p>
        <h1>
          One API key.
          <br />
          Dozens of endpoints.
          <br />
          Zero infrastructure.
        </h1>
        <p className="hero-sub">
          VeroAPI gives you a single account-level key and a growing library of
          “random” but ridiculously useful endpoints for apps and Discord bots.
        </p>

        <div className="hero-actions">
          <Link to="/auth" className="btn primary hero-primary nav-btn-link">
            Start free (1 key per account)
          </Link>
          <Link to="/docs" className="btn outline hero-secondary nav-btn-link">
            Read the docs
          </Link>
        </div>
        <p className="hero-note">
          No card • One key per user • Rate limits per account, not per project.
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

  // Example random endpoint: text scramble
  const snippets = {
    cURL: `curl ${API_BASE_URL}/v1/text/scramble \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "word": "veroapi"
  }'`,
    "Node.js": `import axios from "axios";

const vero = axios.create({
  baseURL: "${API_BASE_URL}/v1",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
  },
});

const res = await vero.post("/text/scramble", {
  word: "veroapi",
});

console.log(res.data.scrambled);`,
    Python: `import requests

session = requests.Session()
session.headers.update({
  "Authorization": "Bearer YOUR_API_KEY",
})

res = session.post(
  "${API_BASE_URL}/v1/text/scramble",
  json={"word": "veroapi"},
)

print(res.json()["scrambled"])`,
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
        <span>Per-account rate limiting</span>
        <span>•</span>
        <span>Single API key per user</span>
      </div>
    </div>
  );
}

function LatencyCard() {
  return (
    <div className="latency-card">
      <div className="latency-main">
        <span className="latency-label">Sample endpoint latency</span>
        <span className="latency-value">86 ms</span>
      </div>
      <div className="latency-bars">
        <div className="bar-row">
          <span>Text APIs</span>
          <div className="bar-track">
            <span className="bar-fill short" />
          </div>
          <span className="bar-ms">52 ms</span>
        </div>
        <div className="bar-row">
          <span>Bot helpers</span>
          <div className="bar-track">
            <span className="bar-fill mid" />
          </div>
          <span className="bar-ms">79 ms</span>
        </div>
        <div className="bar-row">
          <span>Fun endpoints</span>
          <div className="bar-track">
            <span className="bar-fill long" />
          </div>
          <span className="bar-ms">121 ms</span>
        </div>
      </div>
    </div>
  );
}

/* ========= TRUST / FEATURES ========= */

function TrustStrip() {
  const items = [
    { label: "Endpoints (launch)", value: "3" },
    { label: "Planned endpoints", value: "20+" },
    { label: "One key per user", value: "Always" },
    { label: "Rate limiting", value: "Per account" },
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
      icon: "🔑",
      title: "One key, all endpoints",
      text: "Forget juggling workspaces, environments, and projects. Every account gets one primary key that works across the entire API.",
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

/* ========= PRICING & FAQ ========= */

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
          <Link to="/auth" className="btn outline block">
            Start in Playground
          </Link>
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
          <Link to="/auth" className="btn primary block">
            Upgrade to Builder
          </Link>
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

  const [open, setOpen] = useState(0);

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

/* ========= AUTH PAGE ========= */

function AuthPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    const existing = window.localStorage.getItem("veroapi_token");
    if (existing) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Login failed");
      }

      window.localStorage.setItem("veroapi_token", data.token);
      setLoginPassword("");
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");

    try {
      if (signupPassword !== signupConfirm) {
        throw new Error("Passwords do not match.");
      }

      const res = await fetch(`${API_BASE_URL}/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Signup failed");
      }

      window.localStorage.setItem("veroapi_token", data.token);
      setSignupPassword("");
      setSignupConfirm("");
      navigate("/dashboard");
    } catch (err) {
      setSignupError(err.message || "Signup failed");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-inner">
        <div className="auth-copy">
          <h1>Sign in to VeroAPI</h1>
          <p>
            Access your account, manage your single API key, and see usage at a
            glance. Rate limits are tied to your login, not to projects.
          </p>
          <ul className="auth-bullets">
            <li>One API key per account (easy to rotate).</li>
            <li>Perfect for solo builders, bots, and side projects.</li>
            <li>Ready to plug into usage-based billing later.</li>
          </ul>
        </div>

        <div className="auth-card dash-card">
          <div className="dash-card-header">
            <h2>{authMode === "login" ? "Welcome back" : "Create an account"}</h2>
            <span className="dash-tag soft">VeroAPI account</span>
          </div>

          <div className="dash-auth-tabs">
            <button
              className={`dash-auth-tab ${
                authMode === "login" ? "active" : ""
              }`}
              onClick={() => setAuthMode("login")}
            >
              Log in
            </button>
            <button
              className={`dash-auth-tab ${
                authMode === "signup" ? "active" : ""
              }`}
              onClick={() => setAuthMode("signup")}
            >
              Sign up
            </button>
          </div>

          {authMode === "login" ? (
            <form className="dash-login-form" onSubmit={handleLogin}>
              <div className="dash-input-row">
                <label>Email</label>
                <input
                  className="dash-input"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="dash-input-row">
                <label>Password</label>
                <input
                  className="dash-input"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <p className="dash-login-error">{loginError}</p>
              )}
              <button
                className="btn primary dash-login-btn"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? "Signing in…" : "Sign in"}
              </button>
              <p className="dash-login-hint">
                You can always regenerate your key later from the dashboard.
              </p>
            </form>
          ) : (
            <form className="dash-login-form" onSubmit={handleSignup}>
              <div className="dash-input-row">
                <label>Email</label>
                <input
                  className="dash-input"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="dash-input-row">
                <label>Password</label>
                <input
                  className="dash-input"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="dash-input-row">
                <label>Confirm password</label>
                <input
                  className="dash-input"
                  type="password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  required
                />
              </div>
              {signupError && (
                <p className="dash-login-error">{signupError}</p>
              )}
              <button
                className="btn primary dash-login-btn"
                type="submit"
                disabled={signupLoading}
              >
                {signupLoading ? "Creating account…" : "Create account"}
              </button>
              <p className="dash-login-hint">
                Each account automatically gets one primary API key once you
                generate it from the dashboard.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ========= DOCS PAGE (NO EVENTS/WEBHOOKS) ========= */

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

          <p className="docs-section-description">
            Example response:
          </p>
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

/* ========= DASHBOARD (SIMPLIFIED) ========= */

function Dashboard() {
  const navigate = useNavigate();

  const [token, setToken] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("veroapi_token") || ""
  );
  const [user, setUser] = useState(null);

  // API health
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);
  const [healthData, setHealthData] = useState(null);

  // Simple stats (optional backend support)
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Single API key
  const [apiKey, setApiKey] = useState(null); // we only care about one key
  const [keysLoading, setKeysLoading] = useState(false);
  const [keysError, setKeysError] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);
  const [newSecret, setNewSecret] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  // Fetch API health
  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        setHealthLoading(true);
        setHealthError(false);
        const res = await fetch(`${API_BASE_URL}/v1/health`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!cancelled) setHealthData(data);
      } catch {
        if (!cancelled) setHealthError(true);
      } finally {
        if (!cancelled) setHealthLoading(false);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const apiOnline =
    !healthLoading && !healthError && healthData && healthData.ok;

  // Fetch user
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!data.ok) throw new Error("Not ok");
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken("");
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("veroapi_token");
          }
          navigate("/auth");
        }
      }
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  // Fetch single API key (we’ll just use the first one if multiple exist)
  useEffect(() => {
    if (!token) {
      setApiKey(null);
      return;
    }

    let cancelled = false;

    async function fetchKey() {
      try {
        setKeysLoading(true);
        setKeysError("");
        const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load API key");
        }
        if (!cancelled) {
          const first = (data.keys || [])[0] || null;
          setApiKey(first);
        }
      } catch (err) {
        if (!cancelled) {
          setKeysError(err.message || "Failed to load API key");
          setApiKey(null);
        }
      } finally {
        if (!cancelled) setKeysLoading(false);
      }
    }

    fetchKey();
    return () => {
      cancelled = true;
    };
  }, [token]);

  // Fetch stats (if you wired /v1/stats/overview)
  useEffect(() => {
    if (!token) {
      setStats(null);
      return;
    }

    let cancelled = false;

    async function fetchStats() {
      try {
        setStatsLoading(true);
        const res = await fetch(`${API_BASE_URL}/v1/stats/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error();
        if (!cancelled) setStats(data);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  const formatTime = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("veroapi_token");
    }
    navigate("/auth");
  };

  const handleCopySecret = async () => {
    if (!newSecret) return;
    try {
      await navigator.clipboard.writeText(newSecret);
      setCopyMessage("Copied!");
    } catch {
      setCopyMessage("Unable to copy");
    }
    setTimeout(() => setCopyMessage(""), 1200);
  };

  // Generate or regenerate the single key
  const handleGenerateOrRegenerate = async () => {
    if (!token) return;
    setRegenLoading(true);
    setKeysError("");
    setNewSecret("");

    try {
      // If a key exists, revoke it first
      if (apiKey && apiKey.id) {
        try {
          await fetch(`${API_BASE_URL}/v1/api-keys/${apiKey.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // ignore errors; we'll still try to create a new one
        }
      }

      const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ label: "Primary key" }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to generate API key");
      }

      setApiKey(data.key);
      setNewSecret(data.secret);
    } catch (err) {
      setKeysError(err.message || "Failed to generate API key");
    } finally {
      setRegenLoading(false);
    }
  };

  const requestsLast24h = stats?.requests_last_24h ?? null;

  return (
    <section className="dash">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <span className="dash-pill">Account</span>
          <div className="dash-workspace-name">
            <span
              className={`dash-health-dot ${
                healthLoading ? "loading" : apiOnline ? "ok" : "error"
              }`}
            />
            {user ? user.email : "Loading…"}
          </div>
          <div className="dash-env-badge">
            1 primary API key • Rate limit per account
          </div>
          <div className="dash-health">
            {healthLoading && <span>Checking API health…</span>}
            {!healthLoading && healthError && (
              <span>API unreachable from dashboard.</span>
            )}
            {!healthLoading && !healthError && (
              <span>
                API online • uptime {Math.round(healthData?.uptime || 0)}s
              </span>
            )}
          </div>
        </div>

        <nav className="dash-nav">
          <button className="dash-nav-item active">Overview</button>
        </nav>

        <div className="dash-sidebar-foot">
          <p>How to use VeroAPI:</p>
          <ol>
            <li>Generate your primary key</li>
            <li>Paste into your app/bot</li>
            <li>Call any supported endpoint</li>
          </ol>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-main-header">
          <div>
            <h1>Overview</h1>
            <p>
              Manage your single API key and see a quick snapshot of account
              usage.
            </p>
          </div>
          {user ? (
            <button className="btn ghost" onClick={handleLogout}>
              Sign out
            </button>
          ) : (
            <button className="btn primary" onClick={() => navigate("/auth")}>
              Go to sign in
            </button>
          )}
        </header>

        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-label">API status</div>
            <div className="dash-card-value">
              {healthLoading
                ? "Checking…"
                : apiOnline
                ? "Online"
                : "Unavailable"}
            </div>
            <div className="dash-card-sub">
              Health is based on the <code>/v1/health</code> endpoint.
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-label">Requests (last 24h)</div>
            <div className="dash-card-value">
              {statsLoading
                ? "…"
                : requestsLast24h === null
                ? "—"
                : requestsLast24h.toLocaleString()}
            </div>
            <div className="dash-card-sub">
              This is optional and depends on how you implement stats on the
              backend.
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-label">Plan</div>
            <div className="dash-card-value">Playground</div>
            <div className="dash-card-sub">
              1 API key per account • Upgrade later for higher limits.
            </div>
          </div>
        </div>

        <div className="dash-columns">
          <div className="dash-card wide">
            <div className="dash-card-header">
              <h2>Primary API key</h2>
              <span className="dash-tag">
                {keysLoading ? "Loading…" : apiKey ? "Active" : "Not created"}
              </span>
            </div>

            {keysError && (
              <p className="dash-login-error" style={{ marginTop: 4 }}>
                {keysError}
              </p>
            )}

            <p className="dash-login-helper">
              Each account can have exactly one API key at a time. When you
              regenerate, the old key stops working immediately.
            </p>

            <button
              className="btn primary dash-login-btn"
              type="button"
              onClick={handleGenerateOrRegenerate}
              disabled={regenLoading}
            >
              {regenLoading
                ? "Working…"
                : apiKey
                ? "Regenerate API key"
                : "Generate API key"}
            </button>

            {newSecret && (
              <div style={{ marginTop: 10, fontSize: 11 }}>
                <div className="dash-input-row">
                  <label>Your new API key (copy now)</label>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <input
                      className="dash-input"
                      type="text"
                      readOnly
                      value={newSecret}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn outline"
                      onClick={handleCopySecret}
                    >
                      {copyMessage || "Copy"}
                    </button>
                  </div>
                  <p className="dash-login-hint">
                    This is the <strong>only time</strong> we show the full
                    secret. Store it as an environment variable or in your
                    secret manager.
                  </p>
                </div>
              </div>
            )}

            {apiKey && (
              <div style={{ marginTop: 16 }}>
                <div className="dash-table">
                  <div className="dash-table-row head">
                    <span>Label</span>
                    <span>Prefix</span>
                    <span>Created</span>
                    <span>Last used</span>
                  </div>
                  <div className="dash-table-row">
                    <span>{apiKey.label || "Primary key"}</span>
                    <span>{apiKey.prefix}</span>
                    <span>{formatTime(apiKey.created_at)}</span>
                    <span>{formatTime(apiKey.last_used_at)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <h2>Quickstart</h2>
              <span className="dash-tag soft">Random endpoints</span>
            </div>
            <ol className="dash-steps">
              <li>
                <strong>Generate your key</strong> from this page.
              </li>
              <li>
                <strong>Paste into your app</strong> as an env var, e.g.{" "}
                <code>VEROAPI_KEY</code>.
              </li>
              <li>
                <strong>Call an endpoint</strong> like{" "}
                <code>POST /v1/text/scramble</code>.
              </li>
            </ol>
            <p className="dash-login-hint" style={{ marginTop: 10 }}>
              As you add more endpoints (Discord XP helpers, game rewards,
              etc.), you’ll document them in the Docs tab and call them with the
              exact same key.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========= FOOTER ========= */

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
        <Link to="/docs">Docs</Link>
        <a href="#status">Status</a>
        <a href="#changelog">Changelog</a>
        <a href="#legal">Privacy</a>
      </div>
    </footer>
  );
}

export default App;

