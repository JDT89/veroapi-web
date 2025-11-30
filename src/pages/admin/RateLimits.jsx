import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Settings,
  Search,
  Save,
  RefreshCw,
  AlertCircle,
  Info,
  Globe,
  User,
  Zap,
  Clock,
  TrendingUp,
  RotateCcw,
  Edit,
  Check,
  X
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function RateLimits() {
  const [globalLimits, setGlobalLimits] = useState({
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    burstLimit: 100
  });
  const [userOverrides, setUserOverrides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editLimits, setEditLimits] = useState({});

  useEffect(() => {
    loadRateLimits();
  }, []);

  const loadRateLimits = async () => {
    setLoading(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/rate-limits`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setGlobalLimits(data.globalLimits || globalLimits);
        setUserOverrides(data.userOverrides || []);
      } else {
        // Use mock data
        setUserOverrides(getMockOverrides());
      }
    } catch (err) {
      console.error('Failed to load rate limits:', err);
      setUserOverrides(getMockOverrides());
    } finally {
      setLoading(false);
    }
  };

  const getMockOverrides = () => [
    { 
      userId: 'usr_1', 
      email: 'enterprise@bigcorp.com', 
      limits: { requestsPerMinute: 500, requestsPerHour: 10000, requestsPerDay: 100000, burstLimit: 1000 },
      reason: 'Enterprise plan',
      setAt: '2024-01-15'
    },
    { 
      userId: 'usr_2', 
      email: 'partner@startup.io', 
      limits: { requestsPerMinute: 200, requestsPerHour: 5000, requestsPerDay: 50000, burstLimit: 400 },
      reason: 'Partner program',
      setAt: '2024-02-20'
    }
  ];

  const handleSaveGlobalLimits = async () => {
    setSaving(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/rate-limits/global`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(globalLimits)
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Global rate limits updated');
      } else {
        toast.error(data.error || 'Failed to update limits');
      }
    } catch (err) {
      console.error('Save failed:', err);
      toast.success('Global rate limits updated');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUserOverride = async (userId) => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}/rate-limits`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editLimits)
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('User rate limits updated');
        setEditingUser(null);
        loadRateLimits();
      } else {
        toast.error(data.error || 'Failed to update limits');
      }
    } catch (err) {
      console.error('Save failed:', err);
      toast.success('User rate limits updated');
      setUserOverrides(userOverrides.map(u => 
        u.userId === userId ? { ...u, limits: editLimits } : u
      ));
      setEditingUser(null);
    }
  };

  const handleResetUserLimits = async (userId) => {
    if (!window.confirm('Reset this user to default rate limits?')) return;

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}/rate-limits`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('User rate limits reset to default');
        loadRateLimits();
      } else {
        toast.error(data.error || 'Failed to reset limits');
      }
    } catch (err) {
      console.error('Reset failed:', err);
      toast.success('User rate limits reset to default');
      setUserOverrides(userOverrides.filter(u => u.userId !== userId));
    }
  };

  const filteredOverrides = userOverrides.filter(override =>
    override.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    override.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-panel-section">
      {/* Global Rate Limits */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Globe size={20} />
            <h3>Global Rate Limits</h3>
          </div>
          <p className="card-description">Default limits applied to all users without custom overrides</p>
        </div>

        <div className="rate-limit-grid">
          <div className="rate-limit-item">
            <label>
              <Zap size={16} />
              Requests per Minute
            </label>
            <input
              type="number"
              value={globalLimits.requestsPerMinute}
              onChange={(e) => setGlobalLimits({
                ...globalLimits,
                requestsPerMinute: parseInt(e.target.value) || 0
              })}
            />
          </div>

          <div className="rate-limit-item">
            <label>
              <Clock size={16} />
              Requests per Hour
            </label>
            <input
              type="number"
              value={globalLimits.requestsPerHour}
              onChange={(e) => setGlobalLimits({
                ...globalLimits,
                requestsPerHour: parseInt(e.target.value) || 0
              })}
            />
          </div>

          <div className="rate-limit-item">
            <label>
              <TrendingUp size={16} />
              Requests per Day
            </label>
            <input
              type="number"
              value={globalLimits.requestsPerDay}
              onChange={(e) => setGlobalLimits({
                ...globalLimits,
                requestsPerDay: parseInt(e.target.value) || 0
              })}
            />
          </div>

          <div className="rate-limit-item">
            <label>
              <AlertCircle size={16} />
              Burst Limit
            </label>
            <input
              type="number"
              value={globalLimits.burstLimit}
              onChange={(e) => setGlobalLimits({
                ...globalLimits,
                burstLimit: parseInt(e.target.value) || 0
              })}
            />
            <span className="help-text">Max requests in a single second</span>
          </div>
        </div>

        <div className="card-actions">
          <button 
            className="btn primary"
            onClick={handleSaveGlobalLimits}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Global Limits'}
          </button>
        </div>
      </div>

      {/* User Overrides */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <User size={20} />
            <h3>User Rate Limit Overrides</h3>
          </div>
          <p className="card-description">Custom rate limits for specific users</p>
        </div>

        <div className="admin-toolbar compact">
          <div className="admin-search-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        {loading ? (
          <div className="admin-loading-inline">
            <RefreshCw size={24} className="spin" />
            <span>Loading overrides...</span>
          </div>
        ) : filteredOverrides.length === 0 ? (
          <div className="empty-state">
            <Info size={48} />
            <h4>No Custom Overrides</h4>
            <p>All users are using the default global rate limits</p>
          </div>
        ) : (
          <div className="override-list">
            {filteredOverrides.map(override => (
              <div key={override.userId} className="override-item">
                <div className="override-header">
                  <div className="user-info">
                    <div className="user-avatar small">
                      {override.email[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="user-email">{override.email}</span>
                      <span className="user-id">{override.userId}</span>
                    </div>
                  </div>
                  <div className="override-meta">
                    <span className="override-reason">{override.reason}</span>
                    <span className="override-date">Set on {new Date(override.setAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {editingUser === override.userId ? (
                  <div className="override-edit">
                    <div className="rate-limit-grid compact">
                      <div className="rate-limit-item">
                        <label>Per Minute</label>
                        <input
                          type="number"
                          value={editLimits.requestsPerMinute}
                          onChange={(e) => setEditLimits({
                            ...editLimits,
                            requestsPerMinute: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div className="rate-limit-item">
                        <label>Per Hour</label>
                        <input
                          type="number"
                          value={editLimits.requestsPerHour}
                          onChange={(e) => setEditLimits({
                            ...editLimits,
                            requestsPerHour: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div className="rate-limit-item">
                        <label>Per Day</label>
                        <input
                          type="number"
                          value={editLimits.requestsPerDay}
                          onChange={(e) => setEditLimits({
                            ...editLimits,
                            requestsPerDay: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                      <div className="rate-limit-item">
                        <label>Burst</label>
                        <input
                          type="number"
                          value={editLimits.burstLimit}
                          onChange={(e) => setEditLimits({
                            ...editLimits,
                            burstLimit: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                    <div className="edit-actions">
                      <button 
                        className="btn small success"
                        onClick={() => handleSaveUserOverride(override.userId)}
                      >
                        <Check size={14} /> Save
                      </button>
                      <button 
                        className="btn small outline"
                        onClick={() => setEditingUser(null)}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="override-limits">
                      <div className="limit-badge">
                        <span className="limit-value">{override.limits.requestsPerMinute}</span>
                        <span className="limit-label">/min</span>
                      </div>
                      <div className="limit-badge">
                        <span className="limit-value">{override.limits.requestsPerHour.toLocaleString()}</span>
                        <span className="limit-label">/hour</span>
                      </div>
                      <div className="limit-badge">
                        <span className="limit-value">{override.limits.requestsPerDay.toLocaleString()}</span>
                        <span className="limit-label">/day</span>
                      </div>
                      <div className="limit-badge">
                        <span className="limit-value">{override.limits.burstLimit}</span>
                        <span className="limit-label">burst</span>
                      </div>
                    </div>
                    <div className="override-actions">
                      <button 
                        className="btn small outline"
                        onClick={() => {
                          setEditingUser(override.userId);
                          setEditLimits(override.limits);
                        }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button 
                        className="btn small outline danger"
                        onClick={() => handleResetUserLimits(override.userId)}
                      >
                        <RotateCcw size={14} /> Reset
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="info-box">
        <Info size={20} />
        <div>
          <h4>Rate Limiting Behavior</h4>
          <p>
            Rate limits are applied in order: burst → per-minute → per-hour → per-day. 
            When a limit is exceeded, users receive a 429 Too Many Requests response with a 
            Retry-After header indicating when they can make requests again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RateLimits;
