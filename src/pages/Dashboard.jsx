import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

// Modular components
import HealthBox from "../components/HealthBox";
import MetricsGrid from "../components/MetricsGrid";
import APIKeyManager from "../components/APIKeyManager";
import QuickstartCard from "../components/QuickstartCard";
import UsageChart from "../components/UsageChart";
import TimelineCard from "../components/TimelineCard";

function Dashboard() {
  const navigate = useNavigate();

  /* ================================
     AUTH TOKEN
  ================================= */
  const [token, setToken] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("veroapi_token") || ""
  );

  useEffect(() => {
    if (!token) navigate("/auth");
  }, [token, navigate]);

  /* ================================
     USER PROFILE
  ================================= */
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    let cancel = false;

    async function loadUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.ok) throw new Error();

        if (!cancel) setUser(data.user);
      } catch {
        if (!cancel) {
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
      cancel = true;
    };
  }, [token, navigate]);

  /* ================================
     HEALTH CHECK
  ================================= */
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    let cancel = false;

    async function check() {
      try {
        setHealthLoading(true);
        const res = await fetch(`${API_BASE_URL}/v1/health`);
        const data = await res.json();

        if (!res.ok) throw new Error();
        if (!cancel) {
          setHealthError(false);
          setHealthData(data);
        }
      } catch {
        if (!cancel) {
          setHealthError(true);
        }
      } finally {
        if (!cancel) {
          setHealthLoading(false);
        }
      }
    }

    check();
    const interval = setInterval(check, 30000);
    return () => {
      clearInterval(interval);
      cancel = true;
    };
  }, []);

  /* ================================
     STATS (Requests last 24h)
  ================================= */
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!token) return;
    let cancel = false;

    async function loadStats() {
      try {
        setStatsLoading(true);
        const res = await fetch(`${API_BASE_URL}/v1/stats/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.ok) throw new Error();
        if (!cancel) setStats(data);
      } catch {
        if (!cancel) setStats(null);
      } finally {
        if (!cancel) setStatsLoading(false);
      }
    }

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => {
      clearInterval(interval);
      cancel = true;
    };
  }, [token]);

  const requestsLast24h = stats?.requests_last_24h ?? null;

  /* ================================
     API KEY
  ================================= */
  const [apiKey, setApiKey] = useState(null);
  const [keysLoading, setKeysLoading] = useState(false);
  const [keysError, setKeysError] = useState("");
  const [regenLoading, setRegenLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancel = false;

    async function loadKey() {
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

        const first = (data.keys || [])[0] || null;

        if (!cancel) {
          setApiKey(first);
          setShowSecret(false);
        }
      } catch (err) {
        if (!cancel) {
          setKeysError(err.message || "Failed to load API key");
          setApiKey(null);
        }
      } finally {
        if (!cancel) {
          setKeysLoading(false);
        }
      }
    }

    loadKey();
    return () => {
      cancel = true;
    };
  }, [token]);

  const handleGenerateOrRegenerate = async () => {
    if (!token) return;
    setRegenLoading(true);
    setKeysError("");
    setCopyMessage("");

    try {
      // delete existing key if present
      if (apiKey?.id) {
        try {
          await fetch(`${API_BASE_URL}/v1/api-keys/${apiKey.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // ignore delete failure
        }
      }

      // create new key
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

      setApiKey({
        ...(data.key || {}),
        secret: data.secret,
      });
      setShowSecret(true);
    } catch (err) {
      setKeysError(err.message || "Failed to generate API key");
    } finally {
      setRegenLoading(false);
    }
  };

  const handleCopySecret = async () => {
    if (!apiKey?.secret) return;

    try {
      await navigator.clipboard.writeText(apiKey.secret);
      setCopyMessage("Copied!");
    } catch {
      setCopyMessage("Failed");
    }

    setTimeout(() => setCopyMessage(""), 1500);
  };

  /* ================================
     UTIL + USER MENU
  ================================= */
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("veroapi_token");
    }
    navigate("/auth");
  };

  /* ================================
     RENDER
  ================================= */
  return (
    <section className="dash">
      {/* ========== SIDEBAR ========== */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <span className="dash-pill">Account</span>

          <div className="dash-workspace-name">
            <span
              className={`dash-health-dot ${
                healthLoading ? "loading" : healthError ? "error" : "ok"
              }`}
            />
            {user ? user.email : "Loading…"}
          </div>

          <div className="dash-env-badge">
            1 primary API key • Rate limit per account
          </div>

          <div className="dash-health">
            {healthLoading && "Checking API…"}
            {!healthLoading && healthError && "API unreachable from dashboard"}
            {!healthLoading && !healthError && "API online"}
          </div>
        </div>

        <nav className="dash-nav">
          <button className="dash-nav-item active">📊 Overview</button>
        </nav>

        <div className="dash-sidebar-foot">
          <p>How to use VeroAPI:</p>
          <ol>
            <li>Generate your primary key</li>
            <li>Store it securely (env var)</li>
            <li>Call any supported endpoint</li>
          </ol>
        </div>
      </aside>

      {/* ========== MAIN AREA ========== */}
      <div className="dash-main">
        {/* Header bar with user menu */}
        <header className="dash-main-header">
          <div>
            <h1>Overview</h1>
            <p>
              Monitor status, manage your API key, and see how your usage is
              trending.
            </p>
          </div>

          {user ? (
            <div className="dash-user-menu">
              <button
                type="button"
                className="dash-user-menu-btn"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                <div className="dash-user-avatar">
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="dash-user-menu-text">
                  <span className="dash-user-menu-name">{user.email}</span>
                  <span className="dash-user-menu-plan">Playground plan</span>
                </div>
                <span className="dash-user-menu-caret">▾</span>
              </button>

              {userMenuOpen && (
                <div className="dash-user-menu-panel">
                  <button
                    type="button"
                    className="dash-user-menu-item"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn primary"
              type="button"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </button>
          )}
        </header>

        {/* Top row cards */}
        <div className="dash-grid">
          <HealthBox
            healthLoading={healthLoading}
            healthError={healthError}
            healthData={healthData}
          />

          <MetricsGrid
            statsLoading={statsLoading}
            requestsLast24h={requestsLast24h}
          />

          <div className="dash-card">
            <div className="dash-card-label">Plan</div>
            <div className="dash-card-value">Playground</div>
            <div className="dash-card-sub">
              1 API key per account • Upgrade later for higher limits.
            </div>
          </div>
        </div>

        {/* Lower area: API key + right stack */}
        <div className="dash-columns">
          <APIKeyManager
            apiKey={apiKey}
            keysLoading={keysLoading}
            keysError={keysError}
            showSecret={showSecret}
            setShowSecret={setShowSecret}
            regenLoading={regenLoading}
            handleCopySecret={handleCopySecret}
            handleGenerateOrRegenerate={handleGenerateOrRegenerate}
            copyMessage={copyMessage}
            formatTime={formatTime}
          />

          <div className="dash-right-stack">
            <QuickstartCard />
            <UsageChart requestsLast24h={requestsLast24h} />
            <TimelineCard user={user} apiKey={apiKey} formatTime={formatTime} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;