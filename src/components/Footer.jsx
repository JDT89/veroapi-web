import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

export default function Footer() {
  return (
    <footer className="saas-footer">
      <div className="saas-footer-inner">
        <div className="saas-footer-left">
          © {new Date().getFullYear()} VeroAPI – All rights reserved.
        </div>

        <div className="saas-footer-links">
          <Link to="/docs">Docs</Link>
          <Link to="/endpoints">Endpoints</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/auth">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}