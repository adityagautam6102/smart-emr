import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Brain, Shield, Zap, TrendingUp, Heart, CheckCircle, ArrowRight, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ background: 'var(--primary-bg)', color: 'var(--text-primary)' }}>
      {/* Navigation */}
      <nav style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, background: 'var(--secondary-bg)', zIndex: 100 }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={32} /> SMART EMR
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>
          <a href="#benefits" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Benefits</a>
          <Link to="/app" style={{
            background: 'var(--accent-primary)',
            color: 'white',
            padding: '0.7rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Launch App <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={{
        padding: '8rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(to right, #fff, #7c8aff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          AI-Powered Clinical <br /> Intelligence Platform
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: '1.8' }}>
          Reduce chart review time by ~40% with advanced NLP summarization and real-time clinical alert detection. Integrated with FHIR standards for seamless healthcare data interoperability.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/app" style={{
            background: 'var(--accent-primary)',
            color: 'white',
            padding: '1rem 2.5rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'var(--transition)'
          }}>
            Get Started Now <ArrowRight size={20} />
          </Link>
          <button style={{
            background: 'var(--secondary-bg)',
            color: 'var(--accent-primary)',
            padding: '1rem 2.5rem',
            borderRadius: '12px',
            border: '2px solid var(--accent-primary)',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}>
            View Demo
          </button>
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--status-normal)" /> 99.9% Uptime</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--status-normal)" /> HIPAA Compliant</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} color="var(--status-normal)" /> Real-time Alerts</div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" style={{ padding: '6rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>Medical-Grade Features</h2>
          <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
            <FeatureCard
              icon={<Brain size={40} color="var(--accent-primary)" />}
              title="AI-Powered Summarization"
              description="Transform lengthy clinical notes into concise, actionable summaries using transformer-based NLP models for rapid clinical review."
            />
            <FeatureCard
              icon={<TrendingUp size={40} color="var(--status-warning)" />}
              title="Lab Trend Detection"
              description="Automatic detection and visualization of abnormal lab values and trends using clinical thresholds to ensure no critical data is missed."
            />
            <FeatureCard
              icon={<Shield size={40} color="var(--status-normal)" />}
              title="FHIR Integration"
              description="Secure, standardized medical data integration via FHIR R4 for seamless interoperability across healthcare systems."
            />
            <FeatureCard
              icon={<Heart size={40} color="var(--status-critical)" />}
              title="Real-time Alerts"
              description="Instant critical alerts for abnormal findings with severity classification and treatment recommendations."
            />
            <FeatureCard
              icon={<Users size={40} color="var(--accent-secondary)" />}
              title="Multi-Patient Management"
              description="Manage multiple patients with organized dashboards showing patient lists, lab results, and clinical notes."
            />
            <FeatureCard
              icon={<Zap size={40} color="var(--accent-primary)" />}
              title="Clinical Recommendations"
              description="AI-generated treatment recommendations based on clinical findings and patient history."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" style={{ padding: '6rem 2rem', background: 'var(--secondary-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Designed for Clinicians</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <BenefitItem text="Reduce cognitive load with structured data visualization" />
              <BenefitItem text="Identify critical lab changes 3x faster" />
              <BenefitItem text="Fully responsive dark-mode UI optimized for hospital environments" />
              <BenefitItem text="Standardized interoperability with HAPI FHIR" />
              <BenefitItem text="Real-time notifications for critical patient events" />
              <BenefitItem text="Comprehensive audit trails for compliance" />
            </ul>
          </div>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ background: 'var(--tertiary-bg)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', minHeight: '400px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%' }}>
                <StatCard label="Avg. Time Saved" value="~40%" subtext="Per patient review" />
                <StatCard label="Alert Accuracy" value="98.5%" subtext="Clinical detection" />
                <StatCard label="System Uptime" value="99.9%" subtext="Guaranteed" />
                <StatCard label="Users Active" value="500+" subtext="Daily active" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '6rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>How It Works</h2>
          <div className="grid grid-3">
            <ProcessCard
              number="1"
              title="Select Patient"
              description="Choose from active patients in the system with one click access to their full medical record."
            />
            <ProcessCard
              number="2"
              title="Review & Analyze"
              description="Paste clinical notes for AI-powered summarization and view real-time lab alerts and trends."
            />
            <ProcessCard
              number="3"
              title="Act on Insights"
              description="Receive treatment recommendations and take immediate action based on critical findings."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>Ready to Revolutionize Your Workflow?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join hundreds of clinicians using SMART EMR to improve patient outcomes and reduce documentation burden.
          </p>
          <Link to="/app" style={{
            background: 'white',
            color: 'var(--accent-primary)',
            padding: '1rem 2.5rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'var(--transition)'
          }}>
            Start Your Free Trial <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', background: 'var(--secondary-bg)' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Us</a>
          <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Documentation</a>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>&copy; 2026 SMART EMR. A medical-grade clinical intelligence platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="card">
    <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
  </div>
);

const BenefitItem = ({ text }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
    <CheckCircle size={24} color="var(--status-normal)" style={{ flexShrink: 0, marginTop: '0.25rem' }} />
    <span>{text}</span>
  </li>
);

const StatCard = ({ label, value, subtext }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{value}</div>
    <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{subtext}</div>
  </div>
);

const ProcessCard = ({ number, title, description }) => (
  <div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
      <div style={{ width: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
        {number}
      </div>
      <h3>{title}</h3>
    </div>
    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{description}</p>
  </div>
);

export default LandingPage;
