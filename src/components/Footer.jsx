import React from "react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-brand">VeroAPI</span>
        <span className="footer-dot">•</span>
        <span>© {year} VeroAPI — All rights reserved.</span>
      </div>

      <div className="footer-links">
        <a href="/docs">Docs</a>
        <a href="/endpoints">Endpoints</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/auth">Sign in</a>
      </div>
    </footer>
  );
}

export default Footer;
