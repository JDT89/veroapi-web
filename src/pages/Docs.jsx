import { useState } from 'react';
import { 
  Book, Code2, Rocket, Shield, Search, ChevronDown, 
  Copy, Check, Play, ExternalLink, FileCode, Layers, Zap, Terminal
} from 'lucide-react';
import Navigation from '../components/Navigation';
import './Docs.css';

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [activeLanguage, setActiveLanguage] = useState('javascript');
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedSections, setExpandedSections] = useState(['getting-started', 'api-reference']);

  const languages = ['javascript', 'python', 'go', 'php'];

  const languageLabels = {
    javascript: 'JavaScript',
    python: 'Python',
    go: 'Go',
    php: 'PHP'
  };

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    { 
      id: 'getting-started', 
      name: 'Getting Started', 
      icon: <Rocket size={18} />,
      children: [
        { id: 'installation', name: 'Installation' },
        { id: 'quickstart', name: 'Quick Start' },
        { id: 'authentication', name: 'Authentication' }
      ]
    },
    { 
      id: 'api-reference', 
      name: 'API Reference', 
      icon: <Code2 size={18} />,
      children: [
        { id: 'users', name: 'Users API' },
        { id: 'posts', name: 'Posts API' },
        { id: 'auth', name: 'Auth API' }
      ]
    },
    { 
      id: 'guides', 
      name: 'Guides', 
      icon: <Book size={18} />,
      children: [
        { id: 'webhooks', name: 'Webhooks' },
        { id: 'rate-limiting', name: 'Rate Limiting' },
        { id: 'error-handling', name: 'Error Handling' }
      ]
    },
    { 
      id: 'examples', 
      name: 'Code Examples', 
      icon: <FileCode size={18} />,
      children: [
        { id: 'crud-operations', name: 'CRUD Operations' },
        { id: 'real-time', name: 'Real-time Updates' },
        { id: 'batch-requests', name: 'Batch Requests' }
      ]
    }
  ];

  // Code examples for different languages
  const codeExamples = {
    installation: {
      javascript: `npm install @nexus/sdk`,
      python: `pip install nexus-sdk`,
      go: `go get github.com/nexus/sdk-go`,
      php: `composer require nexus/sdk`
    },
    quickstart: {
      javascript: `import nexus from '@nexus/sdk';

const client = new nexus.Client({
  apiKey: process.env.NEXUS_API_KEY
});

// Create a user
const user = await client.users.create({
  name: 'John Doe',
  email: 'john@example.com'
});

console.log(user);`,
      python: `from nexus import Client

client = Client(api_key=os.getenv('NEXUS_API_KEY'))

# Create a user
user = client.users.create(
    name='John Doe',
    email='john@example.com'
)

print(user)`,
      go: `package main

import (
    "github.com/nexus/sdk-go"
    "os"
)

func main() {
    client := nexus.NewClient(os.Getenv("NEXUS_API_KEY"))
    
    // Create a user
    user, err := client.Users.Create(&nexus.UserParams{
        Name:  "John Doe",
        Email: "john@example.com",
    })
}`,
      php: `<?php
require 'vendor/autoload.php';

use Nexus\\Client;

$client = new Client(getenv('NEXUS_API_KEY'));

// Create a user
$user = $client->users->create([
    'name' => 'John Doe',
    'email' => 'john@example.com'
]);

print_r($user);`
    },
    usersCreate: {
      javascript: `const user = await client.users.create({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
});`,
      python: `user = client.users.create(
    name='John Doe',
    email='john@example.com',
    role='admin'
)`,
      go: `user, err := client.Users.Create(&nexus.UserParams{
    Name:  "John Doe",
    Email: "john@example.com",
    Role:  "admin",
})`,
      php: `$user = $client->users->create([
    'name' => 'John Doe',
    'email' => 'john@example.com',
    'role' => 'admin'
]);`
    }
  };

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/users',
      description: 'Create a new user',
      params: [
        { name: 'name', type: 'string', required: true, description: 'User full name' },
        { name: 'email', type: 'string', required: true, description: 'User email address' },
        { name: 'role', type: 'string', required: false, description: 'User role (admin, user)' }
      ],
      response: `{
  "id": "usr_123abc",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2024-01-15T10:30:00Z"
}`
    },
    {
      method: 'GET',
      endpoint: '/users/:id',
      description: 'Get a user by ID',
      params: [
        { name: 'id', type: 'string', required: true, description: 'User ID' }
      ],
      response: `{
  "id": "usr_123abc",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2024-01-15T10:30:00Z"
}`
    },
    {
      method: 'PUT',
      endpoint: '/users/:id',
      description: 'Update a user',
      params: [
        { name: 'id', type: 'string', required: true, description: 'User ID' },
        { name: 'name', type: 'string', required: false, description: 'User full name' },
        { name: 'email', type: 'string', required: false, description: 'User email address' }
      ],
      response: `{
  "id": "usr_123abc",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "user",
  "updated_at": "2024-01-15T11:00:00Z"
}`
    },
    {
      method: 'DELETE',
      endpoint: '/users/:id',
      description: 'Delete a user',
      params: [
        { name: 'id', type: 'string', required: true, description: 'User ID' }
      ],
      response: `{
  "success": true,
  "message": "User deleted successfully"
}`
    }
  ];

  const useCases = [
    {
      title: 'E-commerce Integration',
      description: 'Build a complete e-commerce backend with user management, products, and orders',
      icon: <Layers size={24} />,
      link: '#'
    },
    {
      title: 'Real-time Chat Application',
      description: 'Create a scalable chat app with WebSocket support and message persistence',
      icon: <Zap size={24} />,
      link: '#'
    },
    {
      title: 'CLI Tool Integration',
      description: 'Build command-line tools that interact with your API for automation',
      icon: <Terminal size={24} />,
      link: '#'
    }
  ];

  const tableOfContents = [
    { id: 'installation', title: 'Installation' },
    { id: 'authentication', title: 'Authentication' },
    { id: 'making-requests', title: 'Making Requests' },
    { id: 'api-endpoints', title: 'API Endpoints' },
    { id: 'error-handling', title: 'Error Handling' },
    { id: 'examples', title: 'Code Examples' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="docs-page">
      <Navigation />
      
      <div className="docs-container">
        {/* Sidebar Navigation */}
        <aside className="docs-sidebar">
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
              <div key={section.id} className="nav-section">
                <button 
                  className={`nav-section-header ${expandedSections.includes(section.id) ? 'expanded' : ''}`}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="nav-section-title">
                    {section.icon}
                    <span>{section.name}</span>
                  </div>
                  <ChevronDown size={16} className="chevron" />
                </button>
                
                {expandedSections.includes(section.id) && section.children && (
                  <div className="nav-section-children">
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        className={`nav-item ${activeSection === child.id ? 'active' : ''}`}
                        onClick={() => setActiveSection(child.id)}
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="docs-main">
          <div className="docs-content">
            {/* Quick Start Section */}
            {activeSection === 'quickstart' && (
              <>
                <h1 id="quick-start">Quick Start Guide</h1>
                <p className="lead">Get started with Nexus API in under 5 minutes. This guide will walk you through installation, authentication, and making your first API call.</p>

                <section id="installation" className="doc-section">
                  <h2>Installation</h2>
                  <p>Install the SDK for your preferred language:</p>
                  
                  {/* Language Switcher */}
                  <div className="language-tabs">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        className={`language-tab ${activeLanguage === lang ? 'active' : ''}`}
                        onClick={() => setActiveLanguage(lang)}
                      >
                        {languageLabels[lang]}
                      </button>
                    ))}
                  </div>

                  {/* Code Block with Copy Button */}
                  <div className="code-block-container">
                    <div className="code-block-header">
                      <span className="code-block-language">{languageLabels[activeLanguage]}</span>
                      <button 
                        className="copy-button"
                        onClick={() => copyToClipboard(codeExamples.installation[activeLanguage], 'installation')}
                      >
                        {copiedCode === 'installation' ? <Check size={16} /> : <Copy size={16} />}
                        {copiedCode === 'installation' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-block">
                      <code>{codeExamples.installation[activeLanguage]}</code>
                    </pre>
                  </div>
                </section>

                <section id="authentication" className="doc-section">
                  <h2>Authentication</h2>
                  <p>Get your API key from the dashboard and initialize the client:</p>
                  
                  <div className="code-block-container">
                    <div className="code-block-header">
                      <span className="code-block-language">{languageLabels[activeLanguage]}</span>
                      <button 
                        className="copy-button"
                        onClick={() => copyToClipboard(codeExamples.quickstart[activeLanguage], 'quickstart')}
                      >
                        {copiedCode === 'quickstart' ? <Check size={16} /> : <Copy size={16} />}
                        {copiedCode === 'quickstart' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="code-block">
                      <code>{codeExamples.quickstart[activeLanguage]}</code>
                    </pre>
                  </div>

                  <div className="callout callout-info">
                    <strong>💡 Tip:</strong> Never commit your API key to version control. Use environment variables instead.
                  </div>
                </section>
              </>
            )}

            {/* Users API Reference */}
            {activeSection === 'users' && (
              <>
                <h1 id="users-api">Users API</h1>
                <p className="lead">Manage users in your application with our comprehensive Users API.</p>

                <section id="api-endpoints" className="doc-section">
                  <h2>API Endpoints</h2>
                  
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="api-endpoint">
                      <div className="endpoint-header">
                        <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>
                          {endpoint.method}
                        </span>
                        <code className="endpoint-path">{endpoint.endpoint}</code>
                      </div>
                      <p className="endpoint-description">{endpoint.description}</p>

                      {/* Parameters Table */}
                      <h4>Parameters</h4>
                      <table className="params-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.params.map((param, idx) => (
                            <tr key={idx}>
                              <td><code>{param.name}</code></td>
                              <td><span className="type-badge">{param.type}</span></td>
                              <td>{param.required ? '✓ Yes' : '○ No'}</td>
                              <td>{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Code Example */}
                      {endpoint.method === 'POST' && (
                        <>
                          <h4>Example Request</h4>
                          <div className="language-tabs">
                            {languages.map((lang) => (
                              <button
                                key={lang}
                                className={`language-tab ${activeLanguage === lang ? 'active' : ''}`}
                                onClick={() => setActiveLanguage(lang)}
                              >
                                {languageLabels[lang]}
                              </button>
                            ))}
                          </div>
                          
                          <div className="code-block-container">
                            <div className="code-block-header">
                              <span className="code-block-language">{languageLabels[activeLanguage]}</span>
                              <button 
                                className="copy-button"
                                onClick={() => copyToClipboard(codeExamples.usersCreate[activeLanguage], `users-${index}`)}
                              >
                                {copiedCode === `users-${index}` ? <Check size={16} /> : <Copy size={16} />}
                                {copiedCode === `users-${index}` ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                            <pre className="code-block">
                              <code>{codeExamples.usersCreate[activeLanguage]}</code>
                            </pre>
                          </div>
                        </>
                      )}

                      {/* Response Example */}
                      <h4>Example Response</h4>
                      <div className="code-block-container">
                        <div className="code-block-header">
                          <span className="code-block-language">JSON</span>
                          <button 
                            className="copy-button"
                            onClick={() => copyToClipboard(endpoint.response, `response-${index}`)}
                          >
                            {copiedCode === `response-${index}` ? <Check size={16} /> : <Copy size={16} />}
                            {copiedCode === `response-${index}` ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <pre className="code-block">
                          <code>{endpoint.response}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Interactive Playground */}
                <section id="try-it" className="doc-section">
                  <h2>Try it Now</h2>
                  <div className="api-playground">
                    <div className="playground-header">
                      <h3>API Playground</h3>
                      <button className="btn-play">
                        <Play size={16} />
                        Run Request
                      </button>
                    </div>
                    <div className="playground-content">
                      <p>Test the Users API directly from your browser. Enter your API key to get started.</p>
                      <div className="callout callout-warning">
                        <strong>⚠️ Note:</strong> This playground uses your real API key. Be careful not to share it.
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Code Examples Section */}
            {activeSection === 'crud-operations' && (
              <>
                <h1 id="code-examples">Code Examples</h1>
                <p className="lead">Real-world examples to help you get started quickly.</p>

                <section className="doc-section">
                  <h2>CRUD Operations</h2>
                  <p>Complete example of Create, Read, Update, and Delete operations.</p>

                  <div className="example-cards">
                    {useCases.map((useCase, index) => (
                      <div key={index} className="example-card">
                        <div className="example-icon">{useCase.icon}</div>
                        <h3>{useCase.title}</h3>
                        <p>{useCase.description}</p>
                        <a href={useCase.link} className="example-link">
                          View Example <ExternalLink size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Default: Installation */}
            {activeSection === 'installation' && (
              <>
                <h1>Installation</h1>
                <p className="lead">Choose your preferred language and get started in seconds.</p>

                <div className="language-tabs">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      className={`language-tab ${activeLanguage === lang ? 'active' : ''}`}
                      onClick={() => setActiveLanguage(lang)}
                    >
                      {languageLabels[lang]}
                    </button>
                  ))}
                </div>

                <div className="code-block-container">
                  <div className="code-block-header">
                    <span className="code-block-language">{languageLabels[activeLanguage]}</span>
                    <button 
                      className="copy-button"
                      onClick={() => copyToClipboard(codeExamples.installation[activeLanguage], 'install')}
                    >
                      {copiedCode === 'install' ? <Check size={16} /> : <Copy size={16} />}
                      {copiedCode === 'install' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="code-block">
                    <code>{codeExamples.installation[activeLanguage]}</code>
                  </pre>
                </div>

                <div className="callout callout-info">
                  <strong>Next Steps:</strong> After installation, check out the Quick Start guide to make your first API call.
                </div>
              </>
            )}
          </div>
        </main>

        {/* Table of Contents Sidebar */}
        <aside className="docs-toc">
          <h3>On this page</h3>
          <nav className="toc-nav">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                className="toc-item"
                onClick={() => scrollToSection(item.id)}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default Docs;
