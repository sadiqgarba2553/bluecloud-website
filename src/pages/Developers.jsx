import SEO from '../components/SEO';
import DeveloperPortal from '../components/DeveloperPortal';
import { Link } from 'react-router-dom';

const Developers = () => {
  return (
    <div>
      <SEO
        title="Developer Portal & API Documentation Hub — BLUECLOUD"
        description="Access BLUECLOUD API reference, SDK snippets in JS/Python/Flux, and sandbox API key access."
        path="/developers"
        keywords="BlueCloud API, developer portal, API documentation, SDK integration, developer tools Nigeria, API access Abuja, BlueCloud developers"
      />
      <div className="container">
        <DeveloperPortal />
      </div>

      <section className="section section-light text-center">
        <div className="container">
          <h2 className="mb-2">Planning a business system?</h2>
          <p className="mb-4">Discuss cloud architecture, business systems and deployment requirements.</p>
          <Link to="/enterprise" className="btn-primary">
            Explore Enterprise Solutions
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Developers;
