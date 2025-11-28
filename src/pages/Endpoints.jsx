// src/pages/Endpoints.jsx
import React from "react";
import { ENDPOINT_GROUPS } from "../data/endpoints";

function EndpointsPage() {
  return (
    <div className="endpoints-page">
      <header className="section-heading">
        <h2>All endpoints in VeroAPI.</h2>
        <p>
          Browse every currently planned endpoint, grouped by category. Your
          single account key can call any of them.
        </p>
      </header>

      {ENDPOINT_GROUPS.map((group) => (
        <section className="endpoints-section" key={group.id}>
          <div className="endpoints-section-header">
            <h3>{group.label}</h3>
            {group.description && <p>{group.description}</p>}
          </div>

          <div className="endpoint-gallery-list">
            {group.endpoints.map((ep) => (
              <article className="endpoint-card" key={ep.path}>
                <div className="endpoint-card-head">
                  <span className="endpoint-method">{ep.method}</span>
                  <span className="endpoint-path">{ep.path}</span>
                </div>
                <div className="endpoint-desc">
                  <strong>{ep.name}</strong> — {ep.description}
                </div>
                {ep.badge && (
                  <span className="endpoint-badge">{ep.badge}</span>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default EndpointsPage;
