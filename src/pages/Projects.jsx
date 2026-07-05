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
            <div className="case-study-details" style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--slate-text)' }}><p style={{marginBottom: '0.25rem'}}><strong>The Problem:</strong> They needed a secure, highly scalable portal to manage enterprise operations.</p><p style={{marginBottom: '0.25rem'}}><strong>Our Solution:</strong> We architected a custom web platform with robust backend security protocols and a seamless frontend.</p><p style={{marginBottom: '0.25rem'}}><strong>The Impact:</strong> 100% uptime since launch and 2x faster data retrieval times.</p></div>
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
            <div className="case-study-details" style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--slate-text)' }}><p style={{marginBottom: '0.25rem'}}><strong>The Problem:</strong> Analyzing large datasets was taking hours and crashing legacy servers.</p><p style={{marginBottom: '0.25rem'}}><strong>Our Solution:</strong> We built a high-performance data processing pipeline optimized for speed.</p><p style={{marginBottom: '0.25rem'}}><strong>The Impact:</strong> Processing time reduced from 4 hours to 15 minutes.</p></div>
            <a href="https://fastdata.com.ng" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Visit Website</a>
          </div>
        </div>

        {/* Project 3 */}
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--light-gray)' }}>
          <img src="/fluxlanguageimage.png" alt="Flux Programming Language" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
          <div style={{ padding: 'var(--spacing-3)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Language</span>
              <span style={{ backgroundColor: 'var(--mint-accent)', color: 'var(--deep-navy)', fontSize: '0.75rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' }}>Tools</span>
            </div>
            <h3 className="mb-2">Flux Programming Language</h3>
            <div className="case-study-details" style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--slate-text)' }}><p style={{marginBottom: '0.25rem'}}><strong>The Problem:</strong> Existing languages lacked specific syntactical features for a niche workflow.</p><p style={{marginBottom: '0.25rem'}}><strong>Our Solution:</strong> We engineered a custom compiler, toolchain, and language ecosystem from scratch.</p><p style={{marginBottom: '0.25rem'}}><strong>The Impact:</strong> Allowed developers to write highly specific business logic 40% faster.</p></div>
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
            <div className="case-study-details" style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--slate-text)' }}><p style={{marginBottom: '0.25rem'}}><strong>The Problem:</strong> Developers were switching between 5 different apps to complete basic workflows.</p><p style={{marginBottom: '0.25rem'}}><strong>Our Solution:</strong> We created a unified, powerful studio application that integrates all necessary tools.</p><p style={{marginBottom: '0.25rem'}}><strong>The Impact:</strong> Increased developer productivity by over 30%.</p></div>
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
            <div className="case-study-details" style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--slate-text)' }}><p style={{marginBottom: '0.25rem'}}><strong>The Problem:</strong> No central hub existed for quick, browser-based developer utilities.</p><p style={{marginBottom: '0.25rem'}}><strong>Our Solution:</strong> We built a sleek, fast-loading suite of essential utilities.</p><p style={{marginBottom: '0.25rem'}}><strong>The Impact:</strong> Over 10,000 monthly active users rely on the tool deck daily.</p></div>
            <a href="/tool-deck/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch App</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Projects;
