import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function Hero() {
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState(false);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function checkHealth() {
      try {
        setHealthLoading(true);
        setHealthError(false);
        const res = await fetch(`${API_BASE_URL}/v1/health`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!cancelled) setHealthData(data);
      } catch (err) {
        if (!cancelled) setHealthError(true);
      } finally {
        if (!cancelled) setHealthLoading(false);
      }
    }

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const uptimeHours =
    typeof healthData?.uptime_seconds === "number"
      ? Math.floor(healthData.uptime_seconds / 3600)
      : null;

  return (
    <section className="hero">
      {/* LEFT SIDE */}
      <div className="hero-left">
        {/* Status pill instead of “NEW Random…” */}
        <div className="hero-pill">
          <span
            className="pill-dot"
            style={{
              background: healthError
                ? "#f97316"
                : healthLoading
                ? "#fde047"
                : "#22c55e",
              boxShadow: healthError
                ? "0 0 0 5px rgba(248, 113, 113, 0.35)"
                : "0 0 0 5px rgba(34, 197, 94, 0.25)",
            }}
          />
          {healthLoading && <>Checking API status…</>}
          {!healthLoading && healthError && <>API status: Unreachable</>}
          {!healthLoading && !healthError && (
            <>
              API status: Online
              {uptimeHours !== null && (
                <>
                  {" • "}
                  <span style={{ opacity: 0.9 }}>{uptimeHours}h uptime</span>
                </>
              )}
            </>
          )}
        </div>

        <h1>
          Random-but-useful APIs
          <br />
          for bots, tools & automations.
        </h1>

        <p className="hero-sub">
          VeroAPI gives you a single key for a growing collection of ready-made
          endpoints—from text utilities to game helpers—so you can ship
          features, not glue code.
        </p>

        <div className="hero-actions">
          <Link to="/auth">
            <button className="btn primary" type="button">
              Get your API key
            </button>
          </Link>
          <Link to="/docs">
            <button className="btn outline" type="button">
              View docs
            </button>
          </Link>
        </div>

        <p className="hero-note">
          No credit card required. One API key per account • Rate limits per
          user.
        </p>
      </div>

      {/* RIGHT SIDE – Use-case tiles instead of cURL example */}
      <div className="hero-right">
        <div className="dash-preview">
          <div className="dash-preview-header">
            <div>
              <div className="dash-preview-eyebrow">Use cases</div>
              <div className="dash-preview-title">
                Drop-in APIs for your stack
              </div>
            </div>
            <span className="dash-preview-plan-pill">Ready in minutes</span>
          </div>

          <ul className="dx-list" style={{ marginTop: 6 }}>
            <li>
              <strong>Discord bots</strong> — XP helpers, reward systems,
              streaks, randomizers and more without writing custom endpoints.
            </li>
            <li>
              <strong>Internal tools</strong> — back-office scripts, dashboards,
              admin panels and CLIs that just call a simple HTTPS API.
            </li>
            <li>
              <strong>Automation & cron</strong> — scheduled jobs, webhooks and
              background workers powered by one reusable API key.
            </li>
          </ul>

          <p className="hero-note" style={{ marginTop: 8 }}>
            Start with one key, then plug VeroAPI into bots, dashboards or
            automations as you grow.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
