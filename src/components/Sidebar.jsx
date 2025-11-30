import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Sidebar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== "undefined") {
        const token = window.localStorage.getItem("veroapi_token");
        setHasToken(!!token);
        
        if (token) {
          // Check if user is super admin
          try {
            const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.ok) {
              const data = await res.json();
              setIsSuperAdmin(data.user?.is_super_admin === true);
            }
          } catch (err) {
            console.error("Failed to check admin status:", err);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button
          className="sidebar-brand btn-reset"
          type="button"
          onClick={() => navigate("/")}
        >
          <div className="sidebar-logo">
            <div className="sidebar-logo-inner" />
          </div>
          <span className="sidebar-title">VEROAPI</span>
        </button>
        
        <button
          type="button"
          className="hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div className="hamburger-bars">
            <span />
            <span />
            <span />
          </div>
        </button>
      </header>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-brand btn-reset"
            type="button"
            onClick={() => {
              closeMobile();
              navigate("/");
            }}
          >
            <div className="sidebar-logo">
              <div className="sidebar-logo-inner" />
            </div>
            <span className="sidebar-title">VEROAPI</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <p className="sidebar-section-title">Navigation</p>
            <NavLink 
              to="/" 
              end 
              className={linkClass} 
              onClick={closeMobile}
            >
              <span className="sidebar-link-icon">🏠</span>
              Home
            </NavLink>
            <NavLink 
              to="/docs" 
              className={linkClass} 
              onClick={closeMobile}
            >
              <span className="sidebar-link-icon">📖</span>
              Documentation
            </NavLink>
            <NavLink 
              to="/endpoints" 
              className={linkClass} 
              onClick={closeMobile}
            >
              <span className="sidebar-link-icon">🔌</span>
              APIs
            </NavLink>
            <NavLink 
              to="/pricing" 
              className={linkClass} 
              onClick={closeMobile}
            >
              <span className="sidebar-link-icon">💳</span>
              Pricing
            </NavLink>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-section-title">Account</p>
            <NavLink 
              to="/dashboard" 
              className={linkClass} 
              onClick={closeMobile}
            >
              <span className="sidebar-link-icon">📊</span>
              Dashboard
            </NavLink>
            {!hasToken && (
              <NavLink 
                to="/auth" 
                className={linkClass} 
                onClick={closeMobile}
              >
                <span className="sidebar-link-icon">🔑</span>
                Sign In
              </NavLink>
            )}
          </div>

          {/* Admin Section - Only visible to super admins */}
          {!loading && isSuperAdmin && (
            <div className="sidebar-section">
              <p className="sidebar-section-title">Administration</p>
              <NavLink 
                to="/admin" 
                className={linkClass} 
                onClick={closeMobile}
              >
                <span className="sidebar-link-icon">🛡️</span>
                Admin Panel
              </NavLink>
            </div>
          )}

          <div className="sidebar-section">
            <p className="sidebar-section-title">Resources</p>
            <NavLink 
              to="/changelog" 
              className={linkClass} 
              onClick={closeMobile}
            >
              <span className="sidebar-link-icon">📝</span>
              Changelog
            </NavLink>
            <button 
              type="button"
              className="sidebar-link"
              onClick={() => {
                closeMobile();
                window.open('mailto:support@veroapi.com', '_blank');
              }}
            >
              <span className="sidebar-link-icon">💬</span>
              Support
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          {hasToken ? (
            <NavLink 
              to="/dashboard" 
              className="sidebar-cta"
              onClick={closeMobile}
            >
              Open Dashboard
            </NavLink>
          ) : (
            <NavLink 
              to="/auth" 
              className="sidebar-cta"
              onClick={closeMobile}
            >
              Get API Key
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
