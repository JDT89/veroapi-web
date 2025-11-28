import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">

        {/* BRAND */}
        <Link to="/" className="nav-left">
          <div className="nav-logo" />
          <span className="nav-brand">VeroAPI</span>
        </Link>

        {/* DESKTOP LINKS */}
        <nav className="nav-links desktop-only">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/docs">Docs</NavLink>
          <NavLink to="/endpoints">Endpoints</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>

        {/* AUTH BUTTON */}
        <div className="nav-actions desktop-only">
          <Link to="/auth" className="btn primary">Sign In</Link>
        </div>

        {/* HAMBURGER BUTTON */}
        <button
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu">
          <NavLink onClick={() => setOpen(false)} to="/" end>Home</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/docs">Docs</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/endpoints">Endpoints</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/dashboard">Dashboard</NavLink>
          <Link onClick={() => setOpen(false)} to="/auth" className="btn primary block">
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;