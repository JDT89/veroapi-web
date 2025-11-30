import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function ChangelogManager() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});

  const [formData, setFormData] = useState({
    version: '',
    title: '',
    description: '',
    type: 'feature',
    details: [''],
    isPublished: false
  });

  const typeOptions = [
    { value: 'feature', label: 'Feature', color: '#2EC4B6' },
    { value: 'improvement', label: 'Improvement', color: '#22c55e' },
    { value: 'fix', label: 'Bug Fix', color: '#FF9F1C' },
    { value: 'security', label: 'Security', color: '#f97373' },
    { value: 'deprecation', label: 'Deprecation', color: '#a855f7' }
  ];

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        setEntries(data.entries || []);
      } else {
        throw new Error(data.error || 'Failed to load changelog');
      }
    } catch (err) {
      console.error('Failed to load changelog:', err);
      setError('Failed to load changelog entries. Please try again.');
      toast.error('Failed to load changelog entries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleCreate = async () => {
    if (!formData.version || !formData.title) {
      toast.error('Version and title are required');
      return;
    }

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          details: formData.details.filter(d => d.trim())
        })
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Changelog entry created');
        setShowCreateModal(false);
        resetForm();
        loadEntries();
      } else {
        throw new Error(data.error || 'Failed to create entry');
      }
    } catch (err) {
      console.error('Create failed:', err);
      toast.error(err.message || 'Failed to create entry');
    }
  };

  const handleUpdate = async () => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog/${editingEntry.id}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          details: formData.details.filter(d => d.trim())
        })
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Changelog entry updated');
        setEditingEntry(null);
        resetForm();
        loadEntries();
      } else {
        throw new Error(data.error || 'Failed to update entry');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toast.error(err.message || 'Failed to update entry');
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this changelog entry?')) return;

    setActionLoading(prev => ({ ...prev, [entryId]: 'delete' }));
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Entry deleted');
        loadEntries();
      } else {
        throw new Error(data.error || 'Failed to delete entry');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.message || 'Failed to delete entry');
    } finally {
      setActionLoading(prev => ({ ...prev, [entryId]: null }));
    }
  };

  const handlePublish = async (entryId, publish) => {
    setActionLoading(prev => ({ ...prev, [entryId]: publish ? 'publish' : 'unpublish' }));
    const token = window.localStorage.getItem('veroapi_token');
    const endpoint = publish ? 'publish' : 'unpublish';

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog/${entryId}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success(publish ? 'Entry published' : 'Entry unpublished');
        loadEntries();
      } else {
        throw new Error(data.error || `Failed to ${endpoint} entry`);
      }
    } catch (err) {
      console.error(`${endpoint} failed:`, err);
      toast.error(err.message || `Failed to ${endpoint} entry`);
    } finally {
      setActionLoading(prev => ({ ...prev, [entryId]: null }));
    }
  };

  const resetForm = () => {
    setFormData({
      version: '',
      title: '',
      description: '',
      type: 'feature',
      details: [''],
      isPublished: false
    });
  };

  const startEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      version: entry.version,
      title: entry.title,
      description: entry.description || '',
      type: entry.type,
      details: entry.details?.length ? entry.details : [''],
      isPublished: entry.isPublished
    });
  };

  const addDetailField = () => {
    setFormData({ ...formData, details: [...formData.details, ''] });
  };

  const updateDetail = (index, value) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({ ...formData, details: newDetails });
  };

  const removeDetail = (index) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({ ...formData, details: newDetails.length ? newDetails : [''] });
  };

  const getTypeStyle = (type) => {
    const option = typeOptions.find(t => t.value === type);
    return option ? { background: `${option.color}20`, color: option.color, borderColor: option.color } : {};
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'published') return entry.isPublished;
    if (filter === 'draft') return !entry.isPublished;
    return entry.type === filter;
  });

  return (
    <div className="admin-panel-section">
      {/* Header */}
      <div className="admin-toolbar">
        <div className="admin-filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            All
          </button>
          <button className={`filter-btn ${filter === 'published' ? 'active' : ''}`} onClick={() => setFilter('published')}>
            <Globe size={14} /> Published
          </button>
          <button className={`filter-btn ${filter === 'draft' ? 'active' : ''}`} onClick={() => setFilter('draft')}>
            <EyeOff size={14} /> Drafts
          </button>
          {typeOptions.map(type => (
            <button
              key={type.value}
              className={`filter-btn ${filter === type.value ? 'active' : ''}`}
              onClick={() => setFilter(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>

        <button className="btn primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} />
          New Entry
        </button>
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="admin-loading-inline">
          <RefreshCw size={24} className="spin" />
          <span>Loading changelog entries...</span>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} />
          <h4>No Changelog Entries</h4>
          <p>Create your first changelog entry to keep users informed</p>
          <button className="btn primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Create Entry
          </button>
        </div>
      ) : (
        <div className="changelog-list">
          {filteredEntries.map(entry => (
            <div key={entry.id} className={`changelog-item ${entry.isPublished ? '' : 'draft'}`}>
              <div className="changelog-header">
                <div className="changelog-meta">
                  <span className="version-badge">{entry.version}</span>
                  <span className="type-badge" style={getTypeStyle(entry.type)}>
                    {entry.type}
                  </span>
                  {!entry.isPublished && (
                    <span className="draft-badge">
                      <EyeOff size={12} /> Draft
                    </span>
                  )}
                </div>
                <div className="changelog-actions">
                  {entry.isPublished ? (
                    <button 
                      className="action-btn"
                      onClick={() => handlePublish(entry.id, false)}
                      title="Unpublish"
                    >
                      <EyeOff size={14} />
                    </button>
                  ) : (
                    <button 
                      className="action-btn success"
                      onClick={() => handlePublish(entry.id, true)}
                      title="Publish"
                    >
                      <Eye size={14} />
                    </button>
                  )}
                  <button 
                    className="action-btn"
                    onClick={() => startEdit(entry)}
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="action-btn danger"
                    onClick={() => handleDelete(entry.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="changelog-title">{entry.title}</h3>
              <p className="changelog-description">{entry.description}</p>

              {entry.details?.length > 0 && (
                <ul className="changelog-details">
                  {entry.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}

              <div className="changelog-footer">
                <span className="changelog-date">
                  <Calendar size={14} />
                  Created: {new Date(entry.createdAt).toLocaleDateString()}
                </span>
                {entry.publishedAt && (
                  <span className="changelog-date published">
                    <Globe size={14} />
                    Published: {new Date(entry.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingEntry) && (
        <div className="admin-modal-overlay" onClick={() => { setShowCreateModal(false); setEditingEntry(null); resetForm(); }}>
          <div className="admin-modal large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{editingEntry ? 'Edit Changelog Entry' : 'Create Changelog Entry'}</h2>
              <button className="admin-modal-close" onClick={() => { setShowCreateModal(false); setEditingEntry(null); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <Tag size={16} />
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g., v2.5.0"
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    {typeOptions.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="What's new in this version?"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of the changes..."
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label>Details (bullet points)</label>
                {formData.details.map((detail, idx) => (
                  <div key={idx} className="detail-input-row">
                    <input
                      type="text"
                      value={detail}
                      onChange={(e) => updateDetail(idx, e.target.value)}
                      placeholder={`Detail ${idx + 1}`}
                    />
                    <button 
                      type="button"
                      className="btn small outline danger"
                      onClick={() => removeDetail(idx)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn small outline" onClick={addDetailField}>
                  <Plus size={14} /> Add Detail
                </button>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  Publish immediately
                </label>
              </div>

              <div className="modal-actions">
                <button className="btn outline" onClick={() => { setShowCreateModal(false); setEditingEntry(null); resetForm(); }}>
                  Cancel
                </button>
                <button 
                  className="btn primary"
                  onClick={editingEntry ? handleUpdate : handleCreate}
                >
                  <Save size={16} />
                  {editingEntry ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangelogManager;
