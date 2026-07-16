import { Download, FileText, ArrowLeft, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './RateCard.css';

const RateCard = () => {
  return (
    <div>
      <SEO
        title="Rate Card — Social Media Management Pricing | BlueCloud Technologies"
        description="View BlueCloud's transparent social media management pricing and packages. Download our rate card PDF to get full details on our creative and management services."
        path="/rate-card"
      />

      {/* Page Header */}
      <div className="rate-card-header">
        <div className="container">
          <Link to="/services#social-media" className="rate-card-back-link">
            <ArrowLeft size={18} /> Back to Services
          </Link>
          <div className="rate-card-header-content">
            <div className="rate-card-icon-badge">
              <FileText size={36} />
            </div>
            <div>
              <h1>BlueCloud Rate Card</h1>
              <p>Transparent pricing for our Social Media Management, Graphics Design &amp; Video Editing services. No surprises — just results.</p>
            </div>
          </div>
          <div className="rate-card-header-actions">
            <a
              href="/BlueCloud_Rate_Card.pdf"
              download="BlueCloud_Rate_Card.pdf"
              className="btn-primary rate-card-dl-btn"
              id="download-rate-card"
            >
              <Download size={18} /> Download PDF
            </a>
            <Link to="/contact" className="btn-secondary rate-card-dl-btn">
              <Phone size={18} /> Get a Custom Quote
            </Link>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="rate-card-viewer-section">
        <div className="container">
          <div className="rate-card-viewer-wrapper">
            <div className="rate-card-viewer-bar">
              <span className="viewer-bar-title">
                <FileText size={16} /> BlueCloud_Rate_Card.pdf
              </span>
              <a
                href="/BlueCloud_Rate_Card.pdf"
                download="BlueCloud_Rate_Card.pdf"
                className="viewer-bar-download"
                id="viewer-download-btn"
              >
                <Download size={16} /> Download
              </a>
            </div>
            <iframe
              src="/BlueCloud_Rate_Card.pdf#toolbar=1&navpanes=0&scrollbar=1"
              className="rate-card-iframe"
              title="BlueCloud Rate Card"
              id="rate-card-pdf-viewer"
            />
          </div>

          {/* Fallback message */}
          <div className="rate-card-fallback">
            <p>
              Having trouble viewing the PDF?{' '}
              <a href="/BlueCloud_Rate_Card.pdf" download="BlueCloud_Rate_Card.pdf">
                Click here to download it directly.
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="section section-dark text-center">
        <div className="container">
          <h2 className="mb-2">Ready to Get Started?</h2>
          <p className="mb-4">Have questions about our packages? We're happy to tailor a plan that fits your exact needs and budget.</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}>
              Contact Us Today
            </Link>
            <a
              href="/BlueCloud_Rate_Card.pdf"
              download="BlueCloud_Rate_Card.pdf"
              className="btn-secondary"
              style={{ borderColor: 'var(--cyan-accent)', color: 'var(--cyan-accent)' }}
            >
              <Download size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Download Rate Card
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RateCard;
