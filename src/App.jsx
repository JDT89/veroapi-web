import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./styles.css";

// Set this to your real Render API URL or custom domain
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
          <Link to="/auth" className="btn primary hero-primary nav-btn-link">
            Start free (100k req / mo)
          </Link>
          <a href="#pricing" className="btn outline hero-secondary nav-btn-link">
            View pricing
          </a>
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
    cURL: `curl ${API_BASE_URL}/v1/events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Workspace: prod" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "user.signup",
    "user_id": "u_123",
    "source": "dashboard"
  }'`,
    "Node.js": `import axios from "axios";

const vero = axios.create({
  baseURL: "${API_BASE_URL}/v1",
  headers: {
    Authorization: "Bearer YOUR_API_KEY",
    "X-Workspace": "prod",
  },
});

await vero.post("/events", {
  type: "user.signup",
  user_id: "u_123",
  source: "dashboard",
});`,
    Python: `import requests

session = requests.Session()
session.headers.update({
  "Authorization": "Bearer YOUR_API_KEY",
  "X-Workspace": "prod",
})

session.post(
  "${API_BASE_URL}/v1/events",
  json={"type": "user.signup", "user_id": "u_123", "source": "dashboard"},
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

/* ========= TRUST / FEATURES ========= */

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
          <li>Copy-paste snippets for every major language &amp; framework.</li>
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

/* ========= PRICING & FAQ ========= */

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
          <p className="pricing-sub">Perfect for prototypes &amp; side projects.</p>
          <ul>
            <li>100k requests / month</li>
            <li>Single workspace</li>
            <li>Basic email support</li>
          </ul>
          <Link to="/auth" className="btn outline block">
            Start in sandbox
          </Link>
        </div>

        <div className="pricing-card pricing-featured">
          <span className="pricing-tag accent">Most popular</span>
          <h3>Scale</h3>
          <p className="pricing-price">$39</p>
          <p className="pricing-sub">Up to 5M requests / month.</p>
          <ul>
            <li>Unlimited workspaces</li>
            <li>Custom rate limits &amp; routing</li>
            <li>Priority support &amp; Slack channel</li>
          </ul>
          <Link to="/auth" className="btn primary block">
            Upgrade to Scale
          </Link>
        </div>

        <div className="pricing-card">
          <span className="pricing-tag">Enterprise</span>
          <h3>Orbit</h3>
          <p className="pricing-price">Let’s talk</p>
          <p className="pricing-sub">
            For banks, unicorns, and serious infra folks.
          </p>
          <ul>
            <li>Dedicated region &amp; VPC peering</li>
            <li>Custom SLAs &amp; compliance</li>
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
            Access your dashboard, API keys, and workspaces. Your account lives
            in your VeroAPI Postgres database.
          </p>
          <ul className="auth-bullets">
            <li>One account for all environments &amp; workspaces.</li>
            <li>Tokens stored locally in your browser, not on this UI.</li>
            <li>Ready to wire into Stripe or your own billing later.</li>
          </ul>
        </div>

        <div className="auth-card dash-card">
          <div className="dash-card-header">
            <h2>{authMode === "login" ? "Welcome back" : "Create an account"}</h2>
            <span className="dash-tag soft">VeroAPI dashboard</span>
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
                Forgot your password? Swap to your own auth provider later—this
                flow is fully yours.
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
                Accounts are stored securely in your VeroAPI Postgres database.
                Later you can attach workspaces, environments, and billing.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ========= DOCS PAGE ========= */

function DocsPage() {
  const baseUrl = `${API_BASE_URL}/v1`;

  const curlExample = `curl ${baseUrl}/events \\
  -H "Authorization: Bearer vero_live_xxx" \\
  -H "X-Workspace: prod" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "user.signup",
    "user_id": "u_123",
    "source": "web-app"
  }'`;

  const nodeExample = `import axios from "axios";

const vero = axios.create({
  baseURL: "${baseUrl}",
  headers: {
    Authorization: "Bearer vero_live_xxx",
    "X-Workspace": "prod",
  },
});

await vero.post("/events", {
  type: "user.signup",
  user_id: "u_123",
  source: "web-app",
});`;

  const errorExample = `{
  "ok": false,
  "error": "Rate limit exceeded for environment 'prod'"
}`;

  return (
    <section className="auth-page">
      <div className="auth-inner">
        <div className="auth-copy">
          <h1>VeroAPI Docs</h1>
          <p>
            Use VeroAPI as the event + webhook layer for your product. These
            docs cover everything you need to send your first event in under 2
            minutes.
          </p>
          <ul className="auth-bullets">
            <li>Step 1 – Create an account &amp; workspace.</li>
            <li>Step 2 – Create an API key from the dashboard.</li>
            <li>Step 3 – Send events to <code>/v1/events</code>.</li>
          </ul>
        </div>

        <div className="auth-card dash-card">
          <div className="dash-card-header">
            <h2>1. Base URL & authentication</h2>
            <span className="dash-tag soft">REST v1</span>
          </div>

          <div className="dash-login-form">
            <div className="dash-input-row">
              <label>Base URL</label>
              <p className="dash-login-helper">
                All requests are made over HTTPS. For your deployment:
              </p>
              <pre className="code-body">
                <code>{baseUrl}</code>
              </pre>
            </div>

            <div className="dash-input-row">
              <label>Authentication</label>
              <p className="dash-login-helper">
                Create an API key from the dashboard (
                <strong>Overview → API keys</strong>), then send it in the{" "}
                <code>Authorization</code> header:
              </p>
              <pre className="code-body">
                <code>{`Authorization: Bearer vero_live_xxx`}</code>
              </pre>
              <p className="dash-login-hint">
                Keys are scoped to your account and workspace. The secret value
                is shown only once—store it in your secret manager.
              </p>
            </div>

            <hr style={{ borderColor: "rgba(148,163,184,0.2)", margin: "16px 0" }} />

            <div className="dash-input-row">
              <label>Environments (workspaces)</label>
              <p className="dash-login-helper">
                Environments are lightweight tags attached via{" "}
                <code>X-Workspace</code>. Common examples:
              </p>
              <pre className="code-body">
                <code>{`X-Workspace: prod
X-Workspace: staging
X-Workspace: dev`}</code>
              </pre>
              <p className="dash-login-hint">
                Rate limits are applied <strong>per environment</strong>, so you
                can test in <code>staging</code> without burning through{" "}
                <code>prod</code> quota.
              </p>
            </div>

            <hr style={{ borderColor: "rgba(148,163,184,0.2)", margin: "16px 0" }} />

            <div className="dash-input-row">
              <label>Send your first event</label>
              <p className="dash-login-helper">
                Fire a <code>user.signup</code> event and you’ll see it appear
                in the <strong>Events</strong> tab of the dashboard:
              </p>
              <pre className="code-body">
                <code>{curlExample}</code>
              </pre>
            </div>

            <div className="dash-input-row">
              <label>Node.js example</label>
              <pre className="code-body">
                <code>{nodeExample}</code>
              </pre>
            </div>

            <hr style={{ borderColor: "rgba(148,163,184,0.2)", margin: "16px 0" }} />

            <div className="dash-input-row">
              <label>Rate limits</label>
              <p className="dash-login-helper">
                On the free tier, each environment gets a generous default:
              </p>
              <ul className="auth-bullets" style={{ marginTop: 4 }}>
                <li>100 requests / minute</li>
                <li>100,000 requests / day</li>
              </ul>
              <p className="dash-login-hint">
                If you exceed these, you’ll receive <code>429</code> responses.
                You can see usage per environment in{" "}
                <strong>Usage &amp; limits</strong> in the dashboard.
              </p>
            </div>

            <hr style={{ borderColor: "rgba(148,163,184,0.2)", margin: "16px 0" }} />

            <div className="dash-input-row">
              <label>Errors</label>
              <p className="dash-login-helper">
                Errors are simple and predictable. Every error has{" "}
                <code>ok: false</code> and a human-readable message:
              </p>
              <pre className="code-body">
                <code>{errorExample}</code>
              </pre>
              <p className="dash-login-hint">
                You can safely bubble this up to logs or your own monitoring
                system. For user-facing messages, map them to your own copy.
              </p>
            </div>

            <hr style={{ borderColor: "rgba(148,163,184,0.2)", margin: "16px 0" }} />

            <div className="dash-input-row">
              <label>Webhooks (high level)</label>
              <p className="dash-login-helper">
                When you enable webhooks in the dashboard, events are delivered
                to your HTTPS endpoint with a signed payload:
              </p>
              <pre className="code-body">
                <code>{`POST https://your-service.com/webhooks/vero
Content-Type: application/json
X-VeroAPI-Signature: t=TIMESTAMP,v1=HMAC_HEX`}</code>
              </pre>
              <p className="dash-login-hint">
                Use the secret shown in your webhook settings to validate the
                HMAC and make sure the request really came from VeroAPI. Retries
                and delivery logs are visible in the <strong>Webhooks</strong>{" "}
                tab.
              </p>
            </div>

            <div className="dash-input-row">
              <label>Where to go next</label>
              <p className="dash-login-helper">
                Once you have events flowing, you can:
              </p>
              <ul className="auth-bullets" style={{ marginTop: 4 }}>
                <li>Wire your product events into internal tooling via webhooks.</li>
                <li>Use the <strong>Events</strong> tab to debug live traffic.</li>
                <li>Use <strong>Usage &amp; limits</strong> to stay ahead of bursts.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========= DASHBOARD ========= */

// (Dashboard component unchanged from previous version)

function Dashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("veroapi_token") || "";
  });
  const [user, setUser] = useState(null);

  const [workspaceName, setWorkspaceName] = useState("Main workspace");
  const [workspaceInput, setWorkspaceInput] = useState("Main workspace");
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceSaving, setWorkspaceSaving] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");

  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);
  const [healthData, setHealthData] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  const [usageEnvs, setUsageEnvs] = useState([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState("");

  const [eventsList, setEventsList] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");

  const [keys, setKeys] = useState([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [keysError, setKeysError] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [newSecret, setNewSecret] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [revokingId, setRevokingId] = useState(null);

  const [webhooks, setWebhooks] = useState([]);
  const [webhooksLoading, setWebhooksLoading] = useState(false);
  const [webhooksError, setWebhooksError] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookDescription, setNewWebhookDescription] = useState("");
  const [creatingWebhook, setCreatingWebhook] = useState(false);
  const [deactivatingWebhookId, setDeactivatingWebhookId] = useState(null);

  const [deliveries, setDeliveries] = useState([]);
  const [deliveriesLoading, setDeliveriesLoading] = useState(false);
  const [deliveriesError, setDeliveriesError] = useState("");

  const [sendingEvent, setSendingEvent] = useState(false);
  const [eventMessage, setEventMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        setHealthLoading(true);
        setHealthError(false);
        const res = await fetch(`${API_BASE_URL}/v1/health`);
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setHealthData(data);
        }
      } catch (err) {
        if (!cancelled) {
          setHealthError(true);
        }
      } finally {
        if (!cancelled) {
          setHealthLoading(false);
        }
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

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    let cancelled = false;

    async function loadUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        const data = await res.json();
        if (!data.ok) {
          throw new Error("Not ok");
        }

        if (!cancelled) {
          setUser(data.user);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          setToken("");
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("veroapi_token");
          }
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setWorkspaceName("Main workspace");
      setWorkspaceInput("Main workspace");
      return;
    }

    let cancelled = false;

    async function fetchWorkspace() {
      try {
        setWorkspaceLoading(true);
        setWorkspaceError("");
        const res = await fetch(`${API_BASE_URL}/v1/workspace`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load workspace");
        }
        if (!cancelled) {
          const name = data.workspace?.name || "Main workspace";
          setWorkspaceName(name);
          setWorkspaceInput(name);
        }
      } catch (err) {
        if (!cancelled) {
          setWorkspaceError(err.message || "Failed to load workspace");
        }
      } finally {
        if (!cancelled) {
          setWorkspaceLoading(false);
        }
      }
    }

    fetchWorkspace();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setKeys([]);
      return;
    }

    let cancelled = false;

    async function fetchKeys() {
      try {
        setKeysLoading(true);
        setKeysError("");
        const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load API keys");
        }
        if (!cancelled) {
          setKeys(data.keys || []);
        }
      } catch (err) {
        if (!cancelled) {
          setKeysError(err.message || "Failed to load API keys");
        }
      } finally {
        if (!cancelled) {
          setKeysLoading(false);
        }
      }
    }

    fetchKeys();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setStats(null);
      return;
    }

    let cancelled = false;

    async function fetchStats() {
      try {
        setStatsLoading(true);
        setStatsError("");
        const res = await fetch(`${API_BASE_URL}/v1/stats/overview`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load stats");
        }
        if (!cancelled) {
          setStats(data);
        }
      } catch (err) {
        if (!cancelled) {
          setStatsError(err.message || "Failed to load stats");
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUsageEnvs([]);
      return;
    }

    let cancelled = false;

    async function fetchUsage() {
      try {
        setUsageLoading(true);
        setUsageError("");
        const res = await fetch(`${API_BASE_URL}/v1/stats/usage`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load usage");
        }
        if (!cancelled) {
          setUsageEnvs(data.per_environment || []);
        }
      } catch (err) {
        if (!cancelled) {
          setUsageError(err.message || "Failed to load usage");
        }
      } finally {
        if (!cancelled) {
          setUsageLoading(false);
        }
      }
    }

    fetchUsage();
    const interval = setInterval(fetchUsage, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setEventsList([]);
      return;
    }

    let cancelled = false;

    async function fetchEvents() {
      try {
        setEventsLoading(true);
        setEventsError("");
        const res = await fetch(
          `${API_BASE_URL}/v1/events/recent?limit=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load events");
        }
        if (!cancelled) {
          setEventsList(data.events || []);
        }
      } catch (err) {
        if (!cancelled) {
          setEventsError(err.message || "Failed to load events");
        }
      } finally {
        if (!cancelled) {
          setEventsLoading(false);
        }
      }
    }

    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setWebhooks([]);
      setDeliveries([]);
      return;
    }

    let cancelled = false;

    async function fetchWebhooks() {
      try {
        setWebhooksLoading(true);
        setWebhooksError("");
        const res = await fetch(`${API_BASE_URL}/v1/webhooks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load webhooks");
        }
        if (!cancelled) {
          setWebhooks(data.webhooks || []);
        }
      } catch (err) {
        if (!cancelled) {
          setWebhooksError(err.message || "Failed to load webhooks");
        }
      } finally {
        if (!cancelled) {
          setWebhooksLoading(false);
        }
      }
    }

    async function fetchDeliveries() {
      try {
        setDeliveriesLoading(true);
        setDeliveriesError("");
        const res = await fetch(
          `${API_BASE_URL}/v1/webhooks/deliveries?limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load deliveries");
        }
        if (!cancelled) {
          setDeliveries(data.deliveries || []);
        }
      } catch (err) {
        if (!cancelled) {
          setDeliveriesError(err.message || "Failed to load deliveries");
        }
      } finally {
        if (!cancelled) {
          setDeliveriesLoading(false);
        }
      }
    }

    fetchWebhooks();
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [token]);

  const handleLogout = () => {
    setToken("");
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("veroapi_token");
    }
    navigate("/auth");
  };

  const formatTime = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const [keysErrorState, setKeysErrorState] = useState("");

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (!newLabel.trim() || !token) return;

    setCreatingKey(true);
    setKeysError("");
    setNewSecret("");
    try {
      const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ label: newLabel.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to create API key");
      }

      setKeys((prev) => [data.key, ...prev]);
      setNewSecret(data.secret);
      setNewLabel("");
    } catch (err) {
      setKeysError(err.message || "Failed to create API key");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (id) => {
    if (!id || !token) return;
    setRevokingId(id);
    setKeysError("");
    try {
      const res = await fetch(`${API_BASE_URL}/v1/api-keys/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to revoke API key");
      }
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } catch (err) {
      setKeysError(err.message || "Failed to revoke API key");
    } finally {
      setRevokingId(null);
    }
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

  const handleSendTestEvent = async () => {
    setSendingEvent(true);
    setEventMessage(null);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "X-Workspace": "prod",
        },
        body: JSON.stringify({
          type: "dashboard.test_event",
          user_id: user?.id || "demo_user",
          source: "dashboard",
        }),
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      const data = await res.json();
      setEventMessage(
        `Test event accepted in "${data.environment}" at ${
          data.received_at || "VeroAPI backend"
        }.`
      );
    } catch (err) {
      setEventMessage(
        "Failed to send test event. Check your API URL and backend status."
      );
    } finally {
      setSendingEvent(false);
    }
  };

  const handleWorkspaceSave = async (e) => {
    e.preventDefault();
    if (!token) return;
    const name = workspaceInput.trim();
    if (!name) return;
    setWorkspaceSaving(true);
    setWorkspaceError("");
    try {
      const res = await fetch(`${API_BASE_URL}/v1/workspace`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to update workspace");
      }
      const newName = data.workspace?.name || name;
      setWorkspaceName(newName);
      setWorkspaceInput(newName);
    } catch (err) {
      setWorkspaceError(err.message || "Failed to update workspace");
    } finally {
      setWorkspaceSaving(false);
    }
  };

  const handleCreateWebhook = async (e) => {
    e.preventDefault();
    if (!token) return;
    const url = newWebhookUrl.trim();
    if (!url) return;

    setCreatingWebhook(true);
    setWebhooksError("");
    try {
      const res = await fetch(`${API_BASE_URL}/v1/webhooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          description: newWebhookDescription.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to create webhook");
      }
      setWebhooks((prev) => [data.webhook, ...prev]);
      setNewWebhookUrl("");
      setNewWebhookDescription("");
    } catch (err) {
      setWebhooksError(err.message || "Failed to create webhook");
    } finally {
      setCreatingWebhook(false);
    }
  };

  const handleDeactivateWebhook = async (id) => {
    if (!token || !id) return;
    setDeactivatingWebhookId(id);
    setWebhooksError("");
    try {
      const res = await fetch(`${API_BASE_URL}/v1/webhooks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to deactivate webhook");
      }
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      setWebhooksError(err.message || "Failed to deactivate webhook");
    } finally {
      setDeactivatingWebhookId(null);
    }
  };

  const requestsLast24h = stats?.requests_last_24h ?? 0;
  const errorRate = stats?.error_rate ?? 0;
  const medianLatency = stats?.median_latency_ms ?? 80;

  let headerTitle = "Overview";
  let headerSubtitle =
    "High-level view of your traffic, keys, and recent activity.";

  if (activeSection === "usage") {
    headerTitle = "Usage & limits";
    headerSubtitle =
      "Per-environment usage for this workspace. Upgrade later for higher caps.";
  } else if (activeSection === "webhooks") {
    headerTitle = "Webhooks";
    headerSubtitle =
      "Fan out VeroAPI events to your own services in real time.";
  } else if (activeSection === "events") {
    headerTitle = "Events";
    headerSubtitle =
      "Recent events flowing through this workspace, across environments.";
  }

  return (
    <section className="dash">
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <span className="dash-pill">Workspace</span>
          <div className="dash-workspace-name">
            <span
              className={`dash-health-dot ${
                healthLoading ? "loading" : apiOnline ? "ok" : "error"
              }`}
            />
            {workspaceLoading ? "Loading…" : workspaceName}
          </div>
          <div className="dash-env-badge">
            Rate limits per environment (prod / staging / dev)
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
          <button
            className={`dash-nav-item ${
              activeSection === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveSection("overview")}
          >
            Overview
          </button>
          <button
            className={`dash-nav-item ${
              activeSection === "events" ? "active" : ""
            }`}
            onClick={() => setActiveSection("events")}
          >
            Events
          </button>
          <button
            className={`dash-nav-item ${
              activeSection === "usage" ? "active" : ""
            }`}
            onClick={() => setActiveSection("usage")}
          >
            Usage &amp; limits
          </button>
          <button
            className={`dash-nav-item ${
              activeSection === "webhooks" ? "active" : ""
            }`}
            onClick={() => setActiveSection("webhooks")}
          >
            Webhooks
          </button>
          <button className="dash-nav-item" disabled>
            Audit log (soon)
          </button>
        </nav>
        <div className="dash-sidebar-foot">
          <p>Next up: connect VeroAPI to your app in 3 steps.</p>
          <ol>
            <li>Create a key</li>
            <li>Paste into your app</li>
            <li>Send your first event</li>
          </ol>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-main-header">
          <div>
            <h1>{headerTitle}</h1>
            <p>{headerSubtitle}</p>
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

        {activeSection === "overview" && (
          <>
            {statsError && (
              <p className="dash-login-error" style={{ marginTop: 4 }}>
                {statsError}
              </p>
            )}

            <div className="dash-grid">
              <div className="dash-card">
                <div className="dash-card-label">Requests (last 24 hours)</div>
                <div className="dash-card-value">
                  {statsLoading ? "…" : requestsLast24h.toLocaleString()}
                </div>
                <div className="dash-card-sub">
                  Based on stored <code>/v1/events</code> for this workspace.
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-label">Error rate</div>
                <div className="dash-card-value">
                  {statsLoading ? "…" : `${errorRate.toFixed(2)}%`}
                </div>
                <div className="dash-card-sub">
                  Rejected vs accepted events (tracking coming next).
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-label">Median latency</div>
                <div className="dash-card-value">
                  {statsLoading ? "…" : `${medianLatency} ms`}
                </div>
                <div className="dash-card-sub">
                  Sampled across your recent requests.
                </div>
              </div>
            </div>

            <div className="dash-columns">
              <div className="dash-card wide">
                <div className="dash-card-header">
                  <h2>API keys</h2>
                  <span className="dash-tag">
                    {keysLoading ? "Loading…" : "Redacted for safety"}
                  </span>
                </div>

                <form className="dash-login-form" onSubmit={handleCreateKey}>
                  <div className="dash-input-row">
                    <label>Label</label>
                    <input
                      className="dash-input"
                      type="text"
                      placeholder="e.g. Backend server, Discord bot"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      required
                    />
                  </div>
                  {keysError && (
                    <p className="dash-login-error">{keysError}</p>
                  )}
                  <button
                    className="btn primary dash-login-btn"
                    type="submit"
                    disabled={creatingKey || !token}
                  >
                    {creatingKey ? "Creating key…" : "Create API key"}
                  </button>
                </form>

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
                        secret. Store it in your secret manager.
                      </p>
                    </div>
                  </div>
                )}

                <div className="dash-table" style={{ marginTop: 12 }}>
                  <div className="dash-table-row head">
                    <span>Label</span>
                    <span>Prefix</span>
                    <span>Created</span>
                    <span>Last used</span>
                  </div>

                  {keysLoading ? (
                    <div className="dash-table-row">
                      <span>Loading…</span>
                      <span>—</span>
                      <span>—</span>
                      <span>—</span>
                    </div>
                  ) : keys.length === 0 ? (
                    <div className="dash-table-row">
                      <span>No keys yet</span>
                      <span>—</span>
                      <span>—</span>
                      <span>—</span>
                    </div>
                  ) : (
                    keys.map((key) => (
                      <div className="dash-table-row" key={key.id}>
                        <span>{key.label}</span>
                        <span>{key.prefix}</span>
                        <span>{formatTime(key.created_at)}</span>
                        <span>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <span>{formatTime(key.last_used_at)}</span>
                            <button
                              type="button"
                              className="btn ghost"
                              style={{ padding: "2px 8px", fontSize: 10 }}
                              onClick={() => handleRevokeKey(key.id)}
                              disabled={revokingId === key.id}
                            >
                              {revokingId === key.id ? "Revoking…" : "Revoke"}
                            </button>
                          </div>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2>Account & workspace</h2>
                  {user && (
                    <span className="dash-tag soft">
                      {workspaceLoading ? "Loading…" : workspaceName}
                    </span>
                  )}
                </div>

                {user ? (
                  <>
                    <div className="dash-login-status">
                      <div className="dash-login-line">
                        <span className="dash-login-label">Email</span>
                        <span className="dash-login-value">
                          {user.email}
                        </span>
                      </div>
                      <p className="dash-login-helper">
                        This account is stored in your VeroAPI Postgres
                        database. Later, you can attach more workspaces,
                        environments, and billing.
                      </p>
                    </div>

                    <form
                      className="dash-login-form"
                      onSubmit={handleWorkspaceSave}
                    >
                      <div className="dash-input-row">
                        <label>Workspace name</label>
                        <input
                          className="dash-input"
                          type="text"
                          value={workspaceInput}
                          onChange={(e) =>
                            setWorkspaceInput(e.target.value)
                          }
                          placeholder="e.g. VeroAPI production"
                        />
                      </div>
                      {workspaceError && (
                        <p className="dash-login-error">
                          {workspaceError}
                        </p>
                      )}
                      <button
                        className="btn outline dash-login-btn"
                        type="submit"
                        disabled={workspaceSaving}
                      >
                        {workspaceSaving
                          ? "Saving…"
                          : "Save workspace name"}
                      </button>
                    </form>
                  </>
                ) : (
                  <p className="dash-login-helper">
                    Loading your account… if this takes longer than a few
                    seconds, check that your VeroAPI backend is running and your
                    token is valid.
                  </p>
                )}
              </div>
            </div>

            <div className="dash-card">
              <div className="dash-card-header">
                <h2>Quickstart</h2>
              </div>
              <ol className="dash-steps">
                <li>
                  <strong>Grab your API key</strong>
                  <span> – keys are scoped by workspace and environment.</span>
                </li>
                <li>
                  <strong>Paste into your app</strong>
                  <span> – use the snippets from the homepage or docs.</span>
                </li>
                <li>
                  <strong>Send an event</strong>
                  <span>
                    {" "}
                    – for example, <code>user.signup</code> when a new user
                    joins.
                  </span>
                </li>
              </ol>

              <button
                className="btn outline dash-quickstart-btn"
                onClick={handleSendTestEvent}
                disabled={sendingEvent}
              >
                {sendingEvent
                  ? "Sending test event…"
                  : "Send test event to VeroAPI"}
              </button>
              {eventMessage && (
                <p className="dash-event-status">{eventMessage}</p>
              )}
            </div>
          </>
        )}

        {activeSection === "events" && (
          <div className="dash-card wide">
            <div className="dash-card-header">
              <h2>Recent events</h2>
              <span className="dash-tag soft">
                Last {eventsList.length || 0} events across environments
              </span>
            </div>
            {eventsError && (
              <p className="dash-login-error" style={{ marginTop: 4 }}>
                {eventsError}
              </p>
            )}

            <div className="dash-table" style={{ marginTop: 12 }}>
              <div className="dash-table-row head">
                <span>Type</span>
                <span>User</span>
                <span>Source</span>
                <span>Environment</span>
                <span>When</span>
              </div>

              {eventsLoading ? (
                <div className="dash-table-row">
                  <span>Loading…</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>
              ) : eventsList.length === 0 ? (
                <div className="dash-table-row">
                  <span>No events yet</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>
              ) : (
                eventsList.map((ev) => (
                  <div className="dash-table-row" key={ev.id}>
                    <span>{ev.type}</span>
                    <span>{ev.user_id || "—"}</span>
                    <span>{ev.source || "—"}</span>
                    <span>{ev.environment}</span>
                    <span>{formatTime(ev.created_at)}</span>
                  </div>
                ))
              )}
            </div>

            <p className="dash-login-hint" style={{ marginTop: 16 }}>
              This table is backed by your <code>vero_events</code> table in
              Postgres. Later we can add filtering, search, and per-tenant
              drilldown.
            </p>
          </div>
        )}

        {activeSection === "usage" && (
          <div className="dash-card wide">
            <div className="dash-card-header">
              <h2>Usage &amp; limits</h2>
              <span className="dash-tag soft">
                Free plan: 100 req/min, 100k/day per environment
              </span>
            </div>
            {usageError && (
              <p className="dash-login-error" style={{ marginTop: 4 }}>
                {usageError}
              </p>
            )}

            <div className="dash-table" style={{ marginTop: 12 }}>
              <div className="dash-table-row head">
                <span>Environment</span>
                <span>Last 24 hours</span>
                <span>Daily limit</span>
                <span>Usage</span>
              </div>

              {usageLoading ? (
                <div className="dash-table-row">
                  <span>Loading…</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>
              ) : usageEnvs.length === 0 ? (
                <div className="dash-table-row">
                  <span>No usage yet</span>
                  <span>0</span>
                  <span>100,000</span>
                  <span>0%</span>
                </div>
              ) : (
                usageEnvs.map((env) => {
                  const used = env.last_24h || 0;
                  const limit = env.limit_per_day || 100000;
                  const pct = Math.min(
                    100,
                    Math.round((used / limit) * 100)
                  );

                  return (
                    <div className="dash-table-row" key={env.environment}>
                      <span>{env.environment}</span>
                      <span>{used.toLocaleString()}</span>
                      <span>{limit.toLocaleString()}</span>
                      <span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.08)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                borderRadius: 999,
                                background:
                                  pct < 70
                                    ? "#22c55e"
                                    : pct < 90
                                    ? "#eab308"
                                    : "#ef4444",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 11, opacity: 0.85 }}>
                            {pct}% of daily limit
                          </span>
                        </div>
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <p className="dash-login-hint" style={{ marginTop: 16 }}>
              Later, you can introduce paid plans with higher per-environment
              limits and additional workspaces—without changing your client's
              integration (they already send <code>X-Workspace</code>).
            </p>
          </div>
        )}

        {activeSection === "webhooks" && (
          <div className="dash-card wide">
            <div className="dash-card-header">
              <h2>Webhooks</h2>
              <span className="dash-tag soft">
                Deliver VeroAPI events to your own services
              </span>
            </div>

            <form className="dash-login-form" onSubmit={handleCreateWebhook}>
              <div className="dash-input-row">
                <label>Webhook URL</label>
                <input
                  className="dash-input"
                  type="url"
                  placeholder="https://your-service.com/webhooks/vero"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  required
                />
              </div>
              <div className="dash-input-row">
                <label>Description (optional)</label>
                <input
                  className="dash-input"
                  type="text"
                  placeholder="e.g. Production backend, Discord worker, etc."
                  value={newWebhookDescription}
                  onChange={(e) =>
                    setNewWebhookDescription(e.target.value)
                  }
                />
              </div>
              {webhooksError && (
                <p className="dash-login-error">{webhooksError}</p>
              )}
              <button
                className="btn primary dash-login-btn"
                type="submit"
                disabled={creatingWebhook || !token}
              >
                {creatingWebhook ? "Creating webhook…" : "Add webhook"}
              </button>
              <p className="dash-login-hint">
                We sign each request with <code>X-VeroAPI-Signature</code> so
                you can verify authenticity.
              </p>
            </form>

            <div
              style={{
                marginTop: 18,
                marginBottom: 6,
                fontSize: 12,
                opacity: 0.85,
              }}
            >
              Active endpoints
            </div>
            <div className="dash-table">
              <div className="dash-table-row head">
                <span>URL</span>
                <span>Description</span>
                <span>Created</span>
                <span>Last delivery</span>
              </div>

              {webhooksLoading ? (
                <div className="dash-table-row">
                  <span>Loading…</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>
              ) : webhooks.length === 0 ? (
                <div className="dash-table-row">
                  <span>No active webhooks</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>
              ) : (
                webhooks.map((wh) => (
                  <div className="dash-table-row" key={wh.id}>
                    <span
                      title={wh.url}
                      style={{
                        maxWidth: 220,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {wh.url}
                    </span>
                    <span
                      style={{
                        maxWidth: 180,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {wh.description || "—"}
                    </span>
                    <span>{formatTime(wh.created_at)}</span>
                    <span>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <span>{formatTime(wh.last_delivery_at)}</span>
                        <button
                          type="button"
                          className="btn ghost"
                          style={{ padding: "2px 8px", fontSize: 10 }}
                          onClick={() =>
                            handleDeactivateWebhook(wh.id)
                          }
                          disabled={deactivatingWebhookId === wh.id}
                        >
                          {deactivatingWebhookId === wh.id
                            ? "Deactivating…"
                            : "Deactivate"}
                        </button>
                      </div>
                    </span>
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                marginTop: 24,
                marginBottom: 6,
                fontSize: 12,
                opacity: 0.85,
              }}
            >
              Recent deliveries
            </div>
            <div className="dash-table">
              <div className="dash-table-row head">
                <span>Status</span>
                <span>Endpoint</span>
                <span>Event type</span>
                <span>When</span>
              </div>

              {deliveriesLoading ? (
                <div className="dash-table-row">
                  <span>Loading…</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>
              ) : deliveries.length === 0 ? (
                <div className="dash-table-row">
                  <span>No deliveries yet</span>
                  <span>—</span>
                  <span>—</span>
                  <span>—</span>
                </div>
              ) : (
                deliveries.map((d) => (
                  <div className="dash-table-row" key={d.id}>
                    <span
                      style={{
                        color:
                          d.status_code && d.status_code >= 400
                            ? "#f97373"
                            : "#4ade80",
                      }}
                    >
                      {d.status_code ?? "ERR"}
                    </span>
                    <span
                      title={d.webhook_url || ""}
                      style={{
                        maxWidth: 220,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.webhook_url || "—"}
                    </span>
                    <span>{d.event_type || "—"}</span>
                    <span>{formatTime(d.created_at)}</span>
                  </div>
                ))
              )}
            </div>
            {deliveriesError && (
              <p className="dash-login-error" style={{ marginTop: 4 }}>
                {deliveriesError}
              </p>
            )}
          </div>
        )}
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

