import SEO from '../components/SEO';
import EnterpriseHub from '../components/EnterpriseHub';
import { Link } from 'react-router-dom';

const Enterprise = () => {
  return (
    <div>
      <SEO
        title="Enterprise Infrastructure & 99.999% SLA — BLUECLOUD"
        description="Zero-Trust cloud security, 99.999% SLA availability guarantees, and high-performance cloud architecture for global enterprises."
        path="/enterprise"
      />
      <div className="container">
        <EnterpriseHub />
      </div>

      <section className="section section-dark text-center">
        <div className="container">
          <h2 className="mb-2">Ready to Execute an Enterprise Migration?</h2>
          <p className="mb-4">Speak directly with our enterprise security & cloud architects today.</p>
          <Link to="/contact" className="btn-primary" style={{ backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}>
            Schedule Enterprise Briefing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Enterprise;
