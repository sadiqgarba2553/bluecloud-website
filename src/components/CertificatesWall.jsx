import { useState } from 'react';
import { Award, ZoomIn, Calendar, X, CheckCircle } from 'lucide-react';
import './CertificatesWall.css';

const CERTIFICATES = [
  {
    id: 1,
    title: 'Critical Thinking in the AI Era',
    issuer: 'HP LIFE / HP Foundation',
    date: 'Jan 29, 2026',
    imgSrc: '/port/IMG_3227.jpg',
    credentialId: 'HP-LIFE-AI-2026'
  },
  {
    id: 2,
    title: 'Professional Networking for Career Growth',
    issuer: 'HP LIFE / HP Foundation',
    date: 'Jan 29, 2026',
    imgSrc: '/port/IMG_3226.jpg',
    credentialId: 'HP-LIFE-NET-2026'
  }
];

const CertificatesWall = () => {
  const [activeImg, setActiveImg] = useState(null);

  return (
    <div className="certs-wall-container">
      <div className="certs-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <Award size={18} /> Verified Credentials
        </div>
        <h2>Certifications & Technical Accreditations</h2>
        <p style={{ color: 'var(--slate-text)', maxWidth: '600px', margin: '0 auto' }}>
          Official qualifications, professional certifications, and technical standards attained by BLUECLOUD leadership.
        </p>
      </div>

      <div className="certs-grid">
        {CERTIFICATES.map((cert) => (
          <div key={cert.id} className="cert-card">
            <div className="cert-img-box" onClick={() => setActiveImg(cert.imgSrc)}>
              <img src={cert.imgSrc} alt={cert.title} className="cert-img" />
              <div className="cert-img-overlay">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                  <ZoomIn size={20} /> Preview Credential
                </div>
              </div>
            </div>
            <div className="cert-content-box">
              <div className="cert-issuer-badge">{cert.issuer}</div>
              <h3 className="cert-card-title">{cert.title}</h3>
              <div className="cert-card-date">
                <Calendar size={14} /> Issued: {cert.date}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                <CheckCircle size={14} /> Verified Credential ID: {cert.credentialId}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImg && (
        <div className="cert-lightbox-modal" onClick={() => setActiveImg(null)}>
          <div className="cert-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="cert-lightbox-close" onClick={() => setActiveImg(null)}>
              <X size={24} /> Close
            </button>
            <img src={activeImg} alt="Certificate Enlarged View" className="cert-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesWall;
