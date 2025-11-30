import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";
import "./Dashboard.css";

// Import sub-components
import HealthBox from "../components/HealthBox";
import MetricsGrid from "../components/MetricsGrid";
import APIKeyManager from "../components/APIKeyManager";
import QuickstartCard from "../components/QuickstartCard";
import TimelineCard from "../components/TimelineCard";
import UsageChart from "../components/UsageChart";

function Dashboard() {
  const navigate = useNavigate();

  // Auth state
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");

  // API health state
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState("");

  // API key state
  const [apiKey, setApiKey] = useState(null);
  const [keysLoading, setKeysLoading] = useState(true);
  const [keysError, setKeysError] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  // Stats state
  const [statsLoading, setStatsLoading] = useState(true);
  const [requestsLast24h, setRequestsLast24h] = useState(null);

  // Sidebar state
  const [activeView, setActiveView] = useState("overview");

  // Initialize: check token and load user
  useEffect(() => {
    const storedToken = window.localStorage.getItem("veroapi_token");
    if (!storedToken) {
      navigate("/auth");
      return;
    }
    setToken(storedToken);
  }, [navigate]);

  // Load user data when token is set
  useEffect(() => {
    if (!token) return;

    const loadUser = async () => {
      setUserLoading(true);
      setUserError("");
      try {
        const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load user");
        }

        setUser(data.user);
      } catch (err) {
        const message = err.message || "Could not load user data";
        setUserError(message);
        console.error("[Dashboard] User load error:", err);
        
        // If unauthorized, redirect to auth
        if (message.includes("Unauthorized") || message.includes("401")) {
          window.localStorage.removeItem("veroapi_token");
          navigate("/auth");
        }
      } finally {
        setUserLoading(false);
      }
    };

    loadUser();
  }, [token, navigate]);

  // Load API health
  useEffect(() => {
    const loadHealth = async () => {
      setHealthLoading(true);
      setHealthError("");
      try {
        const res = await fetch(`${API_BASE_URL}/v1/health`);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error("API health check failed");
        }

        setHealthData(data);
      } catch (err) {
        setHealthError(err.message || "Could not check API health");
        console.error("[Dashboard] Health check error:", err);
      } finally {
        setHealthLoading(false);
      }
    };

    loadHealth();
  }, []);

  // Load API keys
  useEffect(() => {
    if (!token) return;

    const loadKeys = async () => {
      setKeysLoading(true);
      setKeysError("");
      try {
        const res = await fetch(`${API_BASE_URL}/v1/api-keys`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load API keys");
        }

        // Get the first key (we enforce one key per user)
        const key = data.keys && data.keys.length > 0 ? data.keys[0] : null;
        setApiKey(key);
      } catch (err) {
        const message = err.message || "Could not load API keys";
        setKeysError(message);
        console.error("[Dashboard] Keys load error:", err);
      } finally {
        setKeysLoading(false);
      }
    };

    loadKeys();
  }, [token]);

  // Load stats
  useEffect(() => {
    if (!token) return;

    const loadStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/v1/stats/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setRequestsLast24h(data.requests_last_24h || 0);
        }
      } catch (err) {
        console.error("[Dashboard] Stats load error:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [token]);

  // Handlers
  const handleCopySecret = async () => {
    if (!apiKey || !apiKey.secret) return;
    try {
      await navigator.clipboard.writeText(apiKey.secret);
      setCopyMessage("Copied!");
      toast.success("API key copied to clipboard!");
      setTimeout(() => setCopyMessage(""), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleGenerateOrRegenerate = async () => {
    if (!token) return;
    setRegenLoading(true);
    setKeysError("");

    try {
      // Delete existing key if present
      if (apiKey && apiKey.id) {
        try {
          await fetch(`${API_BASE_URL}/v1/api-keys/${apiKey.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.warn("[Dashboard] Failed to delete old key:", err);
        }
      }

      // Create new key
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

      toast.success(
        apiKey ? "API key regenerated successfully!" : "API key generated successfully!"
      );
    } catch (err) {
      const message = err.message || "Failed to generate API key";
      setKeysError(message);
      toast.error(message);
    } finally {
      setRegenLoading(false);
    }
  };

  const handleSignOut = () => {
    window.localStorage.removeItem("veroapi_token");
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    
    return date.toLocaleDateString();
  };

  // Loading state
  if (userLoading) {
    return (
      <div className="dash">
        <div className="dash-sidebar">
          <div className="dash-sidebar-label">Loading...</div>
        </div>
        <div className="dash-main">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="dash">
        <div className="dash-sidebar">
          <div className="dash-sidebar-label">Error</div>
        </div>
        <div className="dash-main">
          <p className="dash-error-banner">{userError}</p>
          <button className="btn outline" onClick={() => navigate("/auth")}>
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          <div className="dash-sidebar-label">Your account</div>
          
          {user && (
            <div className="dash-user-chip">
              <div className="dash-avatar">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <div className="dash-user-text">
                <div className="dash-user-email">{user.email}</div>
                <div className="dash-user-plan">
                  {user.workspace_name || "Main workspace"}
                </div>
              </div>
            </div>
          )}

          <div className="dash-side-status">
            <span
              className={`dash-status-dot ${
                healthLoading
                  ? "loading"
                  : healthError
                  ? "error"
                  : healthData?.ok
                  ? "ok"
                  : "error"
              }`}
            />
            <span className="dash-status-text">
              {healthLoading
                ? "Checking API..."
                : healthError
                ? "API offline"
                : healthData?.ok
                ? "API online"
                : "Unknown status"}
            </span>
          </div>

          {user && (
            <div className="dash-side-meta">
              Member since {formatTime(user.created_at)}
            </div>
          )}
        </div>

        <nav className="dash-nav">
          <button
            type="button"
            className={`dash-nav-item ${
              activeView === "overview" ? "dash-nav-item-active" : ""
            }`}
            onClick={() => setActiveView("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`dash-nav-item ${
              activeView === "usage" ? "dash-nav-item-active" : ""
            }`}
            onClick={() => setActiveView("usage")}
          >
            Usage & Stats
          </button>
          <button
            type="button"
            className={`dash-nav-item ${
              activeView === "settings" ? "dash-nav-item-active" : ""
            }`}
            onClick={() => setActiveView("settings")}
          >
            Settings
          </button>
        </nav>

        <div className="dash-sidebar-foot">
          <button
            type="button"
            className="btn outline"
            onClick={handleSignOut}
            style={{ width: "100%", fontSize: "0.8rem" }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dash-main">
        {activeView === "overview" && (
          <>
            <header className="dash-main-header">
              <div>
                <h1>Dashboard</h1>
                <p>Manage your API key and monitor your usage.</p>
              </div>
            </header>

            {/* Metrics row */}
            <div className="dash-metrics">
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
                <div className="dash-card-label">Account Status</div>
                <div className="dash-card-value">
                  {apiKey ? "Active" : "Setup needed"}
                </div>
                <div className="dash-card-sub">
                  {apiKey
                    ? "Your API key is ready to use"
                    : "Generate an API key to get started"}
                </div>
              </div>
            </div>

            {/* Main grid */}
            <div className="dash-main-grid">
              <APIKeyManager
                apiKey={apiKey}
                keysLoading={keysLoading}
                keysError={keysError}
                showSecret={showSecret}
                setShowSecret={setShowSecret}
                regenLoading={regenLoading}
                handleGenerateOrRegenerate={handleGenerateOrRegenerate}
                handleCopySecret={handleCopySecret}
                copyMessage={copyMessage}
                formatTime={formatTime}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                <QuickstartCard />
                <TimelineCard
                  user={user}
                  apiKey={apiKey}
                  formatTime={formatTime}
                />
              </div>
            </div>
          </>
        )}

        {activeView === "usage" && (
          <>
            <header className="dash-main-header">
              <div>
                <h1>Usage & Statistics</h1>
                <p>Monitor your API usage and request patterns.</p>
              </div>
            </header>

            <div className="dash-metrics">
              <div className="dash-card">
                <div className="dash-card-label">Total Requests</div>
                <div className="dash-card-value">
                  {statsLoading
                    ? "..."
                    : requestsLast24h?.toLocaleString() || "0"}
                </div>
                <div className="dash-card-sub">Last 24 hours</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-label">Avg Response Time</div>
                <div className="dash-card-value">~120ms</div>
                <div className="dash-card-sub">Typical latency</div>
              </div>
              <div className="dash-card">
                <div className="dash-card-label">Success Rate</div>
                <div className="dash-card-value">99.8%</div>
                <div className="dash-card-sub">Last 7 days</div>
              </div>
            </div>

            <UsageChart requestsLast24h={requestsLast24h} />

            <div className="dash-card wide" style={{ marginTop: "1rem" }}>
              <div className="dash-card-header">
                <h2>Recent Activity</h2>
                <span className="dash-tag">Coming soon</span>
              </div>
              <p className="dash-login-helper">
                Detailed request logs and analytics will be available here soon.
                You'll be able to see endpoint usage, error rates, and more.
              </p>
            </div>
          </>
        )}

        {activeView === "settings" && (
          <>
            <header className="dash-main-header">
              <div>
                <h1>Settings</h1>
                <p>Manage your account preferences and workspace.</p>
              </div>
            </header>

            <div className="dash-card wide">
              <div className="dash-card-header">
                <h2>Account Information</h2>
              </div>
              <div className="dash-input-row">
                <label>Email Address</label>
                <input
                  className="dash-input"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                />
                <p className="dash-login-hint">
                  Email changes are not currently supported.
                </p>
              </div>
              <div className="dash-input-row" style={{ marginTop: "1rem" }}>
                <label>Workspace Name</label>
                <input
                  className="dash-input"
                  type="text"
                  value={user?.workspace_name || "Main workspace"}
                  readOnly
                  disabled
                />
                <p className="dash-login-hint">
                  Workspace customization coming soon.
                </p>
              </div>
            </div>

            <div className="dash-card wide" style={{ marginTop: "1rem" }}>
              <div className="dash-card-header">
                <h2>Danger Zone</h2>
                <span className="dash-tag">Careful</span>
              </div>
              <p className="dash-login-helper">
                These actions cannot be undone. Please proceed with caution.
              </p>
              <button
                className="btn outline"
                style={{
                  marginTop: "0.5rem",
                  borderColor: "var(--danger)",
                  color: "var(--danger)",
                }}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    toast.error("Account deletion coming soon");
                  }
                }}
              >
                Delete Account
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
