import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-brand">VeroAPI</span>
        <span className="footer-dot">•</span>
        <span className="footer-muted">
          © {new Date().getFullYear()} All rights reserved.
        </span>
      </div>
      <div className="footer-links">
        <Link to="/docs">Docs</Link>
        <a href="#status">Status</a>
        <a href="#changelog">Changelog</a>
        <a href="#legal">Privacy</a>
      </div>
    </footer>
  );
}

export default Footer;
