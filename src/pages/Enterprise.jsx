import SEO from '../components/SEO';
import EnterpriseHub from '../components/EnterpriseHub';
import EnterpriseERPSuite from '../components/EnterpriseERPSuite';
import CorporateProposalEngine from '../components/CorporateProposalEngine';
import { Link } from 'react-router-dom';

const Enterprise = () => {
  return (
    <div>
      <SEO
        title="Enterprise Infrastructure & Business Systems — BLUECLOUD"
        description="Cloud architecture, security planning, business systems and project proposals from BlueCloud."
        path="/enterprise"
        keywords="enterprise software Nigeria, SLA guarantee, Zero-Trust security, cloud infrastructure Abuja, enterprise solutions Africa, high availability, BlueCloud enterprise"
      />
      <div className="container">
        <EnterpriseHub />
        <EnterpriseERPSuite />
        <CorporateProposalEngine />
      </div>

      <section className="section section-dark text-center" style={{ marginTop: 'var(--spacing-6)' }}>
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

