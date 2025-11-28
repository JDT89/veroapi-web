import React from "react";
import APIKeyManager from "../components/APIKeyManager";
import HealthBox from "../components/HealthBox";
import StatsBox from "../components/StatsBox";

function Dashboard() {
  return (
    <section className="dash">

      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <h3 className="dash-title">Dashboard</h3>

        <div className="dash-nav">
          <button className="dash-nav-item active">Overview</button>
          <button className="dash-nav-item">API Keys</button>
          <button className="dash-nav-item">Usage</button>
          <button className="dash-nav-item">Account</button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="dash-main">
        <header className="dash-main-header">
          <div>
            <h1>Overview</h1>
            <p>Your account usage, API status, and key controls</p>
          </div>
          <button className="btn ghost">Sign Out</button>
        </header>

        <div className="dash-grid">
          <HealthBox />
          <StatsBox />
          <div className="dash-card">
            <div className="dash-card-label">Plan</div>
            <div className="dash-card-value">Free</div>
            <p className="dash-card-sub">Upgrade soon for higher limits.</p>
          </div>
        </div>

        <APIKeyManager />
      </div>
    </section>
  );
}

export default Dashboard;