import { useState } from 'react';
import { Layers, Code, Database, Cpu, Shield, Server } from 'lucide-react';
import './TechStackExplorer.css';

const TECH_DATA = [
  // Frontend
  { id: 1, name: 'React 19 & Vite', category: 'Frontend', level: '100%', desc: 'Ultra-fast SPA frameworks, concurrent rendering, and dynamic components.' },
  { id: 2, name: 'JavaScript & HTML5', category: 'Frontend', level: '100%', desc: 'Clean semantic structure, DOM optimization, and modern ESNext logic.' },
  { id: 3, name: 'Vanilla CSS Design', category: 'Frontend', level: '100%', desc: 'Custom CSS tokens, responsive layouts, glassmorphism, and dark/light modes.' },
  
  // Backend & DB
  { id: 4, name: 'Firebase & Firestore', category: 'Backend & DB', level: '95%', desc: 'Real-time NoSQL databases, Firebase Auth, Security Rules, and App Hosting.' },
  { id: 5, name: 'Node.js & Express', category: 'Backend & DB', level: '90%', desc: 'High-throughput microservices, REST APIs, and WebSockets.' },
  { id: 6, name: 'PostgreSQL & SQL Connect', category: 'Backend & DB', level: '88%', desc: 'Relational data modeling, ACID compliance, and Data Connect pipelines.' },
  
  // AI & Data
  { id: 7, name: 'Google Gemini API', category: 'AI & Data', level: '95%', desc: 'Multimodal generative AI, text/code analysis, and custom prompt engineering.' },
  { id: 8, name: 'Python ML Stack', category: 'AI & Data', level: '85%', desc: 'Natural language processing, data analysis pipelines, and predictive algorithms.' },
  
  // Cloud & Security
  { id: 9, name: 'Cloud Security & SSL', category: 'Cloud & Security', level: '95%', desc: 'Enterprise encryption, OAuth 2.0, CORS management, and security rule audits.' },
  { id: 10, name: 'CI/CD & App Hosting', category: 'Cloud & Security', level: '90%', desc: 'Automated build pipelines, continuous integration, and edge delivery.' }
];

const TechStackExplorer = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Frontend', 'Backend & DB', 'AI & Data', 'Cloud & Security'];

  const filteredTech = activeCategory === 'All' 
    ? TECH_DATA 
    : TECH_DATA.filter(t => t.category === activeCategory);

  return (
    <div className="tech-explorer-container">
      <div className="tech-explorer-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Layers size={18} /> Enterprise Tech Stack
        </div>
        <h2>Technologies & Engineering Capabilities</h2>
        <p style={{ color: 'var(--slate-text)', maxWidth: '600px', margin: '0 auto' }}>
          The battle-tested technologies and architecture frameworks powering BLUECLOUD solutions.
        </p>
      </div>

      <div className="tech-filter-tabs">
        {categories.map((cat) => (
          <button 
            key={cat}
            className={activeCategory === cat ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setActiveCategory(cat)}
            style={{ padding: '6px 16px', fontSize: '0.85rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="tech-grid">
        {filteredTech.map((tech) => (
          <div key={tech.id} className="tech-card">
            <div className="tech-card-header">
              <span className="tech-card-name">{tech.name}</span>
              <span className="tech-card-badge">{tech.category}</span>
            </div>
            <div className="tech-card-desc">{tech.desc}</div>
            <div className="tech-progress-bar">
              <div className="tech-progress-fill" style={{ width: tech.level }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackExplorer;
