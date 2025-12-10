import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Users, DollarSign, Activity, Server, Shield, AlertTriangle,
  Search, Filter, Download, RefreshCw, ChevronDown, ChevronUp,
  MoreVertical, Eye, Edit, Trash2, Mail, Ban, Check, X,
  Calendar, Clock, TrendingUp, TrendingDown, Award, Bell,
  Settings, Database, Cpu, HardDrive, Zap, Globe, Lock,
  FileText, AlertCircle, CheckCircle, XCircle, UserPlus
} from 'lucide-react';
import Navigation from '../components/Navigation';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30d');
  const [sortColumn, setSortColumn] = useState('signupDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Quick Stats Cards
  const quickStats = [
    { 
      label: 'Total Users', 
      value: '12,453', 
      change: '+234', 
      trend: 'up',
      icon: <Users />,
      color: '#0066ff'
    },
    { 
      label: 'Active Users', 
      value: '8,921', 
      change: '+156', 
      trend: 'up',
      icon: <Activity />,
      color: '#10b981'
    },
    { 
      label: 'MRR', 
      value: '$45.2K', 
      change: '+$2.1K', 
      trend: 'up',
      icon: <DollarSign />,
      color: '#8b5cf6'
    },
    { 
      label: 'System Health', 
      value: '99.8%', 
      change: '+0.1%', 
      trend: 'up',
      icon: <Server />,
      color: '#10b981'
    }
  ];

  // System Health Metrics
  const systemHealth = [
    { name: 'API Server', status: 'operational', uptime: '99.98%', responseTime: '45ms' },
    { name: 'Database', status: 'operational', uptime: '99.99%', responseTime: '12ms' },
    { name: 'Cache', status: 'operational', uptime: '100%', responseTime: '2ms' },
    { name: 'Queue', status: 'degraded', uptime: '98.5%', responseTime: '150ms' },
    { name: 'Storage', status: 'operational', uptime: '99.95%', responseTime: '8ms' }
  ];

  // System Resources
  const systemResources = [
    { name: 'CPU', usage: 45, limit: 100, unit: '%', color: '#0066ff' },
    { name: 'Memory', usage: 6.2, limit: 16, unit: 'GB', color: '#10b981' },
    { name: 'Disk', usage: 245, limit: 500, unit: 'GB', color: '#f59e0b' },
    { name: 'Network', usage: 12.5, limit: 100, unit: 'Mbps', color: '#8b5cf6' }
  ];

  // Revenue Analytics
  const revenueData = [
    { month: 'Jan', revenue: 38000, churn: 1200 },
    { month: 'Feb', revenue: 41000, churn: 1100 },
    { month: 'Mar', revenue: 43000, churn: 1300 },
    { month: 'Apr', revenue: 45000, churn: 900 },
    { month: 'May', revenue: 47000, churn: 1000 },
    { month: 'Jun', revenue: 45200, churn: 1400 }
  ];

  const planDistribution = [
    { name: 'Free', value: 7200, color: '#9ca3af' },
    { name: 'Pro', value: 4100, color: '#0066ff' },
    { name: 'Enterprise', value: 1153, color: '#8b5cf6' }
  ];

  // Users Data
  const allUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', plan: 'enterprise', mrr: 299, signupDate: '2024-01-15', lastActive: '2 min ago', loginCount: 324 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', status: 'active', plan: 'pro', mrr: 49, signupDate: '2024-02-20', lastActive: '1 hour ago', loginCount: 156 },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user', status: 'suspended', plan: 'free', mrr: 0, signupDate: '2024-03-10', lastActive: '2 days ago', loginCount: 45 },
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'moderator', status: 'active', plan: 'pro', mrr: 49, signupDate: '2024-01-05', lastActive: '5 min ago', loginCount: 892 },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'user', status: 'active', plan: 'enterprise', mrr: 299, signupDate: '2024-02-15', lastActive: '30 min ago', loginCount: 234 },
    { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'user', status: 'inactive', plan: 'free', mrr: 0, signupDate: '2023-12-01', lastActive: '30 days ago', loginCount: 12 },
    { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'admin', status: 'active', plan: 'enterprise', mrr: 299, signupDate: '2024-01-20', lastActive: '1 min ago', loginCount: 567 },
    { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'user', status: 'active', plan: 'pro', mrr: 49, signupDate: '2024-03-05', lastActive: '3 hours ago', loginCount: 89 }
  ];

  // Audit Logs
  const auditLogs = [
    { id: 1, admin: 'Alice Johnson', action: 'User Suspended', target: 'carol@example.com', timestamp: '2 min ago', severity: 'warning' },
    { id: 2, admin: 'Grace Lee', action: 'Plan Changed', target: 'bob@example.com', timestamp: '15 min ago', severity: 'info' },
    { id: 3, admin: 'Alice Johnson', action: 'User Deleted', target: 'old.user@example.com', timestamp: '1 hour ago', severity: 'error' },
    { id: 4, admin: 'Grace Lee', action: 'Role Updated', target: 'david@example.com', timestamp: '2 hours ago', severity: 'info' },
    { id: 5, admin: 'Alice Johnson', action: 'Settings Changed', target: 'Rate Limits', timestamp: '5 hours ago', severity: 'warning' }
  ];

  // Alerts
  const activeAlerts = [
    { id: 1, type: 'warning', message: 'Queue processing delayed by 30 seconds', timestamp: '5 min ago' },
    { id: 2, type: 'info', message: 'Scheduled maintenance in 2 hours', timestamp: '1 hour ago' },
    { id: 3, type: 'error', message: 'Failed login attempts spike detected', timestamp: '3 hours ago' }
  ];

  // Roles & Permissions
  const roles = [
    { id: 'admin', name: 'Admin', users: 42, color: '#8b5cf6' },
    { id: 'moderator', name: 'Moderator', users: 18, color: '#f59e0b' },
    { id: 'user', name: 'User', users: 12393, color: '#0066ff' }
  ];

  // Filter and sort users
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesRole && matchesStatus && matchesPlan;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const direction = sortDirection === 'asc' ? 1 : -1;
    if (typeof aVal === 'string') return aVal.localeCompare(bVal) * direction;
    return (aVal - bVal) * direction;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sortedUsers.length / rowsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const exportData = () => {
    const csv = sortedUsers.map(user => 
      `${user.name},${user.email},${user.role},${user.status},${user.plan},${user.mrr},${user.signupDate}`
    ).join('\n');
    const blob = new Blob([`Name,Email,Role,Status,Plan,MRR,Signup Date\n${csv}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users-export.csv';
    a.click();
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'down': return '#ef4444';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="admin-dashboard-page">
      <Navigation />
      
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="header-subtitle">Manage users, monitor system, and track revenue</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary-admin">
              <Settings size={16} />
              Settings
            </button>
            <button className="btn-primary-admin">
              <UserPlus size={16} />
              Add User
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-grid">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              className="quick-stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-icon-admin" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-details-admin">
                <div className="stat-label-admin">{stat.label}</div>
                <div className="stat-value-admin">{stat.value}</div>
                <div className={`stat-change-admin ${stat.trend}`}>
                  {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alerts Section */}
        {activeAlerts.length > 0 && (
          <div className="alerts-section">
            <div className="alerts-header">
              <h3>
                <Bell size={18} />
                Active Alerts ({activeAlerts.length})
              </h3>
            </div>
            <div className="alerts-list">
              {activeAlerts.map(alert => (
                <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                  <div className="alert-icon">
                    {alert.type === 'error' && <XCircle size={18} />}
                    {alert.type === 'warning' && <AlertTriangle size={18} />}
                    {alert.type === 'info' && <AlertCircle size={18} />}
                  </div>
                  <div className="alert-content">
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-time">{alert.timestamp}</div>
                  </div>
                  <button className="alert-dismiss">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Health Dashboard */}
        <div className="system-health-section">
          <div className="section-header-admin">
            <h3>System Health</h3>
            <button className="btn-refresh">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {/* Service Status */}
          <div className="services-grid">
            {systemHealth.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  <div className="service-name">
                    <div 
                      className="status-indicator" 
                      style={{ background: getStatusColor(service.status) }}
                    ></div>
                    {service.name}
                  </div>
                  <span className={`status-badge-admin status-${service.status}`}>
                    {service.status}
                  </span>
                </div>
                <div className="service-metrics">
                  <div className="service-metric">
                    <span className="metric-label">Uptime</span>
                    <span className="metric-value">{service.uptime}</span>
                  </div>
                  <div className="service-metric">
                    <span className="metric-label">Response</span>
                    <span className="metric-value">{service.responseTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* System Resources */}
          <div className="resources-grid">
            {systemResources.map((resource, index) => (
              <div key={index} className="resource-card">
                <div className="resource-header">
                  <span className="resource-name">{resource.name}</span>
                  <span className="resource-value">
                    {resource.usage}{resource.unit} / {resource.limit}{resource.unit}
                  </span>
                </div>
                <div className="resource-bar">
                  <div 
                    className="resource-fill" 
                    style={{ 
                      width: `${(resource.usage / resource.limit) * 100}%`,
                      background: resource.color
                    }}
                  ></div>
                </div>
                <div className="resource-percentage">
                  {((resource.usage / resource.limit) * 100).toFixed(1)}% used
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="revenue-section">
          <div className="section-header-admin">
            <h3>Revenue Analytics</h3>
            <div className="date-range-picker">
              <Calendar size={16} />
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>

          <div className="revenue-grid">
            {/* Revenue Chart */}
            <div className="revenue-chart-card">
              <h4>Monthly Recurring Revenue</h4>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#0066ff" fill="#0066ff" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="churn" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Plan Distribution */}
            <div className="revenue-chart-card">
              <h4>Users by Plan</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="plan-legend">
                {planDistribution.map((plan, index) => (
                  <div key={index} className="legend-item-admin">
                    <span className="legend-dot-admin" style={{ background: plan.color }}></span>
                    <span className="legend-label-admin">{plan.name}</span>
                    <span className="legend-value-admin">{plan.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Metrics */}
          <div className="revenue-metrics">
            <div className="revenue-metric-card">
              <div className="metric-icon-admin" style={{ background: '#0066ff15', color: '#0066ff' }}>
                <DollarSign />
              </div>
              <div>
                <div className="metric-label-admin">ARR</div>
                <div className="metric-value-big">$542.4K</div>
              </div>
            </div>
            <div className="revenue-metric-card">
              <div className="metric-icon-admin" style={{ background: '#10b98115', color: '#10b981' }}>
                <TrendingUp />
              </div>
              <div>
                <div className="metric-label-admin">Growth Rate</div>
                <div className="metric-value-big">12.5%</div>
              </div>
            </div>
            <div className="revenue-metric-card">
              <div className="metric-icon-admin" style={{ background: '#ef444415', color: '#ef4444' }}>
                <TrendingDown />
              </div>
              <div>
                <div className="metric-label-admin">Churn Rate</div>
                <div className="metric-value-big">3.2%</div>
              </div>
            </div>
            <div className="revenue-metric-card">
              <div className="metric-icon-admin" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
                <Award />
              </div>
              <div>
                <div className="metric-label-admin">Avg LTV</div>
                <div className="metric-value-big">$2,340</div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Management */}
        <div className="roles-section">
          <div className="section-header-admin">
            <h3>Roles & Permissions</h3>
            <button className="btn-secondary-admin">
              <Shield size={16} />
              Manage Roles
            </button>
          </div>
          <div className="roles-grid">
            {roles.map(role => (
              <div key={role.id} className="role-card">
                <div className="role-icon" style={{ background: `${role.color}15`, color: role.color }}>
                  <Shield size={20} />
                </div>
                <div className="role-info">
                  <div className="role-name">{role.name}</div>
                  <div className="role-users">{role.users.toLocaleString()} users</div>
                </div>
                <button className="role-edit">
                  <Edit size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="users-section">
          <div className="section-header-admin">
            <h3>User Management ({sortedUsers.length.toLocaleString()} users)</h3>
            <button className="btn-export-admin" onClick={exportData}>
              <Download size={16} />
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <div className="users-filters">
            <div className="filter-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>

            <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>

            {selectedUsers.length > 0 && (
              <div className="bulk-actions">
                <span>{selectedUsers.length} selected</span>
                <button className="bulk-btn">
                  <Mail size={16} />
                  Email
                </button>
                <button className="bulk-btn">
                  <Ban size={16} />
                  Suspend
                </button>
                <button className="bulk-btn danger">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    />
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable">
                    User
                    {sortColumn === 'name' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </th>
                  <th onClick={() => handleSort('role')} className="sortable">
                    Role
                    {sortColumn === 'role' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </th>
                  <th onClick={() => handleSort('status')} className="sortable">
                    Status
                    {sortColumn === 'status' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </th>
                  <th onClick={() => handleSort('plan')} className="sortable">
                    Plan
                    {sortColumn === 'plan' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </th>
                  <th onClick={() => handleSort('mrr')} className="sortable">
                    MRR
                    {sortColumn === 'mrr' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </th>
                  <th onClick={() => handleSort('signupDate')} className="sortable">
                    Signup Date
                    {sortColumn === 'signupDate' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{user.name.charAt(0)}</div>
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <span className={`plan-badge plan-${user.plan}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="mrr-cell">${user.mrr}</td>
                    <td className="date-cell">{user.signupDate}</td>
                    <td className="time-cell">{user.lastActive}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="View">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="action-btn danger" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sortedUsers.length)} of {sortedUsers.length} users
            </div>
            <div className="pagination-controls">
              <select value={rowsPerPage} onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="page-numbers">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="audit-logs-section">
          <div className="section-header-admin">
            <h3>
              <FileText size={18} />
              Audit Logs
            </h3>
            <button className="btn-export-admin">
              <Download size={16} />
              Export Logs
            </button>
          </div>
          <div className="logs-table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Timestamp</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td className="admin-name">{log.admin}</td>
                    <td className="action-name">{log.action}</td>
                    <td className="target-name"><code>{log.target}</code></td>
                    <td className="timestamp">{log.timestamp}</td>
                    <td>
                      <span className={`severity-badge severity-${log.severity}`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;