import React from "react";

function APIKeyManager({
  apiKey,
  keysLoading,
  keysError,
  showSecret,
  setShowSecret,
  regenLoading,
  handleGenerateOrRegenerate,
  handleCopySecret,
  copyMessage,
  formatTime
}) {
  return (
    <div className="dash-card wide">
      <div className="dash-card-header">
        <h2>Primary API key</h2>
        <span className="dash-tag">
          {keysLoading ? "Loading…" : apiKey ? "Active" : "Not created"}
        </span>
      </div>

      {keysError && (
        <p className="dash-login-error" style={{ marginTop: 4 }}>
          {keysError}
        </p>
      )}

      <p className="dash-login-helper">
        You can only have one API key at a time. Regenerating immediately
        disables the old one.
      </p>

      <button
        className="btn primary dash-login-btn"
        type="button"
        onClick={handleGenerateOrRegenerate}
        disabled={regenLoading}
      >
        {regenLoading
          ? "Working…"
          : apiKey
          ? "Regenerate API key"
          : "Generate API key"}
      </button>

      {apiKey && apiKey.secret && (
        <div style={{ marginTop: 10, fontSize: 11 }}>
          <div className="dash-input-row">
            <label>Your API key</label>
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <input
                className="dash-input"
                type={showSecret ? "text" : "password"}
                readOnly
                value={apiKey.secret}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn outline"
                onClick={() => setShowSecret((prev) => !prev)}
              >
                {showSecret ? "Hide" : "Reveal"}
              </button>
              <button
                type="button"
                className="btn outline"
                onClick={handleCopySecret}
              >
                {copyMessage || "Copy"}
              </button>
            </div>
            <p className="dash-login-hint">
              You can reveal and copy your key from here at any time.
            </p>
          </div>
        </div>
      )}

      {apiKey && (
        <div style={{ marginTop: 16 }}>
          <div className="dash-table">
            <div className="dash-table-row head">
              <span>Label</span>
              <span>Prefix</span>
              <span>Created</span>
              <span>Last used</span>
            </div>
            <div className="dash-table-row">
              <span>{apiKey.label || "Primary key"}</span>
              <span>{apiKey.prefix}</span>
              <span>{formatTime(apiKey.created_at)}</span>
              <span>{formatTime(apiKey.last_used_at)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default APIKeyManager;