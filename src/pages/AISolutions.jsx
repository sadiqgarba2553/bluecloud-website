import { Link } from 'react-router-dom';
import { Cpu, Zap, Database } from 'lucide-react';
import SEO from '../components/SEO';
import AIPlayground from '../components/AIPlayground';
import IndustryAIAccelerators from '../components/IndustryAIAccelerators';

const AISolutions = () => {
  return (
    <div>
      <SEO
        title="AI Solutions — Machine Learning & Automation | BlueCloud Technologies"
        description="Integrate cutting-edge AI models, machine learning, and automation into your business processes with BlueCloud Technologies."
        path="/ai-solutions"
        keywords="AI solutions Nigeria, machine learning Abuja, automation services, AI chatbot development, predictive analytics, custom ML models, artificial intelligence company Nigeria, BlueCloud AI"
      />
      <header className="page-hero container"><p className="eyebrow">Applied AI</p><h1>A useful role for AI.</h1><p className="lead">Connect models to a specific task. Explore document processing, workflow automation and analysis, with requirements and data handling considered from the start.</p><div className="hero-actions"><a className="button" href="#playground">Try the playground →</a><Link className="text-link" to="/contact">Discuss an integration →</Link></div></header>
      <div className="section container">
        <h2 className="text-center mb-6">Our AI Capabilities</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--spacing-5)' }}>
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

        {/* Industry AI Accelerators */}
        <IndustryAIAccelerators />

        {/* Live AI Playground */}
        <div id="playground"><AIPlayground /></div>
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


