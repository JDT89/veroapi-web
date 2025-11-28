// src/pages/Endpoints.jsx
import React, { useState } from "react";
import { ENDPOINT_GROUPS } from "../data/endpoints";

function EndpointsPage() {
  const [activeTab, setActiveTab] = useState("all");

  // Flatten endpoints and keep group info
  const allEndpoints = ENDPOINT_GROUPS.reduce((acc, group) => {
    const withGroup = group.endpoints.map((ep) => ({
      ...ep,
      groupId: group.id,
      groupLabel: group.label,
    }));
    return acc.concat(withGroup);
  }, []);

  const visibleEndpoints =
    activeTab === "all"
      ? allEndpoints
      : allEndpoints.filter((ep) => ep.groupId === activeTab);

  return (
    <div className="endpoints-page">
      <header className="section-heading">
        <h2>All endpoints in VeroAPI.</h2>
        <p>
          Browse every currently planned endpoint, grouped by category. Your
          single account key can call any of them.
        </p>
      </header>

      {/* Tabs: All + categories */}
      <div className="endpoint-gallery-tabs endpoints-tabs">
        <button
          type="button"
          className={
            "endpoint-tab" + (activeTab === "all" ? " active" : "")
          }
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        {ENDPOINT_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            className={
              "endpoint-tab" + (activeTab === group.id ? " active" : "")
            }
            onClick={() => setActiveTab(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <section className="endpoints-section endpoints-section-all">
        <div className="endpoint-gallery-list">
          {visibleEndpoints.map((ep) => {
            const isPlanned = ep.status === "Planned";

            return (
              <article
                className={
                  "endpoint-card" + (isPlanned ? " endpoint-card-planned" : "")
                }
                key={ep.path + ep.method}
              >
                <div className="endpoint-card-head">
                  <span className="endpoint-method">{ep.method}</span>
                  <span className="endpoint-path">{ep.path}</span>
                </div>

                <div className="endpoint-desc">
                  <strong>{ep.name}</strong> — {ep.description}
                </div>

                <div className="endpoint-meta-row">
                  {ep.badge && (
                    <span className="endpoint-badge">{ep.badge}</span>
                  )}
                  {ep.status && (
                    <span
                      className={
                        "endpoint-status " +
                        (ep.status === "Live"
                          ? "endpoint-status-live"
                          : ep.status === "Beta"
                          ? "endpoint-status-beta"
                          : "endpoint-status-planned")
                      }
                    >
                      {ep.status}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default EndpointsPage;
