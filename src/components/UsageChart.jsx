import React from "react";

function UsageChart({ requestsLast24h }) {
  // mock breakdown just for visual — you can wire real data later
  const base = typeof requestsLast24h === "number" ? requestsLast24h : 1200;
  const data = [
    { label: "Now", value: Math.round(base * 0.2) },
    { label: "-6h", value: Math.round(base * 0.18) },
    { label: "-12h", value: Math.round(base * 0.16) },
    { label: "-18h", value: Math.round(base * 0.22) },
    { label: "-24h", value: Math.round(base * 0.24) },
  ];

  const max = data.reduce((m, d) => Math.max(m, d.value), 1);

  return (
    <div className="dash-card usage-card">
      <div className="dash-card-header">
        <h2>Traffic (last 24h)</h2>
        <span className="dash-tag soft">
          {typeof requestsLast24h === "number"
            ? `${requestsLast24h.toLocaleString()} requests`
            : "Sample data"}
        </span>
      </div>

      <div className="usage-chart-bars">
        {data.map((item) => {
          const pct = Math.max(6, (item.value / max) * 100);
          return (
            <div key={item.label} className="usage-chart-bar">
              <div className="usage-chart-bar-label">{item.label}</div>
              <div className="usage-chart-bar-track">
                <div
                  className="usage-chart-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="usage-chart-bar-value">
                {item.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <p className="dash-login-hint" style={{ marginTop: 10 }}>
        This view is for quick directional insight. You can expand with real
        per-hour stats later.
      </p>
    </div>
  );
}

export default UsageChart;