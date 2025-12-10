import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { Link, useParams } from "react-router-dom";
import "./Auth.css";

const ResetPassword = () => {
  const { token } = useParams(); // you will use this in API calls later

  return (
    <>
      <Navigation variant="default" />

      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your new password below.</p>

          <form>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: "1rem" }}>
              Update Password
            </button>
          </form>

          <p className="auth-bottom-text">
            Back to <Link className="auth-link" to="/login">Login</Link>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ResetPassword;
