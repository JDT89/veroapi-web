import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  UserCog,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Mail,
  Shield,
  RefreshCw,
  UserPlus,
  UserMinus,
  Settings,
  Key,
  Check,
  Crown,
  Search
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: ''
  });

  const [adminFormData, setAdminFormData] = useState({
    email: '',
    role: 'admin',
    teamId: ''
  });

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/teams`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        setTeams(data.teams || []);
      } else {
        throw new Error(data.error || 'Failed to load teams');
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
      setError('Failed to load teams. Please try again.');
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAdmins = useCallback(async () => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        setAdmins(data.admins || []);
      } else {
        throw new Error(data.error || 'Failed to load admins');
      }
    } catch (err) {
      console.error('Failed to load admins:', err);
      toast.error('Failed to load admins');
    }
  }, []);

  useEffect(() => {
    loadTeams();
    loadAdmins();
  }, [loadTeams, loadAdmins]);

  const handleCreateTeam = async () => {
    if (!teamFormData.name) {
      toast.error('Team name is required');
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/teams`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamFormData)
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Team created successfully');
        setShowCreateTeamModal(false);
        resetTeamForm();
        loadTeams();
      } else {
        throw new Error(data.error || 'Failed to create team');
      }
    } catch (err) {
      console.error('Create failed:', err);
      toast.error(err.message || 'Failed to create team');
    }
  };

  const handleUpdateTeam = async () => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/teams/${editingTeam.id}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(teamFormData)
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Team updated successfully');
        setEditingTeam(null);
        resetTeamForm();
        loadTeams();
      } else {
        throw new Error(data.error || 'Failed to update team');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(err.message || 'Failed to update team');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (team?.memberCount > 0) {
      toast.error('Cannot delete team with members. Remove all members first.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this team?')) return;

    setActionLoading(prev => ({ ...prev, [teamId]: 'delete' }));
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/teams/${teamId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Team deleted');
        loadTeams();
      } else {
        throw new Error(data.error || 'Failed to delete team');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.message || 'Failed to delete team');
    } finally {
      setActionLoading(prev => ({ ...prev, [teamId]: null }));
    }
  };

  const handleAddAdmin = async () => {
    if (!adminFormData.email) {
      toast.error('Email is required');
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/admins`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminFormData)
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Admin invited successfully');
        setShowAddAdminModal(false);
        resetAdminForm();
        loadAdmins();
      } else {
        throw new Error(data.error || 'Failed to add admin');
      }
    } catch (err) {
      console.error('Add admin failed:', err);
      toast.error(err.message || 'Failed to add admin');
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    const admin = admins.find(a => a.id === adminId);
    if (admin?.role === 'super_admin') {
      toast.error('Cannot remove super admin');
      return;
    }
    if (!window.confirm(`Remove ${admin?.email} from the admin team?`)) return;

    setActionLoading(prev => ({ ...prev, [adminId]: 'remove' }));
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Admin removed');
        loadAdmins();
      } else {
        throw new Error(data.error || 'Failed to remove admin');
      }
    } catch (err) {
      console.error('Remove failed:', err);
      toast.error(err.message || 'Failed to remove admin');
    } finally {
      setActionLoading(prev => ({ ...prev, [adminId]: null }));
    }
  };

  const resetTeamForm = () => {
    setTeamFormData({ name: '', description: '' });
  };

  const resetAdminForm = () => {
    setAdminFormData({ email: '', role: 'admin', teamId: '' });
  };

  const startEditTeam = (team) => {
    setEditingTeam(team);
    setTeamFormData({
      name: team.name,
      description: team.description || ''
    });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'super_admin': return <Crown size={14} className="role-icon super" />;
      case 'admin': return <Shield size={14} className="role-icon admin" />;
      case 'support': return <Users size={14} className="role-icon support" />;
      default: return <Key size={14} className="role-icon" />;
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.teamName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTeamAdmins = (teamId) => admins.filter(a => a.teamId === teamId);

  return (
    <div className="admin-panel-section">
      {/* Teams Section */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Users size={20} />
            <h3>Teams</h3>
          </div>
          <button className="btn primary" onClick={() => setShowCreateTeamModal(true)}>
            <Plus size={16} />
            New Team
          </button>
        </div>

        {loading ? (
          <div className="admin-loading-inline">
            <RefreshCw size={24} className="spin" />
            <span>Loading teams...</span>
          </div>
        ) : teams.length === 0 ? (
          <div className="empty-state small">
            <Users size={32} />
            <p>No teams created yet</p>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map(team => (
              <div 
                key={team.id} 
                className={`team-card ${selectedTeam === team.id ? 'selected' : ''}`}
                onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
              >
                <div className="team-header">
                  <h4>{team.name}</h4>
                  <div className="team-actions">
                    <button className="action-btn" onClick={(e) => { e.stopPropagation(); startEditTeam(team); }}>
                      <Edit size={14} />
                    </button>
                    <button 
                      className="action-btn danger"
                      onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id); }}
                      disabled={team.memberCount > 0}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="team-description">{team.description}</p>
                <div className="team-stats">
                  <span className="team-stat">
                    <UserCog size={14} />
                    {team.memberCount} members
                  </span>
                </div>

                {selectedTeam === team.id && (
                  <div className="team-members">
                    <h5>Team Members</h5>
                    {getTeamAdmins(team.id).length === 0 ? (
                      <p className="no-members">No members yet</p>
                    ) : (
                      <div className="members-list">
                        {getTeamAdmins(team.id).map(admin => (
                          <div key={admin.id} className="member-item">
                            <div className="member-avatar">
                              {admin.email[0].toUpperCase()}
                            </div>
                            <div className="member-info">
                              <span className="member-email">{admin.email}</span>
                              <span className="member-role">
                                {getRoleIcon(admin.role)}
                                {admin.roleName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admins Section */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <UserCog size={20} />
            <h3>Admin Users</h3>
          </div>
          <button className="btn primary" onClick={() => setShowAddAdminModal(true)}>
            <UserPlus size={16} />
            Add Admin
          </button>
        </div>

        <div className="admin-toolbar compact">
          <div className="admin-search-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        <div className="admins-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Team</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map(admin => (
                <tr key={admin.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar small">
                        {admin.email[0].toUpperCase()}
                      </div>
                      <span className="user-email">{admin.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${admin.role}`}>
                      {getRoleIcon(admin.role)}
                      {admin.roleName}
                    </span>
                  </td>
                  <td>{admin.teamName || 'Unassigned'}</td>
                  <td>
                    {admin.lastActive 
                      ? new Date(admin.lastActive).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="Edit role">
                        <Settings size={14} />
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => handleRemoveAdmin(admin.id)}
                        disabled={admin.role === 'super_admin'}
                        title="Remove admin"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Team Modal */}
      {(showCreateTeamModal || editingTeam) && (
        <div className="admin-modal-overlay" onClick={() => { setShowCreateTeamModal(false); setEditingTeam(null); resetTeamForm(); }}>
          <div className="admin-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingTeam ? 'Edit Team' : 'Create Team'}</h2>
              <button className="admin-modal-close" onClick={() => { setShowCreateTeamModal(false); setEditingTeam(null); resetTeamForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="form-group">
                <label>Team Name</label>
                <input
                  type="text"
                  value={teamFormData.name}
                  onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                  placeholder="e.g., Engineering Team"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={teamFormData.description}
                  onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                  placeholder="What does this team handle?"
                  rows={2}
                />
              </div>

              <div className="modal-actions">
                <button className="btn outline" onClick={() => { setShowCreateTeamModal(false); setEditingTeam(null); resetTeamForm(); }}>
                  Cancel
                </button>
                <button className="btn primary" onClick={editingTeam ? handleUpdateTeam : handleCreateTeam}>
                  <Save size={16} />
                  {editingTeam ? 'Update Team' : 'Create Team'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="admin-modal-overlay" onClick={() => { setShowAddAdminModal(false); resetAdminForm(); }}>
          <div className="admin-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Add Admin User</h2>
              <button className="admin-modal-close" onClick={() => { setShowAddAdminModal(false); resetAdminForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="form-group">
                <label>
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={adminFormData.email}
                  onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={adminFormData.role}
                  onChange={(e) => setAdminFormData({ ...adminFormData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="support">Support Agent</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assign to Team</label>
                <select
                  value={adminFormData.teamId}
                  onChange={(e) => setAdminFormData({ ...adminFormData, teamId: e.target.value })}
                >
                  <option value="">No team</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button className="btn outline" onClick={() => { setShowAddAdminModal(false); resetAdminForm(); }}>
                  Cancel
                </button>
                <button className="btn primary" onClick={handleAddAdmin}>
                  <UserPlus size={16} />
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamManagement;
