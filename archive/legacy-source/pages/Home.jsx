import { Link } from 'react-router-dom';
import { Monitor, Cpu, Smartphone, Briefcase, Lightbulb, ShieldCheck, Target, Users } from 'lucide-react';
import SEO from '../components/SEO';
import './Home.css';

const Home = () => {
  return (
    <div>
      <SEO
        title="BlueCloud Technologies — Enterprise Web Development, AI Solutions & Software Engineering"
        description="BlueCloud delivers premium web development, AI-powered solutions, and enterprise software engineering. Based in Abuja, Nigeria — serving clients worldwide."
        path="/"
        keywords="BlueCloud Technologies, web development Nigeria, AI solutions Abuja, enterprise software engineering, build website Nigeria, app development Africa, tech company Abuja, software company Nigeria, React developer Nigeria, hire web developer Nigeria"
      />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Engineering the <span>Future</span> of Your Business
            </h1>
            <p className="hero-subtitle">
              BlueCloud delivers premium web development, AI solutions, and enterprise applications built for modern scale and absolute reliability.
            </p>
            <div className="hero-cta-group">
              <Link to="/contact" className="btn-primary">Request a Quote</Link>
              <Link to="/projects" className="btn-secondary">View Our Work</Link>
            </div>
          </div>
        </div>
      </section>

      {/* World Youth Day Announcement Banner */}
      <div className="wyd-home-banner">
        <div className="container">
          <Link to="/blog/world-youth-day-2026" className="wyd-home-inner">
            <div className="wyd-home-logo-wrap">
              <img
                src="/worldsyouthdaylogo.svg"
                alt="World Youth Day 2026 Logo"
                className="wyd-home-logo"
              />
            </div>
            <div className="wyd-home-text">
              <span className="wyd-home-label">Tomorrow · July 15th</span>
              <h3 className="wyd-home-title">World Youth Day 2026</h3>
              <p className="wyd-home-desc">
                BlueCloud marks the day. Read our piece on the global gathering, what it means,
                and why it matters to us.
              </p>
            </div>
            <div className="wyd-home-cta">
              Read Article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Services Overview */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6">
            <h2>Our Core Capabilities</h2>
            <p>Comprehensive technical solutions bridging software engineering and applied AI.</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-wrapper">
                <Monitor size={28} />
              </div>
              <h3>Web Development</h3>
              <p>Scalable, high-performance web applications and corporate sites tailored to your enterprise.</p>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <Cpu size={28} />
              </div>
              <h3>AI Solutions</h3>
              <p>Intelligent automation and integrations that streamline workflows and drive data-backed decisions.</p>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <Smartphone size={28} />
              </div>
              <h3>App Development</h3>
              <p>Cross-platform mobile and desktop applications designed for seamless user experiences.</p>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <Briefcase size={28} />
              </div>
              <h3>Technical Consulting</h3>
              <p>Strategic IT guidance to optimize your architecture, security, and digital transformation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why BlueCloud */}
      <section className="section why-section">
        <div className="container">
          <div className="text-center mb-6">
            <h2>Why Choose BlueCloud</h2>
            <p>The technical depth and reliability modern enterprises require.</p>
          </div>
          <div className="why-grid">
            <div className="why-item">
              <Lightbulb size={32} className="why-icon" />
              <h3>Innovation-First</h3>
              <p>We blend cutting-edge AI capabilities with proven engineering principles to build solutions that outpace the competition.</p>
            </div>
            <div className="why-item">
              <ShieldCheck size={32} className="why-icon" />
              <h3>Unshakable Reliability</h3>
              <p>Our systems are architected for absolute stability, ensuring your business stays online and secure 24/7.</p>
            </div>
            <div className="why-item">
              <Target size={32} className="why-icon" />
              <h3>Technical Precision</h3>
              <p>We write clean, semantic code and build resilient infrastructures that scale flawlessly as you grow.</p>
            </div>
            <div className="why-item">
              <Users size={32} className="why-icon" />
              <h3>Client-Centric</h3>
              <p>We operate as an extension of your team, providing transparent communication and dedicated ongoing support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work Teaser */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6">
            <h2>Featured Work</h2>
            <p>A glimpse into the robust solutions we've deployed.</p>
          </div>
                    <div className="work-grid">
            <div className="work-card">
              <img src="/fluxlanguageimage.png" alt="Flux Programming Language" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">Language</span>
                  <span className="work-tag">Tools</span>
                </div>
                <h3>Flux Programming Language</h3>
                <p className="mb-3">A custom programming language engineered with its own unique toolchain.</p>
                <a href="/flux-website/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>View Website</a>
              </div>
            </div>
            <div className="work-card">
              <img src="/prism_studio_icon.png" alt="Prism Studio" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">App</span>
                  <span className="work-tag">Editor</span>
                </div>
                <h3>Prism Studio</h3>
                <p className="mb-3">A powerful studio application built for seamless developer workflows.</p>
                <a href="/prism-studio/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch App</a>
              </div>
            </div>
            <div className="work-card">
              <img src="/tooldecklogo.png" alt="Tool Deck" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">Web</span>
                  <span className="work-tag">Utility</span>
                </div>
                <h3>Tool Deck</h3>
                <p className="mb-3">A comprehensive suite of utility tools accessible directly from your browser.</p>
                <a href="/tool-deck/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch App</a>
              </div>
            </div>
            <div className="work-card">
              <img src="/quranlylogo.png" alt="Quranly AI & Audio Platform" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">App</span>
                  <span className="work-tag">AI & Audio</span>
                </div>
                <h3>Quranly Platform</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-text)', marginBottom: '1rem' }}>High-fidelity Quran audio streaming, 100+ reciters & AI Tafsir companion.</p>
                <a href="/quranly/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch App</a>
              </div>
            </div>
            <div className="work-card">
              <img src="/tunnel_icon.svg" alt="Tunnel Arcade Platform" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#0B0F1E', padding: '20px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">App</span>
                  <span className="work-tag">Arcade Gaming</span>
                </div>
                <h3>Tunnel Arcade</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-text)', marginBottom: '1rem' }}>Next-gen 80s-90s retro web arcade with 16 vector games, 2P local versus, leaderboards, chiptune sound studio & offline PWA.</p>
                <a href="/tunnel/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch Arcade</a>
              </div>
            </div>
            <div className="work-card">
              <img src="/mods_logo.png" alt="Mods Social Platform" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F4F6F9', padding: '20px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">App</span>
                  <span className="work-tag">Social Media</span>
                </div>
                <h3>Mods App</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-text)', marginBottom: '1rem' }}>Next-gen social platform with real-time video feeds, tiered verification & cross-platform PWA.</p>
                <a href="/mods/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch App</a>
              </div>
            </div>
            <div className="work-card">
              <img src="/cargoledger_logo.svg" alt="CargoLedger Logistics OS" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#F6F6F3', padding: '24px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">Web</span>
                  <span className="work-tag">Logistics ERP</span>
                </div>
                <h3>CargoLedger</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-text)', marginBottom: '1rem' }}>Shipment management OS for freight forwarders with status pipelines, airway bills & tracking.</p>
                <a href="/cargoledger/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch Platform</a>
              </div>
            </div>
            <div className="work-card">
              <img src="/wifi_master_icon.svg" alt="WiFi Master Security Suite" style={{ width: '100%', height: '200px', objectFit: 'contain', backgroundColor: '#070C12', padding: '20px' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">Tools</span>
                  <span className="work-tag">Cybersecurity</span>
                </div>
                <h3>WiFi Master</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--slate-text)', marginBottom: '1rem' }}>Automated wireless penetration testing suite with handshake interception & monitor mode diagnostics.</p>
                <a href="/wifi-master/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Launch Suite</a>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: 'var(--spacing-5)' }}>
            <Link to="/projects" className="btn-secondary">Explore All Projects</Link>
          </div>
        </div>
      </section>

      {/* Engineering Standards & Trust Section */}
      <section className="section stats-section">
        <div className="container">
          <h2>Engineered for Scale & Reliability</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>8+</h3>
              <p>Production Apps & Tools</p>
            </div>
            <div className="stat-item">
              <h3>High-Avail</h3>
              <p>Resilient Architecture</p>
            </div>
            <div className="stat-item">
              <h3>NDPA</h3>
              <p>Data Protection Standard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Commitments (Authentic replacement for fabricated reviews) */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <div className="text-center mb-6">
            <h2>Our Core Engineering Commitments</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto' }}>
              We believe in demonstrable technical delivery, radical transparency, and zero unsupported marketing hype.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-4)' }}>
            <div style={{ background: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Milestone-Based Billing</h3>
              <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem' }}>
                You inspect and approve verifiable deliverables before payments are released. No opaque retainers or surprise fees.
              </p>
            </div>
            <div style={{ background: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Zero Vendor Lock-In</h3>
              <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem' }}>
                Full ownership of custom code, documentation, and cloud configurations is transferred directly to your organization.
              </p>
            </div>
            <div style={{ background: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Security by Design</h3>
              <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem' }}>
                Zero-trust authentication, TLS 256-bit encryption, and NDPA/GDPR compliance baked in from sprint zero.
              </p>
            </div>
            <div style={{ background: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Direct Lead Engineer Access</h3>
              <p style={{ color: 'var(--slate-text)', fontSize: '0.95rem' }}>
                Collaborate directly with our senior software architects in Abuja without middlemen or outsourced layers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Ahead of the Curve</h2>
            <p>Get technical deep-dives on AI, Web Engineering, and Enterprise Tech delivered straight to your inbox.</p>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing! You will receive our next engineering briefing.'); }}>
              <input 
                type="email" 
                placeholder="Enter your work email" 
                className="newsletter-input" 
                aria-label="Work email address for engineering briefing"
                required 
              />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe to briefing">
                Subscribe
              </button>
            </form>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '10px' }}>
              We respect your inbox. Unsubscribe anytime in accordance with our <Link to="/privacy" style={{ color: 'var(--cyan-accent)' }}>Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="container">
        <div className="cta-banner">
          <h2>Ready to Transform Your Digital Infrastructure?</h2>
          <p className="mb-4">Partner with BlueCloud to build scalable, AI-powered solutions.</p>
          <Link to="/contact" className="btn-primary">Start a Conversation</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;



