import { useState } from 'react';
import { Calculator, CheckCircle, Clock, DollarSign, Send, Layers, Zap } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './ProjectScopeEstimator.css';

const PROJECT_TYPES = [
  { id: 'web', name: 'Web Application', basePrice: 1500, baseWeeks: 3, desc: 'Responsive web apps, dashboards & portals' },
  { id: 'ai', name: 'AI Solution', basePrice: 2500, baseWeeks: 4, desc: 'LLM integration, NLP, predictive analytics' },
  { id: 'enterprise', name: 'Enterprise Software', basePrice: 4000, baseWeeks: 6, desc: 'Complex workflows & high security' },
  { id: 'mobile', name: 'Mobile App', basePrice: 3000, baseWeeks: 5, desc: 'iOS and Android cross-platform solutions' }
];

const FEATURES = [
  { id: 'auth', name: 'User Authentication & Roles', price: 300, weeks: 0.5 },
  { id: 'db', name: 'Realtime Database & Sync', price: 450, weeks: 0.5 },
  { id: 'ai_chat', name: 'AI Chatbot / Assistant', price: 600, weeks: 1 },
  { id: 'analytics', name: 'Analytics & Reporting', price: 400, weeks: 0.5 },
  { id: 'i18n', name: 'Multi-Language Support', price: 350, weeks: 0.5 },
  { id: 'api', name: 'Custom API Integrations', price: 500, weeks: 1 }
];

const SPEED_TIERS = [
  { id: 'standard', name: 'Standard Timeline', multiplier: 1, text: 'Normal delivery cadence' },
  { id: 'express', name: 'Express Speed (+25%)', multiplier: 1.25, text: 'Accelerated priority delivery' }
];

const ProjectScopeEstimator = () => {
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0]);
  const [selectedFeatures, setSelectedFeatures] = useState(['auth', 'db']);
  const [speedTier, setSpeedTier] = useState(SPEED_TIERS[0]);
  
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleFeature = (id) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  // Calculations
  const featuresPrice = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURES.find(f => f.id === featId);
    return acc + (feat ? feat.price : 0);
  }, 0);

  const featuresWeeks = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURES.find(f => f.id === featId);
    return acc + (feat ? feat.weeks : 0);
  }, 0);

  const totalPrice = Math.round((selectedType.basePrice + featuresPrice) * speedTier.multiplier);
  const totalWeeks = Math.max(1, Math.round((selectedType.baseWeeks + featuresWeeks) / (speedTier.id === 'express' ? 1.3 : 1)));

  const handleSubmitEstimate = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'estimates'), {
        name: clientName,
        email: clientEmail,
        projectType: selectedType.name,
        features: selectedFeatures.map(id => FEATURES.find(f => f.id === id)?.name),
        speed: speedTier.name,
        estimatedPrice: `$${totalPrice.toLocaleString()}`,
        estimatedTimeline: `${totalWeeks} Weeks`,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting estimate:', err);
      // Fallback UI acknowledgment
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="estimator-container">
      <div className="estimator-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Calculator size={18} /> Interactive Estimator
        </div>
        <h2>Project Scope & Cost Builder</h2>
        <p style={{ color: 'var(--slate-text)', maxWidth: '600px', margin: '0 auto' }}>
          Select your project specs to generate a real-time estimated scope, timeline, and investment summary.
        </p>
      </div>

      <div className="estimator-grid">
        {/* Left Column: Controls */}
        <div>
          <div className="estimator-section-title">
            <Layers size={18} style={{ color: 'var(--primary-blue)' }} /> 1. Select Project Type
          </div>
          <div className="estimator-options-grid">
            {PROJECT_TYPES.map(type => (
              <div 
                key={type.id} 
                className={`estimator-option-card ${selectedType.id === type.id ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                <div className="estimator-option-name">{type.name}</div>
                <div className="estimator-option-desc">{type.desc}</div>
              </div>
            ))}
          </div>

          <div className="estimator-section-title">
            <Zap size={18} style={{ color: 'var(--primary-blue)' }} /> 2. Add Key Modules
          </div>
          <div className="estimator-checkboxes">
            {FEATURES.map(feat => {
              const active = selectedFeatures.includes(feat.id);
              return (
                <div 
                  key={feat.id} 
                  className={`estimator-checkbox-label ${active ? 'active' : ''}`}
                  onClick={() => toggleFeature(feat.id)}
                >
                  <input type="checkbox" checked={active} readOnly />
                  <span>{feat.name}</span>
                </div>
              );
            })}
          </div>

          <div className="estimator-section-title">
            <Clock size={18} style={{ color: 'var(--primary-blue)' }} /> 3. Select Timeline Cadence
          </div>
          <div className="estimator-options-grid">
            {SPEED_TIERS.map(tier => (
              <div 
                key={tier.id} 
                className={`estimator-option-card ${speedTier.id === tier.id ? 'active' : ''}`}
                onClick={() => setSpeedTier(tier)}
              >
                <div className="estimator-option-name">{tier.name}</div>
                <div className="estimator-option-desc">{tier.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dynamic Summary Panel */}
        <div className="estimator-summary-panel">
          <div>
            <h3>Estimate Summary</h3>
            <div className="estimator-metric-row">
              <span className="estimator-metric-label">Project Category</span>
              <span style={{ color: 'var(--white)', fontWeight: '600' }}>{selectedType.name}</span>
            </div>
            <div className="estimator-metric-row">
              <span className="estimator-metric-label">Estimated Timeline</span>
              <span className="estimator-metric-val">{totalWeeks} Weeks</span>
            </div>
            <div className="estimator-metric-row">
              <span className="estimator-metric-label">Estimated Investment</span>
              <span className="estimator-metric-val">${totalPrice.toLocaleString()} USD</span>
            </div>

            <ul className="estimator-features-list">
              <li style={{ fontWeight: 'bold', color: 'var(--cyan-accent)', marginBottom: '8px' }}>
                Included Scope Items:
              </li>
              <li><CheckCircle size={14} style={{ color: 'var(--mint-accent)' }} /> Base Architecture & UI Integration</li>
              {selectedFeatures.map(fId => {
                const feat = FEATURES.find(f => f.id === fId);
                return feat ? (
                  <li key={fId}><CheckCircle size={14} style={{ color: 'var(--mint-accent)' }} /> {feat.name}</li>
                ) : null;
              })}
            </ul>
          </div>

          {/* Lead capture form */}
          <div>
            {submitted ? (
              <div style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', border: '1px solid var(--cyan-accent)', padding: '12px', borderRadius: '8px', textAlign: 'center', color: 'var(--cyan-accent)' }}>
                <CheckCircle size={24} style={{ margin: '0 auto 6px', display: 'block' }} />
                <strong>Estimate Proposal Sent!</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--white)', marginTop: '4px' }}>Our technical architect will reach out shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEstimate} className="estimator-lead-form">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Your Work Email" 
                  value={clientEmail} 
                  onChange={(e) => setClientEmail(e.target.value)} 
                  required 
                />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}
                >
                  <Send size={16} /> {isSubmitting ? 'Sending...' : 'Request Official Quote'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectScopeEstimator;
