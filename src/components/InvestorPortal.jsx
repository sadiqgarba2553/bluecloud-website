import { useState } from 'react';
import { TrendingUp, Globe, Shield, CheckCircle, Send, Award } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './InvestorPortal.css';

const ROADMAP_PHASES = [
  {
    phase: 'Phase 1 (2026)',
    title: 'Enterprise AI & Compiler Platform',
    desc: 'Deployment of Flux Language toolchain, Aura AI 3.5 Engine, and initial developer SDK hub.'
  },
  {
    phase: 'Phase 2 (2027-2028)',
    title: 'Cloud Operating Environment & Ecosystem',
    desc: 'Launch of BLUECLOUD Cloud OS, unified Prism Workspace editor, and global Developer Marketplace.'
  },
  {
    phase: 'Phase 3 (2029-2031)',
    title: 'Autonomous Enterprise ERP Suite',
    desc: 'Full autonomous business operating suite replacing legacy ERPs with predictive real-time intelligence.'
  },
  {
    phase: 'Phase 4 (2032-2036)',
    title: 'Global Tech & Cloud Infrastructure Dominance',
    desc: 'Multi-region data centers, quantum-resistant encryption, and global enterprise market leadership.'
  }
];

const InvestorPortal = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!name || !email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'investor_inquiries'), {
        name,
        email,
        organization,
        message,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error logging investor inquiry:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="inv-portal-container">
      <div className="inv-portal-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <TrendingUp size={18} /> Global Strategy & Strategic Growth
        </div>
        <h1>BLUECLOUD Investor Relations & Vision</h1>
        <p style={{ color: 'var(--slate-text)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
          Building Africa's premier technology powerhouse and the world's next-generation global software ecosystem.
        </p>
      </div>

      {/* 10-Year Global Vision Roadmap */}
      <div className="section container" style={{ padding: '0 0 var(--spacing-6)' }}>
        <h2 className="text-center mb-6">10-Year Global Technology Strategy</h2>
        <div className="inv-roadmap-grid">
          {ROADMAP_PHASES.map((p, i) => (
            <div key={i} className="inv-roadmap-card">
              <span className="inv-roadmap-phase">{p.phase}</span>
              <h3 className="inv-roadmap-title">{p.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-text)', lineHeight: '1.5' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Partner & Investor Form */}
      <div className="inv-form-card">
        <h2>Strategic Partner & Investor Inquiry</h2>
        <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', marginBottom: 'var(--spacing-4)' }}>
          Connect with BLUECLOUD executive leadership regarding strategic partnerships, technology licenses, and growth initiatives.
        </p>

        {submitted ? (
          <div style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid var(--cyan-accent)', padding: '16px', borderRadius: '8px', textAlign: 'center', color: 'var(--cyan-accent)' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
            <strong style={{ fontSize: '1.1rem' }}>Inquiry Received!</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--white)', marginTop: '4px' }}>
              Our executive office will reach out to schedule a private briefing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry}>
            <input 
              type="text" 
              placeholder="Your Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Work Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Organization / Investment Firm" 
              value={organization} 
              onChange={(e) => setOrganization(e.target.value)} 
            />
            <textarea 
              placeholder="Message / Area of Strategic Interest" 
              rows={4}
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
            />
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}
            >
              <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Strategic Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InvestorPortal;
