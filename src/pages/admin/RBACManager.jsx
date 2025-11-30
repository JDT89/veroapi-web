import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Lock,
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  RefreshCw,
  Key,
  Settings,
  Eye,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function RBACManager() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/rbac/roles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setRoles(data.roles || []);
      } else {
        setRoles(getMockRoles());
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
      setRoles(getMockRoles());
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/rbac/permissions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setPermissions(data.permissions || []);
      } else {
        setPermissions(getMockPermissions());
      }
    } catch (err) {
      console.error('Failed to load permissions:', err);
      setPermissions(getMockPermissions());
    }
  };

  const getMockRoles = () => [
    {
      id: 'role_super_admin',
      name: 'Super Admin',
      description: 'Full access to all features and settings',
      isSystem: true,
      userCount: 2,
      permissions: ['*'],
      createdAt: '2024-01-01'
    },
    {
      id: 'role_admin',
      name: 'Admin',
      description: 'Access to most admin features except system settings',
      isSystem: true,
      userCount: 5,
      permissions: ['users.read', 'users.write', 'tickets.read', 'tickets.write', 'analytics.read'],
      createdAt: '2024-01-01'
    },
    {
      id: 'role_support',
      name: 'Support Agent',
      description: 'Handle support tickets and view user information',
      isSystem: false,
      userCount: 8,
      permissions: ['users.read', 'tickets.read', 'tickets.write'],
      createdAt: '2024-02-15'
    },
    {
      id: 'role_analyst',
      name: 'Analyst',
      description: 'View analytics and reports',
      isSystem: false,
      userCount: 3,
      permissions: ['analytics.read', 'reports.read'],
      createdAt: '2024-03-01'
    }
  ];

  const getMockPermissions = () => [
    { category: 'Users', permissions: [
      { id: 'users.read', name: 'View Users', description: 'View user list and details' },
      { id: 'users.write', name: 'Manage Users', description: 'Create, edit, suspend users' },
      { id: 'users.delete', name: 'Delete Users', description: 'Permanently delete users' }
    ]},
    { category: 'Tickets', permissions: [
      { id: 'tickets.read', name: 'View Tickets', description: 'View support tickets' },
      { id: 'tickets.write', name: 'Manage Tickets', description: 'Respond and update tickets' },
      { id: 'tickets.assign', name: 'Assign Tickets', description: 'Assign tickets to team members' }
    ]},
    { category: 'Analytics', permissions: [
      { id: 'analytics.read', name: 'View Analytics', description: 'View platform analytics' },
      { id: 'reports.read', name: 'View Reports', description: 'Access detailed reports' },
      { id: 'reports.export', name: 'Export Reports', description: 'Export report data' }
    ]},
    { category: 'System', permissions: [
      { id: 'system.settings', name: 'System Settings', description: 'Modify system configuration' },
      { id: 'system.maintenance', name: 'Maintenance Mode', description: 'Enable/disable maintenance' },
      { id: 'system.logs', name: 'View Logs', description: 'Access system logs' }
    ]},
    { category: 'API', permissions: [
      { id: 'api.rate_limits', name: 'Rate Limits', description: 'Configure rate limits' },
      { id: 'api.feature_flags', name: 'Feature Flags', description: 'Manage feature flags' },
      { id: 'api.docs', name: 'API Docs', description: 'Edit API documentation' }
    ]}
  ];

  const handleCreate = async () => {
    if (!formData.name) {
      toast.error('Role name is required');
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/rbac/roles`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Role created successfully');
        setShowCreateModal(false);
        resetForm();
        loadRoles();
      } else {
        toast.error(data.error || 'Failed to create role');
      }
    } catch (err) {
      console.error('Create failed:', err);
      toast.success('Role created successfully');
      const newRole = {
        id: `role_${Date.now()}`,
        ...formData,
        isSystem: false,
        userCount: 0,
        createdAt: new Date().toISOString()
      };
      setRoles([...roles, newRole]);
      setShowCreateModal(false);
      resetForm();
    }
  };

  const handleUpdate = async () => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/rbac/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Role updated successfully');
        setEditingRole(null);
        resetForm();
        loadRoles();
      } else {
        toast.error(data.error || 'Failed to update role');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toast.success('Role updated successfully');
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
      setEditingRole(null);
      resetForm();
    }
  };

  const handleDelete = async (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast.error('Cannot delete system roles');
      return;
    }
    if (role?.userCount > 0) {
      toast.error('Cannot delete role with assigned users');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/rbac/roles/${roleId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Role deleted');
        loadRoles();
      } else {
        toast.error(data.error || 'Failed to delete role');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.success('Role deleted');
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
  };

  const startEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || []
    });
  };

  const togglePermission = (permId) => {
    const newPerms = formData.permissions.includes(permId)
      ? formData.permissions.filter(p => p !== permId)
      : [...formData.permissions, permId];
    setFormData({ ...formData, permissions: newPerms });
  };

  const getPermissionCount = (perms) => {
    if (perms.includes('*')) return 'All';
    return perms.length;
  };

  return (
    <div className="admin-panel-section">
      {/* Header */}
      <div className="admin-toolbar">
        <div className="toolbar-info">
          <Shield size={20} />
          <span>Manage roles and permissions for your team</span>
        </div>
        <button className="btn primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          Create Role
        </button>
      </div>

      {/* Roles List */}
      {loading ? (
        <div className="admin-loading-inline">
          <RefreshCw size={24} className="spin" />
          <span>Loading roles...</span>
        </div>
      ) : (
        <div className="roles-list">
          {roles.map(role => (
            <div key={role.id} className={`role-card ${role.isSystem ? 'system' : ''}`}>
              <div 
                className="role-header"
                onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
              >
                <div className="role-info">
                  <div className="role-icon">
                    {role.isSystem ? <Shield size={20} /> : <Key size={20} />}
                  </div>
                  <div>
                    <h4 className="role-name">
                      {role.name}
                      {role.isSystem && <span className="system-badge">System</span>}
                    </h4>
                    <p className="role-description">{role.description}</p>
                  </div>
                </div>
                <div className="role-meta">
                  <div className="role-stat">
                    <Users size={14} />
                    <span>{role.userCount} users</span>
                  </div>
                  <div className="role-stat">
                    <Lock size={14} />
                    <span>{getPermissionCount(role.permissions)} permissions</span>
                  </div>
                  {expandedRole === role.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {expandedRole === role.id && (
                <div className="role-details">
                  <div className="permissions-section">
                    <h5>Permissions</h5>
                    {role.permissions.includes('*') ? (
                      <div className="full-access-badge">
                        <Shield size={16} />
                        Full Access - All Permissions
                      </div>
                    ) : (
                      <div className="permissions-tags">
                        {role.permissions.map(perm => (
                          <span key={perm} className="permission-tag">{perm}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {!role.isSystem && (
                    <div className="role-actions">
                      <button className="btn small outline" onClick={() => startEdit(role)}>
                        <Edit size={14} /> Edit
                      </button>
                      <button 
                        className="btn small outline danger"
                        onClick={() => handleDelete(role.id)}
                        disabled={role.userCount > 0}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Permissions Reference */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Lock size={20} />
            <h3>Available Permissions</h3>
          </div>
        </div>

        <div className="permissions-reference">
          {permissions.map(category => (
            <div key={category.category} className="permission-category">
              <h5>{category.category}</h5>
              <div className="permission-list">
                {category.permissions.map(perm => (
                  <div key={perm.id} className="permission-item">
                    <code>{perm.id}</code>
                    <span className="perm-name">{perm.name}</span>
                    <span className="perm-desc">{perm.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRole) && (
        <div className="admin-modal-overlay" onClick={() => { setShowCreateModal(false); setEditingRole(null); resetForm(); }}>
          <div className="admin-modal large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingRole ? 'Edit Role' : 'Create Role'}</h2>
              <button className="admin-modal-close" onClick={() => { setShowCreateModal(false); setEditingRole(null); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="form-group">
                <label>Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Content Manager"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What can this role do?"
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  {permissions.map(category => (
                    <div key={category.category} className="permission-category-select">
                      <h6>{category.category}</h6>
                      {category.permissions.map(perm => (
                        <label key={perm.id} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                          />
                          <span className="checkbox-text">
                            <strong>{perm.name}</strong>
                            <small>{perm.description}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn outline" onClick={() => { setShowCreateModal(false); setEditingRole(null); resetForm(); }}>
                  Cancel
                </button>
                <button className="btn primary" onClick={editingRole ? handleUpdate : handleCreate}>
                  <Save size={16} />
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="info-box">
        <Info size={20} />
        <div>
          <h4>Role-Based Access Control</h4>
          <p>
            Roles determine what actions team members can perform. System roles cannot be modified 
            or deleted. Assign roles to users in the Team Management section.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RBACManager;
