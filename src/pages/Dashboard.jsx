import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Key, BarChart3, Clock, TrendingUp, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';
import Navigation from '../components/Navigation';
import './Dashboard.css';

const Dashboard = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = 'sk_live_1a2b3c4d5e6f7g8h9i0j';

  const stats = [
    { label: 'Total Requests', value: '1.2M', change: '+12.5%', icon: <Activity /> },
    { label: 'Success Rate', value: '99.8%', change: '+0.2%', icon: <TrendingUp /> },
    { label: 'Avg Response', value: '45ms', change: '-5ms', icon: <Clock /> },
    { label: 'Active Keys', value: '3', change: '0', icon: <Key /> }
  ];

  const requestData = [
    { time: '00:00', requests: 2400 },
    { time: '04:00', requests: 1800 },
    { time: '08:00', requests: 4200 },
    { time: '12:00', requests: 5800 },
    { time: '16:00', requests: 4500 },
    { time: '20:00', requests: 3200 },
    { time: '23:59', requests: 2800 }
  ];

  const performanceData = [
    { time: '00:00', latency: 42 },
    { time: '04:00', latency: 38 },
    { time: '08:00', latency: 52 },
    { time: '12:00', latency: 48 },
    { time: '16:00', latency: 45 },
    { time: '20:00', latency: 41 },
    { time: '23:59', latency: 39 }
  ];

  const recentActivity = [
    { endpoint: '/api/v1/users', method: 'GET', status: 200, time: '2 min ago', duration: '42ms' },
    { endpoint: '/api/v1/posts', method: 'POST', status: 201, time: '5 min ago', duration: '38ms' },
    { endpoint: '/api/v1/users/123', method: 'PATCH', status: 200, time: '8 min ago', duration: '51ms' },
    { endpoint: '/api/v1/analytics', method: 'GET', status: 200, time: '12 min ago', duration: '45ms' },
    { endpoint: '/api/v1/webhooks', method: 'POST', status: 429, time: '15 min ago', duration: '12ms' }
  ];

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="dashboard-page">
      <Navigation />
      
      <div className="dashboard-container">
        <motion.div 
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1>Dashboard</h1>
            <p>Monitor your API usage and performance</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-secondary">
              <BarChart3 size={18} />
              Export Report
            </button>
            <button className="btn btn-primary">View API Docs</button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-details">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change} from last week
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* API Key Section */}
        <motion.div 
          className="api-key-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="card-header">
            <div>
              <h3>API Key</h3>
              <p>Keep your API key secure and never share it publicly</p>
            </div>
            <button className="btn btn-secondary">Generate New Key</button>
          </div>
          <div className="api-key-display">
            <code>{showApiKey ? apiKey : '••••••••••••••••••••'}</code>
            <div className="api-key-actions">
              <button onClick={() => setShowApiKey(!showApiKey)} className="icon-btn">
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button onClick={copyApiKey} className="icon-btn">
                <Copy size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <div className="charts-grid">
          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="card-header">
              <h3>Request Volume</h3>
              <select className="chart-selector">
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={requestData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
                  <XAxis dataKey="time" stroke="#7a8ba3" />
                  <YAxis stroke="#7a8ba3" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#253654', 
                      border: '1px solid #1e2d47',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#00d4ff" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRequests)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="card-header">
              <h3>Response Time</h3>
              <select className="chart-selector">
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d47" />
                  <XAxis dataKey="time" stroke="#7a8ba3" />
                  <YAxis stroke="#7a8ba3" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#253654', 
                      border: '1px solid #1e2d47',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="latency" 
                    stroke="#0066ff" 
                    strokeWidth={2}
                    dot={{ fill: '#0066ff', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="activity-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="btn btn-secondary">View All</button>
          </div>
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td><code>{activity.endpoint}</code></td>
                    <td>
                      <span className={`method-badge ${activity.method.toLowerCase()}`}>
                        {activity.method}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${activity.status < 300 ? 'success' : 'error'}`}>
                        {activity.status}
                      </span>
                    </td>
                    <td>{activity.duration}</td>
                    <td className="time-col">{activity.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
