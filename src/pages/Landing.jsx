import { motion } from 'framer-motion';
import { Code2, Zap, Shield, BarChart3, Terminal, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import './Landing.css';

const Landing = () => {
  const features = [
    {
      icon: <Zap />,
      title: 'Lightning Fast',
      description: 'Sub-millisecond response times with global CDN distribution and edge computing.'
    },
    {
      icon: <Shield />,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, OAuth 2.0, and compliance with SOC 2, GDPR, and HIPAA.'
    },
    {
      icon: <Code2 />,
      title: 'Developer First',
      description: 'Intuitive SDKs in 12+ languages with comprehensive documentation and examples.'
    },
    {
      icon: <BarChart3 />,
      title: 'Real-time Analytics',
      description: 'Track every request with detailed metrics, logs, and performance insights.'
    },
    {
      icon: <Terminal />,
      title: 'CLI & Automation',
      description: 'Powerful command-line tools for CI/CD integration and automated workflows.'
    },
    {
      icon: <Sparkles />,
      title: 'AI-Powered',
      description: 'Smart rate limiting, anomaly detection, and predictive scaling built-in.'
    }
  ];

  return (
    <div className="landing">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Sparkles size={16} />
              <span>Now with AI-powered scaling</span>
            </motion.div>
            
            <h1>
              Build APIs that
              <br />
              <span className="gradient-text">developers love</span>
            </h1>
            
            <p>
              The most powerful API platform for modern applications. Deploy in seconds,
              scale to millions, monitor everything.
            </p>
            
            <div className="hero-actions">
              <a href="#" className="btn btn-primary">Start Building Free</a>
              <a href="#" className="btn btn-secondary">View Documentation</a>
            </div>
            
            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="stat">
                <div className="stat-value">99.99%</div>
                <div className="stat-label">Uptime SLA</div>
              </div>
              <div className="stat">
                <div className="stat-value">2M+</div>
                <div className="stat-label">API Calls/sec</div>
              </div>
              <div className="stat">
                <div className="stat-value">&lt;10ms</div>
                <div className="stat-label">Avg Response</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-code"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="code-window">
              <div className="code-header">
                <div className="code-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>quickstart.js</span>
              </div>
              <pre className="code-content">
{`const nexus = require('@nexus/sdk');

const client = new nexus.Client({
  apiKey: process.env.NEXUS_API_KEY
});

// Make your first API call
const response = await client.users.create({
  name: 'John Doe',
  email: 'john@example.com'
});

console.log(response.data);
// { id: 'usr_123', name: 'John Doe', ... }`}
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Everything you need to build</h2>
            <p>Production-ready infrastructure that scales with your business</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to build something amazing?</h2>
            <p>Join thousands of developers shipping faster with Nexus API</p>
            <div className="cta-actions">
              <a href="#" className="btn btn-primary">Get Started Free</a>
              <a href="#" className="btn btn-secondary">Talk to Sales</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo gradient-text">NEXUS</div>
              <p>The modern API platform for developers</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Documentation</a>
                <a href="#">API Reference</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Guides</a>
                <a href="#">Examples</a>
                <a href="#">Status</a>
                <a href="#">Support</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Vero API. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
