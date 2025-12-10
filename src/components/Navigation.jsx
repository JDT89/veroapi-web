import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, Settings, LogOut, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navigation.css';

const Navigation = ({ variant = 'default' }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(true); // Toggle this for signed in/out state
  
  const isActive = (path) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);
  
  return (
    <motion.nav 
      className={`nav ${variant} ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <Link to="/" className="logo">
          <svg className="logo-icon" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="url(#logo-gradient)" />
            <path d="M8 10L14 16L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 18L14 12L20 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            <defs>
              <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#0052cc" />
              </linearGradient>
            </defs>
          </svg>
          <span className="gradient-text">NEXUS</span>
        </Link>
        
        <ul className="nav-links desktop-only">
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
          {isSignedIn ? (
            <>
              <button className="icon-btn notification-btn">
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>
              
              <div className="user-menu-wrapper">
                <button 
                  className="user-avatar-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    <User size={18} />
                  </div>
                  <ChevronDown size={16} className={`chevron ${isUserMenuOpen ? 'open' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="dropdown-header">
                        <div className="dropdown-user-info">
                          <div className="dropdown-name">John Doe</div>
                          <div className="dropdown-email">john@example.com</div>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <a href="#" className="dropdown-item">
                        <User size={16} />
                        <span>Profile</span>
                      </a>
                      <a href="#" className="dropdown-item">
                        <Settings size={16} />
                        <span>Settings</span>
                      </a>
                      <div className="dropdown-divider"></div>
                      <a href="#" className="dropdown-item danger">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <a href="#" className="btn btn-sign-in desktop-only">Sign In</a>
              <a href="#" className="btn btn-primary">Get Started</a>
            </>
          )}
          
          <button 
            className="mobile-menu-btn mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-content">
              <Link to="/docs" className={`mobile-menu-item ${isActive('/docs') ? 'active' : ''}`}>
                Documentation
              </Link>
              <Link to="/dashboard" className={`mobile-menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link to="/admin" className={`mobile-menu-item ${isActive('/admin') ? 'active' : ''}`}>
                Admin
              </Link>
              
              {!isSignedIn && (
                <>
                  <div className="mobile-menu-divider"></div>
                  <a href="#" className="btn btn-sign-in mobile-menu-btn">Sign In</a>
                  <a href="#" className="btn btn-primary mobile-menu-btn">Get Started</a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
