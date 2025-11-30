// Admin API Service Layer
// Centralized API calls for admin panel features

import { API_BASE_URL } from '../config';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = window.localStorage.getItem('veroapi_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }
  
  return data;
};

// ============ User Management ============
export const userApi = {
  search: (query) => apiCall(`/v1/admin/users/search?email=${encodeURIComponent(query)}`),
  getDetails: (userId) => apiCall(`/v1/admin/users/${userId}/details`),
  suspend: (userId, reason) => apiCall(`/v1/admin/users/${userId}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),
  unsuspend: (userId) => apiCall(`/v1/admin/users/${userId}/unsuspend`, {
    method: 'POST'
  }),
  delete: (userId) => apiCall(`/v1/admin/users/${userId}`, { method: 'DELETE' }),
  revokeKeys: (userId) => apiCall(`/v1/admin/users/${userId}/revoke-keys`, { method: 'POST' }),
  list: (page = 1, limit = 20) => apiCall(`/v1/admin/users?page=${page}&limit=${limit}`)
};

// ============ Rate Limits ============
export const rateLimitApi = {
  getConfig: () => apiCall('/v1/admin/rate-limits'),
  getUserLimits: (userId) => apiCall(`/v1/admin/users/${userId}/rate-limits`),
  setUserLimits: (userId, limits) => apiCall(`/v1/admin/users/${userId}/rate-limits`, {
    method: 'PUT',
    body: JSON.stringify(limits)
  }),
  resetUserLimits: (userId) => apiCall(`/v1/admin/users/${userId}/rate-limits`, { method: 'DELETE' }),
  getGlobalLimits: () => apiCall('/v1/admin/rate-limits/global'),
  setGlobalLimits: (limits) => apiCall('/v1/admin/rate-limits/global', {
    method: 'PUT',
    body: JSON.stringify(limits)
  })
};

// ============ Feature Flags ============
export const featureFlagApi = {
  list: () => apiCall('/v1/admin/feature-flags'),
  get: (flagId) => apiCall(`/v1/admin/feature-flags/${flagId}`),
  create: (flag) => apiCall('/v1/admin/feature-flags', {
    method: 'POST',
    body: JSON.stringify(flag)
  }),
  update: (flagId, flag) => apiCall(`/v1/admin/feature-flags/${flagId}`, {
    method: 'PUT',
    body: JSON.stringify(flag)
  }),
  delete: (flagId) => apiCall(`/v1/admin/feature-flags/${flagId}`, { method: 'DELETE' }),
  toggle: (flagId, enabled) => apiCall(`/v1/admin/feature-flags/${flagId}/toggle`, {
    method: 'POST',
    body: JSON.stringify({ enabled })
  })
};

// ============ System Health ============
export const healthApi = {
  getStatus: () => apiCall('/v1/admin/health/status'),
  getMetrics: () => apiCall('/v1/admin/health/metrics'),
  getServices: () => apiCall('/v1/admin/health/services'),
  getLogs: (limit = 100) => apiCall(`/v1/admin/health/logs?limit=${limit}`)
};

// ============ Maintenance Mode ============
export const maintenanceApi = {
  getStatus: () => apiCall('/v1/admin/maintenance'),
  enable: (message, estimatedEndTime) => apiCall('/v1/admin/maintenance/enable', {
    method: 'POST',
    body: JSON.stringify({ message, estimatedEndTime })
  }),
  disable: () => apiCall('/v1/admin/maintenance/disable', { method: 'POST' }),
  schedule: (startTime, endTime, message) => apiCall('/v1/admin/maintenance/schedule', {
    method: 'POST',
    body: JSON.stringify({ startTime, endTime, message })
  })
};

// ============ Notifications & Broadcasts ============
export const notificationApi = {
  list: (page = 1) => apiCall(`/v1/admin/notifications?page=${page}`),
  create: (notification) => apiCall('/v1/admin/notifications', {
    method: 'POST',
    body: JSON.stringify(notification)
  }),
  update: (notificationId, notification) => apiCall(`/v1/admin/notifications/${notificationId}`, {
    method: 'PUT',
    body: JSON.stringify(notification)
  }),
  delete: (notificationId) => apiCall(`/v1/admin/notifications/${notificationId}`, { method: 'DELETE' }),
  broadcast: (message, targetType, targetId) => apiCall('/v1/admin/notifications/broadcast', {
    method: 'POST',
    body: JSON.stringify({ message, targetType, targetId })
  })
};

// ============ Changelog Management ============
export const changelogApi = {
  list: () => apiCall('/v1/admin/changelog'),
  create: (entry) => apiCall('/v1/admin/changelog', {
    method: 'POST',
    body: JSON.stringify(entry)
  }),
  update: (entryId, entry) => apiCall(`/v1/admin/changelog/${entryId}`, {
    method: 'PUT',
    body: JSON.stringify(entry)
  }),
  delete: (entryId) => apiCall(`/v1/admin/changelog/${entryId}`, { method: 'DELETE' }),
  publish: (entryId) => apiCall(`/v1/admin/changelog/${entryId}/publish`, { method: 'POST' }),
  unpublish: (entryId) => apiCall(`/v1/admin/changelog/${entryId}/unpublish`, { method: 'POST' })
};

// ============ Support Tickets ============
export const ticketApi = {
  list: (status = 'all', page = 1) => apiCall(`/v1/admin/tickets?status=${status}&page=${page}`),
  get: (ticketId) => apiCall(`/v1/admin/tickets/${ticketId}`),
  respond: (ticketId, message) => apiCall(`/v1/admin/tickets/${ticketId}/respond`, {
    method: 'POST',
    body: JSON.stringify({ message })
  }),
  assign: (ticketId, adminId) => apiCall(`/v1/admin/tickets/${ticketId}/assign`, {
    method: 'POST',
    body: JSON.stringify({ adminId })
  }),
  updateStatus: (ticketId, status) => apiCall(`/v1/admin/tickets/${ticketId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  close: (ticketId, resolution) => apiCall(`/v1/admin/tickets/${ticketId}/close`, {
    method: 'POST',
    body: JSON.stringify({ resolution })
  })
};

// ============ Role-Based Access Control ============
export const rbacApi = {
  getRoles: () => apiCall('/v1/admin/rbac/roles'),
  getRole: (roleId) => apiCall(`/v1/admin/rbac/roles/${roleId}`),
  createRole: (role) => apiCall('/v1/admin/rbac/roles', {
    method: 'POST',
    body: JSON.stringify(role)
  }),
  updateRole: (roleId, role) => apiCall(`/v1/admin/rbac/roles/${roleId}`, {
    method: 'PUT',
    body: JSON.stringify(role)
  }),
  deleteRole: (roleId) => apiCall(`/v1/admin/rbac/roles/${roleId}`, { method: 'DELETE' }),
  getPermissions: () => apiCall('/v1/admin/rbac/permissions'),
  assignRole: (userId, roleId) => apiCall(`/v1/admin/users/${userId}/role`, {
    method: 'PUT',
    body: JSON.stringify({ roleId })
  }),
  getUserRoles: (userId) => apiCall(`/v1/admin/users/${userId}/roles`)
};

// ============ Team Management ============
export const teamApi = {
  list: () => apiCall('/v1/admin/teams'),
  get: (teamId) => apiCall(`/v1/admin/teams/${teamId}`),
  create: (team) => apiCall('/v1/admin/teams', {
    method: 'POST',
    body: JSON.stringify(team)
  }),
  update: (teamId, team) => apiCall(`/v1/admin/teams/${teamId}`, {
    method: 'PUT',
    body: JSON.stringify(team)
  }),
  delete: (teamId) => apiCall(`/v1/admin/teams/${teamId}`, { method: 'DELETE' }),
  addMember: (teamId, userId, role) => apiCall(`/v1/admin/teams/${teamId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId, role })
  }),
  removeMember: (teamId, userId) => apiCall(`/v1/admin/teams/${teamId}/members/${userId}`, {
    method: 'DELETE'
  }),
  getMembers: (teamId) => apiCall(`/v1/admin/teams/${teamId}/members`),
  listAdmins: () => apiCall('/v1/admin/admins')
};

// ============ API Documentation ============
export const docsApi = {
  getContent: () => apiCall('/v1/admin/docs'),
  updateContent: (content) => apiCall('/v1/admin/docs', {
    method: 'PUT',
    body: JSON.stringify({ content })
  }),
  getSwagger: () => apiCall('/v1/admin/docs/swagger'),
  updateSwagger: (spec) => apiCall('/v1/admin/docs/swagger', {
    method: 'PUT',
    body: JSON.stringify({ spec })
  }),
  publishDocs: () => apiCall('/v1/admin/docs/publish', { method: 'POST' })
};

// ============ API Playground ============
export const playgroundApi = {
  getEndpoints: () => apiCall('/v1/admin/playground/endpoints'),
  execute: (method, path, body, headers) => apiCall('/v1/admin/playground/execute', {
    method: 'POST',
    body: JSON.stringify({ method, path, body, headers })
  }),
  getHistory: () => apiCall('/v1/admin/playground/history'),
  saveRequest: (request) => apiCall('/v1/admin/playground/saved', {
    method: 'POST',
    body: JSON.stringify(request)
  }),
  getSavedRequests: () => apiCall('/v1/admin/playground/saved')
};

// ============ Stats Overview ============
export const statsApi = {
  getOverview: () => apiCall('/v1/admin/stats/overview'),
  getRequestStats: (period = '24h') => apiCall(`/v1/admin/stats/requests?period=${period}`),
  getUserGrowth: (period = '30d') => apiCall(`/v1/admin/stats/users?period=${period}`)
};

export default {
  user: userApi,
  rateLimit: rateLimitApi,
  featureFlag: featureFlagApi,
  health: healthApi,
  maintenance: maintenanceApi,
  notification: notificationApi,
  changelog: changelogApi,
  ticket: ticketApi,
  rbac: rbacApi,
  team: teamApi,
  docs: docsApi,
  playground: playgroundApi,
  stats: statsApi
};
