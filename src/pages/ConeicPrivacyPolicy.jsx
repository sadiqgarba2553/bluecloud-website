import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  ShieldCheck, 
  HardDrive, 
  Lock, 
  Globe, 
  FileText, 
  AlertTriangle, 
  RefreshCw, 
  Mail, 
  ExternalLink, 
  Monitor, 
  CheckCircle2, 
  Sparkles,
  Printer
} from 'lucide-react';
import './LegalPages.css';

const ConeicPrivacyPolicy = () => {
  const effectiveDate = "October 17, 2026";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="legal-page coneic-privacy-page">
      <SEO
        title="Coneic Windows Media Player — Privacy Policy | BlueCloud AI Technologies"
        description="Official Privacy Policy for Coneic, a high-performance Windows desktop media player developed by BlueCloud AI Technologies. Learn how Coneic handles local files, network streams, and user privacy."
        path="/coneic/privacy"
        keywords="Coneic privacy policy, Coneic media player, BlueCloud AI Technologies, Windows desktop media player privacy, VLC based player privacy, offline media player security"
      />

      <div className="legal-header" style={{ background: 'linear-gradient(135deg, #090e17 0%, #0f1c30 50%, #172a46 100%)' }}>
        <div className="container">
          <div className="legal-meta-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8' }}>
            <Monitor size={16} /> Windows Desktop Application
          </div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            Coneic Privacy Policy
          </h1>
          <p>
            This Privacy Policy describes how <strong>Coneic</strong>, a Windows desktop media player developed by <strong>BlueCloud AI Technologies</strong>, handles information when you use the application.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              <strong>Effective date:</strong> {effectiveDate}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Publisher: BlueCloud AI Technologies
            </span>
            <button 
              onClick={handlePrint}
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Printer size={15} /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">

            {/* Quick Summary Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.06) 0%, rgba(30, 41, 59, 0.04) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.25)',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#0284c7', fontWeight: '700' }}>
                <Sparkles size={20} />
                <span>Privacy At A Glance</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--slate-text)' }}>
                <li><strong>Local-First:</strong> Plays your audio & video locally on your machine without requiring an account.</li>
                <li><strong>Zero Sale of Personal Data:</strong> BlueCloud AI Technologies never sells or monetizes your data.</li>
                <li><strong>Direct Network Connections:</strong> Streaming URLs connect directly from your machine to the destination host.</li>
                <li><strong>VLC Core:</strong> Powered by open-source VideoLAN technology, maintained independently by BlueCloud AI Technologies.</li>
              </ul>
            </div>

            <p style={{ fontStyle: 'italic', color: '#64748b', fontSize: '1rem' }}>
              Please read this policy alongside any privacy notices for external services you choose to access through Coneic.
            </p>

            {/* 1. Media and local information */}
            <h2>1. Media and Local Information</h2>
            <p>
              Coneic needs access to media files you choose to open in order to play them. Depending on the features enabled in your version, Coneic may store preferences, playlists, playback history, and other application data locally on your computer.
            </p>
            <p>
              These files and settings are used solely to provide media playback and your selected features.
            </p>

            {/* 2. Accounts and personal information */}
            <h2>2. Accounts and Personal Information</h2>
            <p>
              Ordinary local playback does not require a Coneic account. Coneic is not designed to request your name, address, or payment information for local playback.
            </p>
            <p>
              This statement does not cover information you independently provide to third-party streaming services.
            </p>

            {/* 3. Network features */}
            <h2>3. Network Features</h2>
            <p>
              If you open a network stream, your device connects to the selected remote server. That server may receive technical connection information, including your IP address, and may apply its own privacy policy.
            </p>
            <p>
              Depending on the configuration and included components, update checks, metadata retrieval, or other network features may also make requests to external services.
            </p>

            {/* 4. Analytics, diagnostics, and advertising */}
            <h2>4. Analytics, Diagnostics, and Advertising</h2>
            <p>
              BlueCloud AI Technologies should disclose any analytics, crash reporting, telemetry, advertising, or other external data collection implemented in the released version of Coneic.
            </p>
            <p>
              This policy does not authorize undisclosed collection of personal information.
            </p>

            {/* 5. Sharing and disclosure */}
            <h2>5. Sharing and Disclosure</h2>
            <p>
              BlueCloud AI Technologies does not sell personal information obtained through Coneic. Information may be disclosed when legally required or when necessary to provide a network feature you initiate, subject to the practices of the relevant third-party service.
            </p>

            {/* 6. Storage, retention, and choices */}
            <h2>6. Storage, Retention, and Choices</h2>
            <p>
              Locally stored preferences, playlists, and history may remain on your device until you clear them or remove the application data. You control which local files and network streams you open.
            </p>
            <p>
              Removing Coneic may not automatically remove all user-created playlists or configuration files.
            </p>

            {/* 7. Third-party software */}
            <h2>7. Third-Party Software</h2>
            <div className="legal-highlight-box" style={{ borderLeftColor: '#0ea5e9' }}>
              <p>
                Coneic is based on <strong>VLC media player technology</strong> from the <strong>VideoLAN project</strong>. Third-party libraries and services may be subject to their own licenses and policies. Coneic is not represented as an official VideoLAN product.
              </p>
            </div>

            {/* 8. Security */}
            <h2>8. Security</h2>
            <p>
              We aim to limit unnecessary handling of personal information. No software or internet connection is completely risk-free. Keep your software updated and use caution when opening untrusted files or streams.
            </p>

            {/* 9. Children's privacy */}
            <h2>9. Children's Privacy</h2>
            <p>
              Coneic is a general-purpose media player and is not designed to solicit personal information from children. If you believe personal information has been collected improperly, contact us using the website below.
            </p>

            {/* 10. Changes */}
            <h2>10. Changes</h2>
            <p>
              We may update this Privacy Policy when Coneic's features, data practices, or legal requirements change. The effective date at the top will be revised when updates are published.
            </p>

            {/* 11. Contact */}
            <h2>11. Contact</h2>
            <div className="legal-contact-card" style={{ marginTop: '16px' }}>
              <h3 style={{ color: 'var(--deep-navy)', fontSize: '1.2rem', marginBottom: '14px' }}>
                BlueCloud AI Technologies
              </h3>
              <div className="legal-contact-item">
                <ShieldCheck size={18} color="var(--primary-blue)" />
                <span><strong>Developer:</strong> BlueCloud AI Technologies</span>
              </div>
              <div className="legal-contact-item">
                <Globe size={18} color="var(--primary-blue)" />
                <span>
                  <strong>Official Website:</strong>{' '}
                  <a href="https://bluecloudai.online" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>
                    bluecloudai.online
                  </a>
                </span>
              </div>
              <div className="legal-contact-item">
                <Mail size={18} color="var(--primary-blue)" />
                <span>
                  <strong>Legal & Support Inquiries:</strong>{' '}
                  <a href="mailto:sadeeqsgi@icloud.com" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>
                    sadeeqsgi@icloud.com
                  </a>
                </span>
              </div>
            </div>

            {/* Footer notice inside content */}
            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <span>&copy; 2026 BlueCloud AI Technologies. Coneic.</span>
              <div style={{ display: 'flex', gap: '14px' }}>
                <Link to="/privacy" style={{ color: '#0284c7' }}>BlueCloud Main Privacy</Link>
                <span>•</span>
                <Link to="/terms" style={{ color: '#0284c7' }}>Terms of Service</Link>
                <span>•</span>
                <a href="/coneic/privacy.html" target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Static Mirror <ExternalLink size={13} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConeicPrivacyPolicy;
