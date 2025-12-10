import { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Code2, Rocket, Shield, Search, ChevronRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import './Docs.css';

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', name: 'Getting Started', icon: <Rocket size={18} /> },
    { id: 'authentication', name: 'Authentication', icon: <Shield size={18} /> },
    { id: 'api-reference', name: 'API Reference', icon: <Code2 size={18} /> },
    { id: 'guides', name: 'Guides', icon: <Book size={18} /> }
  ];

  const docContent = {
    'getting-started': {
      title: 'Getting Started',
      content: `# Quick Start Guide

Welcome to Nexus API! This guide will help you make your first API call in minutes.

## Installation

Install the SDK for your preferred language:

\`\`\`bash
# Node.js
npm install @nexus/sdk

# Python
pip install nexus-sdk

# Ruby
gem install nexus-sdk
\`\`\`

## Authentication

Get your API key from the dashboard and set it as an environment variable:

\`\`\`bash
export NEXUS_API_KEY="your_api_key_here"
\`\`\`

## Make Your First Request

\`\`\`javascript
const nexus = require('@nexus/sdk');

const client = new nexus.Client({
  apiKey: process.env.NEXUS_API_KEY
});

async function createUser() {
  const response = await client.users.create({
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  console.log(response.data);
}

createUser();
\`\`\`

## Next Steps

- Explore the [API Reference](#api-reference)
- Check out our [Guides](#guides)
- Learn about [Authentication](#authentication)
`
    },
    'authentication': {
      title: 'Authentication',
      content: `# Authentication

Nexus API uses API keys to authenticate requests. You can manage your API keys in the dashboard.

## API Keys

Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so on.

## Bearer Authentication

Include your API key in the Authorization header:

\`\`\`bash
curl https://api.nexus.dev/v1/users \\
  -H "Authorization: Bearer YOUR_API_KEY"
\`\`\`

## OAuth 2.0

For user-facing applications, we support OAuth 2.0 flows:

\`\`\`javascript
const oauth = new nexus.OAuth({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  redirectUri: 'https://yourapp.com/callback'
});

// Generate authorization URL
const authUrl = oauth.getAuthorizationUrl({
  scope: ['users:read', 'users:write']
});

// Exchange code for access token
const token = await oauth.exchangeCodeForToken(code);
\`\`\`

## Rate Limiting

API requests are rate limited per API key:

- **Free tier**: 1,000 requests/hour
- **Pro tier**: 10,000 requests/hour
- **Enterprise**: Custom limits
`
    },
    'api-reference': {
      title: 'API Reference',
      content: `# API Reference

Complete reference for all Nexus API endpoints.

## Base URL

\`\`\`
https://api.nexus.dev/v1
\`\`\`

## Users

### Create User

\`\`\`http
POST /users
\`\`\`

**Request Body:**

\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "metadata": {
    "plan": "pro"
  }
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": "usr_123abc",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "metadata": {
    "plan": "pro"
  }
}
\`\`\`

### Get User

\`\`\`http
GET /users/:id
\`\`\`

**Parameters:**

- \`id\` (required): The user ID

**Response:**

\`\`\`json
{
  "id": "usr_123abc",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
\`\`\`

### Update User

\`\`\`http
PATCH /users/:id
\`\`\`

### Delete User

\`\`\`http
DELETE /users/:id
\`\`\`

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 429  | Rate Limited |
| 500  | Server Error |
`
    },
    'guides': {
      title: 'Guides',
      content: `# Guides

In-depth tutorials and best practices.

## Building a REST API

Learn how to build a production-ready REST API with Nexus.

### Project Structure

\`\`\`
my-api/
├── src/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── tests/
└── package.json
\`\`\`

### Setting Up Routes

\`\`\`javascript
const express = require('express');
const nexus = require('@nexus/sdk');

const app = express();
const client = new nexus.Client({
  apiKey: process.env.NEXUS_API_KEY
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await client.users.list();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000);
\`\`\`

## Webhooks

Set up webhooks to receive real-time notifications.

### Configure Webhook URL

1. Go to Dashboard → Settings → Webhooks
2. Add your endpoint URL
3. Select events to subscribe to
4. Save and get your webhook secret

### Handle Webhook Events

\`\`\`javascript
const crypto = require('crypto');

app.post('/webhooks', (req, res) => {
  const signature = req.headers['x-nexus-signature'];
  const payload = JSON.stringify(req.body);
  
  const hash = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');
  
  if (signature === hash) {
    // Process event
    console.log('Event:', req.body);
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
\`\`\`

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch
2. **Rate Limiting**: Implement exponential backoff
3. **Security**: Never expose API keys in client code
4. **Monitoring**: Set up alerts for failed requests
5. **Caching**: Cache frequently accessed data
`
    }
  };

  return (
    <div className="docs-page">
      <Navigation />
      
      <div className="docs-layout">
        {/* Sidebar */}
        <motion.aside 
          className="docs-sidebar"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="docs-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <nav className="docs-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`docs-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.icon}
                <span>{section.name}</span>
                <ChevronRight size={16} />
              </button>
            ))}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.main 
          className="docs-content"
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="docs-header">
            <h1>{docContent[activeSection].title}</h1>
          </div>
          
          <div className="docs-body">
            {docContent[activeSection].content.split('\n\n').map((block, index) => {
              if (block.startsWith('# ')) {
                return <h2 key={index}>{block.replace('# ', '')}</h2>;
              } else if (block.startsWith('## ')) {
                return <h3 key={index}>{block.replace('## ', '')}</h3>;
              } else if (block.startsWith('### ')) {
                return <h4 key={index}>{block.replace('### ', '')}</h4>;
              } else if (block.startsWith('```')) {
                const code = block.replace(/```\w*\n?/g, '').trim();
                return (
                  <div key={index} className="code-block">
                    <pre><code>{code}</code></pre>
                  </div>
                );
              } else if (block.startsWith('|')) {
                // Simple table rendering
                const rows = block.split('\n');
                return (
                  <table key={index}>
                    <tbody>
                      {rows.filter(row => !row.includes('---')).map((row, i) => (
                        <tr key={i}>
                          {row.split('|').filter(cell => cell.trim()).map((cell, j) => (
                            i === 0 ? <th key={j}>{cell.trim()}</th> : <td key={j}>{cell.trim()}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              } else if (block.trim().startsWith('-')) {
                const items = block.split('\n');
                return (
                  <ul key={index}>
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^- /, '')}</li>
                    ))}
                  </ul>
                );
              } else {
                return <p key={index}>{block}</p>;
              }
            })}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Docs;
