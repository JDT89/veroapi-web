import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, DollarSign, Server, AlertTriangle, TrendingUp, Search, Filter } from 'lucide-react';
import Navigation from '../components/Navigation';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');

  const adminStats = [
    { label: 'Total Users', value: '12,543', change: '+324', icon: <Users />, color: '#00f0ff' },
    { label: 'Revenue (MRR)', value: '$54,320', change: '+$2,100', icon: <DollarSign />, color: '#00ff88' },
    { label: 'API Requests', value: '245M', change: '+12M', icon: <Server />, color: '#ff006e' },
    { label: 'Error Rate', value: '0.12%', change: '-0.03%', icon: <AlertTriangle />, color: '#ffaa00' }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 8200, revenue: 38000 },
    { month: 'Feb', users: 9100, revenue: 42000 },
    { month: 'Mar', users: 9800, revenue: 45000 },
    { month: 'Apr', users: 10500, revenue: 48000 },
    { month: 'May', users: 11200, revenue: 51000 },
    { month: 'Jun', users: 12543, revenue: 54320 }
  ];

  const planDistribution = [
    { name: 'Free', value: 8234, color: '#6b6b85' },
    { name: 'Starter', value: 2891, color: '#00f0ff' },
    { name: 'Pro', value: 1245, color: '#ff006e' },
    { name: 'Enterprise', value: 173, color: '#00ff88' }
  ];

  const topUsers = [
    { name: 'Acme Corp', email: 'tech@acme.com', plan: 'Enterprise', requests: '12.4M', revenue: '$2,499' },
    { name: 'TechStart Inc', email: 'api@techstart.io', plan: 'Pro', requests: '8.2M', revenue: '$299' },
    { name: 'Dev Solutions', email: 'dev@devsol.com', plan: 'Pro', requests: '6.1M', revenue: '$299' },
    { name: 'Cloud Systems', email: 'api@cloud.com', plan: 'Enterprise', requests: '5.8M', revenue: '$2,499' },
    { name: 'Data Corp', email: 'tech@data.co', plan: 'Starter', revenue: '$49', requests: '890K' }
  ];

  const systemMetrics = [
    { metric: 'API Uptime', value: '99.99%', status: 'healthy' },
    { metric: 'Avg Response Time', value: '42ms', status: 'healthy' },
    { metric: 'Error Rate', value: '0.12%', status: 'healthy' },
    { metric: 'Active Servers', value: '24/24', status: 'healthy' },
    { metric: 'Database Load', value: '34%', status: 'healthy' },
    { metric: 'Cache Hit Rate', value: '94.2%', status: 'healthy' }
  ];

  return (
    <div className="admin-dashboard-page">
      <Navigation />
      
      <div className="admin-container">
        <motion.div 
          className="admin-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1>Admin Dashboard</h1>
            <p>Platform overview and management</p>
          </div>
          <div className="admin-header-actions">
            <select 
              className="time-selector"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="btn btn-primary">
              <TrendingUp size={18} />
              Generate Report
            </button>
          </div>
        </motion.div>

        {/* Admin Stats */}
        <div className="admin-stats-grid">
          {adminStats.map((stat, index) => (
            <motion.div 
              key={index}
              className="admin-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              style={{ '--accent-color': stat.color }}
            >
              <div className="admin-stat-icon">{stat.icon}</div>
              <div className="admin-stat-content">
                <div className="admin-stat-label">{stat.label}</div>
                <div className="admin-stat-value">{stat.value}</div>
                <div className="admin-stat-change">
                  {stat.change} this month
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Growth Charts */}
        <div className="admin-charts-grid">
          <motion.div 
            className="admin-chart-card span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="card-header">
              <h3>User Growth & Revenue</h3>
              <div className="chart-legend">
                <span><span className="legend-dot" style={{background: '#00f0ff'}}></span> Users</span>
                <span><span className="legend-dot" style={{background: '#ff006e'}}></span> Revenue</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" />
                  <XAxis dataKey="month" stroke="#6b6b85" />
                  <YAxis yAxisId="left" stroke="#6b6b85" />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b6b85" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1e1e2e', 
                      border: '1px solid #2a2a3a',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="users" 
                    stroke="#00f0ff" 
                    strokeWidth={3}
                    dot={{ fill: '#00f0ff', r: 5 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ff006e" 
                    strokeWidth={3}
                    dot={{ fill: '#ff006e', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            className="admin-chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="card-header">
              <h3>Plan Distribution</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1e1e2e', 
                      border: '1px solid #2a2a3a',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* System Metrics */}
        <motion.div 
          className="system-metrics-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="card-header">
            <h3>System Health</h3>
            <div className="health-indicator">
              <span className="health-dot"></span>
              All Systems Operational
            </div>
          </div>
          <div className="metrics-grid">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="metric-item">
                <div className="metric-label">{metric.metric}</div>
                <div className="metric-value">{metric.value}</div>
                <div className={`metric-status ${metric.status}`}>
                  {metric.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Users Table */}
        <motion.div 
          className="users-table-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="card-header">
            <h3>Top Users</h3>
            <div className="table-actions">
              <div className="search-input">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="btn btn-secondary">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Requests</th>
                  <th>Revenue</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`plan-badge ${user.plan.toLowerCase()}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td>{user.requests}</td>
                    <td className="revenue-cell">{user.revenue}</td>
                    <td>
                      <button className="action-btn">View</button>
                    </td>
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

export default AdminDashboard;
