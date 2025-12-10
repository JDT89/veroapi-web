import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", form);
    // Integrate your auth logic here
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your dashboard</p>

          {/* Social Logins */}
          <div className="social-login-group">
            <button className="social-btn google-btn">
              <img src="/google-icon.svg" alt="Google" />
              Continue with Google
            </button>

            <button className="social-btn github-btn">
              <img src="/github-icon.svg" alt="GitHub" />
              Continue with GitHub
            </button>
          </div>

          <div className="divider">
            <span>or continue with email</span>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="login-form">

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                />
                Remember me
              </label>

              <a href="/forgot-password" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary-new login-btn">
              Sign In
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="/register">Create one</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
