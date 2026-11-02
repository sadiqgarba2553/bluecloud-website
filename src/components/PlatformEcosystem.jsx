import { useState } from 'react';
import { Cpu, Terminal, Layout, Wrench, CheckCircle, Zap, ArrowRight } from 'lucide-react';

import './PlatformEcosystem.css';

const PLATFORM_NODES = [
  {
    id: 'flux',
    name: 'Flux Language & Compiler',
    role: 'Core Execution Engine',
    icon: <Terminal size={24} style={{ color: 'var(--cyan-accent)' }} />,
    shortDesc: 'Domain-specific language compiler engineered for high-speed AI logic and deterministic execution.',
    details: 'Flux is BLUECLOUD\'s programming language project. It features AST parsing, custom memory management, and dynamic AI token bindings for experimenting with domain-specific business logic.',
    link: '/flux-website/index.html'
  },
  {
    id: 'aura',
    name: 'Aura AI Engine',
    role: 'Autonomous Intelligence',
    icon: <Cpu size={24} style={{ color: 'var(--cyan-accent)' }} />,
    shortDesc: 'Enterprise multimodal generative AI pipeline for real-time document analysis, code audit, and chat.',
    details: 'Aura powers BLUECLOUD\'s intelligent automation pipeline using Gemini 3.5 models. It offers structured JSON outputs, project-specific data handling, and real-time voice speech synthesis.',
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
    shortDesc: 'Browser utilities for formatting data and common file tasks.',
    details: 'Tool Deck provides instant local utilities including JSON formatters, base64 coders, PDF signers, color pickers, and UUID generators optimized for modern web browsers.',
    link: '/tool-deck/index.html'
  }
];

const BENCHMARKS = [
  { category: 'Language tooling', description: 'Explore Flux syntax, its compiler and language tools.' },
  { category: 'AI workflows', description: 'Discuss model integration, document processing and assistants.' },
  { category: 'Developer workspace', description: 'Explore editing, preview and asset workflows in Prism Studio.' },
  { category: 'Local utilities', description: 'Use the browser toolkit or download Tooldeck for Windows.' }
];

const PlatformEcosystem = () => {
  const [selectedNode, setSelectedNode] = useState(PLATFORM_NODES[0]);

  return (
    <div className="platform-container">
      <div className="platform-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Zap size={18} /> Enterprise Cloud & Software Platform
        </div>
        <h1>The BlueCloud platform</h1>
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
              role="button" tabIndex={0} aria-pressed={selectedNode.id === node.id}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedNode(node); } }}
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
        <h2 className="text-center mb-6">Platform capabilities</h2>
        <div className="platform-benchmarks-grid">
          {BENCHMARKS.map((bm, i) => (
            <div key={i} className="platform-benchmark-card">
              <h3>{bm.category}</h3>
              <p>{bm.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformEcosystem;
