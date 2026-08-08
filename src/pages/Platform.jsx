import SEO from '../components/SEO';
import PlatformEcosystem from '../components/PlatformEcosystem';
import { Link } from 'react-router-dom';

const Platform = () => {
  return (
    <div>
      <SEO
        title="BLUECLOUD Platform Ecosystem — Cloud Architecture, AI & Compiler Platform"
        description="Explore the unified BLUECLOUD platform uniting Flux Language, Aura AI Engine, Prism Studio, and Tool Deck."
        path="/platform"
      />
      <div className="container">
        <PlatformEcosystem />
      </div>

      <section className="section section-dark text-center">
        <div className="container">
          <h2 className="mb-2">Ready to Build on the BLUECLOUD Platform?</h2>
          <p className="mb-4">Explore our developer documentation or schedule an enterprise platform consultation.</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/developers" className="btn-primary" style={{ backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}>
              Developer API Docs
            </Link>
            <Link to="/enterprise" className="btn-secondary" style={{ borderColor: 'var(--cyan-accent)', color: 'var(--cyan-accent)' }}>
              Enterprise Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Platform;
