import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Flag,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  Search,
  RefreshCw,
  Info,
  Users,
  Globe,
  Percent,
  Calendar,
  Code,
  Tag
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function FeatureFlags() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    enabled: false,
    rolloutPercentage: 100,
    targetUsers: [],
    environment: 'all',
    expiresAt: ''
  });

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/feature-flags`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        setFlags(data.flags || []);
      } else {
        throw new Error(data.error || 'Failed to load feature flags');
      }
    } catch (err) {
      console.error('Failed to load flags:', err);
      setError('Failed to load feature flags. Please try again.');
      toast.error('Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggle = async (flagId, currentState) => {
    setActionLoading(prev => ({ ...prev, [flagId]: 'toggle' }));
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/feature-flags/${flagId}/toggle`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: !currentState })
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success(`Flag ${!currentState ? 'enabled' : 'disabled'}`);
        loadFlags();
      } else {
        throw new Error(data.error || 'Failed to toggle flag');
      }
    } catch (err) {
      console.error('Toggle failed:', err);
      toast.error(err.message || 'Failed to toggle flag');
    } finally {
      setActionLoading(prev => ({ ...prev, [flagId]: null }));
    }
  };

  const handleCreate = async () => {
    if (!formData.key || !formData.name) {
      toast.error('Key and name are required');
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/feature-flags`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Feature flag created');
        setShowCreateModal(false);
        resetForm();
        loadFlags();
      } else {
        throw new Error(data.error || 'Failed to create flag');
      }
    } catch (err) {
      console.error('Create failed:', err);
      toast.error(err.message || 'Failed to create flag');
    }
  };

  const handleUpdate = async () => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/feature-flags/${editingFlag.id}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Feature flag updated');
        setEditingFlag(null);
        resetForm();
        loadFlags();
      } else {
        throw new Error(data.error || 'Failed to update flag');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(err.message || 'Failed to update flag');
    }
  };

  const handleDelete = async (flagId) => {
    if (!window.confirm('Are you sure you want to delete this feature flag?')) return;

    setActionLoading(prev => ({ ...prev, [flagId]: 'delete' }));
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/feature-flags/${flagId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Feature flag deleted');
        loadFlags();
      } else {
        throw new Error(data.error || 'Failed to delete flag');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.message || 'Failed to delete flag');
    } finally {
      setActionLoading(prev => ({ ...prev, [flagId]: null }));
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      name: '',
      description: '',
      enabled: false,
      rolloutPercentage: 100,
      targetUsers: [],
      environment: 'all',
      expiresAt: ''
    });
  };

  const startEdit = (flag) => {
    setEditingFlag(flag);
    setFormData({
      key: flag.key,
      name: flag.name,
      description: flag.description || '',
      enabled: flag.enabled,
      rolloutPercentage: flag.rolloutPercentage,
      targetUsers: flag.targetUsers || [],
      environment: flag.environment || 'all',
      expiresAt: flag.expiresAt || ''
    });
  };

  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         flag.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'enabled' && flag.enabled) ||
                         (filterStatus === 'disabled' && !flag.enabled);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-panel-section">
      {/* Header */}
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search flags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="admin-filters">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === 'enabled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('enabled')}
          >
            <ToggleRight size={14} /> Enabled
          </button>
          <button
            className={`filter-btn ${filterStatus === 'disabled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('disabled')}
          >
            <ToggleLeft size={14} /> Disabled
          </button>
        </div>

        <button className="btn primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          New Flag
        </button>
      </div>

      {/* Flags Grid */}
      {loading ? (
        <div className="admin-loading-inline">
          <RefreshCw size={24} className="spin" />
          <span>Loading feature flags...</span>
        </div>
      ) : filteredFlags.length === 0 ? (
        <div className="empty-state">
          <Flag size={48} />
          <h4>No Feature Flags</h4>
          <p>Create your first feature flag to start controlling feature rollouts</p>
          <button className="btn primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Create Flag
          </button>
        </div>
      ) : (
        <div className="flags-grid">
          {filteredFlags.map(flag => (
            <div key={flag.id} className={`flag-card ${flag.enabled ? 'enabled' : 'disabled'}`}>
              <div className="flag-header">
                <div className="flag-info">
                  <code className="flag-key">{flag.key}</code>
                  <h4 className="flag-name">{flag.name}</h4>
                </div>
                <button
                  className={`toggle-btn ${flag.enabled ? 'on' : 'off'}`}
                  onClick={() => handleToggle(flag.id, flag.enabled)}
                >
                  {flag.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              <p className="flag-description">{flag.description}</p>

              <div className="flag-meta">
                <div className="flag-meta-item">
                  <Percent size={14} />
                  <span>{flag.rolloutPercentage}% rollout</span>
                </div>
                <div className="flag-meta-item">
                  <Globe size={14} />
                  <span>{flag.environment}</span>
                </div>
                <div className="flag-meta-item">
                  <Calendar size={14} />
                  <span>Updated {new Date(flag.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flag-actions">
                <button className="btn small outline" onClick={() => startEdit(flag)}>
                  <Edit size={14} /> Edit
                </button>
                <button className="btn small outline danger" onClick={() => handleDelete(flag.id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingFlag) && (
        <div className="admin-modal-overlay" onClick={() => { setShowCreateModal(false); setEditingFlag(null); resetForm(); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}</h2>
              <button className="admin-modal-close" onClick={() => { setShowCreateModal(false); setEditingFlag(null); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="form-group">
                <label>
                  <Code size={16} />
                  Flag Key
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g., new_feature"
                  disabled={!!editingFlag}
                />
                <span className="help-text">Unique identifier used in code. Cannot be changed after creation.</span>
              </div>

              <div className="form-group">
                <label>
                  <Tag size={16} />
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., New Feature"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this flag control?"
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Percent size={16} />
                    Rollout Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.rolloutPercentage}
                    onChange={(e) => setFormData({ ...formData, rolloutPercentage: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Globe size={16} />
                    Environment
                  </label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                  >
                    <option value="all">All Environments</option>
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  />
                  Enable this flag immediately
                </label>
              </div>

              <div className="modal-actions">
                <button className="btn outline" onClick={() => { setShowCreateModal(false); setEditingFlag(null); resetForm(); }}>
                  Cancel
                </button>
                <button className="btn primary" onClick={editingFlag ? handleUpdate : handleCreate}>
                  <Save size={16} />
                  {editingFlag ? 'Update Flag' : 'Create Flag'}
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
          <h4>Feature Flag Best Practices</h4>
          <p>
            Use feature flags to gradually roll out new features, run A/B tests, or quickly disable 
            features in production. Always clean up unused flags to prevent technical debt.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeatureFlags;
