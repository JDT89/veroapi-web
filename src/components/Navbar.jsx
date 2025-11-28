import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "../styles.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="saas-nav">
        <div className="saas-nav-inner">
          {/* Logo */}
          <Link to="/" className="saas-brand">
            <div className="saas-logo-orb">
              <div className="saas-logo-dot" />
            </div>
            <span>VeroAPI</span>
          </Link>

          {/* Desktop Links */}
          <nav className="saas-links">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/docs">Docs</NavLink>
            <NavLink to="/endpoints">Endpoints</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="saas-actions">
            <Link to="/docs">
              <button className="saas-btn ghost">Docs</button>
            </Link>
            <Link to="/auth">
              <button className="saas-btn primary">Sign in</button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`saas-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Dropdown */}
      <div className={`saas-mobile-menu ${open ? "open" : ""}`}>
        <nav className="saas-mobile-links">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/docs" onClick={() => setOpen(false)}>
            Docs
          </NavLink>
          <NavLink to="/endpoints" onClick={() => setOpen(false)}>
            Endpoints
          </NavLink>
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
        </nav>

        <div className="saas-mobile-actions">
          <Link to="/docs" onClick={() => setOpen(false)}>
            <button className="saas-btn outline block">Docs</button>
          </Link>
          <Link to="/auth" onClick={() => setOpen(false)}>
            <button className="saas-btn primary block">Sign in</button>
          </Link>
        </div>
      </div>
    </>
  );
}