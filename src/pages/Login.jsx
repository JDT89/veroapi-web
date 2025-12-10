import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="login-title gradient-text">Welcome Back</h1>
        <p className="login-subtitle">Sign in to access your dashboard</p>

        <form className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" required />
          </div>

          <div className="login-links-row">
            <Link to="/forgot-password" className="login-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Sign In
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <Link to="/register" className="btn btn-outline login-secondary-btn">
            Create an Account
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
