import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Users,
  Key,
  Activity,
  TrendingUp,
  Shield,
  Search,
  Calendar,
  BarChart3,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Settings,
  Flag,
  Heart,
  Wrench,
  Bell,
  FileText,
  MessageCircle,
  Lock,
  UserCog,
  BookOpen,
  Play,
  ChevronRight,
  X,
  UserX,
  UserCheck,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  Eye,
  Send,
  Check,
  XCircle,
  AlertTriangle,
  Server,
  Database,
  Zap,
  Globe,
  Mail,
  Save,
  Code,
  Terminal,
  Copy,
  ExternalLink,
  Filter,
  Menu
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import './Admin.css';

// Import admin sub-components
import UserManagement from './admin/UserManagement';
import RateLimits from './admin/RateLimits';
import FeatureFlags from './admin/FeatureFlags';
import HealthDashboard from './admin/HealthDashboard';
import MaintenanceMode from './admin/MaintenanceMode';
import NotificationManager from './admin/NotificationManager';
import ChangelogManager from './admin/ChangelogManager';
import SupportTickets from './admin/SupportTickets';
import RBACManager from './admin/RBACManager';
import TeamManagement from './admin/TeamManagement';
import DocsEditor from './admin/DocsEditor';
import APIPlayground from './admin/APIPlayground';

// Admin navigation tabs configuration
const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3, description: 'Platform statistics and quick actions' },
  { id: 'users', label: 'Users', icon: Users, description: 'User management and suspension controls' },
  { id: 'rate-limits', label: 'Rate Limits', icon: Settings, description: 'Configure rate limiting' },
  { id: 'feature-flags', label: 'Feature Flags', icon: Flag, description: 'Toggle features on/off' },
  { id: 'health', label: 'System Health', icon: Heart, description: 'Monitor system status' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, description: 'Maintenance mode controls' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Broadcast messages' },
  { id: 'changelog', label: 'Changelog', icon: FileText, description: 'Manage changelog entries' },
  { id: 'tickets', label: 'Tickets', icon: MessageCircle, description: 'Support ticket system' },
  { id: 'rbac', label: 'Access Control', icon: Lock, description: 'Roles and permissions' },
  { id: 'teams', label: 'Teams', icon: UserCog, description: 'Admin team management' },
  { id: 'docs', label: 'API Docs', icon: BookOpen, description: 'Edit documentation' },
  { id: 'playground', label: 'Playground', icon: Play, description: 'Test API endpoints' }
];

