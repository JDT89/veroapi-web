import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Zap, Clock, Shield, Copy, Check, Code, ArrowRight, Filter, Sparkles, Terminal, Play, ChevronDown, ArrowUpDown, Loader2, X, Keyboard } from 'lucide-react';

const EndpointsPageRedesign = () => {
  // URL params for persistent filters
  const getInitialParams = () => {
    if (typeof window === 'undefined') return { category: 'all', search: '', sort: 'popularity' };
    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get('category') || 'all',
      search: params.get('q') || '',
      sort: params.get('sort') || 'popularity'
    };
  };

  const initialParams = getInitialParams();
  const [searchQuery, setSearchQuery] = useState(initialParams.search);
  const [activeCategory, setActiveCategory] = useState(initialParams.category);
  const [sortBy, setSortBy] = useState(initialParams.sort);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  
  // Try it now state
  const [tryItEndpoint, setTryItEndpoint] = useState(null);
  const [tryItInput, setTryItInput] = useState('');
  const [tryItResponse, setTryItResponse] = useState(null);
  const [tryItLoading, setTryItLoading] = useState(false);

  const searchRef = useRef(null);
  const cardRefs = useRef([]);
  const containerRef = useRef(null);

  const categories = [
    { id: 'all', label: 'All Endpoints', count: 11 },
    { id: 'text', label: 'Text Utils', count: 3, color: '#FF9F1C' },
    { id: 'random', label: 'Randomness', count: 6, color: '#2EC4B6' },
    { id: 'utility', label: 'Utilities', count: 2, color: '#a855f7' }
  ];

  const sortOptions = [
    { id: 'popularity', label: 'Most Popular' },
    { id: 'name', label: 'Alphabetical' },
    { id: 'response', label: 'Fastest Response' },
    { id: 'newest', label: 'Newest First' }
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
      responseTimeNum: 45,
      popularity: 95,
      dateAdded: '2024-01-15',
      tryItConfig: {
        fields: [
          { name: 'text', type: 'text', placeholder: 'Enter text to scramble...', default: 'javascript' },
          { name: 'difficulty', type: 'select', options: ['easy', 'medium', 'hard'], default: 'medium' }
        ]
      },
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
      responseTimeNum: 38,
      popularity: 88,
      dateAdded: '2024-01-10',
      tryItConfig: {
        fields: [
          { name: 'text', type: 'text', placeholder: 'Enter text to slugify...', default: 'Hello World 2024!' },
          { name: 'separator', type: 'select', options: ['-', '_', '.'], default: '-' }
        ]
      },
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
      responseTimeNum: 42,
      popularity: 92,
      dateAdded: '2024-02-01',
      tryItConfig: {
        fields: [
          { name: 'min', type: 'number', placeholder: 'Min value', default: '1' },
          { name: 'max', type: 'number', placeholder: 'Max value', default: '100' },
          { name: 'count', type: 'number', placeholder: 'Count', default: '5' }
        ]
      },
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
      responseTimeNum: 40,
      popularity: 85,
      dateAdded: '2024-03-01',
      tryItConfig: {
        fields: [
          { name: 'items', type: 'text', placeholder: 'Comma-separated items...', default: 'red, blue, green, yellow' },
          { name: 'count', type: 'number', placeholder: 'How many to pick', default: '1' }
        ]
      },
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
      responseTimeNum: 35,
      popularity: 90,
      dateAdded: '2024-01-20',
      tryItConfig: {
        fields: [
          { name: 'count', type: 'number', placeholder: 'Number of UUIDs', default: '3' },
          { name: 'version', type: 'select', options: ['v4', 'v1'], default: 'v4' }
        ]
      },
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
      responseTimeNum: 40,
      popularity: 78,
      dateAdded: '2024-02-15',
      tryItConfig: {
        fields: [
          { name: 'text', type: 'text', placeholder: 'Enter text...', default: 'hello world example' },
          { name: 'to', type: 'select', options: ['camelCase', 'snake_case', 'kebab-case', 'PascalCase', 'UPPER_CASE'], default: 'camelCase' }
        ]
      },
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
      responseTimeNum: 30,
      popularity: 82,
      dateAdded: '2024-01-05',
      tryItConfig: {
        fields: []
      },
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
      id: 'random-text',
      name: 'Random Text',
      category: 'random',
      method: 'GET',
      path: '/random/text',
      description: 'Get random text snippets. Supports types: quote, joke, trivia, fact, riddle',
      status: 'live',
      responseTime: '35ms',
      responseTimeNum: 35,
      popularity: 90,
      dateAdded: '2024-02-20',
      tryItConfig: {
        fields: [
          { name: 'type', type: 'select', options: ['quote', 'joke', 'trivia', 'fact', 'riddle'], default: 'quote' }
        ]
      },
      example: {
        request: `GET /random/text?type=quote`,
        response: `{
  "ok": true,
  "type": "quote",
  "text": "The only way to do great work is to love what you do.",
  "author": "Steve Jobs"
}`
      },
      tags: ['Content', 'Bots', 'Fun']
    },
    {
      id: 'random-social',
      name: 'Random Social',
      category: 'random',
      method: 'GET',
      path: '/random/social',
      description: 'Get random social media content. Supports types: tweet, bio, hashtag, caption, username',
      status: 'live',
      responseTime: '38ms',
      responseTimeNum: 38,
      popularity: 88,
      dateAdded: '2024-03-10',
      tryItConfig: {
        fields: [
          { name: 'type', type: 'select', options: ['tweet', 'bio', 'hashtag', 'caption', 'username'], default: 'bio' }
        ]
      },
      example: {
        request: `GET /random/social?type=bio`,
        response: `{
  "ok": true,
  "type": "bio",
  "text": "Coffee enthusiast ☕ | Code by day, dream by night | Building the future one commit at a time"
}`
      },
      tags: ['Social', 'Content', 'Marketing']
    },
    {
      id: 'random-fortune',
      name: 'Random Fortune',
      category: 'random',
      method: 'GET',
      path: '/random/fortune',
      description: 'Get random fortune-telling content. Supports types: fortune, horoscope, prediction, wisdom, advice',
      status: 'live',
      responseTime: '32ms',
      responseTimeNum: 32,
      popularity: 85,
      dateAdded: '2024-02-28',
      tryItConfig: {
        fields: [
          { name: 'type', type: 'select', options: ['fortune', 'horoscope', 'prediction', 'wisdom', 'advice'], default: 'wisdom' }
        ]
      },
      example: {
        request: `GET /random/fortune?type=wisdom`,
        response: `{
  "ok": true,
  "type": "wisdom",
  "text": "A journey of a thousand miles begins with a single step."
}`
      },
      tags: ['Fun', 'Entertainment', 'Wisdom']
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
      responseTimeNum: 48,
      popularity: 75,
      dateAdded: '2024-03-15',
      tryItConfig: {
        fields: [
          { name: 'text', type: 'text', placeholder: 'Text to hash...', default: 'hello world' },
          { name: 'algorithm', type: 'select', options: ['md5', 'sha256', 'sha512'], default: 'sha256' }
        ]
      },
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

  // Update URL when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (activeCategory !== 'all') params.set('category', activeCategory);
    if (searchQuery) params.set('q', searchQuery);
    if (sortBy !== 'popularity') params.set('sort', sortBy);
    
    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }, [activeCategory, searchQuery, sortBy]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // "/" to focus search
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // "?" to show keyboard help
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setShowKeyboardHelp(prev => !prev);
        return;
      }

      // Escape to close modals/clear
      if (e.key === 'Escape') {
        if (tryItEndpoint) {
          setTryItEndpoint(null);
          setTryItResponse(null);
          return;
        }
        if (showKeyboardHelp) {
          setShowKeyboardHelp(false);
          return;
        }
        if (expandedEndpoint) {
          setExpandedEndpoint(null);
          return;
        }
        if (document.activeElement === searchRef.current) {
          searchRef.current?.blur();
          setFocusedIndex(0);
          return;
        }
      }

      // Arrow navigation when not in search
      if (document.activeElement === searchRef.current) return;

      const filteredLength = filteredEndpoints.length;
      if (filteredLength === 0) return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredLength - 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        const endpoint = filteredEndpoints[focusedIndex];
        setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id);
      } else if (e.key === 't' && focusedIndex >= 0) {
        e.preventDefault();
        const endpoint = filteredEndpoints[focusedIndex];
        openTryIt(endpoint);
      } else if (e.key === 'c' && focusedIndex >= 0) {
        e.preventDefault();
        const endpoint = filteredEndpoints[focusedIndex];
        handleCopy(`curl https://api.vero-api.com${endpoint.path}`, endpoint.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, expandedEndpoint, tryItEndpoint, showKeyboardHelp]);

  // Scroll focused card into view
  useEffect(() => {
    if (focusedIndex >= 0 && cardRefs.current[focusedIndex]) {
      cardRefs.current[focusedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [focusedIndex]);

  // Filter and sort endpoints
  const filteredEndpoints = endpoints
    .filter(ep => {
      const matchesCategory = activeCategory === 'all' || ep.category === activeCategory;
      const matchesSearch = ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ep.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'response':
          return a.responseTimeNum - b.responseTimeNum;
        case 'newest':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
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

  const getMethodBg = (method) => {
    switch(method) {
      case 'GET': return 'linear-gradient(135deg, rgba(46, 196, 182, 0.15) 0%, rgba(46, 196, 182, 0.05) 100%)';
      case 'POST': return 'linear-gradient(135deg, rgba(255, 159, 28, 0.15) 0%, rgba(255, 159, 28, 0.05) 100%)';
      case 'PUT': return 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)';
      case 'DELETE': return 'linear-gradient(135deg, rgba(249, 115, 115, 0.15) 0%, rgba(249, 115, 115, 0.05) 100%)';
      default: return 'transparent';
    }
  };

  // Try It Now functionality
  const openTryIt = (endpoint) => {
    setTryItEndpoint(endpoint);
    setTryItResponse(null);
    const defaultValues = {};
    endpoint.tryItConfig.fields.forEach(field => {
      defaultValues[field.name] = field.default || '';
    });
    setTryItInput(JSON.stringify(defaultValues, null, 2));
  };

  const executeTryIt = async () => {
    if (!tryItEndpoint) return;
    
    setTryItLoading(true);
    
    // Simulate API call with mock response
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    
    try {
      const inputData = JSON.parse(tryItInput);
      
      // Generate mock responses based on endpoint
      let mockResponse = { ok: true };
      
      switch (tryItEndpoint.id) {
        case 'text-scramble':
          const text = inputData.text || 'test';
          const chars = text.split('');
          for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
          }
          mockResponse = { ok: true, original: text, scrambled: chars.join('') };
          break;
        case 'text-slug':
          mockResponse = { 
            ok: true, 
            slug: (inputData.text || '').toLowerCase().replace(/[^a-z0-9]+/g, inputData.separator || '-').replace(/^-|-$/g, '')
          };
          break;
        case 'random-number':
          const min = parseInt(inputData.min) || 1;
          const max = parseInt(inputData.max) || 100;
          const count = parseInt(inputData.count) || 1;
          const numbers = Array.from({ length: count }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
          );
          mockResponse = { ok: true, numbers };
          break;
        case 'random-pick':
          const items = (inputData.items || '').split(',').map(s => s.trim()).filter(Boolean);
          const pickCount = Math.min(parseInt(inputData.count) || 1, items.length);
          const shuffled = [...items].sort(() => Math.random() - 0.5);
          mockResponse = { ok: true, picked: shuffled.slice(0, pickCount) };
          break;
        case 'uuid-generate':
          const uuidCount = parseInt(inputData.count) || 1;
          const uuids = Array.from({ length: uuidCount }, () => 
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
              const r = Math.random() * 16 | 0;
              return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            })
          );
          mockResponse = { ok: true, uuids };
          break;
        case 'text-case':
          const inputText = inputData.text || '';
          let result = inputText;
          switch (inputData.to) {
            case 'camelCase':
              result = inputText.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
              break;
            case 'snake_case':
              result = inputText.toLowerCase().replace(/\s+/g, '_');
              break;
            case 'kebab-case':
              result = inputText.toLowerCase().replace(/\s+/g, '-');
              break;
            case 'PascalCase':
              result = inputText.toLowerCase().replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, c) => c.toUpperCase());
              break;
            case 'UPPER_CASE':
              result = inputText.toUpperCase().replace(/\s+/g, '_');
              break;
          }
          mockResponse = { ok: true, result };
          break;
        case 'coin-flip':
          mockResponse = { ok: true, result: Math.random() > 0.5 ? 'heads' : 'tails' };
          break;
        case 'random-text':
          const quotes = [
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { text: "Stay hungry, stay foolish.", author: "Steve Jobs" }
          ];
          const quote = quotes[Math.floor(Math.random() * quotes.length)];
          mockResponse = { ok: true, type: inputData.type || 'quote', ...quote };
          break;
        case 'hash-generate':
          mockResponse = { 
            ok: true, 
            algorithm: inputData.algorithm || 'sha256',
            hash: Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
          };
          break;
        default:
          mockResponse = { ok: true, message: 'Mock response' };
      }
      
      setTryItResponse({
        status: 200,
        time: Math.floor(Math.random() * 30) + 25,
        data: mockResponse
      });
    } catch (e) {
      setTryItResponse({
        status: 400,
        time: 12,
        data: { ok: false, error: 'Invalid JSON input' }
      });
    }
    
    setTryItLoading(false);
  };

  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: '100vh',
        background: '#171D23',
        color: '#F6F7F8',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '40px 16px'
      }}
    >
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
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {[
              { icon: Zap, label: '~40ms avg', color: '#FF9F1C' },
              { icon: Shield, label: '99.9% uptime', color: '#22c55e' },
              { icon: Clock, label: '24/7 available', color: '#2EC4B6' },
              { icon: Keyboard, label: 'Press ? for shortcuts', color: '#a855f7', onClick: () => setShowKeyboardHelp(true) }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  onClick={stat.onClick}
                  style={{
                    padding: '12px',
                    background: 'rgba(30, 37, 44, 0.6)',
                    border: '1px solid rgba(46, 196, 182, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'center',
                    cursor: stat.onClick ? 'pointer' : 'default',
                    transition: 'all 0.2s ease'
                  }}
                >
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
              ref={searchRef}
              type="text"
              placeholder="Search endpoints... (press / to focus)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setFocusedIndex(-1);
              }}
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
                setFocusedIndex(-1);
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(46, 196, 182, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '4px 8px',
              background: 'rgba(46, 196, 182, 0.1)',
              borderRadius: '6px',
              fontSize: '0.75rem',
              color: 'rgba(246, 247, 248, 0.5)',
              fontFamily: 'monospace'
            }}>
              /
            </div>
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              style={{
                padding: '14px 18px',
                background: 'rgba(30, 37, 44, 0.6)',
                border: '1px solid rgba(46, 196, 182, 0.2)',
                borderRadius: '12px',
                color: 'rgba(246, 247, 248, 0.8)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowUpDown size={16} />
              {sortOptions.find(s => s.id === sortBy)?.label}
              <ChevronDown size={16} style={{
                transform: showSortDropdown ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s ease'
              }} />
            </button>
            
            {showSortDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'rgba(30, 37, 44, 0.95)',
                border: '1px solid rgba(46, 196, 182, 0.3)',
                borderRadius: '12px',
                padding: '8px',
                zIndex: 100,
                minWidth: '180px',
                backdropFilter: 'blur(20px)'
              }}>
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setShowSortDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: sortBy === option.id ? 'rgba(46, 196, 182, 0.2)' : 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: sortBy === option.id ? '#2EC4B6' : 'rgba(246, 247, 248, 0.7)',
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setFocusedIndex(-1);
              }}
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

        {/* Endpoints Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
          gap: '20px'
        }}>
          {filteredEndpoints.map((endpoint, index) => (
            <div
              key={endpoint.id}
              ref={el => cardRefs.current[index] = el}
              tabIndex={0}
              style={{
                background: getMethodBg(endpoint.method),
                border: `2px solid ${focusedIndex === index ? getMethodColor(endpoint.method) : 'rgba(46, 196, 182, 0.2)'}`,
                borderLeft: `4px solid ${getMethodColor(endpoint.method)}`,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                outline: 'none',
                transform: focusedIndex === index ? 'scale(1.02)' : 'scale(1)',
                boxShadow: focusedIndex === index ? `0 8px 24px ${getMethodColor(endpoint.method)}33` : 'none'
              }}
              onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
              onFocus={() => setFocusedIndex(index)}
              onMouseEnter={(e) => {
                if (focusedIndex !== index) {
                  e.currentTarget.style.borderColor = getMethodColor(endpoint.method);
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${getMethodColor(endpoint.method)}33`;
                }
              }}
              onMouseLeave={(e) => {
                if (focusedIndex !== index) {
                  e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Popularity indicator */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${endpoint.popularity}%`,
                height: '3px',
                background: `linear-gradient(90deg, ${getMethodColor(endpoint.method)}, ${getMethodColor(endpoint.method)}66)`,
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
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      background: `${getMethodColor(endpoint.method)}25`,
                      color: getMethodColor(endpoint.method),
                      border: `2px solid ${getMethodColor(endpoint.method)}`,
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      fontFamily: 'monospace',
                      letterSpacing: '0.05em'
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
                    color: getMethodColor(endpoint.method),
                    fontFamily: 'monospace'
                  }}>
                    {endpoint.path}
                  </code>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTryIt(endpoint);
                    }}
                    style={{
                      padding: '8px 12px',
                      background: `${getMethodColor(endpoint.method)}15`,
                      border: `1px solid ${getMethodColor(endpoint.method)}50`,
                      borderRadius: '8px',
                      color: getMethodColor(endpoint.method),
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}
                    title="Try it now (T)"
                  >
                    <Play size={14} />
                    Try
                  </button>
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
                    title="Copy curl command (C)"
                  >
                    {copiedId === endpoint.id ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
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
                  {/* Mobile-friendly stacked layout */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
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
                        color: getMethodColor(endpoint.method),
                        fontFamily: 'monospace',
                        margin: 0,
                        overflow: 'auto',
                        maxHeight: '150px'
                      }}>
                        {endpoint.example.request}
                      </pre>
                    </div>

                    {/* Response */}
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        color: 'rgba(246, 247, 248, 0.5)',
                        marginBottom: '8px',
                        letterSpacing: '0.05em'
                      }}>
                        Response
                      </div>
                      <pre style={{
                        padding: '12px',
                        background: 'rgba(15, 19, 24, 0.8)',
                        border: '1px solid rgba(46, 196, 182, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: '#22c55e',
                        fontFamily: 'monospace',
                        margin: 0,
                        overflow: 'auto',
                        maxHeight: '150px'
                      }}>
                        {endpoint.example.response}
                      </pre>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openTryIt(endpoint);
                      }}
                      style={{
                        flex: '1 1 auto',
                        padding: '10px',
                        background: `linear-gradient(135deg, ${getMethodColor(endpoint.method)}30 0%, ${getMethodColor(endpoint.method)}10 100%)`,
                        border: `1px solid ${getMethodColor(endpoint.method)}`,
                        borderRadius: '8px',
                        color: getMethodColor(endpoint.method),
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Play size={16} />
                      Try It Now
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to docs page for this endpoint
                        window.location.href = `/docs${endpoint.path}`;
                      }}
                      style={{
                        flex: '1 1 auto',
                        padding: '10px',
                        background: 'rgba(46, 196, 182, 0.1)',
                        border: '1px solid rgba(46, 196, 182, 0.3)',
                        borderRadius: '8px',
                        color: '#2EC4B6',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Code size={16} />
                      View Docs
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredEndpoints.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'rgba(246, 247, 248, 0.5)'
          }}>
            <Filter size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '8px',
              color: 'rgba(246, 247, 248, 0.7)'
            }}>
              No endpoints found
            </h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}

        {/* CTA Section */}
        <div style={{
          marginTop: '80px',
          padding: '48px',
          background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.1) 0%, rgba(255, 159, 28, 0.1) 100%)',
          border: '1px solid rgba(46, 196, 182, 0.2)',
          borderRadius: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            Ready to integrate?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(246, 247, 248, 0.6)',
            marginBottom: '32px'
          }}>
            Get your API key and start building in under 2 minutes
          </p>
          <button style={{
            padding: '16px 32px',
            fontSize: '1rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #FF9F1C 0%, #ffb347 100%)',
            color: '#171D23',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 32px rgba(255, 159, 28, 0.4)'
          }}>
            Get Started Free
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Try It Now Modal */}
      {tryItEndpoint && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}
        onClick={() => {
          setTryItEndpoint(null);
          setTryItResponse(null);
        }}>
          <div 
            style={{
              background: '#1E252C',
              border: `2px solid ${getMethodColor(tryItEndpoint.method)}`,
              borderRadius: '20px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(46, 196, 182, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: '#1E252C',
              zIndex: 10
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{
                    padding: '6px 12px',
                    background: `${getMethodColor(tryItEndpoint.method)}25`,
                    color: getMethodColor(tryItEndpoint.method),
                    border: `2px solid ${getMethodColor(tryItEndpoint.method)}`,
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    fontFamily: 'monospace'
                  }}>
                    {tryItEndpoint.method}
                  </span>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                    {tryItEndpoint.name}
                  </h2>
                </div>
                <code style={{ color: getMethodColor(tryItEndpoint.method), fontSize: '0.9rem' }}>
                  {tryItEndpoint.path}
                </code>
              </div>
              <button
                onClick={() => {
                  setTryItEndpoint(null);
                  setTryItResponse(null);
                }}
                style={{
                  padding: '8px',
                  background: 'rgba(246, 247, 248, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'rgba(246, 247, 248, 0.6)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {/* Input Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: 'rgba(246, 247, 248, 0.5)',
                  marginBottom: '10px',
                  letterSpacing: '0.05em'
                }}>
                  Request Body
                </label>
                <textarea
                  value={tryItInput}
                  onChange={(e) => setTryItInput(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '16px',
                    background: 'rgba(15, 19, 24, 0.8)',
                    border: '1px solid rgba(46, 196, 182, 0.3)',
                    borderRadius: '12px',
                    color: '#F6F7F8',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = getMethodColor(tryItEndpoint.method)}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(46, 196, 182, 0.3)'}
                />
              </div>

              {/* Execute Button */}
              <button
                onClick={executeTryIt}
                disabled={tryItLoading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: `linear-gradient(135deg, ${getMethodColor(tryItEndpoint.method)} 0%, ${getMethodColor(tryItEndpoint.method)}cc 100%)`,
                  border: 'none',
                  borderRadius: '12px',
                  color: '#171D23',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: tryItLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: tryItLoading ? 0.7 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {tryItLoading ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Execute Request
                  </>
                )}
              </button>

              {/* Response Section */}
              {tryItResponse && (
                <div style={{ marginTop: '24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <label style={{
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: 'rgba(246, 247, 248, 0.5)',
                      letterSpacing: '0.05em'
                    }}>
                      Response
                    </label>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem' }}>
                      <span style={{
                        color: tryItResponse.status === 200 ? '#22c55e' : '#f97373'
                      }}>
                        {tryItResponse.status} {tryItResponse.status === 200 ? 'OK' : 'Error'}
                      </span>
                      <span style={{ color: 'rgba(246, 247, 248, 0.5)' }}>
                        {tryItResponse.time}ms
                      </span>
                    </div>
                  </div>
                  <pre style={{
                    padding: '16px',
                    background: 'rgba(15, 19, 24, 0.8)',
                    border: `1px solid ${tryItResponse.status === 200 ? '#22c55e' : '#f97373'}40`,
                    borderRadius: '12px',
                    color: tryItResponse.status === 200 ? '#22c55e' : '#f97373',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    margin: 0,
                    overflow: 'auto',
                    maxHeight: '250px'
                  }}>
                    {JSON.stringify(tryItResponse.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}
        onClick={() => setShowKeyboardHelp(false)}>
          <div 
            style={{
              background: '#1E252C',
              border: '2px solid #2EC4B6',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                style={{
                  padding: '8px',
                  background: 'rgba(246, 247, 248, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'rgba(246, 247, 248, 0.6)',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { key: '/', desc: 'Focus search' },
                { key: '↑ / k', desc: 'Navigate up' },
                { key: '↓ / j', desc: 'Navigate down' },
                { key: 'Enter', desc: 'Expand/collapse card' },
                { key: 't', desc: 'Try endpoint' },
                { key: 'c', desc: 'Copy curl command' },
                { key: 'Esc', desc: 'Close modal / blur search' },
                { key: '?', desc: 'Toggle this help' }
              ].map((shortcut, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: idx < 7 ? '1px solid rgba(46, 196, 182, 0.1)' : 'none'
                }}>
                  <span style={{ color: 'rgba(246, 247, 248, 0.7)' }}>{shortcut.desc}</span>
                  <kbd style={{
                    padding: '4px 10px',
                    background: 'rgba(46, 196, 182, 0.1)',
                    border: '1px solid rgba(46, 196, 182, 0.3)',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#2EC4B6'
                  }}>
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          * {
            box-sizing: border-box;
          }
          
          input::placeholder {
            color: rgba(246, 247, 248, 0.4);
          }
          
          textarea::placeholder {
            color: rgba(246, 247, 248, 0.4);
          }
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(46, 196, 182, 0.1);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(46, 196, 182, 0.3);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(46, 196, 182, 0.5);
          }
        `}
      </style>
    </div>
  );
};

export default EndpointsPageRedesign;
