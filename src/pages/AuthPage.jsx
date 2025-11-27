import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function AuthPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    const existing = window.localStorage.getItem("veroapi_token");
    if (existing) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Login failed");
      }

      window.localStorage.setItem("veroapi_token", data.token);
      setLoginPassword("");
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");

    try {
      if (signupPassword !== signupConfirm) {
        throw new Error("Passwords do not match.");
      }

      const res = await fetch(`${API_BASE_URL}/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Signup failed");
      }

      window.localStorage.setItem("veroapi_token", data.token);
      setSignupPassword("");
      setSignupConfirm("");
      navigate("/dashboard");
    } catch (err) {
      setSignupError(err.message || "Signup failed");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-inner">
        <div className="auth-copy">
          <h1>Sign in to VeroAPI</h1>
          <p>
            Access your account, manage your single API key, and see usage at a
            glance. Rate limits are tied to your login, not to projects.
          </p>
          <ul className="auth-bullets">
            <li>One API key per account (easy to rotate).</li>
            <li>Perfect for solo builders, bots, and side projects.</li>
            <li>Ready to plug into usage-based billing later.</li>
          </ul>
        </div>

        <div className="auth-card dash-card">
          <div className="dash-card-header">
            <h2>{authMode === "login" ? "Welcome back" : "Create an account"}</h2>
            <span className="dash-tag soft">VeroAPI account</span>
          </div>

          <div className="dash-auth-tabs">
            <button
              className={`dash-auth-tab ${
                authMode === "login" ? "active" : ""
              }`}
              onClick={() => setAuthMode("login")}
            >
              Log in
            </button>
            <button
              className={`dash-auth-tab ${
                authMode === "signup" ? "active" : ""
              }`}
              onClick={() => setAuthMode("signup")}
            >
              Sign up
            </button>
          </div>

          {authMode === "login" ? (
            <form className="dash-login-form" onSubmit={handleLogin}>
              <div className="dash-input-row">
                <label>Email</label>
                <input
                  className="dash-input"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="dash-input-row">
                <label>Password</label>
                <input
                  className="dash-input"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              {loginError && (
                <p className="dash-login-error">{loginError}</p>
              )}
              <button
                className="btn primary dash-login-btn"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? "Signing in…" : "Sign in"}
              </button>
              <p className="dash-login-hint">
                You can always regenerate your key later from the dashboard.
              </p>
            </form>
          ) : (
            <form className="dash-login-form" onSubmit={handleSignup}>
              <div className="dash-input-row">
                <label>Email</label>
                <input
                  className="dash-input"
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="dash-input-row">
                <label>Password</label>
                <input
                  className="dash-input"
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="dash-input-row">
                <label>Confirm password</label>
                <input
                  className="dash-input"
                  type="password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  required
                />
              </div>
              {signupError && (
                <p className="dash-login-error">{signupError}</p>
              )}
              <button
                className="btn primary dash-login-btn"
                type="submit"
                disabled={signupLoading}
              >
                {signupLoading ? "Creating account…" : "Create account"}
              </button>
              <p className="dash-login-hint">
                Each account automatically gets one primary API key once you
                generate it from the dashboard.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
