import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-left">
          <h3 className="footer-logo">VeroAPI</h3>
          <p className="footer-text">
            Build powerful API experiences with ease.
          </p>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <h4>Product</h4>
            <a href="/docs">Documentation</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/pricing">Pricing</a>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
            <a href="/contact">Contact</a>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} VeroAPI — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
