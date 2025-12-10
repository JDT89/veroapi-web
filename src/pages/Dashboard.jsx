import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Activity, Key, BarChart3, Clock, TrendingUp, TrendingDown, AlertCircle, 
  Copy, Eye, EyeOff, Download, Filter, Search, RefreshCw, Zap, Shield,
  Globe, Server, Code, CheckCircle, XCircle, Calendar, DollarSign,
  Users, ArrowUpRight, ArrowDownRight, Plus, Settings, FileText, Play
} from 'lucide-react';
import Navigation from '../components/Navigation';
import './Dashboard.css';

const Dashboard = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [timeRange, setTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('line');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApiKey, setSelectedApiKey] = useState('production');
  const [isRealTime, setIsRealTime] = useState(true);

  // API Keys
  const apiKeys = [
    { 
      id: 'production', 
      name: 'Production', 
      key: 'sk_live_1a2b3c4d5e6f7g8h9i0j',
      usage: '1.2M',
      created: '2024-01-15',
      lastUsed: '2 min ago'
    },
    { 
      id: 'development', 
      name: 'Development', 
      key: 'sk_test_9i8h7g6f5e4d3c2b1a0z',
      usage: '45K',
      created: '2024-01-10',
      lastUsed: '1 hour ago'
    },
    { 
      id: 'staging', 
      name: 'Staging', 
      key: 'sk_test_x1y2z3a4b5c6d7e8f9g0',
      usage: '180K',
      created: '2024-01-08',
      lastUsed: '15 min ago'
    }
  ];

  const currentApiKey = apiKeys.find(k => k.id === selectedApiKey);

  // Big Stats with trends
  const bigStats = [
    { 
      label: 'Total Requests', 
      value: '2.4M', 
      change: '+12.5%', 
      trend: 'up',
      icon: <Activity />,
      color: '#0066ff'
    },
    { 
      label: 'Success Rate', 
      value: '99.8%', 
      change: '+0.3%', 
      trend: 'up',
      icon: <CheckCircle />,
      color: '#10b981'
    },
    { 
      label: 'Avg Response', 
      value: '45ms', 
      change: '-5ms', 
      trend: 'up',
      icon: <Clock />,
      color: '#f59e0b'
    },
    { 
      label: 'Monthly Cost', 
      value: '$124', 
      change: '+$8', 
      trend: 'down',
      icon: <DollarSign />,
      color: '#8b5cf6'
    }
  ];

  // Time range data
  const timeRangeData = {
    '24h': [
      { time: '00:00', requests: 2400, errors: 12, latency: 42 },
      { time: '04:00', requests: 1800, errors: 8, latency: 38 },
      { time: '08:00', requests: 4200, errors: 18, latency: 52 },
      { time: '12:00', requests: 5800, errors: 24, latency: 48 },
      { time: '16:00', requests: 4500, errors: 15, latency: 45 },
      { time: '20:00', requests: 3200, errors: 10, latency: 41 },
      { time: '23:59', requests: 2800, errors: 9, latency: 39 }
    ],
    '7d': [
      { time: 'Mon', requests: 45000, errors: 180, latency: 44 },
      { time: 'Tue', requests: 52000, errors: 210, latency: 46 },
      { time: 'Wed', requests: 48000, errors: 195, latency: 43 },
      { time: 'Thu', requests: 58000, errors: 240, latency: 48 },
      { time: 'Fri', requests: 61000, errors: 250, latency: 50 },
      { time: 'Sat', requests: 38000, errors: 150, latency: 40 },
      { time: 'Sun', requests: 35000, errors: 140, latency: 39 }
    ],
    '30d': [
      { time: 'Week 1', requests: 280000, errors: 1100, latency: 45 },
      { time: 'Week 2', requests: 320000, errors: 1280, latency: 47 },
      { time: 'Week 3', requests: 305000, errors: 1200, latency: 44 },
      { time: 'Week 4', requests: 340000, errors: 1350, latency: 46 }
    ]
  };

  const chartData = timeRangeData[timeRange];

  // Top Endpoints Analytics
  const topEndpoints = [
    { endpoint: '/api/v1/users', requests: 450000, avgTime: '38ms', errors: 120 },
    { endpoint: '/api/v1/posts', requests: 320000, avgTime: '45ms', errors: 95 },
    { endpoint: '/api/v1/analytics', requests: 180000, avgTime: '62ms', errors: 48 },
    { endpoint: '/api/v1/auth/login', requests: 95000, avgTime: '28ms', errors: 15 },
    { endpoint: '/api/v1/webhooks', requests: 52000, avgTime: '18ms', errors: 8 }
  ];

  // Geographic Distribution
  const geoData = [
    { name: 'United States', value: 45, color: '#0066ff' },
    { name: 'Europe', value: 30, color: '#10b981' },
    { name: 'Asia', value: 18, color: '#f59e0b' },
    { name: 'Other', value: 7, color: '#8b5cf6' }
  ];

  // Recent Activity with more details
  const allActivity = [
    { endpoint: '/api/v1/users', method: 'GET', status: 200, time: '2 min ago', duration: '42ms', ip: '192.168.1.1', country: 'US' },
    { endpoint: '/api/v1/posts', method: 'POST', status: 201, time: '5 min ago', duration: '38ms', ip: '192.168.1.2', country: 'UK' },
    { endpoint: '/api/v1/users/123', method: 'PATCH', status: 200, time: '8 min ago', duration: '51ms', ip: '192.168.1.3', country: 'DE' },
    { endpoint: '/api/v1/analytics', method: 'GET', status: 200, time: '12 min ago', duration: '45ms', ip: '192.168.1.4', country: 'US' },
    { endpoint: '/api/v1/webhooks', method: 'POST', status: 429, time: '15 min ago', duration: '12ms', ip: '192.168.1.5', country: 'FR' },
    { endpoint: '/api/v1/auth/login', method: 'POST', status: 200, time: '18 min ago', duration: '28ms', ip: '192.168.1.6', country: 'CA' },
    { endpoint: '/api/v1/posts/456', method: 'DELETE', status: 204, time: '22 min ago', duration: '35ms', ip: '192.168.1.7', country: 'JP' },
    { endpoint: '/api/v1/users', method: 'GET', status: 500, time: '25 min ago', duration: '120ms', ip: '192.168.1.8', country: 'AU' }
  ];

  // Filter activity
  const filteredActivity = allActivity.filter(item => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'success' && item.status < 400) ||
      (filterStatus === 'error' && item.status >= 400);
    const matchesMethod = filterMethod === 'all' || item.method === filterMethod;
    const matchesSearch = searchQuery === '' || 
      item.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const copyApiKey = () => {
    navigator.clipboard.writeText(currentApiKey.key);
  };

  // Export functionality
  const exportData = (format) => {
    if (format === 'csv') {
      const csv = filteredActivity.map(item => 
        `${item.endpoint},${item.method},${item.status},${item.time},${item.duration}`
      ).join('\n');
      const blob = new Blob([`Endpoint,Method,Status,Time,Duration\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'activity-log.csv';
      a.click();
    }
  };

  // Simulated real-time updates
  const [liveCount, setLiveCount] = useState(2400000);
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setLiveCount(prev => prev + Math.floor(Math.random() * 10));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  return (
    <div className="dashboard-page">
      <Navigation />
      
      <div className="dashboard-container">
        {/* Header with Time Range Selector */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <div className="realtime-indicator">
              <span className={`status-dot ${isRealTime ? 'active' : ''}`}></span>
              <span>{isRealTime ? 'Live' : 'Paused'}</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="time-range-selector">
              <button 
                className={`time-btn ${timeRange === '24h' ? 'active' : ''}`}
                onClick={() => setTimeRange('24h')}
              >
                24 Hours
              </button>
              <button 
                className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                7 Days
              </button>
              <button 
                className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                30 Days
              </button>
              <button className="time-btn">
                <Calendar size={16} />
                Custom
              </button>
            </div>
          </div>
        </div>

        {/* Big Stat Cards */}
        <div className="big-stats-grid">
          {bigStats.map((stat, index) => (
            <motion.div 
              key={index}
              className="big-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-details">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Bar */}
        <div className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <Plus size={16} />
              New API Key
            </button>
            <button className="action-btn">
              <FileText size={16} />
              Documentation
            </button>
            <button className="action-btn">
              <Play size={16} />
              Test API
            </button>
            <button className="action-btn">
              <Server size={16} />
              Check Status
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Main Chart */}
          <div className="chart-card main-chart">
            <div className="chart-header">
              <div>
                <h3>API Requests</h3>
                <p className="chart-subtitle">Request volume over time</p>
              </div>
              <div className="chart-controls">
                <div className="chart-type-selector">
                  <button 
                    className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
                    onClick={() => setChartType('line')}
                    title="Line Chart"
                  >
                    <Activity size={16} />
                  </button>
                  <button 
                    className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`}
                    onClick={() => setChartType('area')}
                    title="Area Chart"
                  >
                    <BarChart3 size={16} />
                  </button>
                  <button 
                    className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
                    onClick={() => setChartType('bar')}
                    title="Bar Chart"
                  >
                    <BarChart3 size={16} />
                  </button>
                </div>
                <button className="refresh-btn">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'line' && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#0066ff" strokeWidth={2} dot={{ fill: '#0066ff' }} />
                  <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
                </LineChart>
              )}
              {chartType === 'area' && (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Area type="monotone" dataKey="requests" stroke="#0066ff" fill="#0066ff" fillOpacity={0.2} />
                </AreaChart>
              )}
              {chartType === 'bar' && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#0066ff" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Secondary Charts Grid */}
          <div className="secondary-charts">
            {/* Performance Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Response Time</h3>
                  <p className="chart-subtitle">Average latency</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="latency" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Geographic Distribution */}
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h3>Geographic Distribution</h3>
                  <p className="chart-subtitle">Requests by region</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={geoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {geoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {geoData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-dot" style={{ background: item.color }}></span>
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Endpoints Analytics */}
        <div className="analytics-section">
          <div className="section-header">
            <h3>Top Endpoints</h3>
            <p>Most frequently used API endpoints</p>
          </div>
          <div className="endpoints-grid">
            {topEndpoints.map((endpoint, index) => (
              <div key={index} className="endpoint-card">
                <div className="endpoint-info">
                  <code className="endpoint-path">{endpoint.endpoint}</code>
                  <div className="endpoint-stats">
                    <span className="endpoint-stat">
                      <Activity size={14} />
                      {(endpoint.requests / 1000).toFixed(0)}K requests
                    </span>
                    <span className="endpoint-stat">
                      <Clock size={14} />
                      {endpoint.avgTime}
                    </span>
                    <span className="endpoint-stat error">
                      <AlertCircle size={14} />
                      {endpoint.errors} errors
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Key Management */}
        <div className="api-keys-section">
          <div className="section-header">
            <h3>API Keys</h3>
            <button className="btn-primary-small">
              <Plus size={16} />
              Generate New Key
            </button>
          </div>
          
          <div className="api-keys-grid">
            {apiKeys.map((key) => (
              <div 
                key={key.id} 
                className={`api-key-card ${selectedApiKey === key.id ? 'selected' : ''}`}
                onClick={() => setSelectedApiKey(key.id)}
              >
                <div className="key-header">
                  <div className="key-name">
                    <Key size={18} />
                    <span>{key.name}</span>
                  </div>
                  <span className="key-usage">{key.usage} requests</span>
                </div>
                <div className="key-value">
                  <code>{showApiKey ? key.key : '••••••••••••••••••••'}</code>
                  <div className="key-actions">
                    <button onClick={(e) => { e.stopPropagation(); setShowApiKey(!showApiKey); }}>
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); copyApiKey(); }}>
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="key-meta">
                  <span>Created: {key.created}</span>
                  <span>Last used: {key.lastUsed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log with Filtering */}
        <div className="activity-section">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <div className="activity-controls">
              <button className="btn-export" onClick={() => exportData('csv')}>
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="activity-filters">
            <div className="filter-group">
              <Search size={16} />
              <input 
                type="text"
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="success">Success (2xx)</option>
              <option value="error">Errors (4xx, 5xx)</option>
            </select>
            
            <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
              <option value="all">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>

            <button className="filter-reset" onClick={() => {
              setFilterStatus('all');
              setFilterMethod('all');
              setSearchQuery('');
            }}>
              Reset
            </button>
          </div>

          {/* Activity Table */}
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Location</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivity.map((item, index) => (
                  <tr key={index}>
                    <td><code className="endpoint-code">{item.endpoint}</code></td>
                    <td><span className={`method-badge method-${item.method.toLowerCase()}`}>{item.method}</span></td>
                    <td><span className={`status-badge status-${Math.floor(item.status / 100)}`}>{item.status}</span></td>
                    <td className="duration">{item.duration}</td>
                    <td>
                      <div className="location">
                        <Globe size={14} />
                        {item.country}
                      </div>
                    </td>
                    <td className="time-ago">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Developer Tools Section */}
        <div className="developer-tools">
          <div className="section-header">
            <h3>Developer Tools</h3>
          </div>
          <div className="tools-grid">
            <div className="tool-card">
              <Code size={24} />
              <h4>API Testing</h4>
              <p>Test your API endpoints directly from the dashboard</p>
              <button className="tool-btn">Open Playground</button>
            </div>
            <div className="tool-card">
              <FileText size={24} />
              <h4>Code Snippets</h4>
              <p>Get ready-to-use code in multiple languages</p>
              <button className="tool-btn">View Snippets</button>
            </div>
            <div className="tool-card">
              <Zap size={24} />
              <h4>Webhook Tester</h4>
              <p>Test and debug your webhook integrations</p>
              <button className="tool-btn">Test Webhooks</button>
            </div>
            <div className="tool-card">
              <Shield size={24} />
              <h4>Rate Limit Simulator</h4>
              <p>Simulate rate limiting scenarios</p>
              <button className="tool-btn">Run Simulator</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
