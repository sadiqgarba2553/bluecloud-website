import { useState } from 'react';
import { Rocket, Check, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './SMELaunchpad.css';

const PACKAGES = [
  {
    id: 'startup-mvp',
    name: 'Startup Launchpad MVP',
    price: '$1,200',
    period: 'One-Time Project',
    tag: 'BEST FOR EARLY STARTUPS',
    features: [
      'Custom React 19 SPA + Mobile Responsive UI',
      'Firebase Authentication & Firestore Database',
      'SEO Optimization & Custom Domain Deployment',
      'Deliverable in 7 Business Days'
    ]
  },
  {
    id: 'growth-sme',
    name: 'SME Enterprise Growth Platform',
    price: '$3,500',
    period: 'Full Infrastructure',
    tag: 'MOST POPULAR FOR BUSINESSES',
    features: [
      'Full Custom Web Application + Admin CRM Dashboard',
      'Integrated BLUECLOUD AI Chatbot Assistant',
      'Automated Invoicing & Payment Gateway Integration',
      'Priority 99.99% Uptime & 30-Day Post Launch SLA'
    ]
  },
  {
    id: 'monthly-retainer',
    name: 'Managed Tech Retainer',
    price: '$850',
    period: 'per month',
    tag: 'CONTINUOUS SUPPORT',
    features: [
      'Dedicated Tech Lead & Monthly Feature Updates',
      '24/7 Security Rules Monitoring & Database Backups',
      'Continuous SEO & Speed Optimization',
      'Unused Hours Roll Over to Next Month'
    ]
  }
];

const SMELaunchpad = () => {
  const [selectedPkg, setSelectedPkg] = useState('growth-sme');
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !contactEmail || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'sme_onboarding'), {
        packageId: selectedPkg,
        businessName,
        contactEmail,
        phone,
        notes,
        status: 'new_inquiry',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('SME Onboarding Error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sme-launchpad-card">
      <div className="sme-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Rocket size={18} /> Small Business & Startup Acceleration
        </div>
        <h2>BLUECLOUD Small Business & SME Launchpad</h2>
        <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem' }}>
          Enterprise-grade technology solutions packaged with affordable, transparent pricing for growing businesses.
        </p>

        {/* Packages Cards */}
        <div className="sme-packages-grid">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`sme-pkg-card ${selectedPkg === pkg.id ? 'active' : ''}`}
              onClick={() => setSelectedPkg(pkg.id)}
            >
              <span className="sme-pkg-tag">{pkg.tag}</span>
              <h3 className="sme-pkg-title">{pkg.name}</h3>
              <div className="sme-pkg-price">{pkg.price} <span>{pkg.period}</span></div>
              
              <ul className="sme-pkg-features">
                {pkg.features.map((feat, idx) => (
                  <li key={idx}><Check size={14} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} /> {feat}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Request Form */}
      <div className="sme-form-card">
        <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-navy)', marginBottom: '4px' }}>
          Start Your Business Onboarding ({PACKAGES.find(p => p.id === selectedPkg)?.name})
        </h3>
        <p style={{ color: 'var(--slate-text)', fontSize: '0.85rem', marginBottom: 'var(--spacing-4)' }}>
          Fill out your business details below to receive a formal proposal and start your project within 24 hours.
        </p>

        {submitted ? (
          <div style={{ backgroundColor: 'rgba(11, 95, 255, 0.08)', border: '1px solid var(--primary-blue)', padding: '16px', borderRadius: '8px', textAlign: 'center', color: 'var(--primary-blue)' }}>
            <CheckCircle size={32} style={{ margin: '0 auto 8px', display: 'block' }} />
            <strong style={{ fontSize: '1.05rem' }}>Onboarding Request Received!</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-text)', marginTop: '4px' }}>
              Thank you, {businessName}. Our engineering lead will contact <strong>{contactEmail}</strong> shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <input 
                type="text" 
                placeholder="Company / Business Name" 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none' }}
              />
              <input 
                type="email" 
                placeholder="Business Email" 
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none' }}
              />
              <input 
                type="tel" 
                placeholder="Phone Number (e.g. 08125531111)" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none' }}
              />
            </div>
            <textarea
              rows="2"
              placeholder="Briefly describe your project or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--light-gray)', outline: 'none', marginBottom: '14px', fontFamily: 'inherit' }}
            ></textarea>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit SME Onboarding Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SMELaunchpad;
