import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  return (
    <>
      <Navigation variant="default" />

      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start your journey with VeroAPI</p>

          <form>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "1rem" }}>
              Create Account
            </button>
          </form>

          <div className="auth-divider"><span>or continue with</span></div>

          <button className="btn auth-social-btn">Sign up with Google</button>
          <button className="btn auth-social-btn">Sign up with GitHub</button>

          <p className="auth-bottom-text">
            Already have an account?{" "}
            <Link className="auth-link" to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Register;
