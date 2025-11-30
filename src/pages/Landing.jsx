import React, { useState, useEffect } from 'react';
import { Zap, Code, Shield, TrendingUp, ArrowRight, Check, Sparkles, Play, Terminal, Clock, Star } from 'lucide-react';

const LandingPageRedesign = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-100ms response times for all endpoints",
      stat: "<100ms",
      color: "#FF9F1C"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and authentication",
      stat: "256-bit",
      color: "#2EC4B6"
    },
    {
      icon: TrendingUp,
      title: "99.99% Uptime",
      description: "Reliable infrastructure you can depend on",
      stat: "99.99%",
      color: "#22c55e"
    }
  ];

  const useCases = [
    {
      title: "Discord Bots",
      description: "Power your bot with XP systems, rewards, mini-games and more",
      metrics: ["10k+ bots", "2M users"],
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "SaaS Products",
      description: "Add random utilities without building infrastructure",
      metrics: ["500+ apps", "50M requests"],
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Internal Tools",
      description: "Build admin panels, dashboards and automation scripts",
      metrics: ["1k+ teams", "24/7 uptime"],
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  const testimonials = [
    {
      text: "VeroAPI saved us weeks of development time. Their text utilities are exactly what we needed.",
      author: "Sarah Chen",
      role: "CTO at BotHub",
      rating: 5
    },
    {
      text: "The API is fast, reliable, and well-documented. Perfect for our Discord bot infrastructure.",
      author: "Mike Rodriguez",
      role: "Lead Developer",
      rating: 5
    },
    {
      text: "Simple pricing, great support, and rock-solid uptime. Couldn't ask for more.",
      author: "Emily Watson",
      role: "Product Manager",
      rating: 5
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#171D23',
      color: '#F6F7F8',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '120px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Animated background gradient */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-25%',
          width: '150%',
          height: '200%',
          background: 'radial-gradient(circle at 50% 50%, rgba(46, 196, 182, 0.15) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease'
        }}>
          {/* Status badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'rgba(46, 196, 182, 0.1)',
            border: '1px solid rgba(46, 196, 182, 0.3)',
            borderRadius: '999px',
            marginBottom: '32px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <Sparkles size={16} style={{ color: '#2EC4B6' }} />
            <span style={{ color: '#2EC4B6' }}>New: 10+ endpoints now live</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: '24px',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #F6F7F8 0%, #2EC4B6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            APIs that just work.<br />
            <span style={{
              background: 'linear-gradient(135deg, #FF9F1C 0%, #2EC4B6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              No BS.
            </span>
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(246, 247, 248, 0.7)',
            marginBottom: '40px',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto 40px'
          }}>
            One API key. Dozens of random-but-useful endpoints. Zero infrastructure headaches.
            Perfect for Discord bots, internal tools, and SaaS products.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            <button style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #FF9F1C 0%, #ffb347 100%)',
              color: '#171D23',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 8px 32px rgba(255, 159, 28, 0.4)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 12px 40px rgba(255, 159, 28, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 32px rgba(255, 159, 28, 0.4)';
            }}>
              Get Started Free
              <ArrowRight size={20} />
            </button>

            <button style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              background: 'rgba(46, 196, 182, 0.1)',
              color: '#2EC4B6',
              border: '1px solid rgba(46, 196, 182, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(46, 196, 182, 0.2)';
              e.target.style.borderColor = '#2EC4B6';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(46, 196, 182, 0.1)';
              e.target.style.borderColor = 'rgba(46, 196, 182, 0.3)';
            }}>
              <Play size={20} />
              View Demo
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: '24px',
            justifyContent: 'center',
            fontSize: '0.875rem',
            color: 'rgba(246, 247, 248, 0.5)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} style={{ color: '#22c55e' }} />
              No credit card required
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} style={{ color: '#22c55e' }} />
              1,000 free calls/month
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} style={{ color: '#22c55e' }} />
              Cancel anytime
            </div>
          </div>
        </div>

        {/* Code preview */}
        <div style={{
          maxWidth: '800px',
          margin: '60px auto 0',
          position: 'relative'
        }}>
          <div style={{
            background: 'rgba(30, 37, 44, 0.8)',
            border: '1px solid rgba(46, 196, 182, 0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'left',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(46, 196, 182, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Terminal size={16} style={{ color: '#2EC4B6' }} />
                <span style={{ fontSize: '0.875rem', color: 'rgba(246, 247, 248, 0.7)' }}>
                  Quick Start
                </span>
              </div>
              <button style={{
                padding: '6px 12px',
                fontSize: '0.75rem',
                background: 'rgba(46, 196, 182, 0.1)',
                color: '#2EC4B6',
                border: '1px solid rgba(46, 196, 182, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                Copy
              </button>
            </div>
            <pre style={{
              margin: 0,
              fontFamily: 'ui-monospace, monospace',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              color: '#F6F7F8',
              overflowX: 'auto'
            }}>
              <code>{`curl https://api.vero-api.com/v1/text/scramble \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "VeroAPI"}'`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '80px 24px',
        borderTop: '1px solid rgba(46, 196, 182, 0.1)',
        borderBottom: '1px solid rgba(46, 196, 182, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          textAlign: 'center'
        }}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s ease ${idx * 0.1}s`
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${feature.color}20 0%, ${feature.color}10 100%)`,
                  border: `2px solid ${feature.color}40`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={36} style={{ color: feature.color }} />
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '800',
                  color: feature.color,
                  marginBottom: '8px'
                }}>
                  {feature.stat}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#F6F7F8',
                  marginBottom: '8px'
                }}>
                  {feature.title}
                </div>
                <div style={{
                  fontSize: '0.95rem',
                  color: 'rgba(246, 247, 248, 0.6)'
                }}>
                  {feature.description}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Use Cases Section */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, #171D23 0%, rgba(30, 37, 44, 0.5) 100%)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}>
              Built for developers,<br />
              <span style={{ color: '#2EC4B6' }}>loved by teams</span>
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(246, 247, 248, 0.6)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              From indie hackers to enterprise teams, VeroAPI powers applications across the globe
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {useCases.map((useCase, idx) => (
              <div key={idx} style={{
                background: 'rgba(30, 37, 44, 0.8)',
                border: '1px solid rgba(46, 196, 182, 0.2)',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(46, 196, 182, 0.2)';
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: useCase.gradient,
                  opacity: '0.1',
                  borderRadius: '50%'
                }} />
                <div style={{ position: 'relative' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    marginBottom: '12px',
                    color: '#F6F7F8'
                  }}>
                    {useCase.title}
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: 'rgba(246, 247, 248, 0.6)',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    {useCase.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}>
                    {useCase.metrics.map((metric, midx) => (
                      <div key={midx} style={{
                        padding: '6px 14px',
                        background: 'rgba(46, 196, 182, 0.1)',
                        border: '1px solid rgba(46, 196, 182, 0.3)',
                        borderRadius: '999px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#2EC4B6'
                      }}>
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '100px 24px',
        borderTop: '1px solid rgba(46, 196, 182, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              marginBottom: '16px',
              letterSpacing: '-0.02em'
            }}>
              Trusted by developers
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} style={{
                background: 'rgba(30, 37, 44, 0.6)',
                border: '1px solid rgba(46, 196, 182, 0.2)',
                borderRadius: '16px',
                padding: '28px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  marginBottom: '16px'
                }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#FF9F1C" color="#FF9F1C" />
                  ))}
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  color: 'rgba(246, 247, 248, 0.8)',
                  marginBottom: '20px'
                }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#F6F7F8',
                    marginBottom: '4px'
                  }}>
                    {testimonial.author}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: 'rgba(246, 247, 248, 0.5)'
                  }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(135deg, rgba(46, 196, 182, 0.1) 0%, rgba(255, 159, 28, 0.1) 100%)',
        borderTop: '1px solid rgba(46, 196, 182, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}>
            Ready to ship faster?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(246, 247, 248, 0.7)',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Join thousands of developers who've already ditched custom API infrastructure
          </p>
          <button style={{
            padding: '18px 40px',
            fontSize: '1.1rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #FF9F1C 0%, #ffb347 100%)',
            color: '#171D23',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(255, 159, 28, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 12px 40px rgba(255, 159, 28, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 32px rgba(255, 159, 28, 0.4)';
          }}>
            Start Building Now
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPageRedesign;