import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

// Modular components
import HealthBox from "../components/HealthBox";
import MetricsGrid from "../components/MetricsGrid";
import APIKeyManager from "../components/APIKeyManager";
import QuickstartCard from "../components/QuickstartCard";

function Dashboard() {
  const navigate = useNavigate();

  /* ==================================================
     AUTH TOKEN
  ================================================== */
  const [token, setToken] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("veroapi_token") || ""
  );

  useEffect(() => {
    if (!token) navigate("/auth");
  }, [token, navigate]);

  /* ==================================================
     USER PROFILE
  ================================================== */
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
          window.localStorage.removeItem("veroapi_token");
          navigate("/auth");
        }
      }
    }

    loadUser();
    return () => (cancel = true);
  }, [token, navigate]);

  /* ==================================================
     HEALTH CHECK
  ================================================== */
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
        if (!cancel) setHealthError(true);
      } finally {
        if (!cancel) setHealthLoading(false);
      }
    }

    check();
    const interval = setInterval(check, 30_000);
    return () => {
      clearInterval(interval);
      cancel = true;
    };
  }, []);

  /* ==================================================
     STATS (Requests last 24h)
  ================================================== */
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
    const interval = setInterval(loadStats, 30_000);
    return () => {
      clearInterval(interval);
      cancel = true;
    };
  }, [token]);

  const requestsLast24h = stats?.requests_last_24h ?? null;

  /* ==================================================
     API KEY
  ================================================== */
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
        const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.ok) throw new Error(data.error);
        const first = (data.keys || [])[0] || null;

        if (!cancel) {
          setApiKey(first);
          setShowSecret(false);
        }
      } catch (err) {
        if (!cancel) setKeysError(err.message || "Failed to load API key");
      } finally {
        if (!cancel) setKeysLoading(false);
      }
    }

    loadKey();
    return () => (cancel = true);
  }, [token]);

  const handleGenerateOrRegenerate = async () => {
    if (!token) return;
    setRegenLoading(true);
    setKeysError("");

    try {
      // delete existing key if present
      if (apiKey?.id) {
        await fetch(`${API_BASE_URL}/v1/api-keys/${apiKey.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
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
      if (!res.ok || !data.ok) throw new Error(data.error);

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

  /* ==================================================
     UTIL
  ================================================== */
  const formatTime = (t) => {
    if (!t) return "—";
    try {
      return new Date(t).toLocaleString();
    } catch {
      return t;
    }
  };

  const handleLogout = () => {
    setToken("");
    window.localStorage.removeItem("veroapi_token");
    navigate("/auth");
  };

  /* ==================================================
     RENDER
  ================================================== */
  return (
    <section className="dash">
      {/* ------------------------ SIDEBAR ------------------------ */}
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
            {!healthLoading && healthError && "API unreachable"}
            {!healthLoading && !healthError && "API online"}
          </div>
        </div>

        <nav className="dash-nav">
          <button className="dash-nav-item active">Overview</button>
        </nav>

        <div className="dash-sidebar-foot">
          <p>How to use VeroAPI:</p>
          <ol>
            <li>Generate your primary key</li>
            <li>Paste into your bot/app</li>
            <li>Call any endpoint</li>
          </ol>
        </div>
      </aside>

      {/* ------------------------ MAIN AREA ------------------------ */}
      <div className="dash-main">
        <header className="dash-main-header">
          <div>
            <h1>Overview</h1>
            <p>Your API key, usage, status, and quickstart tools.</p>
          </div>

          {user ? (
            <button className="btn ghost" onClick={handleLogout}>
              Sign out
            </button>
          ) : (
            <button className="btn primary" onClick={() => navigate("/auth")}>
              Sign in
            </button>
          )}
        </header>

        {/* TOP THREE CARDS */}
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
              1 API key per account • Upgrade later
            </div>
          </div>
        </div>

        {/* LOWER GRID: API KEY + QUICKSTART */}
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

          <QuickstartCard />
        </div>
      </div>
    </section>
  );
}

export default Dashboard;