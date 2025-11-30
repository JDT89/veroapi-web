import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Play,
  Send,
  Copy,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Code,
  FileJson,
  Key,
  Globe,
  Zap
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function APIPlayground() {
  const [method, setMethod] = useState('GET');
  const [endpoint, setEndpoint] = useState('/v1/health');
  const [requestBody, setRequestBody] = useState('');
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [savedRequests, setSavedRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('body');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    loadSavedRequests();
    loadHistory();
  }, []);

  const loadSavedRequests = () => {
    const saved = localStorage.getItem('playground_saved');
    if (saved) {
      setSavedRequests(JSON.parse(saved));
    } else {
      setSavedRequests(getDefaultSaved());
    }
  };

  const loadHistory = () => {
    const hist = localStorage.getItem('playground_history');
    if (hist) {
      setHistory(JSON.parse(hist));
    }
  };

  const getDefaultSaved = () => [
    { 
      id: 'saved_1', 
      name: 'Health Check', 
      method: 'GET', 
      endpoint: '/v1/health',
      body: '',
      headers: []
    },
    { 
      id: 'saved_2', 
      name: 'Text Scramble', 
      method: 'POST', 
      endpoint: '/v1/text/scramble',
      body: JSON.stringify({ text: "Hello World" }, null, 2),
      headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }]
    },
    { 
      id: 'saved_3', 
      name: 'Coin Flip', 
      method: 'GET', 
      endpoint: '/v1/fun/coin-flip',
      body: '',
      headers: []
    }
  ];

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);
    const startTime = performance.now();
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const requestHeaders = {
        Authorization: `Bearer ${token}`
      };

      headers.filter(h => h.enabled && h.key).forEach(h => {
        requestHeaders[h.key] = h.value;
      });

      const options = {
        method,
        headers: requestHeaders
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data
      });

      // Add to history
      const historyItem = {
        id: `hist_${Date.now()}`,
        method,
        endpoint,
        status: res.status,
        time: new Date().toISOString(),
        responseTime: Math.round(endTime - startTime)
      };
      const newHistory = [historyItem, ...history.slice(0, 19)];
      setHistory(newHistory);
      localStorage.setItem('playground_history', JSON.stringify(newHistory));

    } catch (err) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponse({
        status: 0,
        statusText: 'Error',
        data: { error: err.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequest = () => {
    if (!saveName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const newSaved = {
      id: `saved_${Date.now()}`,
      name: saveName,
      method,
      endpoint,
      body: requestBody,
      headers: headers.filter(h => h.enabled)
    };

    const updated = [...savedRequests, newSaved];
    setSavedRequests(updated);
    localStorage.setItem('playground_saved', JSON.stringify(updated));
    setShowSaveModal(false);
    setSaveName('');
    toast.success('Request saved');
  };

  const loadSavedRequest = (saved) => {
    setMethod(saved.method);
    setEndpoint(saved.endpoint);
    setRequestBody(saved.body || '');
    setHeaders(saved.headers?.length ? saved.headers : [
      { key: 'Content-Type', value: 'application/json', enabled: true }
    ]);
    setResponse(null);
  };

  const deleteSavedRequest = (id) => {
    const updated = savedRequests.filter(s => s.id !== id);
    setSavedRequests(updated);
    localStorage.setItem('playground_saved', JSON.stringify(updated));
    toast.success('Request deleted');
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index, field, value) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const copyResponse = () => {
    if (response?.data) {
      navigator.clipboard.writeText(
        typeof response.data === 'object' 
          ? JSON.stringify(response.data, null, 2)
          : response.data
      );
      toast.success('Response copied to clipboard');
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'warning';
    if (status >= 400) return 'error';
    return 'unknown';
  };

  const methodColors = {
    GET: '#22c55e',
    POST: '#3b82f6',
    PUT: '#f59e0b',
    PATCH: '#8b5cf6',
    DELETE: '#ef4444'
  };

  return (
    <div className="admin-panel-section playground">
      <div className="playground-layout">
        {/* Sidebar - Saved Requests */}
        <div className="playground-sidebar">
          <div className="sidebar-header">
            <h4>Saved Requests</h4>
          </div>
          <div className="saved-list">
            {savedRequests.map(saved => (
              <div 
                key={saved.id} 
                className="saved-item"
                onClick={() => loadSavedRequest(saved)}
              >
                <span 
                  className="method-badge small"
                  style={{ backgroundColor: methodColors[saved.method] }}
                >
                  {saved.method}
                </span>
                <span className="saved-name">{saved.name}</span>
                <button 
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); deleteSavedRequest(saved.id); }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="sidebar-header">
            <h4>History</h4>
          </div>
          <div className="history-list">
            {history.slice(0, 10).map(item => (
              <div 
                key={item.id} 
                className="history-item"
                onClick={() => setEndpoint(item.endpoint)}
              >
                <div className="history-main">
                  <span 
                    className="method-badge tiny"
                    style={{ backgroundColor: methodColors[item.method] }}
                  >
                    {item.method}
                  </span>
                  <span className="history-endpoint">{item.endpoint}</span>
                </div>
                <div className="history-meta">
                  <span className={`status-dot ${getStatusColor(item.status)}`} />
                  <span className="history-time">{item.responseTime}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="playground-main">
          {/* Request Builder */}
          <div className="request-builder">
            <div className="request-row">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="method-select"
                style={{ color: methodColors[method] }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>

              <div className="endpoint-input">
                <span className="base-url">{API_BASE_URL}</span>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="/v1/endpoint"
                />
              </div>

              <button
                className="btn primary send-btn"
                onClick={executeRequest}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw size={18} className="spin" />
                ) : (
                  <Send size={18} />
                )}
                Send
              </button>

              <button
                className="btn outline"
                onClick={() => setShowSaveModal(true)}
              >
                <Save size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="request-tabs">
              <button
                className={`tab ${activeTab === 'body' ? 'active' : ''}`}
                onClick={() => setActiveTab('body')}
              >
                <FileJson size={14} />
                Body
              </button>
              <button
                className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
                onClick={() => setActiveTab('headers')}
              >
                <Key size={14} />
                Headers ({headers.filter(h => h.enabled).length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'body' ? (
                <textarea
                  className="body-editor"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                />
              ) : (
                <div className="headers-editor">
                  {headers.map((header, idx) => (
                    <div key={idx} className="header-row">
                      <input
                        type="checkbox"
                        checked={header.enabled}
                        onChange={(e) => updateHeader(idx, 'enabled', e.target.checked)}
                      />
                      <input
                        type="text"
                        placeholder="Header name"
                        value={header.key}
                        onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                      />
                      <button 
                        className="remove-header"
                        onClick={() => removeHeader(idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button className="btn small outline" onClick={addHeader}>
                    <Plus size={14} /> Add Header
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Response Viewer */}
          <div className="response-viewer">
            <div className="response-header">
              <h4>Response</h4>
              {response && (
                <div className="response-meta">
                  <span className={`status-badge ${getStatusColor(response.status)}`}>
                    {response.status === 0 ? (
                      <XCircle size={14} />
                    ) : response.status < 400 ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}
                    {response.status} {response.statusText}
                  </span>
                  <span className="response-time">
                    <Clock size={14} />
                    {responseTime}ms
                  </span>
                  <button className="btn small outline" onClick={copyResponse}>
                    <Copy size={14} /> Copy
                  </button>
                </div>
              )}
            </div>

            <div className="response-body">
              {loading ? (
                <div className="loading-state">
                  <RefreshCw size={32} className="spin" />
                  <p>Sending request...</p>
                </div>
              ) : response ? (
                <pre className="response-json">
                  {typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : response.data
                  }
                </pre>
              ) : (
                <div className="empty-state">
                  <Zap size={48} />
                  <p>Send a request to see the response</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="admin-modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="admin-modal small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Save Request</h2>
              <button className="admin-modal-close" onClick={() => setShowSaveModal(false)}>×</button>
            </div>
            <div className="admin-modal-content">
              <div className="form-group">
                <label>Request Name</label>
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g., Get User Profile"
                />
              </div>
              <div className="save-preview">
                <span 
                  className="method-badge"
                  style={{ backgroundColor: methodColors[method] }}
                >
                  {method}
                </span>
                <span>{endpoint}</span>
              </div>
              <div className="modal-actions">
                <button className="btn outline" onClick={() => setShowSaveModal(false)}>
                  Cancel
                </button>
                <button className="btn primary" onClick={handleSaveRequest}>
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default APIPlayground;
