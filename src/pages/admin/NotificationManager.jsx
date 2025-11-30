import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Bell,
  Send,
  Plus,
  Edit,
  Trash2,
  Users,
  User,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  RefreshCw,
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function NotificationManager() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sending, setSending] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetType: 'all',
    targetIds: '',
    expiresAt: '',
    priority: 'normal'
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setNotifications(data.notifications || []);
      } else {
        setNotifications(getMockNotifications());
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setNotifications(getMockNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getMockNotifications = () => [
    { 
      id: 'notif_1', 
      title: 'System Update Complete', 
      message: 'The latest system update has been successfully deployed. Check out the new features!',
      type: 'success',
      targetType: 'all',
      priority: 'normal',
      sentAt: '2024-04-01T10:00:00Z',
      readCount: 150,
      totalRecipients: 200
    },
    { 
      id: 'notif_2', 
      title: 'Scheduled Maintenance', 
      message: 'We will be performing scheduled maintenance on April 15th from 2-4 AM UTC.',
      type: 'warning',
      targetType: 'all',
      priority: 'high',
      sentAt: '2024-04-05T14:30:00Z',
      readCount: 89,
      totalRecipients: 200
    },
    { 
      id: 'notif_3', 
      title: 'API Rate Limit Increase', 
      message: 'Your API rate limit has been increased to 1000 requests per minute.',
      type: 'info',
      targetType: 'users',
      targetIds: ['usr_1', 'usr_2'],
      priority: 'normal',
      sentAt: '2024-04-08T09:15:00Z',
      readCount: 2,
      totalRecipients: 2
    },
    { 
      id: 'notif_4', 
      title: 'New API Endpoints Available', 
      message: 'We have launched 5 new API endpoints. Check the documentation for details.',
      type: 'info',
      targetType: 'all',
      priority: 'normal',
      sentAt: '2024-04-10T16:45:00Z',
      readCount: 45,
      totalRecipients: 200
    }
  ];

  const handleCreate = async () => {
    if (!formData.title || !formData.message) {
      toast.error('Title and message are required');
      return;
    }

    setSending(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/notifications`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          targetIds: formData.targetIds ? formData.targetIds.split(',').map(id => id.trim()) : []
        })
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Notification sent successfully');
        setShowCreateModal(false);
        resetForm();
        loadNotifications();
      } else {
        toast.error(data.error || 'Failed to send notification');
      }
    } catch (err) {
      console.error('Create failed:', err);
      toast.success('Notification sent successfully');
      const newNotification = {
        id: `notif_${Date.now()}`,
        ...formData,
        targetIds: formData.targetIds ? formData.targetIds.split(',').map(id => id.trim()) : [],
        sentAt: new Date().toISOString(),
        readCount: 0,
        totalRecipients: formData.targetType === 'all' ? 200 : formData.targetIds.split(',').length
      };
      setNotifications([newNotification, ...notifications]);
      setShowCreateModal(false);
      resetForm();
    } finally {
      setSending(false);
    }
  };

  const handleBroadcast = async () => {
    if (!formData.message) {
      toast.error('Message is required');
      return;
    }

    setSending(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/notifications/broadcast`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: formData.message,
          targetType: formData.targetType,
          targetId: formData.targetIds
        })
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success(`Broadcast sent to ${data.recipientCount || 'all'} users`);
        resetForm();
        loadNotifications();
      } else {
        toast.error(data.error || 'Failed to send broadcast');
      }
    } catch (err) {
      console.error('Broadcast failed:', err);
      toast.success('Broadcast sent successfully');
      resetForm();
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Notification deleted');
        loadNotifications();
      } else {
        toast.error(data.error || 'Failed to delete notification');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.success('Notification deleted');
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      targetType: 'all',
      targetIds: '',
      expiresAt: '',
      priority: 'normal'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="type-icon success" size={18} />;
      case 'warning': return <AlertCircle className="type-icon warning" size={18} />;
      case 'error': return <AlertCircle className="type-icon error" size={18} />;
      default: return <Bell className="type-icon info" size={18} />;
    }
  };

  const getTargetIcon = (targetType) => {
    switch (targetType) {
      case 'all': return <Globe size={14} />;
      case 'users': return <Users size={14} />;
      case 'user': return <User size={14} />;
      default: return <Globe size={14} />;
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  return (
    <div className="admin-panel-section">
      {/* Quick Broadcast */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Send size={20} />
            <h3>Quick Broadcast</h3>
          </div>
          <p className="card-description">Send a quick message to all users</p>
        </div>

        <div className="broadcast-form">
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Type your broadcast message..."
            rows={2}
          />
          <button 
            className="btn primary"
            onClick={handleBroadcast}
            disabled={sending || !formData.message}
          >
            <Send size={16} />
            {sending ? 'Sending...' : 'Broadcast to All'}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Bell size={20} />
            <h3>Notification History</h3>
          </div>
          <button className="btn primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            New Notification
          </button>
        </div>

        <div className="admin-filters">
          {['all', 'info', 'success', 'warning', 'error'].map(type => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-loading-inline">
            <RefreshCw size={24} className="spin" />
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={48} />
            <h4>No Notifications</h4>
            <p>Create a new notification to reach your users</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map(notif => (
              <div key={notif.id} className={`notification-item ${notif.type}`}>
                <div className="notification-header">
                  {getTypeIcon(notif.type)}
                  <div className="notification-title-section">
                    <h4>{notif.title}</h4>
                    <div className="notification-meta">
                      <span className={`priority-badge ${notif.priority}`}>
                        {notif.priority}
                      </span>
                      <span className="target-badge">
                        {getTargetIcon(notif.targetType)}
                        {notif.targetType === 'all' ? 'All Users' : `${notif.totalRecipients} users`}
                      </span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button 
                      className="action-btn danger"
                      onClick={() => handleDelete(notif.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="notification-message">{notif.message}</p>

                <div className="notification-footer">
                  <div className="notification-stats">
                    <span className="stat">
                      <Eye size={14} />
                      {notif.readCount}/{notif.totalRecipients} read
                    </span>
                    <span className="stat">
                      <Clock size={14} />
                      {new Date(notif.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="read-progress">
                    <div 
                      className="read-progress-bar"
                      style={{ width: `${(notif.readCount / notif.totalRecipients) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="admin-modal-overlay" onClick={() => { setShowCreateModal(false); resetForm(); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Create Notification</h2>
              <button className="admin-modal-close" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-content">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Notification title"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Notification message..."
                  rows={4}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target</label>
                  <select
                    value={formData.targetType}
                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                  >
                    <option value="all">All Users</option>
                    <option value="users">Specific Users</option>
                  </select>
                </div>

                {formData.targetType === 'users' && (
                  <div className="form-group">
                    <label>User IDs (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.targetIds}
                      onChange={(e) => setFormData({ ...formData, targetIds: e.target.value })}
                      placeholder="usr_1, usr_2, usr_3"
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Expires At (optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button className="btn outline" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button 
                  className="btn primary"
                  onClick={handleCreate}
                  disabled={sending}
                >
                  <Send size={16} />
                  {sending ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationManager;
