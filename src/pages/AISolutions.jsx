import { Link } from 'react-router-dom';
import { Cpu, Zap, Database } from 'lucide-react';
import SEO from '../components/SEO';

const AISolutions = () => {
  return (
    <div>
      <SEO
        title="AI Solutions — Machine Learning & Automation | BlueCloud Technologies"
        description="Integrate cutting-edge AI models, machine learning, and automation into your business processes with BlueCloud Technologies."
        path="/ai-solutions"
      />
      <div style={{ backgroundColor: 'var(--deep-navy)', color: 'var(--white)', padding: 'var(--spacing-8) 0', textAlign: 'center' }}>
        <div className="container">
          <Cpu size={64} style={{ color: 'var(--cyan-accent)', margin: '0 auto var(--spacing-3)' }} />
          <h1 style={{ color: 'var(--white)' }}>AI Solutions & Automation</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', color: '#94A3B8' }}>
            Harness the power of machine learning and intelligent automation to scale your business operations efficiently.
          </p>
        </div>
      </div>

      <div className="section container">
        <h2 className="text-center mb-6">Our AI Capabilities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-5)' }}>
          <div style={{ backgroundColor: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
            <Zap size={32} style={{ color: 'var(--primary-blue)', marginBottom: 'var(--spacing-2)' }} />
            <h3>Intelligent Automation</h3>
            <p>We build systems that automate repetitive, high-volume tasks, freeing your team to focus on strategic initiatives.</p>
          </div>
          <div style={{ backgroundColor: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
            <Database size={32} style={{ color: 'var(--primary-blue)', marginBottom: 'var(--spacing-2)' }} />
            <h3>Predictive Analytics</h3>
            <p>Leverage your historical data to forecast trends, optimize inventory, and make data-driven decisions with confidence.</p>
          </div>
          <div style={{ backgroundColor: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
            <Cpu size={32} style={{ color: 'var(--primary-blue)', marginBottom: 'var(--spacing-2)' }} />
            <h3>Custom ML Models</h3>
            <p>From Natural Language Processing to computer vision, we train and deploy models specific to your industry needs.</p>
          </div>
        </div>
      </div>

      <div className="section section-light text-center">
        <div className="container">
          <h2 className="mb-3">Ready to integrate AI into your workflow?</h2>
          <p className="mb-4">Contact our technical team to discuss a custom AI solution for your enterprise.</p>
          <Link to="/contact" className="btn-primary">Discuss Your Project</Link>
        </div>
      </div>
    </div>
  );
};

export default AISolutions;
