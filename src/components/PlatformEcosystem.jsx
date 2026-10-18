import { useState } from 'react';
import { Cpu, Terminal, Layout, Wrench, CheckCircle, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './PlatformEcosystem.css';

const PLATFORM_NODES = [
  {
    id: 'flux',
    name: 'Flux Language & Compiler',
    role: 'Core Execution Engine',
    icon: <Terminal size={24} style={{ color: 'var(--cyan-accent)' }} />,
    shortDesc: 'Domain-specific language compiler engineered for high-speed AI logic and deterministic execution.',
    details: 'Flux is BLUECLOUD\'s proprietary programming language built from scratch. It features AST parsing, custom memory management, and dynamic AI token bindings designed to write complex business logic 40% faster than standard scripting languages.',
    link: '/flux-website/index.html'
  },
  {
    id: 'aura',
    name: 'Aura AI Engine',
    role: 'Autonomous Intelligence',
    icon: <Cpu size={24} style={{ color: 'var(--cyan-accent)' }} />,
    shortDesc: 'Enterprise multimodal generative AI pipeline for real-time document analysis, code audit, and chat.',
    details: 'Aura powers BLUECLOUD\'s intelligent automation pipeline using Gemini 3.5 models. It offers structured JSON outputs, zero-data retention security rules, and real-time voice speech synthesis.',
    link: '/ai-solutions'
  },
  {
    id: 'prism',
    name: 'Prism Studio App',
    role: 'Workspace IDE & Editor',
    icon: <Layout size={24} style={{ color: 'var(--cyan-accent)' }} />,
    shortDesc: 'Unified desktop and web workspace integrating code editing, previewing, and asset workflows.',
    details: 'Prism Studio eliminates context-switching for engineering teams by consolidating code creation, live previewing, asset management, and deployment into one desktop environment.',
    link: '/prism-studio/index.html'
  },
  {
    id: 'tooldeck',
    name: 'Tool Deck Developer Suite',
    role: 'Browser Utilities Suite',
    icon: <Wrench size={24} style={{ color: 'var(--cyan-accent)' }} />,
    shortDesc: 'High-performance browser-native developer utilities used by over 10,000 active monthly engineers.',
    details: 'Tool Deck provides instant zero-latency tools including JSON formatters, base64 coders, PDF signers, color pickers, and UUID generators optimized for modern web browsers.',
    link: '/tool-deck/index.html'
  }
];

const BENCHMARKS = [
  {
    category: 'AI Pipeline Execution Speed',
    bluecloud: '< 280ms',
    legacy: '1,200ms',
    unit: 'Avg Latency'
  },
  {
    category: 'System Uptime Guarantee',
    bluecloud: '99.999%',
    legacy: '99.9%',
    unit: 'Annual SLA'
  },
  {
    category: 'Logic Authoring Speed',
    bluecloud: '+ 40%',
    legacy: 'Baseline',
    unit: 'Developer Velocity'
  },
  {
    category: 'Security Compliance Audit',
    bluecloud: 'Zero-Trust SSL',
    legacy: 'Standard CORS',
    unit: 'Rule Auditing'
  }
];

const PlatformEcosystem = () => {
  const [selectedNode, setSelectedNode] = useState(PLATFORM_NODES[0]);

  return (
    <div className="platform-container">
      <div className="platform-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Zap size={18} /> Enterprise Cloud & Software Platform
        </div>
        <h1>The BLUECLOUD Platform Ecosystem</h1>
        <p className="platform-subtitle">
          An integrated technology stack uniting custom compilers, autonomous AI engines, developer workspaces, and high-performance cloud infrastructure.
        </p>
      </div>

      {/* Interactive System Architecture Map */}
      <div className="platform-arch-box">
        <div className="platform-arch-title">
          <h2>System Architecture & Core Platform Pillars</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>Select a platform pillar to inspect technical architecture and capabilities.</p>
        </div>

        <div className="platform-nodes-grid">
          {PLATFORM_NODES.map((node) => (
            <div 
              key={node.id}
              className={`platform-node-card ${selectedNode.id === node.id ? 'active' : ''}`}
              onClick={() => setSelectedNode(node)}
            >
              <div className="platform-node-header">
                {node.icon}
                <div>
                  <div className="platform-node-name">{node.name}</div>
                  <div className="platform-node-role">{node.role}</div>
                </div>
              </div>
              <p className="platform-node-desc">{node.shortDesc}</p>
            </div>
          ))}
        </div>

        {/* Selected Node Details Drawer */}
        <div className="platform-detail-drawer">
          <div className="platform-detail-title">
            <CheckCircle size={18} /> {selectedNode.name} Architecture Specification
          </div>
          <p style={{ color: 'var(--white)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '12px' }}>
            {selectedNode.details}
          </p>
          <a 
            href={selectedNode.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '6px 16px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}
          >
            Launch {selectedNode.name} Module <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Platform Benchmarks */}
      <div className="section container">
        <h2 className="text-center mb-6">Platform Technical Benchmarks</h2>
        <div className="platform-benchmarks-grid">
          {BENCHMARKS.map((bm, i) => (
            <div key={i} className="platform-benchmark-card">
              <h3>{bm.category}</h3>
              <div className="benchmark-row">
                <span className="benchmark-val-legacy">Legacy Stack: {bm.legacy}</span>
                <span className="benchmark-val-bc">BLUECLOUD: {bm.bluecloud}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-text)', marginTop: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                Metric: {bm.unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformEcosystem;
