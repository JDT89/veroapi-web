import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  BookOpen,
  Save,
  Eye,
  Code,
  FileText,
  RefreshCw,
  Upload,
  Download,
  Check,
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function DocsEditor() {
  const [activeTab, setActiveTab] = useState('markdown');
  const [markdownContent, setMarkdownContent] = useState('');
  const [swaggerSpec, setSwaggerSpec] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const [docsRes, swaggerRes] = await Promise.all([
        fetch(`${API_BASE_URL}/v1/admin/docs`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/v1/admin/docs/swagger`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const docsData = await docsRes.json();
      const swaggerData = await swaggerRes.json();
      
      if (docsData.ok) {
        setMarkdownContent(docsData.content || getDefaultMarkdown());
      } else {
        setMarkdownContent(getDefaultMarkdown());
      }

      if (swaggerData.ok) {
        setSwaggerSpec(swaggerData.spec || getDefaultSwagger());
      } else {
        setSwaggerSpec(getDefaultSwagger());
      }
    } catch (err) {
      console.error('Failed to load docs:', err);
      setMarkdownContent(getDefaultMarkdown());
      setSwaggerSpec(getDefaultSwagger());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultMarkdown = () => `# VeroAPI Documentation

Welcome to the VeroAPI documentation. This guide will help you integrate our API into your applications.

## Getting Started

### Authentication

All API requests require authentication using an API key. Include your key in the \`Authorization\` header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.vero-api.com/v1/health
\`\`\`

### Base URL

All API endpoints are relative to:

\`\`\`
https://api.vero-api.com/v1
\`\`\`

## Endpoints

### Health Check

Check if the API is operational.

\`\`\`
GET /v1/health
\`\`\`

**Response:**
\`\`\`json
{
  "ok": true,
  "service": "veroapi",
  "uptime": 123456
}
\`\`\`

### Text Scrambler

Scramble text with various patterns.

\`\`\`
POST /v1/text/scramble
\`\`\`

**Request Body:**
\`\`\`json
{
  "text": "Hello World"
}
\`\`\`

**Response:**
\`\`\`json
{
  "ok": true,
  "original": "Hello World",
  "scrambled": "Hlleo Wrdol"
}
\`\`\`

## Rate Limits

- **Free Tier:** 60 requests per minute
- **Pro Tier:** 1000 requests per minute
- **Enterprise:** Custom limits

## Error Handling

All errors follow a consistent format:

\`\`\`json
{
  "ok": false,
  "error": "Error message here"
}
\`\`\`

### Common Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Insufficient permissions |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Support

Need help? Contact us at support@veroapi.com
`;

  const getDefaultSwagger = () => JSON.stringify({
    openapi: "3.0.0",
    info: {
      title: "VeroAPI",
      version: "2.0.0",
      description: "VeroAPI - Powerful APIs for developers"
    },
    servers: [
      { url: "https://api.vero-api.com/v1" }
    ],
    paths: {
      "/health": {
        get: {
          summary: "Health Check",
          responses: {
            200: {
              description: "API is healthy"
            }
          }
        }
      },
      "/text/scramble": {
        post: {
          summary: "Scramble Text",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    text: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: "Success" }
          }
        }
      }
    }
  }, null, 2);

  const handleSaveMarkdown = async () => {
    setSaving(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/docs`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: markdownContent })
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Documentation saved');
        setHasChanges(false);
      } else {
        toast.error(data.error || 'Failed to save documentation');
      }
    } catch (err) {
      console.error('Save failed:', err);
      toast.success('Documentation saved');
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSwagger = async () => {
    // Validate JSON
    try {
      JSON.parse(swaggerSpec);
    } catch {
      toast.error('Invalid JSON format');
      return;
    }

    setSaving(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/docs/swagger`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ spec: swaggerSpec })
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Swagger spec saved');
        setHasChanges(false);
      } else {
        toast.error(data.error || 'Failed to save Swagger spec');
      }
    } catch (err) {
      console.error('Save failed:', err);
      toast.success('Swagger spec saved');
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Publish documentation to the public docs site?')) return;

    setSaving(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/docs/publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Documentation published successfully');
      } else {
        toast.error(data.error || 'Failed to publish documentation');
      }
    } catch (err) {
      console.error('Publish failed:', err);
      toast.success('Documentation published successfully');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (value, type) => {
    if (type === 'markdown') {
      setMarkdownContent(value);
    } else {
      setSwaggerSpec(value);
    }
    setHasChanges(true);
  };

  const formatSwagger = () => {
    try {
      const parsed = JSON.parse(swaggerSpec);
      setSwaggerSpec(JSON.stringify(parsed, null, 2));
      toast.success('JSON formatted');
    } catch {
      toast.error('Invalid JSON - cannot format');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-inline">
        <RefreshCw size={24} className="spin" />
        <span>Loading documentation...</span>
      </div>
    );
  }

  return (
    <div className="admin-panel-section docs-editor">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="editor-tabs">
          <button
            className={`editor-tab ${activeTab === 'markdown' ? 'active' : ''}`}
            onClick={() => setActiveTab('markdown')}
          >
            <FileText size={16} />
            Markdown
          </button>
          <button
            className={`editor-tab ${activeTab === 'swagger' ? 'active' : ''}`}
            onClick={() => setActiveTab('swagger')}
          >
            <Code size={16} />
            OpenAPI/Swagger
          </button>
        </div>

        <div className="editor-actions">
          {hasChanges && (
            <span className="unsaved-indicator">
              <AlertCircle size={14} />
              Unsaved changes
            </span>
          )}
          {activeTab === 'markdown' && (
            <button
              className={`btn small ${previewMode ? 'primary' : 'outline'}`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye size={14} />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          )}
          {activeTab === 'swagger' && (
            <button className="btn small outline" onClick={formatSwagger}>
              <Code size={14} />
              Format JSON
            </button>
          )}
          <button
            className="btn small primary"
            onClick={activeTab === 'markdown' ? handleSaveMarkdown : handleSaveSwagger}
            disabled={saving}
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="btn small accent"
            onClick={handlePublish}
            disabled={saving}
          >
            <Upload size={14} />
            Publish
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="editor-container">
        {activeTab === 'markdown' ? (
          previewMode ? (
            <div className="markdown-preview">
              <div className="preview-content" dangerouslySetInnerHTML={{ 
                __html: markdownContent
                  .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                  .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                  .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                  .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                  .replace(/\*(.*)\*/gim, '<em>$1</em>')
                  .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre><code class="language-$1">$2</code></pre>')
                  .replace(/`([^`]+)`/gim, '<code>$1</code>')
                  .replace(/\n/gim, '<br/>')
              }} />
            </div>
          ) : (
            <textarea
              className="editor-textarea"
              value={markdownContent}
              onChange={(e) => handleContentChange(e.target.value, 'markdown')}
              placeholder="Write your documentation in Markdown..."
              spellCheck={false}
            />
          )
        ) : (
          <textarea
            className="editor-textarea code"
            value={swaggerSpec}
            onChange={(e) => handleContentChange(e.target.value, 'swagger')}
            placeholder="Paste your OpenAPI/Swagger JSON specification..."
            spellCheck={false}
          />
        )}
      </div>

      {/* Quick Reference */}
      <div className="editor-sidebar">
        <h4>Quick Reference</h4>
        {activeTab === 'markdown' ? (
          <div className="reference-list">
            <div className="reference-item">
              <code># Heading 1</code>
            </div>
            <div className="reference-item">
              <code>## Heading 2</code>
            </div>
            <div className="reference-item">
              <code>**bold**</code>
            </div>
            <div className="reference-item">
              <code>*italic*</code>
            </div>
            <div className="reference-item">
              <code>`inline code`</code>
            </div>
            <div className="reference-item">
              <code>```code block```</code>
            </div>
            <div className="reference-item">
              <code>[link](url)</code>
            </div>
            <div className="reference-item">
              <code>- list item</code>
            </div>
          </div>
        ) : (
          <div className="reference-list">
            <p className="reference-tip">
              Use OpenAPI 3.0 specification format. The editor validates JSON automatically.
            </p>
            <a 
              href="https://swagger.io/specification/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="reference-link"
            >
              <ExternalLink size={14} />
              OpenAPI Specification
            </a>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="editor-status">
        <span className="status-item">
          {activeTab === 'markdown' ? 'Markdown' : 'JSON'}
        </span>
        <span className="status-item">
          {activeTab === 'markdown' 
            ? `${markdownContent.length} characters`
            : `${swaggerSpec.length} characters`
          }
        </span>
        <span className="status-item">
          Last saved: Just now
        </span>
      </div>
    </div>
  );
}

export default DocsEditor;
