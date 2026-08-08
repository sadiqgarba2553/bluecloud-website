import { useState } from 'react';
import { Cpu, ShieldAlert, Truck, HeartPulse, Flame, Play, CheckCircle, Activity } from 'lucide-react';
import './IndustryAIAccelerators.css';

const INDUSTRY_DATA = {
  fintech: {
    title: "FinTech & Banking AI Fraud Engine",
    icon: ShieldAlert,
    description: "Detect anomalous transaction patterns and execute automated compliance audits for credit risk and anti-money laundering (AML).",
    metrics: [
      { label: "Fraud Detection Speed", val: "Sub-45ms" },
      { label: "False Positive Reduction", val: "-76%" },
      { label: "Compliance Benchmark", val: "ISO 27001 Certified" }
    ],
    sampleOutput: {
      auditResult: "NO_ANOMALIES_DETECTED",
      transactionRiskScore: 0.002,
      amlRuleCheck: "PASSED_100%",
      recommendation: "Approved for instant cross-border settlement."
    }
  },
  logistics: {
    title: "Logistics & Fleet Optimization AI",
    icon: Truck,
    description: "Optimize multi-stop vehicle routing, fuel consumption, and predictive maintenance schedules for logistics fleets.",
    metrics: [
      { label: "Fuel Cost Savings", val: "-24% Annual" },
      { label: "Dispatch Accuracy", val: "99.8%" },
      { label: "Fleet Telemetry Delay", val: "< 100ms" }
    ],
    sampleOutput: {
      routeOptimization: "COMPLETED",
      fuelEfficiencyGain: "24.2%",
      estimatedTimeEnRoute: "34 mins (Saved 18 mins)",
      trafficAvoidance: "Rerouted around Zone B congestion"
    }
  },
  healthcare: {
    title: "Healthcare & BioTech EHR Security Guard",
    icon: HeartPulse,
    description: "Encrypt patient health records with zero-trust protocol enforcement and HIPAA-compliant automated audit logging.",
    metrics: [
      { label: "Encryption Grade", val: "AES-256 GCM" },
      { label: "HIPAA Audit Pass Rate", val: "100%" },
      { label: "Access Latency", val: "115ms" }
    ],
    sampleOutput: {
      securityScan: "ZERO_VULNERABILITIES",
      hipaaCompliance: "VERIFIED",
      dataMasking: "Patient PII scrubbed prior to AI analysis",
      accessLogID: "LOG-HC-994812"
    }
  },
  energy: {
    title: "Energy & Oil Assets Monitoring Telemetry",
    icon: Flame,
    description: "Predictive asset maintenance monitoring for energy grids, pipelines, and industrial machinery using sensor AI telemetry.",
    metrics: [
      { label: "Downtime Prevented", val: "-92% Failure Rate" },
      { label: "Sensor Polling", val: "1,000 Hertz" },
      { label: "ROI Payback", val: "under 60 Days" }
    ],
    sampleOutput: {
      pipelineVibrationAudit: "NORMAL_OPERATING_RANGE",
      predictedMaintenanceDate: "142 Days Remaining",
      pressureStability: "1,450 PSI (Optimal)",
      alertLevel: "GREEN_SECURE"
    }
  }
};

const IndustryAIAccelerators = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('fintech');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simOutput, setSimOutput] = useState(null);

  const active = INDUSTRY_DATA[selectedIndustry];
  const IconComp = active.icon;

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimOutput(null);
    setTimeout(() => {
      setSimOutput(JSON.stringify(active.sampleOutput, null, 2));
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="industry-ai-card">
      <div className="industry-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Cpu size={18} /> Vertical Industry AI Solutions
        </div>
        <h2>BLUECLOUD Industry-Specific AI Accelerators</h2>
        <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem' }}>
          Purpose-built artificial intelligence models tuned for high-stakes corporate sectors.
        </p>

        {/* Industry Selector Buttons */}
        <div className="industry-selector-grid">
          {Object.keys(INDUSTRY_DATA).map((key) => {
            const item = INDUSTRY_DATA[key];
            const ItemIcon = item.icon;
            return (
              <button
                key={key}
                className={`ind-select-btn ${selectedIndustry === key ? 'active' : ''}`}
                onClick={() => { setSelectedIndustry(key); setSimOutput(null); }}
              >
                <ItemIcon size={18} /> {item.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="industry-body">
        <div className="ind-grid">
          <div className="ind-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <IconComp size={24} style={{ color: 'var(--primary-blue)' }} />
              <h3 style={{ color: 'var(--deep-navy)', margin: 0, fontSize: '1.25rem' }}>{active.title}</h3>
            </div>
            <p style={{ color: 'var(--slate-text)', fontSize: '0.92rem', marginBottom: 'var(--spacing-4)' }}>
              {active.description}
            </p>

            <button className="btn-primary" onClick={handleSimulate} disabled={isSimulating} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
              <Play size={16} /> {isSimulating ? 'Running AI Diagnostics...' : 'Simulate Industry AI Payload'}
            </button>

            {simOutput && (
              <div className="sim-output-box">
                <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'var(--cyan-accent)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={14} /> Telemetry Output Verified
                </div>
                <pre>{simOutput}</pre>
              </div>
            )}
          </div>

          <div className="ind-metrics-col">
            <h4 style={{ fontSize: '0.9rem', color: 'var(--deep-navy)', marginBottom: '12px', borderBottom: '1px solid var(--light-gray)', paddingBottom: '6px' }}>
              Sector Performance Benchmarks
            </h4>
            {active.metrics.map((m, idx) => (
              <div key={idx} className="ind-metric-card">
                <span>{m.label}</span>
                <strong>{m.val}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryAIAccelerators;
