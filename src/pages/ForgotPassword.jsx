import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "./Auth.css";

const ForgotPassword = () => {
  return (
    <>
      <Navigation variant="default" />

      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Forgot Password?</h1>
          <p className="auth-subtitle">Enter your email and we’ll send a reset link.</p>

          <form>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" />
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "1rem" }}>
              Send Reset Link
            </button>
          </form>

          <p className="auth-bottom-text">
            Remember your password?{" "}
            <Link className="auth-link" to="/login">Go back to login</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
