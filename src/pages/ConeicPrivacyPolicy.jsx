import SEO from '../components/SEO';
import { 
  Monitor, 
  MapPin, 
  Mail, 
  Globe
} from 'lucide-react';
import './LegalPages.css';

const ConeicPrivacyPolicy = () => {
  const effectiveDate = "October 17, 2026";

  return (
    <div className="legal-page">
      <SEO
        title="Coneic Privacy Policy | BlueCloud AI Technologies"
        description="Official Privacy Policy for Coneic, a Windows desktop media player developed by BlueCloud AI Technologies. Learn how Coneic handles local media files, network streams, and user privacy."
        path="/coneic/privacy"
        keywords="Coneic privacy policy, Windows desktop media player privacy, BlueCloud AI Technologies, VLC media player privacy, offline media player security"
      />

      <div className="legal-header">
        <div className="container">
          <div className="legal-meta-badge">
            <Monitor size={16} /> Windows Desktop Application
          </div>
          <h1>Coneic Privacy Policy</h1>
          <p>
            This Privacy Policy describes how Coneic, a Windows desktop media player developed by BlueCloud AI Technologies, handles information when you use the application.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">

            <div className="legal-highlight-box">
              <p>
                <strong>Effective Date:</strong> {effectiveDate} | <strong>Product:</strong> Coneic Windows Media Player | <strong>Publisher:</strong> BlueCloud AI Technologies
              </p>
            </div>

            <p>
              Please read this policy alongside any privacy notices for external services you choose to access through Coneic.
            </p>

            <h2>1. Media and Local Information</h2>
            <p>
              Coneic needs access to media files you choose to open in order to play them. Depending on the features enabled in your version, Coneic may store preferences, playlists, playback history, and other application data locally on your computer. These files and settings are used to provide media playback and your selected features.
            </p>

            <h2>2. Accounts and Personal Information</h2>
            <p>
              Ordinary local playback does not require a Coneic account. Coneic is not designed to request your name, address, or payment information for local playback. This statement does not cover information you independently provide to third-party streaming services.
            </p>

            <h2>3. Network Features</h2>
            <p>
              If you open a network stream, your device connects to the selected remote server. That server may receive technical connection information, including your IP address, and may apply its own privacy policy. Depending on the configuration and included components, update checks, metadata retrieval, or other network features may also make requests to external services.
            </p>

            <h2>4. Analytics, Diagnostics, and Advertising</h2>
            <p>
              BlueCloud AI Technologies should disclose any analytics, crash reporting, telemetry, advertising, or other external data collection implemented in the released version of Coneic. This policy does not authorize undisclosed collection of personal information.
            </p>

            <h2>5. Sharing and Disclosure</h2>
            <p>
              BlueCloud AI Technologies does not sell personal information obtained through Coneic. Information may be disclosed when legally required or when necessary to provide a network feature you initiate, subject to the practices of the relevant third-party service.
            </p>

            <h2>6. Storage, Retention, and Choices</h2>
            <p>
              Locally stored preferences, playlists, and history may remain on your device until you clear them or remove the application data. You control which local files and network streams you open. Removing Coneic may not automatically remove all user-created playlists or configuration files.
            </p>

            <h2>7. Third-Party Software</h2>
            <div className="legal-highlight-box">
              <p>
                Coneic is based on <strong>VLC media player technology</strong> from the <strong>VideoLAN project</strong>. Third-party libraries and services may be subject to their own licenses and policies. Coneic is not represented as an official VideoLAN product.
              </p>
            </div>

            <h2>8. Security</h2>
            <p>
              We aim to limit unnecessary handling of personal information. No software or internet connection is completely risk-free. Keep your software updated and use caution when opening untrusted files or streams.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Coneic is a general-purpose media player and is not designed to solicit personal information from children. If you believe personal information has been collected improperly, contact us using the website below.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy when Coneic's features, data practices, or legal requirements change. The effective date at the top will be revised when updates are published.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy or Coneic, please contact the development team:
            </p>

            <div className="legal-contact-card">
              <h3>BlueCloud AI Technologies</h3>
              <div className="legal-contact-item">
                <MapPin size={18} color="var(--primary-blue)" />
                <span>Plot 1743, Cadastral Zone B, Mabushi, Abuja, FCT, Nigeria</span>
              </div>
              <div className="legal-contact-item">
                <Globe size={18} color="var(--primary-blue)" />
                <span>
                  <strong>Official Website:</strong>{' '}
                  <a href="https://bluecloudai.online" target="_blank" rel="noopener noreferrer">
                    bluecloudai.online
                  </a>
                </span>
              </div>
              <div className="legal-contact-item">
                <Mail size={18} color="var(--primary-blue)" />
                <span>
                  <strong>Support & Legal Inquiries:</strong>{' '}
                  <a href="mailto:sadeeqsgi@icloud.com">
                    sadeeqsgi@icloud.com
                  </a>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConeicPrivacyPolicy;
