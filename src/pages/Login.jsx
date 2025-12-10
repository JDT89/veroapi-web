import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <>
      {/* Navigation */}
      <Navigation variant="default" />

      {/* Login Page */}
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your dashboard</p>

          <form>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="login-row">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>

              <Link to="/forgot-password" className="login-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="login-divider">
            <span>or continue with</span>
          </div>

          {/* Social Login Buttons */}
          <button className="btn login-secondary-btn">
            Continue with Google
          </button>
          <button className="btn login-secondary-btn">
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

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Login;

