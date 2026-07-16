import { Download, FileText, ArrowLeft, Phone, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './RateCard.css';

const RateCard = () => {
  const highlights = [
    'Starter, Growth & Enterprise packages available',
    'Platform management: Instagram, X, LinkedIn, Facebook & TikTok',
    'Content creation, scheduling & community management',
    'Monthly performance reports & analytics',
    'Paid social advertising add-ons available',
    'Flexible monthly retainer or project-based pricing',
  ];

  return (
    <div>
      <SEO
        title="Social Media Rate Card | BlueCloud Technologies"
        description="Download BlueCloud's Social Media Management rate card. Transparent, flexible pricing packages for businesses of all sizes."
        path="/rate-card"
      />

      {/* Page Header */}
      <div className="rate-card-header">
        <div className="container">
          <Link to="/services#social-media" className="rate-card-back-link">
            <ArrowLeft size={18} /> Back to Services
          </Link>

          <div className="rate-card-hero">
            <div className="rate-card-hero-left">
              <div className="rate-card-badge">
                <Star size={14} /> Social Media Management
              </div>
              <h1>Our Rate Card</h1>
              <p>
                Transparent, flexible pricing for businesses ready to grow their online presence.
                Download our rate card to explore our packages and find the right fit for you.
              </p>

              <div className="rate-card-actions">
                <a
                  href="/BlueCloud_Rate_Card.pdf"
                  download="BlueCloud_Rate_Card.pdf"
                  className="btn-primary rate-card-dl-btn"
                  id="download-rate-card-btn"
                >
                  <Download size={18} /> Download Rate Card PDF
                </a>
                <Link to="/contact" className="btn-secondary rate-card-dl-btn">
                  <Phone size={18} /> Request a Custom Quote
                </Link>
              </div>
            </div>

            <div className="rate-card-hero-right">
              <div className="rate-card-doc-preview">
                <div className="doc-preview-header">
                  <FileText size={28} />
                  <div>
                    <span className="doc-preview-name">BlueCloud_Rate_Card.pdf</span>
                    <span className="doc-preview-type">Social Media Management</span>
                  </div>
                </div>
                <div className="doc-preview-divider" />
                <ul className="doc-preview-highlights">
                  {highlights.map((item, i) => (
                    <li key={i}>
                      <CheckCircle size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/BlueCloud_Rate_Card.pdf"
                  download="BlueCloud_Rate_Card.pdf"
                  className="doc-preview-download"
                  id="doc-preview-download-btn"
                >
                  <Download size={16} /> Download Full Rate Card
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="section section-dark text-center">
        <div className="container">
          <h2 className="mb-2">Not Sure Which Package Fits?</h2>
          <p className="mb-4">
            Let's talk. We'll recommend the best plan based on your goals, audience size, and budget.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}>
              Book a Free Consultation
            </Link>
            <a
              href="/BlueCloud_Rate_Card.pdf"
              download="BlueCloud_Rate_Card.pdf"
              className="btn-secondary"
              style={{ borderColor: 'var(--cyan-accent)', color: 'var(--cyan-accent)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} /> Download Rate Card
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RateCard;
