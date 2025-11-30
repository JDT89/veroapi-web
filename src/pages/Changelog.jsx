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

  const typeColors = {
    feature: 'bg-blue-100 text-blue-800 border-blue-200',
    improvement: 'bg-green-100 text-green-800 border-green-200',
    fix: 'bg-orange-100 text-orange-800 border-orange-200',
    deprecation: 'bg-purple-100 text-purple-800 border-purple-200',
    security: 'bg-red-100 text-red-800 border-red-200'
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
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">API Changelog</h1>
        <p className="text-slate-600">Stay updated with the latest changes to our API</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'feature', 'improvement', 'fix', 'security', 'deprecation'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedType === type
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredChangelog.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${typeColors[item.type]}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="text-sm font-mono text-slate-600">{item.version}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500 ml-4 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm whitespace-nowrap">{item.date}</span>
                </div>
              </div>

              {item.details && (
                <>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium mt-3 transition-colors"
                  >
                    {expandedItems.has(item.id) ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show details
                      </>
                    )}
                  </button>

                  {expandedItems.has(item.id) && (
                    <ul className="mt-4 space-y-2 pl-4 border-l-2 border-slate-200">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="text-slate-600 text-sm">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredChangelog.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No changes found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default Changelog;
