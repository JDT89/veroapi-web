import React, { useState } from 'react';
import { Check, Zap, TrendingUp, Building2, Sparkles } from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      description: 'Perfect for side projects and testing',
      price: {
        monthly: 0,
        annual: 0
      },
      features: [
        '1,000 API calls/month',
        'Basic endpoints access',
        'Community support',
        'Standard rate limits',
        'Documentation access'
      ],
      cta: 'Get Started',
      popular: false,
      buttonStyle: 'outline'
    },
    {
      name: 'Professional',
      icon: TrendingUp,
      description: 'For growing businesses and startups',
      price: {
        monthly: 49,
        annual: 470
      },
      features: [
        '50,000 API calls/month',
        'All endpoints access',
        'Priority email support',
        'Higher rate limits',
        'Webhook notifications',
        'Advanced analytics',
        'Custom integrations'
      ],
      cta: 'Start Free Trial',
      popular: true,
      buttonStyle: 'primary'
    },
    {
      name: 'Enterprise',
      icon: Building2,
      description: 'For large-scale applications',
      price: {
        monthly: 299,
        annual: 2870
      },
      features: [
        'Unlimited API calls',
        'All endpoints + early access',
        '24/7 dedicated support',
        'No rate limits',
        'Custom webhooks',
        'Advanced analytics + reporting',
        'Custom SLA',
        'Dedicated account manager',
        'On-premise deployment option'
      ],
      cta: 'Contact Sales',
      popular: false,
      buttonStyle: 'accent'
    }
  ];

  const addons = [
    {
      name: 'Additional API Calls',
      description: 'Extra 10,000 calls/month',
      price: 10
    },
    {
      name: 'Premium Support',
      description: '24/7 priority support with 1-hour response time',
      price: 99
    },
    {
      name: 'Custom Webhooks',
      description: 'Build custom webhook integrations',
      price: 49
    }
  ];

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '0 auto',
      animation: 'fadeUpSoft 0.4s ease'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center',
        marginBottom: '3rem',
        maxWidth: '700px',
        margin: '0 auto 3rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent)',
          borderRadius: 'var(--radius-pill)',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          color: 'var(--accent)',
          fontWeight: '500'
        }}>
          <Sparkles size={16} />
          Simple, transparent pricing
        </div>
        
        <h1 style={{ 
          margin: '0 0 1rem',
          fontSize: '2.5rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          letterSpacing: '-0.02em',
          lineHeight: '1.2'
        }}>
          Choose the right plan for your needs
        </h1>
        <p style={{ 
          margin: 0,
          fontSize: '1.1rem',
          color: 'var(--text-soft)',
          lineHeight: '1.6'
        }}>
          Start free, scale as you grow. All plans include access to our core API features.
        </p>
      </div>

      {/* Billing Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '3rem'
      }}>
        <span style={{
          fontSize: '0.95rem',
          color: billingCycle === 'monthly' ? 'var(--text-main)' : 'var(--text-soft)',
          fontWeight: billingCycle === 'monthly' ? '600' : '400',
          transition: 'all 0.2s ease'
        }}>
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
          style={{
            position: 'relative',
            width: '56px',
            height: '32px',
            background: billingCycle === 'annual' ? 'var(--accent)' : 'var(--bg-elevated)',
            border: `1px solid ${billingCycle === 'annual' ? 'var(--accent)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{
            position: 'absolute',
            top: '3px',
            left: billingCycle === 'annual' ? '27px' : '3px',
            width: '24px',
            height: '24px',
            background: 'var(--text-main)',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }} />
        </button>
        <span style={{
          fontSize: '0.95rem',
          color: billingCycle === 'annual' ? 'var(--text-main)' : 'var(--text-soft)',
          fontWeight: billingCycle === 'annual' ? '600' : '400',
          transition: 'all 0.2s ease'
        }}>
          Annual
        </span>
        <span style={{
          padding: '0.25rem 0.6rem',
          background: 'var(--highlight-soft)',
          color: 'var(--highlight)',
          fontSize: '0.75rem',
          fontWeight: '600',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--highlight)'
        }}>
          Save 20%
        </span>
      </div>

      {/* Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        marginBottom: '4rem'
      }}>
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          return (
            <div
              key={idx}
              className="card"
              style={{
                position: 'relative',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                boxShadow: plan.popular ? 'var(--shadow-accent)' : 'var(--shadow-soft)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                if (!plan.popular) {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '0.35rem 1rem',
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: 'var(--shadow-accent)'
                }}>
                  Most Popular
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: plan.popular ? 'var(--accent-soft)' : 'var(--bg-elevated)',
                  border: `1px solid ${plan.popular ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: plan.popular ? 'var(--accent)' : 'var(--text-soft)'
                }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.01em'
                  }}>
                    {plan.name}
                  </h3>
                </div>
              </div>

              <p style={{
                margin: '0 0 1.5rem',
                fontSize: '0.9rem',
                color: 'var(--text-soft)',
                lineHeight: '1.5'
              }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    letterSpacing: '-0.02em'
                  }}>
                    ${plan.price[billingCycle]}
                  </span>
                  <span style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-soft)'
                  }}>
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'annual' && plan.price.annual > 0 && (
                  <p style={{
                    margin: '0.5rem 0 0',
                    fontSize: '0.85rem',
                    color: 'var(--text-softer)'
                  }}>
                    ${Math.round(plan.price.annual / 12)}/month billed annually
                  </p>
                )}
              </div>

              <button
                className="btn"
                style={{
                  width: '100%',
                  marginBottom: '1.5rem',
                  ...(plan.buttonStyle === 'primary' && {
                    background: 'var(--highlight)',
                    borderColor: 'var(--highlight)',
                    color: '#171D23',
                    boxShadow: '0 8px 24px var(--highlight-glow)'
                  }),
                  ...(plan.buttonStyle === 'accent' && {
                    background: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    color: '#171D23',
                    boxShadow: '0 8px 24px var(--accent-glow)'
                  }),
                  ...(plan.buttonStyle === 'outline' && {
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-main)'
                  })
                }}
              >
                {plan.cta}
              </button>

              <div style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <p style={{
                  margin: '0 0 1rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-softer)'
                }}>
                  Features included:
                </p>
                <ul style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none'
                }}>
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.5rem 0',
                      fontSize: '0.9rem',
                      color: 'var(--text-soft)'
                    }}>
                      <Check 
                        size={18} 
                        style={{ 
                          color: plan.popular ? 'var(--accent)' : 'var(--text-softer)',
                          flexShrink: 0,
                          marginTop: '2px'
                        }} 
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add-ons Section */}
      <div style={{
        marginTop: '4rem',
        paddingTop: '3rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            margin: '0 0 0.5rem',
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}>
            Optional Add-ons
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            color: 'var(--text-soft)'
          }}>
            Enhance your plan with additional capabilities
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {addons.map((addon, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 0.25rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-main)'
                }}>
                  {addon.name}
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: 'var(--text-soft)'
                }}>
                  {addon.description}
                </p>
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--accent)',
                whiteSpace: 'nowrap'
              }}>
                +${addon.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{
        marginTop: '4rem',
        paddingTop: '3rem',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{
            margin: '0 0 0.5rem',
            fontSize: '1.75rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {[
            {
              q: 'Can I change plans at any time?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
            },
            {
              q: 'What happens if I exceed my API call limit?',
              a: 'Your requests will be rate-limited. You can purchase additional API calls or upgrade to a higher plan.'
            },
            {
              q: 'Do you offer refunds?',
              a: 'Yes, we offer a 30-day money-back guarantee on all paid plans.'
            },
            {
              q: 'Is there a free trial?',
              a: 'The Professional plan includes a 14-day free trial. No credit card required to start.'
            }
          ].map((faq, idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{
                margin: '0 0 0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-main)'
              }}>
                {faq.q}
              </h4>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: 'var(--text-soft)',
                lineHeight: '1.6'
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
