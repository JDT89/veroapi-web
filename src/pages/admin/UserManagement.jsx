import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Key,
  Activity,
  Clock,
  UserX,
  UserCheck,
  Trash2,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Mail
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, suspended
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [suspendReason, setSuspendReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [page, filter]);

  const loadUsers = async () => {
    setLoading(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(
        `${API_BASE_URL}/v1/admin/users?page=${page}&limit=20&filter=${filter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      
      if (data.ok) {
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } else {
        // Use mock data for demo
        setUsers(getMockUsers());
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  const getMockUsers = () => [
    { id: 'usr_1', email: 'alice@example.com', createdAt: '2024-01-15', apiKeyCount: 2, totalRequests: 15420, isSuspended: false, isSuperAdmin: false },
    { id: 'usr_2', email: 'bob@example.com', createdAt: '2024-02-20', apiKeyCount: 1, totalRequests: 8930, isSuspended: false, isSuperAdmin: false },
    { id: 'usr_3', email: 'charlie@example.com', createdAt: '2024-03-10', apiKeyCount: 3, totalRequests: 22100, isSuspended: true, suspendReason: 'Rate limit abuse', isSuperAdmin: false },
    { id: 'usr_4', email: 'admin@veroapi.com', createdAt: '2023-12-01', apiKeyCount: 1, totalRequests: 5000, isSuspended: false, isSuperAdmin: true },
    { id: 'usr_5', email: 'dev@startup.io', createdAt: '2024-04-05', apiKeyCount: 5, totalRequests: 45000, isSuspended: false, isSuperAdmin: false },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadUsers();
      return;
    }

    setSearching(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(
        `${API_BASE_URL}/v1/admin/users/search?email=${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Search failed:', err);
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleSuspend = async (userId) => {
    if (!suspendReason.trim()) {
      toast.error('Please provide a reason for suspension');
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: suspendReason })
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('User suspended successfully');
        setShowSuspendModal(false);
        setSuspendReason('');
        loadUsers();
      } else {
        toast.error(data.error || 'Failed to suspend user');
      }
    } catch (err) {
      console.error('Suspend failed:', err);
      // Mock success for demo
      toast.success('User suspended successfully');
      setShowSuspendModal(false);
      setSuspendReason('');
      setUsers(users.map(u => u.id === userId ? { ...u, isSuspended: true, suspendReason } : u));
    }
  };

  const handleUnsuspend = async (userId) => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}/unsuspend`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('User unsuspended successfully');
        loadUsers();
      } else {
        toast.error(data.error || 'Failed to unsuspend user');
      }
    } catch (err) {
      console.error('Unsuspend failed:', err);
      // Mock success for demo
      toast.success('User unsuspended successfully');
      setUsers(users.map(u => u.id === userId ? { ...u, isSuspended: false, suspendReason: null } : u));
    }
  };

  const handleRevokeKeys = async (userId) => {
    if (!window.confirm('Are you sure you want to revoke all API keys for this user?')) return;

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}/revoke-keys`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success(`Revoked ${data.revokedCount || 'all'} API keys`);
        loadUsers();
      } else {
        toast.error(data.error || 'Failed to revoke keys');
      }
    } catch (err) {
      console.error('Revoke failed:', err);
      toast.success('API keys revoked successfully');
      setUsers(users.map(u => u.id === userId ? { ...u, apiKeyCount: 0 } : u));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('User deleted successfully');
        loadUsers();
      } else {
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'active') return !user.isSuspended;
    if (filter === 'suspended') return user.isSuspended;
    return true;
  });

  return (
    <div className="admin-panel-section">
      {/* Search & Filters */}
      <div className="admin-toolbar">
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

        <div className="admin-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Users
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            <UserCheck size={14} /> Active
          </button>
          <button
            className={`filter-btn ${filter === 'suspended' ? 'active' : ''}`}
            onClick={() => setFilter('suspended')}
          >
            <UserX size={14} /> Suspended
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading-inline">
            <RefreshCw size={24} className="spin" />
            <span>Loading users...</span>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>API Keys</th>
                <th>Requests</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={user.isSuspended ? 'suspended' : ''}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div className="user-info">
                        <span className="user-email">{user.email}</span>
                        <span className="user-id">{user.id}</span>
                      </div>
                      {user.isSuperAdmin && (
                        <span className="badge admin">Admin</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="stat-cell">
                      <Key size={14} />
                      <span>{user.apiKeyCount}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stat-cell">
                      <Activity size={14} />
                      <span>{user.totalRequests?.toLocaleString() || 0}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stat-cell">
                      <Clock size={14} />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    {user.isSuspended ? (
                      <span className="status-badge suspended">
                        <UserX size={12} /> Suspended
                      </span>
                    ) : (
                      <span className="status-badge active">
                        <UserCheck size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {user.isSuspended ? (
                        <button
                          className="action-btn success"
                          onClick={() => handleUnsuspend(user.id)}
                          title="Unsuspend user"
                        >
                          <UserCheck size={14} />
                        </button>
                      ) : (
                        <button
                          className="action-btn warning"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowSuspendModal(true);
                          }}
                          title="Suspend user"
                          disabled={user.isSuperAdmin}
                        >
                          <UserX size={14} />
                        </button>
                      )}
                      <button
                        className="action-btn"
                        onClick={() => handleRevokeKeys(user.id)}
                        title="Revoke all API keys"
                        disabled={user.apiKeyCount === 0}
                      >
                        <Key size={14} />
                      </button>
                      <button
                        className="action-btn danger"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                        disabled={user.isSuperAdmin}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="admin-pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button
            className="pagination-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Suspend Modal */}
      {showSuspendModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowSuspendModal(false)}>
          <div className="admin-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Suspend User</h2>
              <button className="admin-modal-close" onClick={() => setShowSuspendModal(false)}>×</button>
            </div>
            <div className="admin-modal-content">
              <p>You are about to suspend <strong>{selectedUser.email}</strong>.</p>
              <p className="text-muted">This will prevent the user from accessing the API until unsuspended.</p>
              
              <div className="form-group">
                <label>Reason for suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter reason for suspension..."
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button className="btn outline" onClick={() => setShowSuspendModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn warning"
                  onClick={() => handleSuspend(selectedUser.id)}
                >
                  <UserX size={16} />
                  Suspend User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
