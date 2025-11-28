// src/components/landing/EndpointGallery.jsx
import React, { useState } from "react";
import { ENDPOINT_GROUPS } from "../../data/endpoints";

function EndpointGallery() {
  const [activeGroupId, setActiveGroupId] = useState(ENDPOINT_GROUPS[0].id);

  const activeGroup =
    ENDPOINT_GROUPS.find((group) => group.id === activeGroupId) ||
    ENDPOINT_GROUPS[0];

  return (
    <section className="endpoint-gallery" id="endpoints">
      <div className="endpoint-gallery-inner">
        <div className="endpoint-gallery-copy">
          <h2>Random endpoints that actually feel useful.</h2>
          <p>
            Start with text helpers, Discord utilities and fun/random building
            blocks. Swap your one-off scripts for a real API layer.
          </p>

          <div className="endpoint-gallery-tabs">
            {ENDPOINT_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                className={
                  "endpoint-tab" +
                  (group.id === activeGroupId ? " active" : "")
                }
                onClick={() => setActiveGroupId(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>

        <div className="endpoint-gallery-list">
          {activeGroup.endpoints.map((ep) => {
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
      </div>
    </section>
  );
}

export default EndpointGallery;


