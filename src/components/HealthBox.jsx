import React from "react";

function HealthBox({ healthLoading, healthError, healthData }) {
  const apiOnline = !healthLoading && !healthError && healthData?.ok;

  return (
    <div className="dash-card">
      <div className="dash-card-label">API Status</div>

      <div className="dash-card-value">
        {healthLoading
          ? "Checking…"
          : apiOnline
          ? "Online"
          : "Unavailable"}
      </div>

      <div className="dash-card-sub">
        Health is based on <code>/v1/health</code>.  
        {apiOnline && (
          <>
            <br />
            Uptime: {Math.round(healthData?.uptime || 0)}s
          </>
        )}
      </div>
    </div>
  );
}

export default HealthBox;