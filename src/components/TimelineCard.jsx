import React from "react";

function TimelineCard({ user, apiKey, formatTime }) {
  const items = [];

  if (user) {
    items.push({
      label: "Signed in",
      detail: user.email,
      time: "Just now",
      status: "done",
    });
  }

  if (apiKey) {
    items.push({
      label: "API key created",
      detail: apiKey.label || "Primary key",
      time: formatTime(apiKey.created_at),
      status: "done",
    });
  } else {
    items.push({
      label: "Create your API key",
      detail: "Generate a primary key from the left card.",
      time: "Pending",
      status: "pending",
    });
  }

  items.push({
    label: "First successful request",
    detail: "Call any random endpoint with your key.",
    time: apiKey ? "Waiting…" : "Blocked until key exists",
    status: "pending",
  });

  return (
    <div className="dash-card timeline-card">
      <div className="dash-card-header">
        <h2>Activity timeline</h2>
        <span className="dash-tag">Account checklist</span>
      </div>

      <ul className="timeline-list">
        {items.map((item, idx) => (
          <li key={idx} className="timeline-item">
            <div className={`timeline-dot timeline-dot-${item.status}`} />
            <div className="timeline-content">
              <div className="timeline-title">{item.label}</div>
              <div className="timeline-detail">{item.detail}</div>
              <div className="timeline-meta">{item.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TimelineCard;