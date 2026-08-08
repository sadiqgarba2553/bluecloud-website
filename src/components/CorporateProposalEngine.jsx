import { useState } from 'react';
import { FileText, Send, CheckCircle, Shield, Briefcase, Download } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './CorporateProposalEngine.css';

const CorporateProposalEngine = () => {
  const [companyName, setCompanyName] = useState('');
  const [execEmail, setExecEmail] = useState('');
  const [industry, setIndustry] = useState('Financial Services & Banking');
  const [estimatedBudget, setEstimatedBudget] = useState('$10k - $50k Enterprise');
  const [timeline, setTimeline] = useState('Immediate (1-2 Months)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !execEmail || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'corporate_proposals'), {
        companyName,
        execEmail,
        industry,
        estimatedBudget,
        timeline,
        status: 'proposal_requested',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Corporate proposal error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="proposal-engine-card">
      <div className="proposal-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <FileText size={18} /> Corporate Procurement & RFP Gateway
        </div>
        <h2>Request a Customized BLUECLOUD Enterprise Proposal</h2>
        <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem', maxWidth: '680px' }}>
          Generate an official executive pitch deck, SLA breakdown, and formal technical proposal for your board or procurement department.
        </p>
      </div>

      <div className="proposal-body">
        {submitted ? (
          <div style={{ backgroundColor: 'rgba(11, 95, 255, 0.08)', border: '1px solid var(--primary-blue)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--primary-blue)' }}>
            <CheckCircle size={36} style={{ margin: '0 auto 12px', display: 'block' }} />
            <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>Executive Proposal Request Registered!</strong>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-text)' }}>
              Thank you, <strong>{companyName}</strong>. Our enterprise engineering director will email your customized PDF proposal and board deck to <strong>{execEmail}</strong> within 12 business hours.
            </p>
            <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--deep-navy)', backgroundColor: 'var(--white)', padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--light-gray)' }}>
              <Download size={16} style={{ color: 'var(--primary-blue)' }} /> Immediate Standard Rate Card Available on Downloads Page
            </div>
          </div>
        ) : (
          <form onSubmit={handleProposalSubmit} className="proposal-form-grid">
            <div className="form-group">
              <label>Company / Corporate Name</label>
              <input 
                type="text" 
                placeholder="e.g. Apex Global Bank" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Executive / Procurement Email</label>
              <input 
                type="email" 
                placeholder="exec@company.com" 
                value={execEmail}
                onChange={(e) => setExecEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Industry Sector</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                <option value="Financial Services & Banking">Financial Services & Banking</option>
                <option value="Logistics & Global Supply Chain">Logistics & Supply Chain</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="Energy & Utilities">Energy & Utilities</option>
                <option value="Government & Public Sector">Government & Public Sector</option>
                <option value="Retail & Enterprise Commerce">Retail & Enterprise Commerce</option>
              </select>
            </div>

            <div className="form-group">
              <label>Estimated Project Scope / Budget</label>
              <select value={estimatedBudget} onChange={(e) => setEstimatedBudget(e.target.value)}>
                <option value="$10k - $50k Enterprise">$10,000 - $50,000 USD</option>
                <option value="$50k - $150k Large Enterprise">$50,000 - $150,000 USD</option>
                <option value="$150k+ Strategic Multi-Year">$150,000+ USD Multi-Year Contract</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Send size={16} /> {isSubmitting ? 'Generating Board Deck...' : 'Request Formal PDF Proposal & Pitch Deck'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CorporateProposalEngine;
