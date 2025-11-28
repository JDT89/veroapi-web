import React from "react";

function MetricsGrid({ statsLoading, requestsLast24h }) {
  return (
    <div className="dash-card">
      <div className="dash-card-label">Requests (last 24h)</div>
      <div className="dash-card-value">
        {statsLoading
          ? "…"
          : requestsLast24h === null
          ? "—"
          : requestsLast24h.toLocaleString()}
      </div>
      <div className="dash-card-sub">
        Count of all authenticated API requests made in the past 24 hours.
      </div>
    </div>
  );
}

export default MetricsGrid;