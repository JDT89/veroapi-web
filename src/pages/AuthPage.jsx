import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";
import "./AuthPage.css";

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("veroapi_token");
      if (token) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return false;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const path = mode === "login" ? "/v1/auth/login" : "/v1/auth/signup";
      const url = `${API_BASE_URL}${path}`;
      
      console.log('[Auth] Attempting to connect to:', url);
      
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password 
        }),
      });

      console.log('[Auth] Response status:', res.status);

      let data;
      try {
        data = await res.json();
        console.log('[Auth] Response data:', data);
      } catch (jsonError) {
        console.error('[Auth] Failed to parse JSON:', jsonError);
        throw new Error("Server returned invalid response");
      }

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      const token = data.token;
      if (typeof window !== "undefined" && token) {
        window.localStorage.setItem("veroapi_token", token);
      }

      const successMessage =
        mode === "signup"
          ? "Account created successfully!"
          : "Welcome back!";
      
      setSuccess(successMessage + " Redirecting...");
      toast.success(successMessage);

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
      
    } catch (err) {
      console.error('[Auth] Error:', err);
      
      let message = "Something went wrong. Please try again.";
      
      if (err.message.includes("Failed to fetch")) {
        message = `Cannot connect to API server at ${API_BASE_URL}. Please check if the server is running.`;
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    if (!password) return "";
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return "Weak";
    if (score === 2) return "Okay";
    if (score === 3) return "Strong";
    return "Very strong";
  })();

  return (
    <section className="auth-page">
      <div className="auth-shell">
        {/* Left column – copy */}
        <div className="auth-copy">
          <span className="auth-pill">
            <span className="auth-pill-dot" />
            VeroAPI Console
          </span>
          <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p>
            Sign in to manage your API key, explore random endpoints, and plug
            VeroAPI straight into your apps, bots, and internal tools.
          </p>

          <ul className="auth-points">
            <li>One API key per account with simple rate limiting.</li>
            <li>No dashboards to build — just plug into your existing stack.</li>
            <li>Perfect for Discord bots, cron jobs, and small SaaS utilities.</li>
          </ul>

          <div className="auth-footnote">
            Need help?{" "}
            <button
              type="button"
              className="auth-link-button"
              onClick={() => navigate("/docs")}
            >
              Read the docs
            </button>
          </div>
        </div>

        {/* Right column – card */}
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => handleModeChange("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => handleModeChange("signup")}
            >
              Create account
            </button>
          </div>

          {/* Status badges */}
          <div className="auth-badges">
            <span className="auth-badge">
              <span className="auth-badge-dot" />
              Email + password only
            </span>
            <span className="auth-badge ghost">
              No social login (yet)
            </span>
          </div>

          {/* Messages */}
          {error && <p className="auth-alert error">{error}</p>}
          {success && <p className="auth-alert success">{success}</p>}

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="auth-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-row">
                <input
                  id="password"
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  className="auth-toggle-visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {password && (
                <div className="auth-password-strength">
                  Password strength: <span>{passwordStrength}</span>
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div className="auth-field">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                />
              </div>
            )}

            <button
              type="submit"
              className="btn primary auth-submit"
              disabled={loading}
            >
              {loading
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </button>

            {mode === "login" && (
              <p className="auth-secondary-text">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="auth-link-button"
                  onClick={() => handleModeChange("signup")}
                >
                  Create one
                </button>
              </p>
            )}

            {mode === "signup" && (
              <p className="auth-secondary-text">
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-link-button"
                  onClick={() => handleModeChange("login")}
                >
                  Sign in
                </button>
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default AuthPage;
