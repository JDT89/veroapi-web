import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const Changelog = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  const changelogData = [
    {
      id: 1,
      date: '2024-11-15',
      version: 'v2.4.0',
      type: 'feature',
      title: 'New Webhook Events',
      description: 'Added support for real-time webhook notifications for payment status updates.',
      details: [
        'New webhook events: payment.succeeded, payment.failed, payment.pending',
        'Configurable retry logic with exponential backoff',
        'Webhook signature verification for enhanced security'
      ]
    },
    {
      id: 2,
      date: '2024-11-10',
      version: 'v2.3.5',
      type: 'improvement',
      title: 'Rate Limiting Updates',
      description: 'Improved rate limiting with more granular control and better error messages.',
      details: [
        'Increased default rate limit to 1000 requests/minute',
        'Added rate limit headers in all API responses',
        'Better error messages when limits are exceeded'
      ]
    },
    {
      id: 3,
      date: '2024-11-05',
      version: 'v2.3.4',
      type: 'fix',
      title: 'Authentication Bug Fix',
      description: 'Fixed an issue where OAuth tokens were expiring earlier than expected.',
      details: [
        'Corrected token expiration calculation',
        'Added better logging for token refresh events',
        'Updated documentation with token lifecycle information'
      ]
    },
    {
      id: 4,
      date: '2024-10-28',
      version: 'v2.3.0',
      type: 'feature',
      title: 'Batch Operations Endpoint',
      description: 'New batch endpoint allowing multiple operations in a single API call.',
      details: [
        'Support for up to 100 operations per batch',
        'Atomic transaction support',
        'Detailed response for each operation in the batch'
      ]
    },
    {
      id: 5,
      date: '2024-10-20',
      version: 'v2.2.8',
      type: 'deprecation',
      title: 'Legacy v1 Endpoints Sunset Notice',
      description: 'v1 API endpoints will be deprecated on January 1, 2025.',
      details: [
        'All v1 endpoints will be disabled on January 1, 2025',
        'Please migrate to v2 endpoints before this date',
        'Migration guide available in documentation'
      ]
    },
    {
      id: 6,
      date: '2024-10-15',
      version: 'v2.2.7',
      type: 'security',
      title: 'Enhanced Security Measures',
      description: 'Implemented additional security features including IP whitelisting.',
      details: [
        'IP whitelisting support for API keys',
        'Two-factor authentication for API key management',
        'Security audit logging'
      ]
    }
  ];

  const typeStyles = {
    feature: {
      bg: 'rgba(46, 196, 182, 0.2)',
      border: '#2EC4B6',
      text: '#2EC4B6'
    },
    improvement: {
      bg: 'rgba(34, 197, 94, 0.2)',
      border: '#22c55e',
      text: '#22c55e'
    },
    fix: {
      bg: 'rgba(255, 159, 28, 0.2)',
      border: '#FF9F1C',
      text: '#FF9F1C'
    },
    deprecation: {
      bg: 'rgba(168, 85, 247, 0.2)',
      border: '#a855f7',
      text: '#a855f7'
    },
    security: {
      bg: 'rgba(249, 115, 115, 0.2)',
      border: '#f97373',
      text: '#f97373'
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredChangelog = selectedType === 'all' 
    ? changelogData 
    : changelogData.filter(item => item.type === selectedType);

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      animation: 'fadeUpSoft 0.4s ease'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          margin: '0 0 0.5rem',
          fontSize: '2rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          letterSpacing: '-0.02em'
        }}>
          API Changelog
        </h1>
        <p style={{ 
          margin: 0,
          fontSize: '0.95rem',
          color: 'var(--text-soft)'
        }}>
          Stay updated with the latest changes to our API
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem',
        marginBottom: '1.5rem'
      }}>
        {['all', 'feature', 'improvement', 'fix', 'security', 'deprecation'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              borderRadius: 'var(--radius-pill)',
              border: selectedType === type 
                ? '1px solid var(--accent)' 
                : '1px solid var(--border-strong)',
              background: selectedType === type 
                ? 'var(--accent-soft)' 
                : 'var(--bg-elevated)',
              color: selectedType === type 
                ? 'var(--accent)' 
                : 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.14s ease',
              boxShadow: selectedType === type 
                ? 'var(--shadow-accent)' 
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedType !== type) {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.background = 'var(--bg-soft)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedType !== type) {
                e.target.style.borderColor = 'var(--border-strong)';
                e.target.style.background = 'var(--bg-elevated)';
              }
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Changelog Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredChangelog.map(item => {
          const style = typeStyles[item.type];
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <div
              key={item.id}
              className="card"
              style={{
                transition: 'all 0.2s ease',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '0.75rem',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    marginBottom: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: 'var(--radius-sm)',
                      background: style.bg,
                      color: style.text,
                      border: `1px solid ${style.border}`
                    }}>
                      {item.type}
                    </span>
                    <span style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '0.8rem',
                      color: 'var(--text-softer)',
                      fontWeight: '500'
                    }}>
                      {item.version}
                    </span>
                  </div>
                  <h3 style={{
                    margin: '0 0 0.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.01em'
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    color: 'var(--text-soft)',
                    lineHeight: '1.5'
                  }}>
                    {item.description}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  color: 'var(--text-softer)',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}>
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
              </div>

              {item.details && (
                <>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      marginTop: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      color: 'var(--text-soft)',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.14s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'var(--bg-elevated)';
                      e.target.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = 'var(--text-soft)';
                    }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isExpanded ? 'Hide details' : 'Show details'}
                  </button>

                  {isExpanded && (
                    <ul style={{
                      margin: '1rem 0 0',
                      padding: '0 0 0 1rem',
                      borderLeft: '2px solid var(--border-subtle)',
                      listStyle: 'none'
                    }}>
                      {item.details.map((detail, idx) => (
                        <li key={idx} style={{
                          padding: '0.4rem 0',
                          fontSize: '0.875rem',
                          color: 'var(--text-soft)',
                          lineHeight: '1.6',
                          position: 'relative',
                          paddingLeft: '1rem'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: 'var(--accent)'
                          }}>•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {filteredChangelog.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem',
          color: 'var(--text-softer)'
        }}>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            No changes found for this filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Changelog;
