import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  Heart,
  Server,
  Database,
  Globe,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Clock,
  Zap,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function HealthDashboard() {
  const [health, setHealth] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadHealthData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setRefreshing(true);
    setError(null);
    
    const token = window.localStorage.getItem('veroapi_token');

    try {
      // Load health status
      const healthRes = await fetch(`${API_BASE_URL}/v1/health`);
      
      if (!healthRes.ok) {
        throw new Error('Failed to fetch health status');
      }
      
      const healthData = await healthRes.json();
      
      setHealth({
        ok: healthData.ok !== false,
        uptime: healthData.uptime || 0,
        version: healthData.version || '2.0.0',
        timestamp: new Date().toISOString()
      });

      // Try to load detailed metrics
      try {
        const metricsRes = await fetch(`${API_BASE_URL}/v1/admin/health/metrics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (metricsRes.ok) {
          const metricsData = await metricsRes.json();
          if (metricsData.ok !== false) {
            setMetrics(metricsData.metrics || null);
            setServices(metricsData.services || []);
          }
        }
      } catch (metricsErr) {
        console.warn('Could not load detailed metrics:', metricsErr);
        // Metrics are optional, don't fail the whole operation
      }
    } catch (err) {
      console.error('Failed to load health data:', err);
      if (!silent) {
        setError('Failed to load health data. Please try again.');
        toast.error('Failed to load health data');
      }
      setHealth({ ok: false, uptime: 0 });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHealthData();
    
    // Auto-refresh every 30 seconds if enabled
    const interval = setInterval(() => {
      if (autoRefresh) {
        loadHealthData(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, loadHealthData]);

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes) => {
    if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="status-icon healthy" size={18} />;
      case 'degraded':
        return <AlertTriangle className="status-icon degraded" size={18} />;
      case 'unhealthy':
        return <XCircle className="status-icon unhealthy" size={18} />;
      default:
        return <AlertTriangle className="status-icon unknown" size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-inline">
        <RefreshCw size={24} className="spin" />
        <span>Loading health data...</span>
      </div>
    );
  }

  return (
    <div className="admin-panel-section">
      {/* Header with Refresh */}
      <div className="health-header">
        <div className="health-status-indicator">
          {health?.ok ? (
            <>
              <CheckCircle size={24} className="status-icon healthy" />
              <span className="status-text healthy">All Systems Operational</span>
            </>
          ) : (
            <>
              <XCircle size={24} className="status-icon unhealthy" />
              <span className="status-text unhealthy">System Issues Detected</span>
            </>
          )}
        </div>
        
        <div className="health-actions">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <button 
            className="btn outline"
            onClick={() => loadHealthData()}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Uptime</span>
            <span className="metric-value">{formatUptime(health?.uptime || 0)}</span>
            <span className="metric-sub">API version {health?.version || '2.0.0'}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Zap size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Avg Response Time</span>
            <span className="metric-value">{metrics?.requests?.avgResponseTime || 0}ms</span>
            <span className="metric-sub success">
              <ArrowDown size={12} /> 5% from yesterday
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Activity size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Requests (24h)</span>
            <span className="metric-value">{(metrics?.requests?.last24h || 0).toLocaleString()}</span>
            <span className="metric-sub success">
              <ArrowUp size={12} /> 12% from yesterday
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Error Rate</span>
            <span className="metric-value">{metrics?.requests?.errorRate || 0}%</span>
            <span className="metric-sub">Last 24 hours</span>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Server size={20} />
            <h3>System Resources</h3>
          </div>
        </div>

        <div className="resources-grid">
          <div className="resource-item">
            <div className="resource-header">
              <Cpu size={18} />
              <span>CPU Usage</span>
              <span className="resource-value">{metrics?.cpu?.usage || 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${metrics?.cpu?.usage || 0}%`,
                  backgroundColor: metrics?.cpu?.usage > 80 ? 'var(--danger)' : 'var(--accent)'
                }} 
              />
            </div>
            <span className="resource-sub">{metrics?.cpu?.cores || 0} CPU cores</span>
          </div>

          <div className="resource-item">
            <div className="resource-header">
              <HardDrive size={18} />
              <span>Memory</span>
              <span className="resource-value">{metrics?.memory?.percentage || 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${metrics?.memory?.percentage || 0}%`,
                  backgroundColor: metrics?.memory?.percentage > 80 ? 'var(--danger)' : 'var(--accent)'
                }} 
              />
            </div>
            <span className="resource-sub">{metrics?.memory?.used || 0}GB / {metrics?.memory?.total || 0}GB</span>
          </div>

          <div className="resource-item">
            <div className="resource-header">
              <HardDrive size={18} />
              <span>Disk Usage</span>
              <span className="resource-value">{metrics?.disk?.percentage || 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${metrics?.disk?.percentage || 0}%`,
                  backgroundColor: metrics?.disk?.percentage > 80 ? 'var(--danger)' : 'var(--accent)'
                }} 
              />
            </div>
            <span className="resource-sub">{metrics?.disk?.used || 0}GB / {metrics?.disk?.total || 0}GB</span>
          </div>

          <div className="resource-item">
            <div className="resource-header">
              <Database size={18} />
              <span>DB Connections</span>
              <span className="resource-value">{metrics?.database?.connections || 0}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${((metrics?.database?.connections || 0) / (metrics?.database?.maxConnections || 100)) * 100}%`
                }} 
              />
            </div>
            <span className="resource-sub">Max {metrics?.database?.maxConnections || 100} connections</span>
          </div>
        </div>

        <div className="network-stats">
          <div className="network-stat">
            <Globe size={18} />
            <div>
              <span className="network-label">Network In</span>
              <span className="network-value">{formatBytes(metrics?.network?.bytesIn || 0)}/s</span>
            </div>
          </div>
          <div className="network-stat">
            <Globe size={18} />
            <div>
              <span className="network-label">Network Out</span>
              <span className="network-value">{formatBytes(metrics?.network?.bytesOut || 0)}/s</span>
            </div>
          </div>
          <div className="network-stat">
            <Database size={18} />
            <div>
              <span className="network-label">Avg Query Time</span>
              <span className="network-value">{metrics?.database?.queryTime || 0}ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <Heart size={20} />
            <h3>Service Health</h3>
          </div>
        </div>

        <div className="services-list">
          {services.map((service, idx) => (
            <div key={idx} className={`service-item ${service.status}`}>
              <div className="service-info">
                {getStatusIcon(service.status)}
                <span className="service-name">{service.name}</span>
              </div>
              <div className="service-meta">
                <span className={`service-status ${service.status}`}>
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </span>
                <span className="service-uptime">{service.uptime}% uptime</span>
                <span className="service-check">
                  Last check: {new Date(service.lastCheck).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Stats */}
      <div className="admin-card">
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={20} />
            <h3>Request Statistics</h3>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-box">
            <span className="stat-value">{(metrics?.requests?.total || 0).toLocaleString()}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{(metrics?.requests?.last24h || 0).toLocaleString()}</span>
            <span className="stat-label">Last 24 Hours</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{metrics?.requests?.avgResponseTime || 0}ms</span>
            <span className="stat-label">Avg Response Time</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{metrics?.requests?.errorRate || 0}%</span>
            <span className="stat-label">Error Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthDashboard;
