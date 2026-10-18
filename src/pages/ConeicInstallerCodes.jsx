import SEO from '../components/SEO';
import { 
  Terminal, 
  MapPin, 
  Mail, 
  Globe
} from 'lucide-react';
import './LegalPages.css';

const ConeicInstallerCodes = () => {
  return (
    <div className="legal-page">
      <SEO
        title="Coneic Windows Packaging | BlueCloud AI Technologies"
        description="Current Windows packaging status for Coneic media player by BLUECLOUD, including portable builds and Microsoft Store packaging."
        path="/coneic/installer-codes"
        keywords="Coneic Windows packaging, Coneic portable player, Microsoft Store, BlueCloud AI Technologies"
      />

      <div className="legal-header">
        <div className="container">
          <div className="legal-meta-badge">
            <Terminal size={16} /> Microsoft Store &amp; Enterprise Reference
          </div>
          <h1>Coneic Windows Packaging</h1>
          <p>
            Windows distribution and packaging information for Coneic media player, published by BLUECLOUD.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">

            <div className="legal-highlight-box">
              <p><strong>Current distribution:</strong> Coneic 0.2.1 Alpha is a portable Windows application. It requires the complete application folder, including its libraries and plugins. A standalone player executable is not an installer.</p>
            </div>
            <h2>1. Windows package status</h2>
            <p>A complete Microsoft Store MSIX package is being prepared. A Store download will be announced after submission and approval. Do not use the old standalone Coneic.exe download as a silent installer.</p>
            <h2>2. Installer parameters and return codes</h2>
            <p>No validated Coneic EXE/MSI installer is currently published on this page. NSIS switches and Windows Installer error numbers must not be entered as Coneic-specific return codes without testing the actual installer.</p>
            <p>Portable builds have no installation or uninstallation return codes. To use a portable release, extract the complete archive into one folder and launch Coneic.exe from that folder.</p>
            <h2>3. Microsoft Store packaging</h2>
            <p>MSIX installation and updates are managed by Windows. Microsoft signs packages distributed through the Store. A test package or unsigned executable is not a certified Store release.</p>
            <p>For EXE/MSI submissions, the installer must include the complete application, support offline silent installation, and meet Microsoft's trusted code-signing requirements.</p>
            <p><a href="https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msi/app-package-requirements">Microsoft EXE/MSI requirements</a> · <a href="https://learn.microsoft.com/en-us/windows/msix/package/sign-msix-package-guide">Microsoft MSIX signing guidance</a></p>
            <h2>4. Application details</h2>
            <p>Coneic 0.2.1 Alpha is a Windows x64 media player by <a href="https://bluecloudai.online">BLUECLOUD</a>, based on VLC 3.0.24. <a href="https://bluecloudai.online/coneic/privacy">Privacy policy</a>.</p>
            <h2>5. Publisher &amp; Technical Support</h2>
            <p>
              For enterprise deployment inquiries, store verification questions, or custom packaging requests:
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
                  <strong>Support Desk:</strong>{' '}
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

export default ConeicInstallerCodes;
