import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [token, setToken] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("veroapi_token") || ""
  );
  const [user, setUser] = useState(null);

  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);
  const [healthData, setHealthData] = useState(null);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [apiKey, setApiKey] = useState(null);
  const [keysLoading, setKeysLoading] = useState(false);
  const [keysError, setKeysError] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  // Health check
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

  // Load current user
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

  // Load API key (single key per account)
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
          setShowSecret(false);
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

  // Load stats
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
    if (!apiKey || !apiKey.secret) return;
    try {
      await navigator.clipboard.writeText(apiKey.secret);
      setCopyMessage("Copied");
    } catch {
      setCopyMessage("Unable to copy");
    }
    setTimeout(() => setCopyMessage(""), 1200);
  };

  const handleGenerateOrRegenerate = async () => {
    if (!token) return;
    setRegenLoading(true);
    setKeysError("");
    setCopyMessage("");

    try {
      // If a key exists, revoke first
      if (apiKey && apiKey.id) {
        try {
          await fetch(`${API_BASE_URL}/v1/api-keys/${apiKey.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // ignore revoke errors
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

      const mergedKey = {
        ...(data.key || {}),
        secret: data.secret || (data.key && data.key.secret),
      };
      setApiKey(mergedKey);
      setShowSecret(true);
    } catch (err) {
      setKeysError(err.message || "Failed to generate API key");
    } finally {
      setRegenLoading(false);
    }
  };

  const requestsLast24h = stats?.requests_last_24h ?? null;

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-main">
          <h1>Dashboard</h1>
          <p>
            Track API status, usage, and your primary key in one place. One key per
            account, usable across all VeroAPI endpoints.
          </p>
        </div>

        <div className="dashboard-header-right">
          {user && (
            <div className="dashboard-user-chip">
              <div className="dashboard-user-avatar">
                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="dashboard-user-meta">
                <span className="dashboard-user-email">
                  {user.email || "Loading…"}
                </span>
                <span className="dashboard-user-plan">Free • 1 primary key</span>
              </div>
            </div>
          )}
          <button
            type="button"
            className="btn secondary dashboard-signout"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="dashboard-layout">
        {/* LEFT COLUMN – account + navigation */}
        <aside className="dashboard-sidebar">
          <section className="dash-panel">
            <div className="dash-panel-header">
              <span className="dash-pill">Account</span>
            </div>
            <div className="dash-account-details">
              <div className="dash-account-row">
                <span className="dash-label">Email</span>
                <span className="dash-value">
                  {user ? user.email : "Loading…"}
                </span>
              </div>
              <div className="dash-account-row">
                <span className="dash-label">Plan</span>
                <span className="dash-value">Free tier</span>
              </div>
              <div className="dash-account-row">
                <span className="dash-label">Keys</span>
                <span className="dash-value">1 primary key per account</span>
              </div>
            </div>

            <div className="dash-health-row">
              <span className="dash-label">API status</span>
              <div className="dash-health-indicator">
                <span
                  className={
                    healthLoading
                      ? "health-dot health-dot-loading"
                      : apiOnline
                      ? "health-dot health-dot-ok"
                      : "health-dot health-dot-error"
                  }
                />
                <span className="dash-health-text">
                  {healthLoading
                    ? "Checking…"
                    : healthError
                    ? "Unreachable from dashboard"
                    : "Online"}
                </span>
              </div>
              {!healthLoading && !healthError && (
                <p className="dash-health-sub">
                  Uptime {Math.round(healthData?.uptime || 0)}s • based on{" "}
                  <code>/v1/health</code>
                </p>
              )}
            </div>

            <div className="dash-sidebar-foot">
              <p>Quick steps to go live:</p>
              <ol>
                <li>Generate your primary API key below</li>
                <li>Store it as an env var in your app/bot</li>
                <li>Call any endpoint from the Docs or Endpoints page</li>
              </ol>
            </div>
          </section>
        </aside>

        {/* RIGHT COLUMN – metrics + key + quickstart */}
        <main className="dashboard-main">
          {/* Top metrics row */}
          <section className="dashboard-metrics">
            <div className="metric-card">
              <div className="metric-label">API status</div>
              <div className="metric-value">
                {healthLoading
                  ? "Checking…"
                  : apiOnline
                  ? "Online"
                  : "Unavailable"}
              </div>
              <p className="metric-sub">
                Health is based on the <code>/v1/health</code> endpoint.
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-label">Requests (last 24h)</div>
              <div className="metric-value">
                {statsLoading
                  ? "…"
                  : requestsLast24h === null
                  ? "—"
                  : requestsLast24h.toLocaleString()}
              </div>
              <p className="metric-sub">
                Optional metric – depends on your backend stats implementation.
              </p>
            </div>

            <div className="metric-card">
              <div className="metric-label">Plan</div>
              <div className="metric-value">Free</div>
              <p className="metric-sub">
                1 key per account • soft rate limits suitable for dev and
                low-volume bots.
              </p>
            </div>
          </section>

          {/* Main content row */}
          <section className="dashboard-bottom-row">
            {/* API key manager */}
            <section className="panel-card api-key-card">
              <div className="panel-card-header">
                <div>
                  <h2>Primary API key</h2>
                  <p className="panel-subtitle">
                    Every request you make to VeroAPI uses this key in the{" "}
                    <code>Authorization</code> header.
                  </p>
                </div>
                <span className="badge">
                  {keysLoading ? "Loading…" : apiKey ? "Active" : "Not created"}
                </span>
              </div>

              {keysError && (
                <p className="panel-error">{keysError}</p>
              )}

              <button
                className="btn primary generate-btn"
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

              {apiKey && apiKey.secret && (
                <div className="api-key-secret-block">
                  <label className="api-key-label">Your API key</label>
                  <div className="api-key-input-row">
                    <input
                      className="api-key-input"
                      type={showSecret ? "text" : "password"}
                      readOnly
                      value={apiKey.secret}
                    />
                    <button
                      type="button"
                      className="btn secondary"
                      onClick={() => setShowSecret((prev) => !prev)}
                    >
                      {showSecret ? "Hide" : "Reveal"}
                    </button>
                    <button
                      type="button"
                      className="btn secondary"
                      onClick={handleCopySecret}
                    >
                      {copyMessage || "Copy"}
                    </button>
                  </div>
                  <p className="api-key-hint">
                    Keep this key secret. Store it in an environment variable or
                    your secret manager and never commit it to Git.
                  </p>
                </div>
              )}

              {apiKey && (
                <div className="api-key-meta-table">
                  <div className="api-key-meta-row api-key-meta-head">
                    <span>Label</span>
                    <span>Prefix</span>
                    <span>Created</span>
                    <span>Last used</span>
                  </div>
                  <div className="api-key-meta-row">
                    <span>{apiKey.label || "Primary key"}</span>
                    <span>{apiKey.prefix}</span>
                    <span>{formatTime(apiKey.created_at)}</span>
                    <span>{formatTime(apiKey.last_used_at)}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Quickstart */}
            <section className="panel-card quickstart-card">
              <div className="panel-card-header">
                <div>
                  <h2>Quickstart</h2>
                  <p className="panel-subtitle">
                    Drop VeroAPI into your app in a few lines of code.
                  </p>
                </div>
                <span className="badge badge-soft">Random endpoints</span>
              </div>

              <ol className="quickstart-steps">
                <li>
                  <strong>Generate your key</strong> on this page and save it as{" "}
                  <code>VEROAPI_KEY</code>.
                </li>
                <li>
                  <strong>Call an endpoint</strong> like{" "}
                  <code>POST /v1/text/scramble</code> with the key in the{" "}
                  <code>Authorization: Bearer</code> header.
                </li>
                <li>
                  <strong>Scale out</strong> by reusing the same key across bots,
                  dashboards, and small internal tools.
                </li>
              </ol>

              <p className="quickstart-footnote">
                When you regenerate, the old key stops working immediately. Rotate
                keys during a low-traffic window if you’re in production.
              </p>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
