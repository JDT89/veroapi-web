import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

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

            {apiKey && apiKey.secret && (
              <div style={{ marginTop: 10, fontSize: 11 }}>
                <div className="dash-input-row">
                  <label>Your API key</label>
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
                      type={showSecret ? "text" : "password"}
                      readOnly
                      value={apiKey.secret}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn outline"
                      onClick={() => setShowSecret((prev) => !prev)}
                    >
                      {showSecret ? "Hide" : "Reveal"}
                    </button>
                    <button
                      type="button"
                      className="btn outline"
                      onClick={handleCopySecret}
                    >
                      {copyMessage || "Copy"}
                    </button>
                  </div>
                  <p className="dash-login-hint">
                    You can reveal and copy your key from here at any time.
                    Store it as an environment variable or in your secret
                    manager.
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

export default Dashboard;
