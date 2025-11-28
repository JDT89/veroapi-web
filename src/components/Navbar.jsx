import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("veroapi_token");
      setHasToken(!!token);
    }
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-left">
            <button
              className="nav-brand-link"
              type="button"
              onClick={() => {
                closeMobile();
                navigate("/");
              }}
            >
              <span className="nav-logo">
                <span className="nav-logo-orbit" />
                <span className="nav-logo-dot" />
              </span>
              <span className="nav-brand">VEROAPI</span>
            </button>

            {/* Desktop links */}
            <div className="nav-links">
              <NavLink to="/" end className={linkClass}>
                Overview
              </NavLink>
              <NavLink to="/docs" className={linkClass}>
                Docs
              </NavLink>
              <NavLink to="/endpoints" className={linkClass}>
                Endpoints
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="nav-actions nav-actions-desktop">
            {hasToken ? (
              <NavLink to="/dashboard" className="nav-btn-link">
                <button className="btn outline" type="button">
                  Dashboard
                </button>
              </NavLink>
            ) : (
              <>
                <NavLink to="/auth" className="nav-btn-link">
                  <button className="btn ghost" type="button">
                    Sign in
                  </button>
                </NavLink>
                <NavLink to="/auth" className="nav-btn-link">
                  <button className="btn primary" type="button">
                    Get API key
                  </button>
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen ? "true" : "false"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <div className="nav-toggle-bars">
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="nav-mobile">
          <div className="nav-mobile-inner">
            <div className="nav-mobile-links">
              <NavLink to="/" end onClick={closeMobile} className={linkClass}>
                Overview
              </NavLink>
              <NavLink to="/docs" onClick={closeMobile} className={linkClass}>
                Docs
              </NavLink>
              <NavLink
                to="/endpoints"
                onClick={closeMobile}
                className={linkClass}
              >
                Endpoints
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={closeMobile}
                className={linkClass}
              >
                Dashboard
              </NavLink>
            </div>

            <div className="nav-mobile-actions">
              {hasToken ? (
                <button
                  type="button"
                  className="btn outline block"
                  onClick={() => {
                    closeMobile();
                    navigate("/dashboard");
                  }}
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn outline block"
                    onClick={() => {
                      closeMobile();
                      navigate("/auth");
                    }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="btn primary block"
                    onClick={() => {
                      closeMobile();
                      navigate("/auth");
                    }}
                  >
                    Get API key
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
