import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Code2, Zap, Shield, BarChart3, Terminal, Sparkles, ArrowRight, CheckCircle2, Star } from 'lucide-react';
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
      
      {/* Hero Section - Completely Rebuilt */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg">
          <div className="hero-gradient-orb hero-gradient-orb-1"></div>
          <div className="hero-gradient-orb hero-gradient-orb-2"></div>
        </div>
        
        <div className="container">
          <div className="hero-center">
            {/* Badge */}
            <motion.div 
              className="hero-badge-new"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Star size={14} className="badge-star" />
              <span>Trusted by 50,000+ developers worldwide</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="hero-title-new"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The API platform
              <br />
              built for <span className="title-highlight">scale</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="hero-subtitle-new"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ship production-ready APIs in minutes. Scale to millions of requests.
              <br />
              Monitor everything. All from one powerful platform.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              className="hero-ctas-new"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a href="#" className="btn-new btn-primary-new">
                <span>Start Building Free</span>
                <ArrowRight size={18} />
              </a>
              <a href="#" className="btn-new btn-secondary-new">
                <span>View Live Demo</span>
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="hero-trust"
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="trust-item">
                <CheckCircle2 size={16} />
                <span>No credit card required</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} />
                <span>Free forever plan</span>
              </div>
              <div className="trust-item">
                <CheckCircle2 size={16} />
                <span>5-minute setup</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="hero-stats-new"
              ref={statsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="stat-new">
                <div className="stat-number">
                  {isStatsInView ? <AnimatedCounter end={99.99} suffix="%" /> : '99.99%'}
                </div>
                <div className="stat-text">Uptime SLA</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-new">
                <div className="stat-number">
                  {isStatsInView ? <AnimatedCounter end={2} suffix="M+" /> : '2M+'}
                </div>
                <div className="stat-text">Requests/sec</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-new">
                <div className="stat-number">
                  {isStatsInView ? <AnimatedCounter end={10} prefix="<" suffix="ms" /> : '<10ms'}
                </div>
                <div className="stat-text">Response time</div>
              </div>
            </motion.div>

            {/* Code Preview */}
            <motion.div 
              className="hero-code-preview"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="code-window-new">
                <div className="code-header-new">
                  <div className="code-dots-new">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="code-title">quickstart.js</span>
                  <div className="code-actions">
                    <span className="code-language">JavaScript</span>
                  </div>
                </div>
                <div className="code-body-new">
                  <pre>
<span className="code-line"><span className="line-number">1</span><span className="code-keyword">import</span> <span className="code-variable">nexus</span> <span className="code-keyword">from</span> <span className="code-string">'@nexus/sdk'</span>;</span>
<span className="code-line"><span className="line-number">2</span></span>
<span className="code-line"><span className="line-number">3</span><span className="code-keyword">const</span> <span className="code-variable">client</span> <span className="code-operator">=</span> <span className="code-keyword">new</span> <span className="code-function">nexus</span>.<span className="code-function">Client</span>({'{'}
</span>
<span className="code-line"><span className="line-number">4</span>  <span className="code-property">apiKey</span>: <span className="code-variable">process</span>.<span className="code-variable">env</span>.<span className="code-constant">NEXUS_API_KEY</span></span>
<span className="code-line"><span className="line-number">5</span>{'}'});</span>
<span className="code-line"><span className="line-number">6</span></span>
<span className="code-line"><span className="line-number">7</span><span className="code-comment">// Make your first API call</span></span>
<span className="code-line"><span className="line-number">8</span><span className="code-keyword">const</span> <span className="code-variable">response</span> <span className="code-operator">=</span> <span className="code-keyword">await</span> <span className="code-variable">client</span>.<span className="code-variable">users</span>.<span className="code-function">create</span>({'{'}
</span>
<span className="code-line"><span className="line-number">9</span>  <span className="code-property">name</span>: <span className="code-string">'John Doe'</span>,</span>
<span className="code-line"><span className="line-number">10</span>  <span className="code-property">email</span>: <span className="code-string">'john@example.com'</span></span>
<span className="code-line"><span className="line-number">11</span>{'}'});</span>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
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
