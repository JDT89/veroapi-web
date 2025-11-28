import React from "react";

function QuickstartCard() {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <h2>Quickstart</h2>
        <span className="dash-tag soft">Random endpoints</span>
      </div>

      <ol className="dash-steps">
        <li>
          <strong>Generate your key</strong> if you haven’t already.
        </li>
        <li>
          <strong>Store it securely</strong> in <code>VEROAPI_KEY</code>.
        </li>
        <li>
          <strong>Call an endpoint</strong> like{" "}
          <code>POST /v1/text/scramble</code>.
        </li>
      </ol>

      <p className="dash-login-hint" style={{ marginTop: 10 }}>
        As more endpoints are added, they’ll be accessible using the same key.
      </p>
    </div>
  );
}

export default QuickstartCard;