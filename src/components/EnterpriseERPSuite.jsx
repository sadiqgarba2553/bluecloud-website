import { useState } from 'react';
import { Layers, Users, DollarSign, Package, CheckCircle, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import './EnterpriseERPSuite.css';

const EnterpriseERPSuite = () => {
  const [activeTab, setActiveTab] = useState('workforce');

  return (
    <div className="erp-suite-card">
      <div className="erp-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Layers size={18} /> Integrated Operations Infrastructure
        </div>
        <h2>BLUECLOUD Enterprise ERP & CRM Suite</h2>
        <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem' }}>
          Unify corporate workforce management, automated financial ledgers, and supply chain telemetry in a single real-time cloud engine.
        </p>

        {/* Tab Navigation */}
        <div className="erp-tabs">
          <button 
            className={`erp-tab-btn ${activeTab === 'workforce' ? 'active' : ''}`}
            onClick={() => setActiveTab('workforce')}
          >
            <Users size={16} /> Workforce & HR Operations
          </button>
          <button 
            className={`erp-tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            <DollarSign size={16} /> Automated Financial Ledger
          </button>
          <button 
            className={`erp-tab-btn ${activeTab === 'supply' ? 'active' : ''}`}
            onClick={() => setActiveTab('supply')}
          >
            <Package size={16} /> Supply Chain Telemetry
          </button>
        </div>
      </div>

      <div className="erp-body">
        {activeTab === 'workforce' && (
          <div className="erp-tab-content">
            <div className="erp-grid">
              <div className="erp-info-box">
                <h3>Global Workforce Dispatch & HR Sync</h3>
                <p>Manage multi-location teams, automated payroll calculations, and role-based access control (RBAC) with sub-second synchronization across all corporate branches.</p>
                
                <ul className="erp-feature-list">
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Real-time employee attendance & location verification</li>
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Automated payroll generation & direct bank transfer APIs</li>
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Comprehensive KPI performance dashboards</li>
                </ul>
              </div>

              <div className="erp-metrics-box">
                <div className="metric-row">
                  <span>Active Corporate Users</span>
                  <strong>14,280 Employees</strong>
                </div>
                <div className="metric-row">
                  <span>Payroll Processing Time</span>
                  <strong style={{ color: 'var(--primary-blue)' }}>Reduced from 4 days to 3 mins</strong>
                </div>
                <div className="metric-row">
                  <span>RBAC Security Policy</span>
                  <strong>Strict 2FA + Zero-Trust</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="erp-tab-content">
            <div className="erp-grid">
              <div className="erp-info-box">
                <h3>Automated Invoicing & Revenue Analytics</h3>
                <p>Eliminate manual accounting bottlenecks with AI-driven tax calculations, multi-currency invoicing, and real-time revenue forecast telemetry.</p>
                
                <ul className="erp-feature-list">
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Automated PDF invoice generation & email dispatch</li>
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Multi-currency conversion & bank reconciliation</li>
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Continuous financial audit logs for corporate tax compliance</li>
                </ul>
              </div>

              <div className="erp-metrics-box">
                <div className="metric-row">
                  <span>Monthly Transactions Processed</span>
                  <strong>$42.8M USD</strong>
                </div>
                <div className="metric-row">
                  <span>Reconciliation Accuracy</span>
                  <strong style={{ color: 'var(--primary-blue)' }}>99.998%</strong>
                </div>
                <div className="metric-row">
                  <span>Audit Readiness</span>
                  <strong>Instant ISO Compliance</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'supply' && (
          <div className="erp-tab-content">
            <div className="erp-grid">
              <div className="erp-info-box">
                <h3>Real-Time Inventory & Supply Chain Telemetry</h3>
                <p>Track warehouse stock, raw material dispatches, and fleet logistics with automated reorder thresholds and predictive demand forecasting.</p>
                
                <ul className="erp-feature-list">
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Barcode & RFID warehouse inventory tracking</li>
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Automated low-stock procurement alerts</li>
                  <li><CheckCircle size={16} style={{ color: 'var(--primary-blue)' }} /> Fleet route optimization & ETA tracking</li>
                </ul>
              </div>

              <div className="erp-metrics-box">
                <div className="metric-row">
                  <span>Warehouse Nodes Monitored</span>
                  <strong>18 Global Hubs</strong>
                </div>
                <div className="metric-row">
                  <span>Stockout Reduction</span>
                  <strong style={{ color: 'var(--primary-blue)' }}>-88% Stockouts</strong>
                </div>
                <div className="metric-row">
                  <span>Dispatch Latency</span>
                  <strong>Sub-15 Minute Order Fulfillment</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseERPSuite;
