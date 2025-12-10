import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Code2, Zap, Shield, BarChart3, Terminal, Sparkles } from 'lucide-react';
import Navigation from '../components/Navigation';
import './Landing.css';

const Landing = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-50px" });

  // Animated counter component
  const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!isStatsInView) return;
      
      let startTime;
      let animationFrame;
      
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / (duration * 1000);
        
        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [isStatsInView, end, duration]);
    
    return <>{prefix}{count}{suffix}</>;
  };

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
      <section className="hero" ref={heroRef}>
        <div className="hero-bg"></div>
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Sparkles size={16} className="sparkle-icon" />
              <span>Now with AI-powered scaling</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Build APIs that
              <br />
              <span className="gradient-text-hero">developers love</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              The most powerful API platform for modern applications. Deploy in seconds,
              scale to millions, monitor everything.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <a href="#" className="btn btn-primary btn-hero">Start Building Free</a>
              <a href="#" className="btn btn-secondary btn-hero">View Documentation</a>
            </motion.div>
            
            <motion.div 
              className="hero-stats"
              ref={statsRef}
              initial={{ opacity: 0 }}
              animate={isStatsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div 
                className="stat"
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="stat-icon">
                  <Shield size={20} />
                </div>
                <div className="stat-value">
                  {isStatsInView ? <AnimatedCounter end={99.99} suffix="%" /> : '99.99%'}
                </div>
                <div className="stat-label">Uptime SLA</div>
              </motion.div>
              <motion.div 
                className="stat"
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className="stat-icon">
                  <Zap size={20} />
                </div>
                <div className="stat-value">
                  {isStatsInView ? <AnimatedCounter end={2} suffix="M+" /> : '2M+'}
                </div>
                <div className="stat-label">API Calls/sec</div>
              </motion.div>
              <motion.div 
                className="stat"
                initial={{ opacity: 0, y: 20 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="stat-icon">
                  <BarChart3 size={20} />
                </div>
                <div className="stat-value">
                  {isStatsInView ? <AnimatedCounter end={10} prefix="<" suffix="ms" /> : '<10ms'}
                </div>
                <div className="stat-label">Avg Response</div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-code"
            initial={{ opacity: 0, x: 30 }}
            animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
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
<span className="code-keyword">const</span> <span className="code-variable">nexus</span> <span className="code-operator">=</span> <span className="code-function">require</span>(<span className="code-string">'@nexus/sdk'</span>);

<span className="code-keyword">const</span> <span className="code-variable">client</span> <span className="code-operator">=</span> <span className="code-keyword">new</span> <span className="code-variable">nexus</span>.<span className="code-function">Client</span>({'{'}
  <span className="code-property">apiKey</span>: <span className="code-variable">process</span>.<span className="code-variable">env</span>.<span className="code-constant">NEXUS_API_KEY</span>
{'}'});

<span className="code-comment">// Make your first API call</span>
<span className="code-keyword">const</span> <span className="code-variable">response</span> <span className="code-operator">=</span> <span className="code-keyword">await</span> <span className="code-variable">client</span>.<span className="code-variable">users</span>.<span className="code-function">create</span>({'{'}
  <span className="code-property">name</span>: <span className="code-string">'John Doe'</span>,
  <span className="code-property">email</span>: <span className="code-string">'john@example.com'</span>
{'}'});

<span className="code-variable">console</span>.<span className="code-function">log</span>(<span className="code-variable">response</span>.<span className="code-property">data</span>);
<span className="code-comment">// {'{'} id: 'usr_123', name: 'John Doe', ... {'}'}</span>
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
            <p>&copy; 2024 Nexus API. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
