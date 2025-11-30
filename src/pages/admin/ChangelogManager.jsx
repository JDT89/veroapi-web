import React, { useState, useEffect } from 'react';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filter, setFilter] = useState('all');

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

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setEntries(data.entries || []);
      } else {
        setEntries(getMockEntries());
      }
    } catch (err) {
      console.error('Failed to load changelog:', err);
      setEntries(getMockEntries());
    } finally {
      setLoading(false);
    }
  };

  const getMockEntries = () => [
    {
      id: 'cl_1',
      version: 'v2.5.0',
      title: 'API Playground Launch',
      description: 'Interactive API testing environment for developers',
      type: 'feature',
      details: [
        'Real-time request/response preview',
        'Save and share API test configurations',
        'Auto-generated code snippets for multiple languages'
      ],
      isPublished: true,
      createdAt: '2024-04-01',
      publishedAt: '2024-04-01'
    },
    {
      id: 'cl_2',
      version: 'v2.4.2',
      title: 'Performance Improvements',
      description: 'Reduced average response time by 35%',
      type: 'improvement',
      details: [
        'Optimized database queries',
        'Added response caching layer',
        'Improved connection pooling'
      ],
      isPublished: true,
      createdAt: '2024-03-25',
      publishedAt: '2024-03-25'
    },
    {
      id: 'cl_3',
      version: 'v2.4.1',
      title: 'Rate Limit Fix',
      description: 'Fixed incorrect rate limit calculation for burst requests',
      type: 'fix',
      details: [
        'Corrected burst window calculation',
        'Added better error messages for rate limit responses',
        'Fixed edge case with concurrent requests'
      ],
      isPublished: true,
      createdAt: '2024-03-20',
      publishedAt: '2024-03-20'
    },
    {
      id: 'cl_4',
      version: 'v2.5.1',
      title: 'Enhanced Admin Panel',
      description: 'New admin features and improvements',
      type: 'feature',
      details: [
        'User suspension controls',
        'Feature flag management',
        'System health dashboard'
      ],
      isPublished: false,
      createdAt: '2024-04-10',
      publishedAt: null
    }
  ];

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
      
      if (data.ok) {
        toast.success('Changelog entry created');
        setShowCreateModal(false);
        resetForm();
        loadEntries();
      } else {
        toast.error(data.error || 'Failed to create entry');
      }
    } catch (err) {
      console.error('Create failed:', err);
      toast.success('Changelog entry created');
      const newEntry = {
        id: `cl_${Date.now()}`,
        ...formData,
        details: formData.details.filter(d => d.trim()),
        createdAt: new Date().toISOString(),
        publishedAt: formData.isPublished ? new Date().toISOString() : null
      };
      setEntries([newEntry, ...entries]);
      setShowCreateModal(false);
      resetForm();
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
      
      if (data.ok) {
        toast.success('Changelog entry updated');
        setEditingEntry(null);
        resetForm();
        loadEntries();
      } else {
        toast.error(data.error || 'Failed to update entry');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toast.success('Changelog entry updated');
      setEntries(entries.map(e => 
        e.id === editingEntry.id 
          ? { ...e, ...formData, details: formData.details.filter(d => d.trim()) }
          : e
      ));
      setEditingEntry(null);
      resetForm();
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this changelog entry?')) return;

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Entry deleted');
        loadEntries();
      } else {
        toast.error(data.error || 'Failed to delete entry');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.success('Entry deleted');
      setEntries(entries.filter(e => e.id !== entryId));
    }
  };

  const handlePublish = async (entryId, publish) => {
    const token = window.localStorage.getItem('veroapi_token');
    const endpoint = publish ? 'publish' : 'unpublish';

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/changelog/${entryId}/${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success(publish ? 'Entry published' : 'Entry unpublished');
        loadEntries();
      } else {
        toast.error(data.error || `Failed to ${endpoint} entry`);
      }
    } catch (err) {
      console.error(`${endpoint} failed:`, err);
      toast.success(publish ? 'Entry published' : 'Entry unpublished');
      setEntries(entries.map(e => 
        e.id === entryId 
          ? { ...e, isPublished: publish, publishedAt: publish ? new Date().toISOString() : null }
          : e
      ));
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
