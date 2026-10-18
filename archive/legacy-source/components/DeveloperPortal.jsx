import { useState } from 'react';
import { Code, Terminal, Clock, Send, CheckCircle, Shield, Zap, Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './DeveloperPortal.css';

const CODE_PREVIEW = `// BLUECLOUD Enterprise API & SDK (Coming Soon Q3 2026)
import { BlueCloudAPI } from '@bluecloud/sdk';

const client = new BlueCloudAPI({
  apiKey: 'bc_live_enterprise_token',
  environment: 'production'
});

// Execute AI Pipeline or Flux Language Script
const result = await client.ai.generate({
  model: 'aura-gemini-3.5',
  prompt: 'Synthesize enterprise operational telemetry'
});`;

const DeveloperPortal = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [useCase, setUseCase] = useState('Enterprise System Integration');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'api_waitlist'), {
        name,
        email,
        organization,
        useCase,
        status: 'pending_early_access',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dev-portal-container">
      <div className="dev-portal-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Code size={18} /> Developer API & SDK Suite
        </div>
        <h1>BLUECLOUD Enterprise API — Coming Soon</h1>
        <p style={{ color: 'var(--slate-text)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
          We are building the next generation of high-throughput AI, Cloud, and Flux Compiler APIs. Sign up for early developer preview access.
        </p>
      </div>

      {/* Coming Soon & Early Access Banner Card */}
      <div style={{ backgroundColor: 'var(--deep-navy)', color: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', marginBottom: 'var(--spacing-6)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: 'var(--spacing-4)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={24} style={{ color: 'var(--cyan-accent)' }} />
            <div>
              <h3 style={{ color: 'var(--white)', margin: 0, fontSize: '1.25rem' }}>Enterprise API Gateway Q3 2026</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-accent)', fontWeight: 'bold' }}>OFFICIAL RELEASE SCHEDULED</span>
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid var(--cyan-accent)', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--cyan-accent)' }}>
            Status: Private Alpha Testing
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-5)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Zap size={20} style={{ color: 'var(--cyan-accent)', marginBottom: '6px' }} />
            <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', marginBottom: '4px' }}>AI & Intelligence APIs</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Direct HTTP REST & WebSocket access to Aura Gemini 3.5 models for automated document parsing and code audits.</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Terminal size={20} style={{ color: 'var(--cyan-accent)', marginBottom: '6px' }} />
            <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', marginBottom: '4px' }}>Flux Compiler Gateway</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Remote compilation engine for executing domain-specific Flux Language logic pipelines.</p>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: 'var(--spacing-3)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Shield size={20} style={{ color: 'var(--cyan-accent)', marginBottom: '6px' }} />
            <h4 style={{ color: 'var(--white)', fontSize: '0.95rem', marginBottom: '4px' }}>Zero-Trust Security</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Granular token scopes, IP whitelist restrictions, and sub-100ms response guarantees.</p>
          </div>
        </div>

        {/* Code Preview Block */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-4)', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--cyan-accent)', whiteSpace: 'pre-wrap', marginBottom: 'var(--spacing-5)' }}>
          {CODE_PREVIEW}
        </div>
      </div>

      {/* Early Access Waitlist Form */}
      <div style={{ backgroundColor: 'var(--white)', border: '1px solid var(--light-gray)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-5)', boxShadow: 'var(--shadow-sm)', maxWidth: '650px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '4px', textAlign: 'center' }}>Request Early Developer & Enterprise Access</h3>
        <p style={{ textAlign: 'center', color: 'var(--slate-text)', fontSize: '0.85rem', marginBottom: 'var(--spacing-4)' }}>
          Join the waitlist to receive private SDK keys and early developer documentation prior to public launch.
        </p>

        {submitted ? (
          <div style={{ backgroundColor: 'rgba(11, 95, 255, 0.08)', border: '1px solid var(--primary-blue)', padding: '16px', borderRadius: '8px', textAlign: 'center', color: 'var(--primary-blue)' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
            <strong style={{ fontSize: '1.1rem' }}>Early Access Request Registered!</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-text)', marginTop: '4px' }}>
              Thank you, {name}. We will notify <strong>{email}</strong> as soon as developer slots open.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWaitlistSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none' }}
              />
              <input 
                type="email" 
                placeholder="Work Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Company / Organization" 
                value={organization} 
                onChange={(e) => setOrganization(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none' }}
              />
              <select 
                value={useCase} 
                onChange={(e) => setUseCase(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none', backgroundColor: 'var(--white)' }}
              >
                <option value="Enterprise System Integration">Enterprise Integration</option>
                <option value="SaaS Mobile/Web App">SaaS Web / Mobile App</option>
                <option value="Custom AI Model Pipeline">Custom AI Pipeline</option>
                <option value="Flux Language Development">Flux Language Compiler</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Send size={16} /> {isSubmitting ? 'Registering...' : 'Request Early Access Key'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeveloperPortal;


