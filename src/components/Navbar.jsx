import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles.css";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          {/* Left: Brand */}
          <div className="nav-left">
            <Link to="/" className="nav-brand-link" onClick={closeMobile}>
              <span className="nav-logo">
                <span className="nav-logo-orbit" />
                <span className="nav-logo-dot" />
              </span>
              <span className="nav-brand">VeroAPI</span>
            </Link>
          </div>

          {/* Desktop links */}
          <nav className="nav-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/docs">Docs</NavLink>
            <NavLink to="/endpoints">Endpoints</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </nav>

          {/* Desktop actions */}
          <div className="nav-actions">
            <Link to="/docs" className="nav-btn-link">
              <button className="btn ghost">Docs</button>
            </Link>
            <Link to="/auth" className="nav-btn-link">
              <button className="btn primary">Sign in</button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`nav-toggle ${mobileOpen ? "nav-toggle-open" : ""}`}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile menu (slide-down under navbar) */}
      <div
        className={`nav-mobile-menu ${
          mobileOpen ? "nav-mobile-menu-open" : ""
        }`}
      >
        <nav className="nav-mobile-links">
          <NavLink
            to="/"
            end
            onClick={closeMobile}
          >
            Home
          </NavLink>
          <NavLink
            to="/docs"
            onClick={closeMobile}
          >
            Docs
          </NavLink>
          <NavLink
            to="/endpoints"
            onClick={closeMobile}
          >
            Endpoints
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={closeMobile}
          >
            Dashboard
          </NavLink>
        </nav>

        <div className="nav-mobile-actions">
          <Link to="/docs" onClick={closeMobile}>
            <button className="btn outline nav-mobile-btn">View docs</button>
          </Link>
          <Link to="/auth" onClick={closeMobile}>
            <button className="btn primary nav-mobile-btn">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;