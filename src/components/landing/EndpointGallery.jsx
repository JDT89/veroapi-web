// src/components/landing/EndpointGallery.jsx
import React, { useState } from "react";

const TABS = ["Text", "Bot helpers", "Fun"];

const ENDPOINTS = {
  Text: [
    {
      method: "POST",
      path: "/v1/text/scramble",
      desc: "Give us a word, get back multiple scrambled variations.",
      badge: "JSON in • JSON out",
    },
    {
      method: "POST",
      path: "/v1/text/summarize",
      desc: "Shorten long strings into concise summaries for UI.",
      badge: "Great for bot replies",
    },
    {
      method: "POST",
      path: "/v1/text/slugify",
      desc: "Turn arbitrary text into clean, URL-safe slugs.",
      badge: "Perfect for IDs",
    },
  ],
  "Bot helpers": [
    {
      method: "POST",
      path: "/v1/discord/xp/next-level",
      desc: "Calculate XP and levels so you don't hard-code curves.",
      badge: "Discord bots",
    },
    {
      method: "POST",
      path: "/v1/discord/cooldown/check",
      desc: "Single call to decide if a user is on cooldown.",
      badge: "Global limits",
    },
    {
      method: "POST",
      path: "/v1/discord/rewards/roll",
      desc: "Randomized reward helper for messages or commands.",
      badge: "Economy systems",
    },
  ],
  Fun: [
    {
      method: "GET",
      path: "/v1/fun/prompt",
      desc: "Random prompts for games, writing, or chat bots.",
      badge: "Creativity",
    },
    {
      method: "GET",
      path: "/v1/fun/coin-flip",
      desc: "Simple coin flips with metadata for stats tracking.",
      badge: "Mini-games",
    },
    {
      method: "GET",
      path: "/v1/fun/word",
      desc: "Random word generator tuned for games & quizzes.",
      badge: "Word games",
    },
  ],
};

function EndpointGallery() {
  const [activeTab, setActiveTab] = useState("Text");
  const endpoints = ENDPOINTS[activeTab];

  return (
    <section className="endpoint-gallery">
      <div className="endpoint-gallery-inner">
        <div className="endpoint-gallery-copy">
          <h2>Random endpoints that save you from glue code.</h2>
          <p>
            Use VeroAPI for the boring but critical pieces: string tools, bot helpers,
            and fun utilities that fit perfectly into Discord bots, games, and small
            SaaS projects.
          </p>

          <div className="endpoint-gallery-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`endpoint-tab ${
                  tab === activeTab ? "active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="endpoint-gallery-list">
          {endpoints.map((ep) => (
            <div className="endpoint-card" key={ep.path}>
              <div className="endpoint-card-head">
                <span className="endpoint-method">{ep.method}</span>
                <span className="endpoint-path">{ep.path}</span>
              </div>
              <div className="endpoint-desc">{ep.desc}</div>
              {ep.badge && <div className="endpoint-badge">{ep.badge}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EndpointGallery;
