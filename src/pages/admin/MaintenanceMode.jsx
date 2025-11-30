import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Wrench,
  Power,
  PowerOff,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Save,
  Info,
  RefreshCw,
  MessageSquare,
  Timer,
  Bell
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function MaintenanceMode() {
  const [status, setStatus] = useState({
    enabled: false,
    message: '',
    startedAt: null,
    estimatedEndTime: null,
    scheduledMaintenance: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  const [message, setMessage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [scheduleStart, setScheduleStart] = useState('');
  const [scheduleEnd, setScheduleEnd] = useState('');
  const [scheduleMessage, setScheduleMessage] = useState('');

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/maintenance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        const newStatus = data.status || {
          enabled: false,
          message: '',
          startedAt: null,
          estimatedEndTime: null,
          scheduledMaintenance: null
        };
        setStatus(newStatus);
        if (newStatus.message) {
          setMessage(newStatus.message);
        }
      } else {
        throw new Error(data.error || 'Failed to load maintenance status');
      }
    } catch (err) {
      console.error('Failed to load maintenance status:', err);
      setError('Failed to load maintenance status. Please try again.');
      toast.error('Failed to load maintenance status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleEnable = async () => {
    if (!message.trim()) {
      toast.error('Please enter a maintenance message');
      return;
    }

    setSaving(true);
    const token = window.localStorage.getItem('veroapi_token');
    const estimatedEndTime = new Date(Date.now() + estimatedDuration * 60000).toISOString();

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/maintenance/enable`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, estimatedEndTime })
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Maintenance mode enabled');
        loadStatus();
      } else {
        throw new Error(data.error || 'Failed to enable maintenance mode');
      }
    } catch (err) {
      console.error('Enable failed:', err);
      toast.error(err.message || 'Failed to enable maintenance mode');
    } finally {
      setSaving(false);
    }
  };

  const handleDisable = async () => {
    if (!window.confirm('Are you sure you want to disable maintenance mode? The API will become fully accessible again.')) {
      return;
    }

    setSaving(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/maintenance/disable`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Maintenance mode disabled');
        loadStatus();
      } else {
        throw new Error(data.error || 'Failed to disable maintenance mode');
      }
    } catch (err) {
      console.error('Disable failed:', err);
      toast.error(err.message || 'Failed to disable maintenance mode');
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleStart || !scheduleEnd) {
      toast.error('Please select start and end times');
      return;
    }

    if (new Date(scheduleStart) >= new Date(scheduleEnd)) {
      toast.error('End time must be after start time');
      return;
    }

    setSaving(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/maintenance/schedule`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          startTime: scheduleStart, 
          endTime: scheduleEnd, 
          message: scheduleMessage || 'Scheduled maintenance'
        })
      });
      const data = await res.json();
      
      if (res.ok && data.ok !== false) {
        toast.success('Maintenance scheduled successfully');
        loadStatus();
        setScheduleStart('');
        setScheduleEnd('');
        setScheduleMessage('');
      } else {
        throw new Error(data.error || 'Failed to schedule maintenance');
      }
    } catch (err) {
      console.error('Schedule failed:', err);
      toast.error(err.message || 'Failed to schedule maintenance');
    } finally {
      setSaving(false);
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString();
  };

  const getTimeRemaining = () => {
    if (!status.estimatedEndTime) return null;
    const remaining = new Date(status.estimatedEndTime) - new Date();
    if (remaining <= 0) return 'Overdue';
    
    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m remaining`;
    return `${minutes}m remaining`;
  };

  if (loading) {
    return (
      <div className="admin-loading-inline">
        <RefreshCw size={24} className="spin" />
        <span>Loading maintenance status...</span>
      </div>
    );
  }

  return (
    <div className="admin-panel-section">
      {/* Current Status */}
      <div className={`maintenance-status-card ${status.enabled ? 'active' : 'inactive'}`}>
        <div className="status-header">
          {status.enabled ? (
            <>
              <AlertTriangle size={32} className="status-icon warning" />
              <div>
                <h2>Maintenance Mode Active</h2>
                <p>The API is currently in maintenance mode. Only admins can access the system.</p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle size={32} className="status-icon success" />
              <div>
                <h2>System Operational</h2>
                <p>The API is fully accessible to all users.</p>
              </div>
            </>
          )}
        </div>

        {status.enabled && (
          <div className="maintenance-details">
            <div className="detail-item">
              <Clock size={16} />
              <span>Started: {formatDateTime(status.startedAt)}</span>
            </div>
            <div className="detail-item">
              <Timer size={16} />
              <span>Est. End: {formatDateTime(status.estimatedEndTime)}</span>
            </div>
            {getTimeRemaining() && (
              <div className="detail-item highlight">
                <AlertTriangle size={16} />
                <span>{getTimeRemaining()}</span>
              </div>
            )}
            <div className="detail-item message">
              <MessageSquare size={16} />
              <span>{status.message}</span>
            </div>
          </div>
        )}

        <div className="status-actions">
          {status.enabled ? (
            <button 
              className="btn success large"
              onClick={handleDisable}
              disabled={saving}
            >
              <Power size={20} />
              {saving ? 'Disabling...' : 'Disable Maintenance Mode'}
            </button>
          ) : null}
        </div>
      </div>

      {/* Enable Maintenance */}
      {!status.enabled && (
        <div className="admin-card">
          <div className="card-header">
            <div className="card-title">
              <PowerOff size={20} />
              <h3>Enable Maintenance Mode</h3>
            </div>
            <p className="card-description">
              Put the API into maintenance mode. Users will receive a 503 Service Unavailable response.
            </p>
          </div>

          <div className="maintenance-form">
            <div className="form-group">
              <label>
                <MessageSquare size={16} />
                Maintenance Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="We're performing scheduled maintenance. Please check back soon."
                rows={3}
              />
              <span className="help-text">This message will be displayed to users trying to access the API.</span>
            </div>

            <div className="form-group">
              <label>
                <Timer size={16} />
                Estimated Duration (minutes)
              </label>
              <select
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(parseInt(e.target.value))}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={240}>4 hours</option>
                <option value={480}>8 hours</option>
              </select>
            </div>

            <button 
              className="btn warning large"
              onClick={handleEnable}
              disabled={saving || !message.trim()}
            >
              <PowerOff size={20} />
              {saving ? 'Enabling...' : 'Enable Maintenance Mode'}
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Maintenance */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Calendar size={20} />
            <h3>Schedule Maintenance</h3>
          </div>
          <p className="card-description">
            Schedule a future maintenance window. Users will be notified in advance.
          </p>
        </div>

        {status.scheduledMaintenance ? (
          <div className="scheduled-info">
            <div className="scheduled-badge">
              <Calendar size={16} />
              <span>Scheduled Maintenance</span>
            </div>
            <div className="scheduled-details">
              <div className="detail-row">
                <span className="label">Start:</span>
                <span>{formatDateTime(status.scheduledMaintenance.startTime)}</span>
              </div>
              <div className="detail-row">
                <span className="label">End:</span>
                <span>{formatDateTime(status.scheduledMaintenance.endTime)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Message:</span>
                <span>{status.scheduledMaintenance.message}</span>
              </div>
            </div>
            <button className="btn outline danger">
              Cancel Scheduled Maintenance
            </button>
          </div>
        ) : (
          <div className="schedule-form">
            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  value={scheduleStart}
                  onChange={(e) => setScheduleStart(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="datetime-local"
                  value={scheduleEnd}
                  onChange={(e) => setScheduleEnd(e.target.value)}
                  min={scheduleStart || new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notification Message</label>
              <textarea
                value={scheduleMessage}
                onChange={(e) => setScheduleMessage(e.target.value)}
                placeholder="We will be performing scheduled maintenance during this window..."
                rows={2}
              />
            </div>

            <button 
              className="btn primary"
              onClick={handleSchedule}
              disabled={saving || !scheduleStart || !scheduleEnd}
            >
              <Calendar size={16} />
              {saving ? 'Scheduling...' : 'Schedule Maintenance'}
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="info-box warning">
        <AlertTriangle size={20} />
        <div>
          <h4>Important Notice</h4>
          <p>
            When maintenance mode is enabled, all API endpoints will return a 503 Service Unavailable 
            response except for admin-authenticated requests. Make sure to notify users before 
            enabling maintenance mode.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceMode;
