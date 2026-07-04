import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Projects = () => {
  return (
    <div className="section container">
      <SEO
        title="Our Projects — BlueCloud Technologies Portfolio"
        description="Explore our recent enterprise deployments and technical solutions including Flux Programming Language, Prism Studio, and Tool Deck."
        path="/projects"
      />
      <div className="text-center mb-6">
        <h1>Our Portfolio</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Explore a selection of our recent enterprise deployments and technical solutions.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'center', marginBottom: 'var(--spacing-5)' }}>
        <button className="btn-primary">All</button>
        <button className="btn-secondary">Web</button>
        <button className="btn-secondary">AI</button>
        <button className="btn-secondary">App</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
        
        {/* Project 1 */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--light-gray)' }}>
          <div style={{ height: '200px', backgroundColor: '#0A1A2F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Cyberion Company
          </div>
          <div style={{ padding: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Web</span>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Enterprise</span>
            </div>
            <h3 className="mb-2">cyberioncompany.com.ng</h3>
            <p className="mb-3">Complete enterprise portal and web presence built for scale and security.</p>
            <a href="https://cyberioncompany.com.ng" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Visit Website</a>
          </div>
        </div>

        {/* Project 2 */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--light-gray)' }}>
          <div style={{ height: '200px', backgroundColor: '#0B5FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 'bold' }}>
            FastData
          </div>
          <div style={{ padding: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Web</span>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Data</span>
            </div>
            <h3 className="mb-2">fastdata.com.ng</h3>
            <p className="mb-3">A high-performance data processing and analytics platform engineered for speed.</p>
            <a href="https://fastdata.com.ng" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Visit Website</a>
          </div>
        </div>

        {/* Project 3 */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--light-gray)' }}>
          <img src="/fluxlanguageimage.png" alt="Flux Programming Language" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
          <div style={{ padding: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Language</span>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Tools</span>
            </div>
            <h3 className="mb-2">Flux Programming Language</h3>
            <p className="mb-3">A custom programming language built from the ground up, complete with its own toolchain and compiler ecosystem.</p>
            <a href="/flux-website/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>View Website</a>
          </div>
        </div>

        {/* Project 4 */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--light-gray)' }}>
          <img src="/prism_studio_icon.png" alt="Prism Studio" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
          <div style={{ padding: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>App</span>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Editor</span>
            </div>
            <h3 className="mb-2">Prism Studio</h3>
            <p className="mb-3">A powerful studio application built for seamless developer workflows.</p>
            <a href="/prism-studio/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch App</a>
          </div>
        </div>

        {/* Project 5 */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--light-gray)' }}>
          <img src="/tooldecklogo.png" alt="Tool Deck" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
          <div style={{ padding: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Web</span>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Utility</span>
            </div>
            <h3 className="mb-2">Tool Deck</h3>
            <p className="mb-3">A comprehensive suite of utility tools accessible directly from your browser.</p>
            <a href="/tool-deck/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch App</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Projects;
