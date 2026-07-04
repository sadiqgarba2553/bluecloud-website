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
              <img src="/fluxlanguageimage.png" alt="Flux Programming Language" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div className="work-content">
                <div className="work-tags">
                  <span className="work-tag">Language</span>
                  <span className="work-tag">Tools</span>
                </div>
                <h3>Flux Programming Language</h3>
                <p className="mb-3">A custom programming language engineered with its own unique toolchain.</p>
                <a href="/flux-website/index.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>View Website</a></div>
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
          </div>
          <div className="text-center" style={{ marginTop: 'var(--spacing-5)' }}>
            <Link to="/projects" className="btn-secondary">Explore All Projects</Link>
          </div>
        </div>
      </section>

      {/* Client Trust Section */}
      <section className="section stats-section">
        <div className="container">
          <h2>Trusted by Forward-Thinking Teams</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50+</h3>
              <p>Projects Delivered</p>
            </div>
            <div className="stat-item">
              <h3>99%</h3>
              <p>Uptime Guarantee</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Client Support</p>
            </div>
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
