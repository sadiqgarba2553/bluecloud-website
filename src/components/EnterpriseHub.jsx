import { useState } from 'react';
import { ShieldCheck, Server, Lock, Award, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import './EnterpriseHub.css';

const DEPLOYMENT_TIERS = [
  {
    name: 'Managed Multi-Tenant Cloud',
    bestFor: 'Growing tech startups & digital apps',
    isolation: 'Logical Namespace Isolation',
    sla: '99.9% Uptime SLA',
    support: '24/7 Priority Email & Chat'
  },
  {
    name: 'Dedicated Private Instance',
    bestFor: 'Financial platforms & health tech',
    isolation: 'Dedicated Virtual Private Cloud (VPC)',
    sla: '99.99% Uptime SLA',
    support: 'Dedicated Technical Account Manager'
  },
  {
    name: 'Air-Gapped On-Premises',
    bestFor: 'Government & defence operations',
    isolation: 'Complete Physical Air-Gap',
    sla: '99.999% SLA Guaranteed',
    support: 'On-site Engineering Support'
  }
];

const EnterpriseHub = () => {
  const [usersCount, setUsersCount] = useState(500);
  
  // Savings calculations
  const legacyCost = usersCount * 18;
  const bluecloudCost = Math.round(usersCount * 8.5);
  const annualSavings = (legacyCost - bluecloudCost) * 12;

  return (
    <div className="ent-hub-container">
      <div className="ent-hub-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <ShieldCheck size={18} /> Mission-Critical Infrastructure & SLAs
        </div>
        <h1>BLUECLOUD Enterprise Solutions</h1>
        <p style={{ color: 'var(--slate-text)', maxWidth: '650px', margin: '0 auto', fontSize: '1.1rem' }}>
          Zero-Trust security, 99.999% SLA availability guarantees, and high-performance cloud architecture for global enterprises.
        </p>
      </div>

      {/* SLA Banner */}
      <div className="ent-sla-banner">
        <div className="ent-sla-number">99.999%</div>
        <h2 style={{ color: 'var(--white)', fontSize: '1.5rem', marginBottom: '8px' }}>Guaranteed System Availability SLA</h2>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
          Backed by financial credits, active-active multi-region failover, and continuous zero-downtime microservice deployments.
        </p>
      </div>

      {/* Deployment Tier Matrix */}
      <div className="section container" style={{ padding: '0 0 var(--spacing-6)' }}>
        <h2 className="text-center mb-6">Deployment Options & Infrastructure Control</h2>
        <div className="ent-matrix-grid">
          {DEPLOYMENT_TIERS.map((tier, idx) => (
            <div key={idx} className="ent-matrix-card">
              <h3>{tier.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-text)', marginBottom: '12px' }}><strong>Ideal For:</strong> {tier.bestFor}</p>
              
              <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--deep-navy)', marginBottom: '16px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--primary-blue)' }} /> {tier.isolation}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--primary-blue)' }} /> {tier.sla}
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} style={{ color: 'var(--primary-blue)' }} /> {tier.support}
                </li>
              </ul>
              
              <Link to="/contact" className="btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'inline-block', fontSize: '0.85rem' }}>
                Request Architecture Brief
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise ROI Simulator */}
      <div className="ent-sim-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            <DollarSign size={18} /> Financial Simulator
          </div>
          <h2>Enterprise Cost & ROI Calculator</h2>
          <p style={{ color: 'var(--slate-text)', fontSize: '0.9rem' }}>Estimate annual infrastructure cost reduction when migrating to BLUECLOUD.</p>
        </div>

        <div className="ent-sim-grid">
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', color: 'var(--deep-navy)', marginBottom: '8px' }}>
              Active Platform Seat Count: <span style={{ color: 'var(--primary-blue)' }}>{usersCount} Users</span>
            </label>
            <input 
              type="range" 
              min="50" 
              max="5000" 
              step="50"
              value={usersCount}
              onChange={(e) => setUsersCount(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-text)', marginTop: '4px' }}>
              <span>50 Users</span>
              <span>5,000 Users</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--deep-navy)', color: 'var(--white)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-3)' }}>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '4px' }}>Estimated Annual Savings</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--cyan-accent)' }}>
              ${annualSavings.toLocaleString()} USD
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--white)', marginTop: '4px' }}>
              Based on reduced infrastructure overhead, automated AI pipeline caching, and consolidated developer workflows.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseHub;
