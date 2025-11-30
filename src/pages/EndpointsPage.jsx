import React, { useState } from 'react';
import { Search, Zap, Clock, Shield, Copy, Check, Code, ArrowRight, Filter, Sparkles, Terminal } from 'lucide-react';

const EndpointsPageRedesign = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);

  const categories = [
    { id: 'all', label: 'All Endpoints', count: 12 },
    { id: 'text', label: 'Text Utils', count: 5, color: '#FF9F1C' },
    { id: 'random', label: 'Randomness', count: 4, color: '#2EC4B6' },
    { id: 'utility', label: 'Utilities', count: 3, color: '#a855f7' }
  ];

  const endpoints = [
    {
      id: 'text-scramble',
      name: 'Text Scrambler',
      category: 'text',
      method: 'POST',
      path: '/v1/text/scramble',
      description: 'Scramble words for games, challenges, and puzzles with customizable difficulty',
      status: 'live',
      responseTime: '45ms',
      popularity: 95,
      example: {
        request: `{
  "text": "javascript",
  "difficulty": "medium"
}`,
        response: `{
  "ok": true,
  "original": "javascript",
  "scrambled": "ajvascript"
}`
      },
      tags: ['Games', 'Discord', 'Fun']
    },
    {
      id: 'text-slug',
      name: 'Slugify',
      category: 'text',
      method: 'POST',
      path: '/v1/text/slugify',
      description: 'Convert any text into clean, URL-friendly slugs with customizable separators',
      status: 'live',
      responseTime: '38ms',
      popularity: 88,
      example: {
        request: `{
  "text": "Hello World 2024!",
  "separator": "-"
}`,
        response: `{
  "ok": true,
  "slug": "hello-world-2024"
}`
      },
      tags: ['SEO', 'URLs', 'Web']
    },
    {
      id: 'random-number',
      name: 'Random Number',
      category: 'random',
      method: 'POST',
      path: '/v1/random/number',
      description: 'Generate cryptographically secure random numbers with min/max bounds',
      status: 'live',
      responseTime: '42ms',
      popularity: 92,
      example: {
        request: `{
  "min": 1,
  "max": 100,
  "count": 5
}`,
        response: `{
  "ok": true,
  "numbers": [42, 17, 89, 3, 56]
}`
      },
      tags: ['RNG', 'Games', 'Lottery']
    },
    {
      id: 'random-pick',
      name: 'Random Pick',
      category: 'random',
      method: 'POST',
      path: '/v1/random/pick',
      description: 'Randomly select items from arrays with optional weights',
      status: 'beta',
      responseTime: '40ms',
      popularity: 85,
      example: {
        request: `{
  "items": ["red", "blue", "green"],
  "count": 1
}`,
        response: `{
  "ok": true,
  "picked": ["blue"]
}`
      },
      tags: ['Selection', 'Games', 'Utility']
    },
    {
      id: 'uuid-generate',
      name: 'UUID Generator',
      category: 'utility',
      method: 'POST',
      path: '/v1/utility/uuid',
      description: 'Generate RFC4122 compliant UUIDs (v4) in bulk',
      status: 'live',
      responseTime: '35ms',
      popularity: 90,
      example: {
        request: `{
  "count": 3,
  "version": "v4"
}`,
        response: `{
  "ok": true,
  "uuids": [
    "550e8400-e29b-41d4-a716-446655440000",
    "7c9e6679-7425-40de-944b-e07fc1f90ae7"
  ]
}`
      },
      tags: ['IDs', 'Database', 'Tracking']
    },
    {
      id: 'text-case',
      name: 'Case Converter',
      category: 'text',
      method: 'POST',
      path: '/v1/text/case',
      description: 'Convert text between various cases: camelCase, snake_case, kebab-case, etc.',
      status: 'live',
      responseTime: '40ms',
      popularity: 78,
      example: {
        request: `{
  "text": "hello world",
  "to": "camelCase"
}`,
        response: `{
  "ok": true,
  "result": "helloWorld"
}`
      },
      tags: ['Formatting', 'Development']
    },
    {
      id: 'coin-flip',
      name: 'Coin Flip',
      category: 'random',
      method: 'GET',
      path: '/v1/random/coin',
      description: 'Fair coin flip with optional bias parameter',
      status: 'live',
      responseTime: '30ms',
      popularity: 82,
      example: {
        request: `// GET request, no body needed`,
        response: `{
  "ok": true,
  "result": "heads"
}`
      },
      tags: ['Games', 'Simple', 'Fast']
    },
    {
      id: 'hash-generate',
      name: 'Hash Generator',
      category: 'utility',
      method: 'POST',
      path: '/v1/utility/hash',
      description: 'Generate cryptographic hashes (MD5, SHA-256, SHA-512)',
      status: 'beta',
      responseTime: '48ms',
      popularity: 75,
      example: {
        request: `{
  "text": "hello",
  "algorithm": "sha256"
}`,
        response: `{
  "ok": true,
  "hash": "2cf24dba5fb0..."
}`
      },
      tags: ['Security', 'Crypto', 'Verification']
    }
  ];

  const filteredEndpoints = endpoints.filter(ep => {
    const matchesCategory = activeCategory === 'all' || ep.category === activeCategory;
    const matchesSearch = ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ep.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'live': return '#22c55e';
      case 'beta': return '#FF9F1C';
      case 'planned': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getMethodColor = (method) => {
    switch(method) {
      case 'GET': return '#2EC4B6';
      case 'POST': return '#FF9F1C';
      case 'PUT': return '#a855f7';
      case 'DELETE': return '#f97373';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#171D23',
      color: '#F6F7F8',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: '48px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(46, 196, 182, 0.1)',
            border: '1px solid rgba(46, 196, 182, 0.3)',
            borderRadius: '999px',
            marginBottom: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <Sparkles size={16} style={{ color: '#2EC4B6' }} />
            <span style={{ color: '#2EC4B6' }}>{endpoints.length} endpoints available</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #F6F7F8 0%, #2EC4B6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            API Endpoints
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(246, 247, 248, 0.6)',
            maxWidth: '700px',
            margin: '0 auto 32px',
            lineHeight: '1.6'
          }}>
            Production-ready endpoints with sub-50ms response times. One key, unlimited possibilities.
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {[
              { icon: Zap, label: '~40ms avg', color: '#FF9F1C' },
              { icon: Shield, label: '99.9% uptime', color: '#22c55e' },
              { icon: Clock, label: '24/7 available', color: '#2EC4B6' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} style={{
                  padding: '12px',
                  background: 'rgba(30, 37, 44, 0.6)',
                  border: '1px solid rgba(46, 196, 182, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} style={{ color: stat.color }} />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(246, 247, 248, 0.8)' }}>
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filter */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{
            flex: '1 1 300px',
            position: 'relative'
          }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(246, 247, 248, 0.4)'
            }} />
            <input
              type="text"
              placeholder="Search endpoints, tags, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'rgba(30, 37, 44, 0.6)',
                border: '1px solid rgba(46, 196, 182, 0.2)',
                borderRadius: '12px',
                color: '#F6F7F8',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2EC4B6';
                e.target.style.boxShadow = '0 0 0 3px rgba(46, 196, 182, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(46, 196, 182, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Category filters */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '10px 18px',
                  background: activeCategory === cat.id 
                    ? 'rgba(46, 196, 182, 0.2)' 
                    : 'rgba(30, 37, 44, 0.6)',
                  border: `1px solid ${activeCategory === cat.id ? '#2EC4B6' : 'rgba(46, 196, 182, 0.2)'}`,
                  borderRadius: '999px',
                  color: activeCategory === cat.id ? '#2EC4B6' : 'rgba(246, 247, 248, 0.7)',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat.id) {
                    e.target.style.borderColor = 'rgba(46, 196, 182, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat.id) {
                    e.target.style.borderColor = 'rgba(46, 196, 182, 0.2)';
                  }
                }}
              >
                {cat.label}
                <span style={{
                  padding: '2px 8px',
                  background: 'rgba(46, 196, 182, 0.2)',
                  borderRadius: '999px',
                  fontSize: '0.75rem'
                }}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Endpoints Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '20px'
        }}>
          {filteredEndpoints.map(endpoint => (
            <div
              key={endpoint.id}
              style={{
                background: 'rgba(30, 37, 44, 0.6)',
                border: '1px solid rgba(46, 196, 182, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2EC4B6';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(46, 196, 182, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Popularity indicator */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${endpoint.popularity}%`,
                height: '3px',
                background: 'linear-gradient(90deg, #2EC4B6, #FF9F1C)',
                borderRadius: '16px 0 0 0'
              }} />

              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      padding: '4px 10px',
                      background: `${getMethodColor(endpoint.method)}20`,
                      color: getMethodColor(endpoint.method),
                      border: `1px solid ${getMethodColor(endpoint.method)}`,
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      fontFamily: 'monospace'
                    }}>
                      {endpoint.method}
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      background: `${getStatusColor(endpoint.status)}20`,
                      color: getStatusColor(endpoint.status),
                      border: `1px solid ${getStatusColor(endpoint.status)}`,
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {endpoint.status}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#F6F7F8',
                    marginBottom: '4px'
                  }}>
                    {endpoint.name}
                  </h3>
                  <code style={{
                    fontSize: '0.85rem',
                    color: '#2EC4B6',
                    fontFamily: 'monospace'
                  }}>
                    {endpoint.path}
                  </code>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(`curl https://api.vero-api.com${endpoint.path}`, endpoint.id);
                  }}
                  style={{
                    padding: '8px',
                    background: 'rgba(46, 196, 182, 0.1)',
                    border: '1px solid rgba(46, 196, 182, 0.3)',
                    borderRadius: '8px',
                    color: '#2EC4B6',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {copiedId === endpoint.id ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.95rem',
                color: 'rgba(246, 247, 248, 0.7)',
                lineHeight: '1.5',
                marginBottom: '16px'
              }}>
                {endpoint.description}
              </p>

              {/* Tags */}
              <div style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                marginBottom: '12px'
              }}>
                {endpoint.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '4px 10px',
                    background: 'rgba(46, 196, 182, 0.1)',
                    border: '1px solid rgba(46, 196, 182, 0.2)',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    color: 'rgba(246, 247, 248, 0.6)'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Response time */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'rgba(246, 247, 248, 0.5)'
              }}>
                <Clock size={14} />
                <span>Avg response: {endpoint.responseTime}</span>
              </div>

              {/* Expanded section */}
              {expandedEndpoint === endpoint.id && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(46, 196, 182, 0.2)'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    {/* Request */}
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: 'rgba(246, 247, 248, 0.5)',
                        marginBottom: '8px',
                        letterSpacing: '0.05em'
                      }}>
                        Request
                      </div>
                      <pre style={{
                        padding: '12px',
                        background: 'rgba(15, 19, 24, 0.8)',
                        border: '1px solid rgba(46, 196, 182, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#2EC4B6',
                        fontFamily: 'monospace',
                        margin: 0,
                        overflow: 'auto'
                      }}>
                        {endpoint.example.request}
                      </pre>
                    </div>

                    {/* Re