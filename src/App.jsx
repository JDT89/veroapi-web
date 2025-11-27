import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./styles.css";

// Set this to your real Render API URL or custom domain
// e.g. "https://veroapi-api.onrender.com" or "https://api.veroapi.com"
const API_BASE_URL = "https://veroapi-api.onrender.com";

function App() {
  return (
    <div className="app-root">
      <div className="halo-bg" />
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<LandingLayout />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
        </nav>

        <div className="nav-actions">
          <Link to="/dashboard" className="btn ghost nav-btn-link">
            Sign in
          </Link>
          <Link to="/dashboard" className="btn primary nav-btn-link">
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
          <Link
            to="/dashboard"
            className="btn primary hero-primary nav-btn-link"
          >
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

/* ========= DASHBOARD ========= */

function Dashboard() {
  // API health
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);
  const [healthData, setHealthData] = useState(null);

  // Auth state
  const [token, setToken] = useState(
    () => window.localStorage.getItem("veroapi_token") || ""
  );
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  // Test event
  const [sendingEvent, setSendingEvent] = useState(false);
  const [eventMessage, setEventMessage] = useState(null);

  // Check API health
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

  // Fetch current user when token changes
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
          window.localStorage.removeItem("veroapi_token");
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [token]);

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

      setToken(data.token);
      window.localStorage.setItem("veroapi_token", data.token);
      setUser(data.user);
      setLoginPassword("");
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

      setToken(data.token);
      window.localStorage.setItem("veroapi_token", data.token);
      setUser(data.user);
      setSignupPassword("");
      setSignupConfirm("");
      setAuthMode("login");
    } catch (err) {
      setSignupError(err.message || "Signup failed");
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    window.localStorage.removeItem("veroapi_token");
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
        `Test event accepted at ${data.received_at || "VeroAPI backend"}.`
      );
    } catch (err) {
      setEventMessage(
        "Failed to send test event. Check your API URL and backend status."
      );
    } finally {
      setSendingEvent(false);
    }
  };

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
            veroapi-prod
          </div>
          <div className="dash-env-badge">Production</div>
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
          <button className="dash-nav-item" disabled>
            API keys (soon)
          </button>
          <button className="dash-nav-item" disabled>
            Usage &amp; limits (soon)
          </button>
          <button className="dash-nav-item" disabled>
            Webhooks (soon)
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
            <h1>Overview</h1>
            <p>High-level view of your traffic, keys, and recent activity.</p>
          </div>
          {user ? (
            <button className="btn ghost" onClick={handleLogout}>
              Sign out
            </button>
          ) : (
            <button className="btn primary">Create API key</button>
          )}
        </header>

        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-label">Requests (last 24 hours)</div>
            <div className="dash-card-value">182,940</div>
            <div className="dash-card-sub">+12.4% vs previous 24h</div>
          </div>

          <div className="dash-card">
            <div className="dash-card-label">Error rate</div>
            <div className="dash-card-value">0.21%</div>
            <div className="dash-card-sub">2 incidents muted</div>
          </div>

          <div className="dash-card">
            <div className="dash-card-label">Median latency</div>
            <div className="dash-card-value">79 ms</div>
            <div className="dash-card-sub">Globally, across all regions</div>
          </div>
        </div>

        <div className="dash-columns">
          <div className="dash-card wide">
            <div className="dash-card-header">
              <h2>API keys</h2>
              <span className="dash-tag">Redacted for safety</span>
            </div>
            <div className="dash-table">
              <div className="dash-table-row head">
                <span>Label</span>
                <span>Prefix</span>
                <span>Scope</span>
                <span>Last used</span>
              </div>
              <div className="dash-table-row">
                <span>Backend server</span>
                <span>vero_live_9f3…</span>
                <span>Full workspace</span>
                <span>3 minutes ago</span>
              </div>
              <div className="dash-table-row">
                <span>Discord bot</span>
                <span>vero_live_31b…</span>
                <span>Events only</span>
                <span>9 minutes ago</span>
              </div>
              <div className="dash-table-row">
                <span>Staging</span>
                <span>vero_test_7ad…</span>
                <span>Test traffic</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-header">
              <h2>{user ? "Signed in" : "Sign in or create an account"}</h2>
              {user && <span className="dash-tag soft">Demo workspace</span>}
            </div>

            {user ? (
              <div className="dash-login-status">
                <div className="dash-login-line">
                  <span className="dash-login-label">Email</span>
                  <span className="dash-login-value">{user.email}</span>
                </div>
                <p className="dash-login-helper">
                  This account is stored in your VeroAPI Postgres database.
                  Later, you can attach workspaces, API keys, and billing.
                </p>
              </div>
            ) : (
              <>
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
                      Accounts are stored securely in your VeroAPI Postgres
                      database.
                    </p>
                  </form>
                )}
              </>
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
                – for example, <code>user.signup</code> when a new user joins.
              </span>
            </li>
          </ol>

          <button
            className="btn outline dash-quickstart-btn"
            onClick={handleSendTestEvent}
            disabled={sendingEvent}
          >
            {sendingEvent ? "Sending test event…" : "Send test event to VeroAPI"}
          </button>
          {eventMessage && (
            <p className="dash-event-status">{eventMessage}</p>
          )}
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
        <a href="#docs">Docs</a>
        <a href="#status">Status</a>
        <a href="#changelog">Changelog</a>
        <a href="#legal">Privacy</a>
      </div>
    </footer>
  );
}

export default App;
