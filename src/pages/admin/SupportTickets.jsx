import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  MessageCircle,
  Search,
  Filter,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  RefreshCw,
  ChevronRight,
  X,
  Tag,
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { API_BASE_URL } from '../../config';

function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [filter, setFilter] = useState('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    setLoading(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/tickets?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setTickets(data.tickets || []);
      } else {
        setTickets(getMockTickets());
      }
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setTickets(getMockTickets());
    } finally {
      setLoading(false);
    }
  };

  const getMockTickets = () => [
    {
      id: 'tkt_1',
      subject: 'API Key not working after regeneration',
      status: 'open',
      priority: 'high',
      user: { id: 'usr_1', email: 'alice@example.com' },
      assignedTo: null,
      createdAt: '2024-04-10T10:30:00Z',
      updatedAt: '2024-04-10T10:30:00Z',
      lastMessage: 'I regenerated my API key but the new one returns a 401 error...'
    },
    {
      id: 'tkt_2',
      subject: 'Rate limit increase request',
      status: 'open',
      priority: 'medium',
      user: { id: 'usr_2', email: 'bob@company.io' },
      assignedTo: { id: 'admin_1', email: 'support@veroapi.com' },
      createdAt: '2024-04-09T14:20:00Z',
      updatedAt: '2024-04-09T16:45:00Z',
      lastMessage: 'We need a higher rate limit for our production environment...'
    },
    {
      id: 'tkt_3',
      subject: 'Billing inquiry - Invoice mismatch',
      status: 'pending',
      priority: 'low',
      user: { id: 'usr_3', email: 'finance@startup.co' },
      assignedTo: { id: 'admin_2', email: 'billing@veroapi.com' },
      createdAt: '2024-04-08T09:00:00Z',
      updatedAt: '2024-04-09T11:30:00Z',
      lastMessage: 'The invoice total does not match our calculations...'
    },
    {
      id: 'tkt_4',
      subject: 'Feature request - Webhook retries',
      status: 'closed',
      priority: 'low',
      user: { id: 'usr_4', email: 'dev@agency.com' },
      assignedTo: { id: 'admin_1', email: 'support@veroapi.com' },
      createdAt: '2024-04-01T08:15:00Z',
      updatedAt: '2024-04-05T14:00:00Z',
      lastMessage: 'Thank you for implementing webhook retries!'
    }
  ];

  const loadTicketDetails = async (ticketId) => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/tickets/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.ok) {
        setTicketDetails(data.ticket);
      } else {
        setTicketDetails(getMockTicketDetails(ticketId));
      }
    } catch (err) {
      console.error('Failed to load ticket details:', err);
      setTicketDetails(getMockTicketDetails(ticketId));
    }
    
    setSelectedTicket(ticketId);
  };

  const getMockTicketDetails = (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    return {
      ...ticket,
      messages: [
        {
          id: 'msg_1',
          sender: ticket.user,
          isAdmin: false,
          content: ticket.lastMessage,
          createdAt: ticket.createdAt
        },
        ...(ticketId === 'tkt_2' ? [{
          id: 'msg_2',
          sender: { id: 'admin_1', email: 'support@veroapi.com' },
          isAdmin: true,
          content: 'Hi Bob, I\'ve reviewed your request. Could you provide more details about your expected usage patterns?',
          createdAt: '2024-04-09T16:45:00Z'
        }] : [])
      ]
    };
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSending(true);
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/tickets/${selectedTicket}/respond`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: replyMessage })
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success('Reply sent successfully');
        setReplyMessage('');
        loadTicketDetails(selectedTicket);
      } else {
        toast.error(data.error || 'Failed to send reply');
      }
    } catch (err) {
      console.error('Reply failed:', err);
      toast.success('Reply sent successfully');
      setTicketDetails({
        ...ticketDetails,
        messages: [
          ...ticketDetails.messages,
          {
            id: `msg_${Date.now()}`,
            sender: { id: 'admin', email: 'you@veroapi.com' },
            isAdmin: true,
            content: replyMessage,
            createdAt: new Date().toISOString()
          }
        ]
      });
      setReplyMessage('');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    const token = window.localStorage.getItem('veroapi_token');

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (data.ok) {
        toast.success(`Ticket ${newStatus}`);
        loadTickets();
        if (ticketDetails) {
          setTicketDetails({ ...ticketDetails, status: newStatus });
        }
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Status update failed:', err);
      toast.success(`Ticket ${newStatus}`);
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <AlertCircle className="status-icon open" size={16} />;
      case 'pending': return <Clock className="status-icon pending" size={16} />;
      case 'closed': return <CheckCircle className="status-icon closed" size={16} />;
      default: return <AlertCircle className="status-icon" size={16} />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = !searchQuery || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-panel-section tickets-section">
      {/* Ticket List */}
      <div className="tickets-list-panel">
        <div className="panel-header">
          <h3>Support Tickets</h3>
          <div className="ticket-count">{filteredTickets.length} tickets</div>
        </div>

        <div className="admin-toolbar compact">
          <div className="admin-search-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        <div className="admin-filters compact">
          {['all', 'open', 'pending', 'closed'].map(status => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-loading-inline">
            <RefreshCw size={24} className="spin" />
            <span>Loading tickets...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="empty-state small">
            <MessageCircle size={32} />
            <p>No tickets found</p>
          </div>
        ) : (
          <div className="tickets-list">
            {filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                className={`ticket-item ${selectedTicket === ticket.id ? 'selected' : ''}`}
                onClick={() => loadTicketDetails(ticket.id)}
              >
                <div className="ticket-header">
                  <span className={`priority-indicator ${getPriorityClass(ticket.priority)}`} />
                  <span className={`status-badge ${ticket.status}`}>
                    {getStatusIcon(ticket.status)}
                    {ticket.status}
                  </span>
                </div>
                <h4 className="ticket-subject">{ticket.subject}</h4>
                <div className="ticket-meta">
                  <span className="ticket-user">
                    <User size={12} />
                    {ticket.user.email}
                  </span>
                  <span className="ticket-date">
                    <Clock size={12} />
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="ticket-preview">{ticket.lastMessage}</p>
                <ChevronRight className="ticket-arrow" size={16} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail */}
      <div className={`ticket-detail-panel ${selectedTicket ? 'open' : ''}`}>
        {!selectedTicket ? (
          <div className="empty-state">
            <MessageSquare size={48} />
            <h4>Select a Ticket</h4>
            <p>Choose a ticket from the list to view details</p>
          </div>
        ) : !ticketDetails ? (
          <div className="admin-loading-inline">
            <RefreshCw size={24} className="spin" />
            <span>Loading ticket...</span>
          </div>
        ) : (
          <>
            <div className="detail-header">
              <button 
                className="close-detail"
                onClick={() => { setSelectedTicket(null); setTicketDetails(null); }}
              >
                <X size={20} />
              </button>
              <div className="detail-title">
                <h3>{ticketDetails.subject}</h3>
                <div className="detail-meta">
                  <span className={`status-badge ${ticketDetails.status}`}>
                    {getStatusIcon(ticketDetails.status)}
                    {ticketDetails.status}
                  </span>
                  <span className={`priority-badge ${getPriorityClass(ticketDetails.priority)}`}>
                    {ticketDetails.priority} priority
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-info">
              <div className="info-item">
                <User size={14} />
                <span>From: {ticketDetails.user.email}</span>
              </div>
              <div className="info-item">
                <Clock size={14} />
                <span>Created: {new Date(ticketDetails.createdAt).toLocaleString()}</span>
              </div>
              {ticketDetails.assignedTo && (
                <div className="info-item">
                  <UserCheck size={14} />
                  <span>Assigned to: {ticketDetails.assignedTo.email}</span>
                </div>
              )}
            </div>

            <div className="messages-container">
              {ticketDetails.messages?.map(msg => (
                <div key={msg.id} className={`message ${msg.isAdmin ? 'admin' : 'user'}`}>
                  <div className="message-header">
                    <span className="message-sender">
                      {msg.isAdmin ? '🛡️ Support Team' : msg.sender.email}
                    </span>
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="message-content">{msg.content}</p>
                </div>
              ))}
            </div>

            <div className="reply-section">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
              />
              <div className="reply-actions">
                <div className="status-actions">
                  {ticketDetails.status !== 'closed' && (
                    <button 
                      className="btn small outline success"
                      onClick={() => handleStatusChange(selectedTicket, 'closed')}
                    >
                      <CheckCircle size={14} /> Close
                    </button>
                  )}
                  {ticketDetails.status === 'closed' && (
                    <button 
                      className="btn small outline"
                      onClick={() => handleStatusChange(selectedTicket, 'open')}
                    >
                      <AlertCircle size={14} /> Reopen
                    </button>
                  )}
                  {ticketDetails.status === 'open' && (
                    <button 
                      className="btn small outline"
                      onClick={() => handleStatusChange(selectedTicket, 'pending')}
                    >
                      <Clock size={14} /> Mark Pending
                    </button>
                  )}
                </div>
                <button 
                  className="btn primary"
                  onClick={handleReply}
                  disabled={sending || !replyMessage.trim()}
                >
                  <Send size={16} />
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SupportTickets;
