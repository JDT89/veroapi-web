import React, { useState, useRef, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const emailRef = useRef(null);

  // Auto-focus email field on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    let newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Please enter your password.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setSubmitting(true);

    // Simulate async authentication (replace with real logic)
    setTimeout(() => {
      setSubmitting(false);
      setFormError("Invalid email or password.");
    }, 1500);
  };

  return (
    <>
      {/* Navigation */}
      <Navigation variant="default" />

      <main>
        <div className="login-page">
          <div className="login-card">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to access your dashboard</p>

            <form onSubmit={handleSubmit} aria-describedby={formError ? "login-error" : undefined}>
              {formError && (
                <div id="login-error" className="form-error" aria-live="assertive" role="alert">
                  {formError}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  ref={emailRef}
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={submitting}
                />
                {errors.email && (
                  <div id="email-error" className="input-error" aria-live="polite">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={0}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer"
                    }}
                    disabled={submitting}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <div id="password-error" className="input-error" aria-live="polite">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="login-row">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((v) => !v)}
                    disabled={submitting}
                  />{" "}
                  Remember me
                </label>

                <Link to="/forgot-password" className="login-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider">
              <span>or continue with</span>
            </div>

            {/* Social Login Buttons */}
            <button className="btn login-secondary-btn" disabled={submitting}>
              Continue with Google
            </button>
            <button className="btn login-secondary-btn" disabled={submitting}>
              Continue with GitHub
            </button>

            <p className="login-bottom-text">
              Don’t have an account?{" "}
              <Link to="/register" className="login-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Login;
