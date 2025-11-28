import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const handleBrandClick = () => {
    navigate("/");
    closeMenu();
  };

  const handleAuthClick = () => {
    navigate("/auth");
    closeMenu();
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    closeMenu();
  };

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <div className="nav-left">
            <button
              className="nav-brand-link"
              type="button"
              onClick={handleBrandClick}
            >
              <span className="nav-logo">
                <span className="nav-logo-orbit" />
                <span className="nav-logo-dot" />
              </span>
              <span className="nav-brand">VeroAPI</span>
            </button>

            {/* Desktop links */}
            <nav className="nav-links">
              <NavLink to="/" end>
                Overview
              </NavLink>
              <NavLink to="/docs">Docs</NavLink>
              <NavLink to="/endpoints">Endpoints</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
            </nav>
          </div>

          {/* Desktop actions */}
          <div className="nav-actions nav-actions-desktop">
            <button
              className="btn ghost nav-btn-link"
              type="button"
              onClick={handleDashboardClick}
            >
              Dashboard
            </button>
            <button
              className="btn primary nav-btn-link"
              type="button"
              onClick={handleAuthClick}
            >
              Sign in
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className="nav-toggle-bars">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu panel */}
      {open && (
        <div className="nav-mobile">
          <div className="nav-mobile-inner">
            <nav className="nav-mobile-links">
              <NavLink to="/" end onClick={closeMenu}>
                Overview
              </NavLink>
              <NavLink to="/docs" onClick={closeMenu}>
                Docs
              </NavLink>
              <NavLink to="/endpoints" onClick={closeMenu}>
                Endpoints
              </NavLink>
              <NavLink to="/dashboard" onClick={closeMenu}>
                Dashboard
              </NavLink>
            </nav>

            <div className="nav-mobile-actions">
              <button
                className="btn outline nav-btn-link"
                type="button"
                onClick={handleDashboardClick}
              >
                Dashboard
              </button>
              <button
                className="btn primary nav-btn-link"
                type="button"
                onClick={handleAuthClick}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;