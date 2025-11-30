import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Key,
  Activity,
  TrendingUp,
  Shield,
  Search,
  Calendar,
  DollarSign,
  BarChart3,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Check if user has admin access
  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const token = window.localStorage.getItem('veroapi_token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/stats/overview`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 403) {
        setError('You do not have admin access to this panel.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to verify admin access');
      }

      const data = await res.json();
      setStats(data.stats);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load admin panel');
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(
        `${API_BASE_URL}/v1/admin/users/search?email=${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setSearchResults(data.users || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const loadUserDetails = async (userId) => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(
        `${API_BASE_URL}/v1/admin/users/${userId}/details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setUserDetails(data);
      setSelectedUser(userId);
    } catch (err) {
      console.error('Failed to load user details:', err);
    }
  };

  const handleRevokeAllKeys = async (userId) => {
    if (!window.confirm('Are you sure you want to revoke ALL API keys for this user? This cannot be undone.')) {
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(
        `${API_BASE_URL}/v1/admin/users/${userId}/revoke-keys`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      
      if (data.ok) {
        alert(`Successfully revoked ${data.revokedCount} key(s)`);
        loadUserDetails(userId); // Refresh details
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to revoke keys:', err);
      alert('Failed to revoke keys');
    }
  };

  const handleDeleteUser = async (userId) => {
    const userEmail = userDetails?.user?.email || 'this user';
    
    if (!window.confirm(`Are you sure you want to DELETE ${userEmail}? This will permanently delete all their data and cannot be undone.`)) {
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(
        `${API_BASE_URL}/v1/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      
      if (data.ok) {
        alert(data.message);
        setSelectedUser(null);
        setUserDetails(null);
        // Refresh stats
        checkAdminAccess();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner" />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <AlertCircle size={48} />
        <h2>Access Denied</h2>
        <p>{error}</p>
        <button className="btn primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <div className="admin-badge">
            <Shield size={14} />
            <span>Admin Panel</span>
          </div>
          <h1>Platform Administration</h1>
          <p>Manage users, monitor activity, and view platform statistics</p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon users">
              <Users size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Total Users</span>
              <span className="admin-stat-value">{stats.users.total.toLocaleString()}</span>
              <span className="admin-stat-change positive">
                <ArrowUpRight size={14} />
                {stats.users.last30Days} new in 30 days
              </span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon keys">
              <Key size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">API Keys</span>
              <span className="admin-stat-value">{stats.apiKeys.total.toLocaleString()}</span>
              <span className="admin-stat-meta">
                {stats.apiKeys.activePercentage}% of users
              </span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon activity">
              <Activity size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Requests (24h)</span>
              <span className="admin-stat-value">{stats.requests.last24h.toLocaleString()}</span>
              <span className="admin-stat-meta">
                ~{stats.requests.avgPerDay.toLocaleString()}/day avg
              </span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon total">
              <BarChart3 size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Total Requests</span>
              <span className="admin-stat-value">{stats.requests.total.toLocaleString()}</span>
              <span className="admin-stat-meta">All time</span>
            </div>
          </div>
        </div>
      )}

      {/* User Search */}
      <div className="admin-section">
        <h2 className="admin-section-title">User Lookup</h2>
        <form className="admin-search-form" onSubmit={handleSearch}>
          <div className="admin-search-wrapper">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by email or user ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <button type="submit" className="btn primary" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="admin-search-results">
            <h3>Search Results ({searchResults.length})</h3>
            <div className="admin-users-list">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="admin-user-card"
                  onClick={() => loadUserDetails(user.id)}
                >
                  <div className="admin-user-header">
                    <div className="admin-user-avatar">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="admin-user-info">
                      <span className="admin-user-email">{user.email}</span>
                      <span className="admin-user-id">{user.id}</span>
                    </div>
                    {user.isSuperAdmin && (
                      <span className="admin-user-badge">Super Admin</span>
                    )}
                  </div>
                  <div className="admin-user-stats">
                    <div className="admin-user-stat">
                      <Key size={14} />
                      <span>{user.apiKeyCount} keys</span>
                    </div>
                    <div className="admin-user-stat">
                      <Activity size={14} />
                      <span>{user.totalRequests.toLocaleString()} requests</span>
                    </div>
                    <div className="admin-user-stat">
                      <Clock size={14} />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && userDetails && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>User Details</h2>
              <button
                className="admin-modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="admin-detail-section">
                <h3>Account Information</h3>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Email</span>
                    <span className="admin-detail-value">{userDetails.user.email}</span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">User ID</span>
                    <span className="admin-detail-value">{userDetails.user.id}</span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Workspace</span>
                    <span className="admin-detail-value">
                      {userDetails.user.workspaceName || 'Main workspace'}
                    </span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Created</span>
                    <span className="admin-detail-value">
                      {new Date(userDetails.user.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Usage Statistics</h3>
                <div className="admin-stats-mini">
                  <div className="admin-stat-mini">
                    <span className="admin-stat-mini-value">
                      {userDetails.stats.totalRequests.toLocaleString()}
                    </span>
                    <span className="admin-stat-mini-label">Total Requests</span>
                  </div>
                  <div className="admin-stat-mini">
                    <span className="admin-stat-mini-value">
                      {userDetails.stats.requests24h.toLocaleString()}
                    </span>
                    <span className="admin-stat-mini-label">Last 24h</span>
                  </div>
                  <div className="admin-stat-mini">
                    <span className="admin-stat-mini-value">
                      {userDetails.stats.requests7d.toLocaleString()}
                    </span>
                    <span className="admin-stat-mini-label">Last 7 days</span>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>API Keys</h3>
                {userDetails.apiKeys.length > 0 ? (
                  <div className="admin-keys-list">
                    {userDetails.apiKeys.map((key) => (
                      <div key={key.id} className="admin-key-item">
                        <div>
                          <span className="admin-key-label">{key.label}</span>
                          <span className="admin-key-prefix">{key.prefix}</span>
                        </div>
                        <span className="admin-key-date">
                          Last used: {key.lastUsedAt 
                            ? new Date(key.lastUsedAt).toLocaleString()
                            : 'Never'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin-empty-state">No API keys generated</p>
                )}
              </div>

              <div className="admin-detail-section">
                <h3>Recent Activity</h3>
                {userDetails.recentRequests.length > 0 ? (
                  <div className="admin-activity-list">
                    {userDetails.recentRequests.slice(0, 10).map((req, idx) => (
                      <div key={idx} className="admin-activity-item">
                        <span className="admin-activity-type">{req.type}</span>
                        <span className="admin-activity-time">
                          {new Date(req.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="admin-empty-state">No recent activity</p>
                )}
              </div>

              {/* Admin Actions */}
              <div className="admin-detail-section">
                <h3>Admin Actions</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn outline"
                    onClick={() => handleRevokeAllKeys(selectedUser)}
                    style={{
                      borderColor: '#FF9F1C',
                      color: '#FF9F1C'
                    }}
                  >
                    Revoke All API Keys
                  </button>
                  <button
                    className="btn outline"
                    onClick={() => handleDeleteUser(selectedUser)}
                    style={{
                      borderColor: '#f97373',
                      color: '#f97373'
                    }}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Users */}
      {stats && stats.topUsers && stats.topUsers.length > 0 && (
        <div className="admin-section">
          <h2 className="admin-section-title">Most Active Users (7 days)</h2>
          <div className="admin-top-users">
            {stats.topUsers.map((user, idx) => (
              <div
                key={user.id}
                className="admin-top-user"
                onClick={() => loadUserDetails(user.id)}
              >
                <span className="admin-top-user-rank">#{idx + 1}</span>
                <span className="admin-top-user-email">{user.email}</span>
                <span className="admin-top-user-count">
                  {user.requestCount.toLocaleString()} requests
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
