import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Sparkles, 
  Check, 
  AlertCircle,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { API_BASE_URL } from "../config";
import "./AuthPage.css";

function AuthPage() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setPassword("");
    setConfirmPassword("");
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

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
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
      let message = "Something went wrong. Please try again.";
      
      if (err.message.includes("Failed to fetch")) {
        message = `Cannot connect to API server. Please check if the server is running.`;
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { text: "", color: "", progress: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { text: "Weak", color: "#f97373", progress: 33 };
    if (score === 3) return { text: "Fair", color: "#FF9F1C", progress: 66 };
    if (score === 4) return { text: "Strong", color: "#22c55e", progress: 85 };
    return { text: "Very Strong", color: "#2EC4B6", progress: 100 };
  };

  const passwordStrength = getPasswordStrength();

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-100ms response times"
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Enterprise-grade security"
    },
    {
      icon: TrendingUp,
      title: "Reliable",
      description: "99.9% uptime guaranteed"
    }
  ];

  return (
    <div className="auth-page-redesign">
      <div className="auth-container">
        {/* Left Column - Hero Section */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-hero-badge">
              <Sparkles size={14} />
              <span>VeroAPI Platform</span>
            </div>
            
            <h1 className="auth-hero-title">
              {mode === "login" ? "Welcome back" : "Get started today"}
            </h1>
            
            <p className="auth-hero-description">
              {mode === "login" 
                ? "Sign in to access your API keys, monitor usage, and manage your account."
                : "Create your account and get instant access to powerful API endpoints for your applications."}
            </p>

            {/* Features Grid */}
            <div className="auth-features-grid">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="auth-feature-card">
                    <div className="auth-feature-icon">
                      <Icon size={20} />
                    </div>
                    <div className="auth-feature-content">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Benefits List */}
            <div className="auth-benefits">
              <h3 className="auth-benefits-title">What you get:</h3>
              <ul className="auth-benefits-list">
                <li>
                  <Check size={18} />
                  <span>1,000 free API calls per month</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Access to all random endpoints</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>Real-time usage analytics</span>
                </li>
                <li>
                  <Check size={18} />
                  <span>24/7 API availability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Form */}
        <div className="auth-form-section">
          <div className="auth-form-wrapper">
            {/* Mode Tabs */}
            <div className="auth-tabs-redesign">
              <button
                type="button"
                className={`auth-tab-redesign ${mode === "login" ? "active" : ""}`}
                onClick={() => handleModeChange("login")}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-redesign ${mode === "signup" ? "active" : ""}`}
                onClick={() => handleModeChange("signup")}
              >
                Create Account
              </button>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="auth-alert auth-alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="auth-alert auth-alert-success">
                <Check size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Auth Form */}
            <form className="auth-form-redesign" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="auth-input-group">
                <label htmlFor="email" className="auth-label">
                  Email Address
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="email"
                    type="email"
                    className="auth-input-redesign"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="auth-input-group">
                <label htmlFor="password" className="auth-label">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="auth-input-redesign"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {mode === "signup" && password && (
                  <div className="auth-password-strength">
                    <div className="auth-strength-bar">
                      <div 
                        className="auth-strength-fill"
                        style={{ 
                          width: `${passwordStrength.progress}%`,
                          background: passwordStrength.color
                        }}
                      />
                    </div>
                    <span 
                      className="auth-strength-text"
                      style={{ color: passwordStrength.color }}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field (Signup only) */}
              {mode === "signup" && (
                <div className="auth-input-group">
                  <label htmlFor="confirm-password" className="auth-label">
                    Confirm Password
                  </label>
                  <div className="auth-input-wrapper">
                    <Lock size={18} className="auth-input-icon" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input-redesign"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      className="auth-input-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {mode === "login" && (
                <div className="auth-forgot-password">
                  <button type="button" className="auth-link-button">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn primary auth-submit-redesign"
                disabled={loading}
              >
                {loading ? (
                  <span>
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <>
                    <span>
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Switch Mode */}
              <div className="auth-switch-mode">
                <span>
                  {mode === "login" 
                    ? "Don't have an account?" 
                    : "Already have an account?"}
                </span>
                <button
                  type="button"
                  className="auth-link-button accent"
                  onClick={() => handleModeChange(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Create one" : "Sign in"}
                </button>
              </div>
            </form>

            {/* Footer Info */}
            <div className="auth-footer-info">
              <div className="auth-footer-badges">
                <div className="auth-footer-badge">
                  <Check size={14} />
                  <span>No credit card required</span>
                </div>
                <div className="auth-footer-badge">
                  <Check size={14} />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;