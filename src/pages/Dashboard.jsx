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

  // Load user
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

  // Load API key (single primary key per account)
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

  // Stats
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

  const requestsLast24h = stats?.requests_last_24h ?? null;

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
      setCopyMessage("Copied!");
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
      // delete existing key if present
      if (apiKey && apiKey.id) {
        try {
          await fetch(`${API_BASE_URL}/v1/api-keys/${apiKey.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // ignore
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

  const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  return (
    <section className="dash">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <span className="dash-sidebar-label">Account</span>

          <div className="dash-user-chip">
            <div className="dash-avatar">{firstLetter}</div>
            <div className="dash-user-text">
              <div className="dash-user-email">
                {user ? user.email : "Loading…"}
              </div>
              <div className="dash-user-plan">Playground plan</div>
            </div>
          </div>

          <div className="dash-side-status">
            <span
              className={`dash-status-dot ${
                healthLoading ? "loading" : apiOnline ? "ok" : "error"
              }`}
            />
            <span className="dash-status-text">
              {healthLoading
                ? "Checking API health…"
                : apiOnline
                ? "API online"
                : "API unreachable"}
            </span>
          </div>

          <div className="dash-side-meta">
            1 primary API key • Rate-limited per account
          </div>
        </div>

        <nav className="dash-nav">
          <button className="dash-nav-item dash-nav-item-active">
            Overview
          </button>
        </nav>

        <div className="dash-sidebar-foot">
          <p>Quick setup:</p>
          <ol>
            <li>Generate your primary key</li>
            <li>Store it as an env var</li>
            <li>Call a random endpoint</li>
          </ol>
        </div>
      </aside>

      {/* Main content */}
      <div className="dash-main">
        <header className="dash-main-header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Manage your API key and track a quick snapshot of VeroAPI usage.
            </p>
          </div>
          {user ? (
            <button className="btn ghost" type="button" onClick={handleLogout}>
              Sign out
            </button>
          ) : (
            <button
              className="btn primary"
              type="button"
              onClick={() => navigate("/auth")}
            >
              Go to sign in
            </button>
          )}
        </header>

        {/* Metric cards */}
        <div className="dash-metrics">
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
              Counts all successful and failed calls tied to your account.
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-card-label">Plan</div>
            <div className="dash-card-value">Playground</div>
            <div className="dash-card-sub">
              1 key • account-based rate limits • upgrade options coming soon.
            </div>
          </div>
        </div>

        {/* Lower layout: key manager + quickstart */}
        <div className="dash-main-grid">
          <section className="dash-card dash-card-primary">
            <div className="dash-card-header">
              <h2>Primary API key</h2>
              <span className="dash-tag">
                {keysLoading ? "Loading…" : apiKey ? "Active" : "Not created"}
              </span>
            </div>

            {keysError && (
              <p className="dash-error-banner">{keysError}</p>
            )}

            <p className="dash-helper">
              Each account can have exactly one API key at a time. Regenerating
              immediately revokes the old key.
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

            {apiKey && apiKey.secret && (
              <div className="dash-key-panel">
                <div className="dash-input-row">
                  <label>Your API key</label>
                  <div className="dash-key-row">
                    <input
                      className="dash-input"
                      type={showSecret ? "text" : "password"}
                      readOnly
                      value={apiKey.secret}
                    />
                    <button
                      type="button"
                      className="btn outline dash-key-btn"
                      onClick={() => setShowSecret((prev) => !prev)}
                    >
                      {showSecret ? "Hide" : "Reveal"}
                    </button>
                    <button
                      type="button"
                      className="btn outline dash-key-btn"
                      onClick={handleCopySecret}
                    >
                      {copyMessage || "Copy"}
                    </button>
                  </div>
                  <p className="dash-login-hint">
                    Keep this key secret. Store it as{" "}
                    <code>VEROAPI_KEY</code> in your environment, never in
                    client-side code.
                  </p>
                </div>

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
          </section>

          <section className="dash-card dash-card-secondary">
            <div className="dash-card-header">
              <h2>Quickstart</h2>
              <span className="dash-tag dash-tag-soft">Random endpoints</span>
            </div>
            <ol className="dash-steps">
              <li>
                <strong>Generate your key</strong> on this page.
              </li>
              <li>
                <strong>Set an env var</strong> like{" "}
                <code>VEROAPI_KEY</code> in your bot or app.
              </li>
              <li>
                <strong>Call an endpoint</strong> such as{" "}
                <code>POST /v1/text/scramble</code>.
              </li>
            </ol>
            <p className="dash-login-hint dash-quickstart-note">
              As you add more random helpers (Discord XP utilities, rewards,
              text tools), they all reuse this same key and auth header.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
