import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navigation.css';

const Navigation = ({ variant = 'default' }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <motion.nav 
      className={`nav ${variant}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <Link to="/" className="logo">
          <span className="gradient-text">NEXUS</span>
        </Link>
        
        <ul className="nav-links">
          <li>
            <Link to="/docs" className={isActive('/docs') ? 'active' : ''}>
              Documentation
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
              Admin
            </Link>
          </li>
        </ul>
        
        <div className="nav-actions">
          <a href="#" className="btn btn-secondary">Sign In</a>
          <a href="#" className="btn btn-primary">Get Started</a>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
