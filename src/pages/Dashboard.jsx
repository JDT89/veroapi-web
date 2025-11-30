import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Key, 
  Activity, 
  TrendingUp, 
  Zap, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw,
  CheckCircle,
  Clock,
  BarChart3,
  LogOut
} from "lucide-react";
import { API_BASE_URL } from "../config";
import "./Dashboard.css";

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

  // Stats state
  const [statsLoading, setStatsLoading] = useState(true);
  const [requestsLast24h, setRequestsLast24h] = useState(null);

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
        
        // Handle rate limiting
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and refresh.");
        }
        
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load user");
        }

        setUser(data.user);
      } catch (err) {
        const message = err.message || "Could not load user data";
        setUserError(message);
        
        if (message.includes("Unauthorized") || message.includes("401")) {
          window.localStorage.removeItem("veroapi_token");
          navigate("/auth");
        }
      } finally {
        setUserLoading(false);
      }
    };

    // Add a small delay to avoid immediate rate limiting
    const timer = setTimeout(loadUser, 100);
    return () => clearTimeout(timer);
  }, [token, navigate]);

  // Load API health
  useEffect(() => {
    const loadHealth = async () => {
      setHealthLoading(true);
      setHealthError("");
      try {
        const res = await fetch(`${API_BASE_URL}/v1/health`);
        
        // Handle rate limiting
        if (res.status === 429) {
          setHealthError("Rate limited");
          setHealthData({ ok: false, service: 'veroapi', uptime: 0 });
          return;
        }
        
        const data = await res.json();

        if (res.ok && data.ok === true) {
          setHealthData(data);
          setHealthError("");
        } else {
          throw new Error("API health check failed");
        }
      } catch (err) {
        const message = err.message || "Could not check API health";
        setHealthError(message);
        setHealthData({ ok: false, service: 'veroapi', uptime: 0 });
      } finally {
        setHealthLoading(false);
      }
    };

    // Add delay to avoid rate limiting
    const timer = setTimeout(loadHealth, 200);
    
    // Refresh health check every 60 seconds (reduced from 30)
    const interval = setInterval(loadHealth, 60000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
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
        
        // Handle rate limiting
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please wait a moment and try again.");
        }
        
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to load API keys");
        }

        const key = data.keys && data.keys.length > 0 ? data.keys[0] : null;
        setApiKey(key);
      } catch (err) {
        const message = err.message || "Could not load API keys";
        setKeysError(message);
      } finally {
        setKeysLoading(false);
      }
    };

    // Add delay to stagger requests and avoid rate limiting
    const timer = setTimeout(loadKeys, 300);
    return () => clearTimeout(timer);
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
        
        // Handle rate limiting gracefully
        if (res.status === 429) {
          setRequestsLast24h(0);
          return;
        }
        
        const data = await res.json();

        if (res.ok && data.ok) {
          setRequestsLast24h(data.requests_last_24h || 0);
        } else {
          setRequestsLast24h(0);
        }
      } catch (err) {
        setRequestsLast24h(0);
      } finally {
        setStatsLoading(false);
      }
    };

    // Add delay to stagger requests and avoid rate limiting
    const timer = setTimeout(loadStats, 400);
    return () => clearTimeout(timer);
  }, [token]);

  const handleCopySecret = async () => {
    if (!apiKey || !apiKey.secret) return;
    try {
      await navigator.clipboard.writeText(apiKey.secret);
      toast.success("API key copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleGenerateOrRegenerate = async () => {
    if (!token) return;
    setRegenLoading(true);
    setKeysError("");

    try {
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
        apiKey ? "API key regenerated!" : "API key generated!"
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
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (userLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="dashboard-error">
        <p className="error-message">{userError}</p>
        <button className="btn primary" onClick={() => navigate("/auth")}>
          Go to Sign In
        </button>
      </div>
    );
  }

  const apiOnline = !healthLoading && !healthError && healthData?.ok === true;

  return (
    <div className="dashboard-container">
      {/* Header Bar */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <h1>Dashboard</h1>
          <div className="header-status">
            <div className={`status-indicator ${apiOnline ? 'online' : 'offline'}`} />
            <span>
              {healthLoading 
                ? 'Checking API...' 
                : apiOnline 
                  ? 'All systems operational' 
                  : 'API unavailable'}
            </span>
            <span className="api-url-badge" title={`Connected to: ${API_BASE_URL}`}>
              {API_BASE_URL.includes('localhost') ? '🔧 Local' : '🌐 Production'}
            </span>
          </div>
        </div>
        <div className="dashboard-header-right">
          <div className="user-menu">
            <div className="user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-email">{user?.email}</div>
              <div className="user-workspace">{user?.workspace_name || 'Main workspace'}</div>
            </div>
          </div>
          <button className="btn-icon" onClick={handleSignOut} title="Sign out">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon accent">
              <Activity size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Requests Today</div>
              <div className="stat-value">
                {statsLoading ? '...' : (requestsLast24h?.toLocaleString() || '0')}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <TrendingUp size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">Response Time</div>
              <div className="stat-value">~120ms</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon highlight">
              <Zap size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">API Status</div>
              <div className="stat-value">
                {healthLoading ? '...' : (apiOnline ? 'Online' : 'Offline')}
              </div>
            </div>
          </div>
        </div>

        {/* API Key Section */}
        <div className="card api-key-card">
          <div className="card-header">
            <div className="card-title">
              <Key size={20} />
              <h2>API Key</h2>
            </div>
            {apiKey && (
              <span className="status-badge success">Active</span>
            )}
          </div>

          {keysError && (
            <div className="alert error">{keysError}</div>
          )}

          {!apiKey && !keysLoading && (
            <div className="empty-state">
              <Key size={48} className="empty-icon" />
              <h3>No API key generated yet</h3>
              <p>Create your first API key to start using VeroAPI endpoints</p>
              <button 
                className="btn primary"
                onClick={handleGenerateOrRegenerate}
                disabled={regenLoading}
              >
                {regenLoading ? 'Generating...' : 'Generate API Key'}
              </button>
            </div>
          )}

          {apiKey && (
            <>
              <div className="key-display">
                <div className="key-input-wrapper">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={apiKey.secret || ''}
                    readOnly
                    className="key-input"
                  />
                  <div className="key-actions">
                    <button
                      className="btn-icon-small"
                      onClick={() => setShowSecret(!showSecret)}
                      title={showSecret ? "Hide" : "Show"}
                    >
                      {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      className="btn-icon-small"
                      onClick={handleCopySecret}
                      title="Copy"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="key-meta">
                <div className="key-meta-item">
                  <span className="meta-label">Prefix</span>
                  <code>{apiKey.prefix}</code>
                </div>
                <div className="key-meta-item">
                  <span className="meta-label">Created</span>
                  <span>{formatTime(apiKey.created_at)}</span>
                </div>
                <div className="key-meta-item">
                  <span className="meta-label">Last used</span>
                  <span>{formatTime(apiKey.last_used_at)}</span>
                </div>
              </div>

              <button
                className="btn outline full-width"
                onClick={handleGenerateOrRegenerate}
                disabled={regenLoading}
              >
                <RefreshCw size={16} />
                {regenLoading ? 'Regenerating...' : 'Regenerate Key'}
              </button>
            </>
          )}
        </div>

        {/* Quick Start Guide */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <CheckCircle size={20} />
              <h2>Quick Start</h2>
            </div>
          </div>

          <div className="steps-list">
            <div className="step-item completed">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-title">Create Account</div>
                <div className="step-desc">You're signed in as {user?.email}</div>
              </div>
            </div>

            <div className={`step-item ${apiKey ? 'completed' : 'current'}`}>
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-title">Generate API Key</div>
                <div className="step-desc">
                  {apiKey ? 'Key created successfully' : 'Click the button above to create your key'}
                </div>
              </div>
            </div>

            <div className={`step-item ${apiKey ? 'current' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-title">Make Your First Request</div>
                <div className="step-desc">Call any endpoint with your API key</div>
              </div>
            </div>
          </div>

          {apiKey && (
            <div className="code-snippet">
              <div className="code-header">
                <span>Example Request</span>
                <span className="code-lang">bash</span>
              </div>
              <pre><code>{`curl "${API_BASE_URL}/v1/text/scramble" \\
  -H "Authorization: Bearer ${apiKey.prefix}..." \\
  -H "Content-Type: application/json" \\
  -d '{"text":"VeroAPI"}'`}</code></pre>
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={20} />
              <h2>Recent Activity</h2>
            </div>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot active" />
              <div className="timeline-content">
                <div className="timeline-title">Account Created</div>
                <div className="timeline-desc">{user?.email}</div>
                <div className="timeline-time">{formatTime(user?.created_at)}</div>
              </div>
            </div>

            {apiKey && (
              <div className="timeline-item">
                <div className="timeline-dot active" />
                <div className="timeline-content">
                  <div className="timeline-title">API Key Generated</div>
                  <div className="timeline-desc">{apiKey.label || 'Primary key'}</div>
                  <div className="timeline-time">{formatTime(apiKey.created_at)}</div>
                </div>
              </div>
            )}

            <div className="timeline-item">
              <div className="timeline-dot pending" />
              <div className="timeline-content">
                <div className="timeline-title">First API Request</div>
                <div className="timeline-desc">Waiting for your first call</div>
                <div className="timeline-time">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="card usage-card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 size={20} />
              <h2>Usage Overview</h2>
            </div>
            <span className="chart-period">Last 24 hours</span>
          </div>

          <div className="usage-chart">
            {[
              { label: 'Now', value: 20 },
              { label: '6h', value: 35 },
              { label: '12h', value: 45 },
              { label: '18h', value: 30 },
              { label: '24h', value: 25 }
            ].map((bar, idx) => (
              <div key={idx} className="chart-bar">
                <div className="bar-fill" style={{ height: `${bar.value}%` }}>
                  <div className="bar-tooltip">{bar.value}%</div>
                </div>
                <div className="bar-label">{bar.label}</div>
              </div>
            ))}
          </div>

          <div className="usage-summary">
            <div className="summary-item">
              <span className="summary-label">Total Requests</span>
              <span className="summary-value">
                {requestsLast24h?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Avg/Hour</span>
              <span className="summary-value">
                {requestsLast24h ? Math.round(requestsLast24h / 24) : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
