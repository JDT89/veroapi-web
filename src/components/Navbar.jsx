import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="nav-brand-link">
            <div className="nav-logo">
              <span className="nav-logo-orbit" />
              <span className="nav-logo-dot" />
            </div>
            <span className="nav-brand">VeroAPI</span>
          </Link>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#dx">DX</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <Link to="/docs">Docs</Link>
        </nav>

        <div className="nav-actions">
          <Link to="/auth" className="btn ghost nav-btn-link">
            Sign in
          </Link>
          <Link to="/auth" className="btn primary nav-btn-link">
            Get API key
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