function Admin() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // User search state (for overview)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  // Check if user has admin access
  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Sync URL params with active tab
  useEffect(() => {
    if (activeTab !== 'overview') {
      setSearchParams({ tab: activeTab });
    } else {
      setSearchParams({});
    }
  }, [activeTab, setSearchParams]);

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
      toast.error('Search failed');
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
      toast.error('Failed to load user details');
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
        toast.success(`Successfully revoked ${data.revokedCount} key(s)`);
        loadUserDetails(userId);
      } else {
        toast.error(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to revoke keys:', err);
      toast.error('Failed to revoke keys');
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
        toast.success(data.message);
        setSelectedUser(null);
        setUserDetails(null);
        checkAdminAccess();
      } else {
        toast.error(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error('Failed to delete user');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar on mobile when tab is selected
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

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'rate-limits':
        return <RateLimits />;
      case 'feature-flags':
        return <FeatureFlags />;
      case 'health':
        return <HealthDashboard />;
      case 'maintenance':
        return <MaintenanceMode />;
      case 'notifications':
        return <NotificationManager />;
      case 'changelog':
        return <ChangelogManager />;
      case 'tickets':
        return <SupportTickets />;
      case 'rbac':
        return <RBACManager />;
      case 'teams':
        return <TeamManagement />;
      case 'docs':
        return <DocsEditor />;
      case 'playground':
        return <APIPlayground />;
      case 'overview':
      default:
        return renderOverview();
    }
  };

  // Overview content (original admin panel content)
  const renderOverview = () => (
    <>
      {/* Stats Grid */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card" onClick={() => setActiveTab('users')}>
            <div className="admin-stat-icon users">
              <Users size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Total Users</span>
              <span className="admin-stat-value">{stats.users?.total?.toLocaleString() || 0}</span>
              <span className="admin-stat-change positive">
                <ArrowUpRight size={14} />
                {stats.users?.last30Days || 0} new in 30 days
              </span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon keys">
              <Key size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">API Keys</span>
              <span className="admin-stat-value">{stats.apiKeys?.total?.toLocaleString() || 0}</span>
              <span className="admin-stat-meta">
                {stats.apiKeys?.activePercentage || 0}% of users
              </span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon activity">
              <Activity size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Requests (24h)</span>
              <span className="admin-stat-value">{stats.requests?.last24h?.toLocaleString() || 0}</span>
              <span className="admin-stat-meta">
                ~{stats.requests?.avgPerDay?.toLocaleString() || 0}/day avg
              </span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon total">
              <BarChart3 size={24} />
            </div>
            <div className="admin-stat-content">
              <span className="admin-stat-label">Total Requests</span>
              <span className="admin-stat-value">{stats.requests?.total?.toLocaleString() || 0}</span>
              <span className="admin-stat-meta">All time</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-actions">
          {ADMIN_TABS.filter(tab => tab.id !== 'overview').map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className="admin-quick-action"
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="admin-quick-action-icon">
                  <Icon size={20} />
                </div>
                <div className="admin-quick-action-content">
                  <span className="admin-quick-action-label">{tab.label}</span>
                  <span className="admin-quick-action-desc">{tab.description}</span>
                </div>
                <ChevronRight size={16} />
              </button>
            );
          })}
        </div>
      </div>

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
                    {user.isSuspended && (
                      <span className="admin-user-badge suspended">Suspended</span>
                    )}
                  </div>
                  <div className="admin-user-stats">
                    <div className="admin-user-stat">
                      <Key size={14} />
                      <span>{user.apiKeyCount} keys</span>
                    </div>
                    <div className="admin-user-stat">
                      <Activity size={14} />
                      <span>{user.totalRequests?.toLocaleString() || 0} requests</span>
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
                  {user.requestCount?.toLocaleString() || 0} requests
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="admin-detail-section">
                <h3>Account Information</h3>
                <div className="admin-detail-grid">
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Email</span>
                    <span className="admin-detail-value">{userDetails.user?.email}</span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">User ID</span>
                    <span className="admin-detail-value">{userDetails.user?.id}</span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Workspace</span>
                    <span className="admin-detail-value">
                      {userDetails.user?.workspaceName || 'Main workspace'}
                    </span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Created</span>
                    <span className="admin-detail-value">
                      {new Date(userDetails.user?.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="admin-detail-item">
                    <span className="admin-detail-label">Status</span>
                    <span className={`admin-detail-value ${userDetails.user?.isSuspended ? 'suspended' : 'active'}`}>
                      {userDetails.user?.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>Usage Statistics</h3>
                <div className="admin-stats-mini">
                  <div className="admin-stat-mini">
                    <span className="admin-stat-mini-value">
                      {userDetails.stats?.totalRequests?.toLocaleString() || 0}
                    </span>
                    <span className="admin-stat-mini-label">Total Requests</span>
                  </div>
                  <div className="admin-stat-mini">
                    <span className="admin-stat-mini-value">
                      {userDetails.stats?.requests24h?.toLocaleString() || 0}
                    </span>
                    <span className="admin-stat-mini-label">Last 24h</span>
                  </div>
                  <div className="admin-stat-mini">
                    <span className="admin-stat-mini-value">
                      {userDetails.stats?.requests7d?.toLocaleString() || 0}
                    </span>
                    <span className="admin-stat-mini-label">Last 7 days</span>
                  </div>
                </div>
              </div>

              <div className="admin-detail-section">
                <h3>API Keys</h3>
                {userDetails.apiKeys?.length > 0 ? (
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
                {userDetails.recentRequests?.length > 0 ? (
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
                <div className="admin-actions-row">
                  <button
                    className="btn outline warning"
                    onClick={() => handleRevokeAllKeys(selectedUser)}
                  >
                    <Key size={16} />
                    Revoke All API Keys
                  </button>
                  <button
                    className="btn outline danger"
                    onClick={() => handleDeleteUser(selectedUser)}
                  >
                    <Trash2 size={16} />
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="admin-layout">
      {/* Mobile Menu Toggle */}
      <button 
        className="admin-mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-overlay open" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <Shield size={24} />
            {!sidebarCollapsed && <span>Admin Panel</span>}
          </div>
          <button 
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <nav className="admin-sidebar-nav">
          {ADMIN_TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
                title={sidebarCollapsed ? tab.label : undefined}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{tab.label}</span>}
              </button>
            );
          })}
        </nav>
        
        <div className="admin-sidebar-footer">
          <button 
            className="admin-nav-item"
            onClick={() => navigate('/dashboard')}
            title={sidebarCollapsed ? 'Back to Dashboard' : undefined}
          >
            <ArrowUpRight size={18} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="admin-main-inner">
          {/* Header */}
          <div className="admin-header">
            <div>
              <div className="admin-breadcrumb">
                <Shield size={14} />
                <span>Admin</span>
                <ChevronRight size={14} />
                <span>{ADMIN_TABS.find(t => t.id === activeTab)?.label}</span>
              </div>
              <h1>{ADMIN_TABS.find(t => t.id === activeTab)?.label}</h1>
              <p>{ADMIN_TABS.find(t => t.id === activeTab)?.description}</p>
            </div>
            <div className="admin-header-actions">
              <button className="btn outline" onClick={checkAdminAccess}>
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="admin-content">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
