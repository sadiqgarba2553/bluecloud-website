import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Terminal, 
  ExternalLink, 
  Monitor, 
  ShieldCheck, 
  Printer, 
  FileCode,
  Globe,
  Mail,
  Cpu
} from 'lucide-react';
import './LegalPages.css';

const ConeicInstallerCodes = () => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="legal-page coneic-installer-page">
      <SEO
        title="Coneic Installer Return Codes — NSIS Exit Code Documentation | BlueCloud AI Technologies"
        description="Official NSIS installer exit codes and return values for Coneic Windows desktop media player. Required documentation for Microsoft Partner Center Store submission, Intune, Winget, and SCCM deployments."
        path="/coneic/installer-codes"
        keywords="Coneic installer exit codes, Coneic return codes, NSIS exit codes, Microsoft Store installer documentation, BlueCloud AI Technologies, Coneic media player installer, Windows Store submission codes"
      />

      <div className="legal-header" style={{ background: 'linear-gradient(135deg, #090e17 0%, #0e1e38 50%, #1a2f4c 100%)' }}>
        <div className="container">
          <div className="legal-meta-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8' }}>
            <Terminal size={16} /> Microsoft Store &amp; Enterprise Deployment Reference
          </div>
          <h1>Coneic Installer Return Codes</h1>
          <p>
            Official NSIS installer exit code specification for the <strong>Coneic</strong> Windows Desktop Media Player, published by <strong>BlueCloud AI Technologies</strong> for Microsoft Partner Center Store submission and enterprise silent deployment.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              <strong>Publisher:</strong> BlueCloud AI Technologies
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Installer: NSIS (Nullsoft Scriptable Install System)
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Platform: Windows 10/11 x64
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
                cursor: 'pointer'
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

            {/* Overview */}
            <div className="legal-highlight-box" style={{ borderLeftColor: '#38bdf8' }}>
              <p>
                <strong>What are installer return codes?</strong> When an installer process finishes or encounters an error, it returns an integer exit code. Microsoft Partner Center, Intune, SCCM, Winget, and other deployment tools evaluate this code to determine whether installation succeeded, failed, was cancelled, or requires a reboot. This document defines the codes returned by the Coneic NSIS installer.
              </p>
            </div>

            {/* Section 1: Microsoft Partner Center — Exact Fields */}
            <h2>1. Microsoft Partner Center — Installer Return Codes</h2>
            <p>
              The following table maps every field in the Microsoft Partner Center "Installer parameters and return codes" form to the exact NSIS exit code value for Coneic.
            </p>

            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Microsoft Store Field</th>
                    <th>NSIS Exit Code</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Installation successful</strong></td>
                    <td><code>0</code></td>
                    <td>Installation has been successful. All files, registry entries, shortcuts, and uninstaller have been written without error.</td>
                  </tr>
                  <tr>
                    <td><strong>Installation already in progress</strong></td>
                    <td><code>2</code></td>
                    <td>Another installation is already in progress. The NSIS installer mutex is held by a concurrent setup process. The user must complete the existing installation before proceeding.</td>
                  </tr>
                  <tr>
                    <td><strong>Disk space is full</strong></td>
                    <td><code>2</code></td>
                    <td>The disk space is full. NSIS returns exit code 2 when a write or extraction operation fails due to insufficient storage on the target volume.</td>
                  </tr>
                  <tr>
                    <td><strong>Reboot required</strong></td>
                    <td><code>3010</code></td>
                    <td>A restart is required to complete the install. If the Coneic NSIS script sets the reboot flag (e.g., locked files in use), it returns 3010. If no reboot is needed, the installer returns 0.</td>
                  </tr>
                  <tr>
                    <td><strong>Network failure</strong></td>
                    <td><code>2</code></td>
                    <td>Custom return code value for various network related failures. NSIS returns exit code 2 when a download plugin or network operation fails during installation. The Coneic installer bundles all required files locally, so network failures are not expected during normal installation.</td>
                  </tr>
                  <tr>
                    <td><strong>Package rejected during installation</strong></td>
                    <td><code>2</code></td>
                    <td>Package rejected during installation due to a security policy enabled on the device. NSIS returns exit code 2 when a system policy, antivirus, or UAC elevation failure prevents the installer from executing its script.</td>
                  </tr>
                  <tr>
                    <td><strong>Installation cancelled by user</strong></td>
                    <td><code>1</code></td>
                    <td>The user cancelled the installation. The user clicked Cancel, pressed Escape, or closed the installer window before completion.</td>
                  </tr>
                  <tr>
                    <td><strong>Application already exists</strong></td>
                    <td><code>0</code></td>
                    <td>Application already exists. The Coneic NSIS installer performs an in-place upgrade when an existing version is detected. It overwrites previous files and returns 0 on success.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: Complete NSIS Exit Code Reference */}
            <h2>2. Complete NSIS Exit Code Reference</h2>
            <p>
              NSIS (Nullsoft Scriptable Install System) uses a minimal set of process exit codes. These are the standard return values from every NSIS-compiled installer:
            </p>
            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Exit Code</th>
                    <th>Status</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>0</code></td>
                    <td>Success</td>
                    <td>Normal execution completed. All files extracted, registry keys written, shortcuts created, and uninstaller registered successfully.</td>
                  </tr>
                  <tr>
                    <td><code>1</code></td>
                    <td>User Abort</td>
                    <td>Installation was cancelled by the user. The user clicked Cancel, closed the installer window, or dismissed a confirmation dialog during setup.</td>
                  </tr>
                  <tr>
                    <td><code>2</code></td>
                    <td>Script / System Abort</td>
                    <td>Installation was aborted by the installer script or the operating system. This covers file extraction failures, CRC verification errors, insufficient disk space, write permission denials, missing administrative elevation, security policy blocks, and network download failures.</td>
                  </tr>
                  <tr>
                    <td><code>3010</code></td>
                    <td>Reboot Required</td>
                    <td>Installation succeeded but a system restart is required for locked files to be replaced. Only returned when the NSIS script explicitly sets the reboot flag via <code>SetRebootFlag true</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: Silent Installation */}
            <h2>3. Silent Installation Command</h2>
            <p>
              For automated deployments via Microsoft Intune, SCCM, Winget, or Group Policy:
            </p>
            <div className="legal-highlight-box" style={{ borderLeftColor: '#0ea5e9' }}>
              <p style={{ fontFamily: "'JetBrains Mono', 'Consolas', monospace", fontSize: '0.95rem' }}>
                <strong>Install (silent):</strong> <code>ConeicSetup.exe /S</code><br />
                <strong>Install to custom directory:</strong> <code>ConeicSetup.exe /S /D=C:\Program Files\Coneic</code><br />
                <strong>Uninstall (silent):</strong> <code>"C:\Program Files\Coneic\uninstall.exe" /S</code>
              </p>
            </div>
            <p>
              The <code>/S</code> flag runs the NSIS installer in fully silent mode with no user interface. The <code>/D=</code> switch overrides the default installation directory. Both flags are case-sensitive in NSIS.
            </p>

            {/* Section 4: Documentation URL for Partner Center */}
            <h2>4. Documentation URL for Partner Center</h2>
            <p>
              When the Microsoft Partner Center submission form asks for a public documentation URL explaining installer return codes, enter:
            </p>
            <div className="legal-highlight-box" style={{ borderLeftColor: '#22c55e' }}>
              <p>
                <code style={{ fontSize: '1.05rem' }}>https://bluecloudai.online/coneic/installer-codes</code>
              </p>
            </div>
            <p>
              This URL resolves to the page you are currently viewing.
            </p>

            {/* Section 5: Coneic Application Details */}
            <h2>5. Application Details</h2>
            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Application Name</strong></td>
                    <td>Coneic</td>
                  </tr>
                  <tr>
                    <td><strong>Publisher / Developer</strong></td>
                    <td>BlueCloud AI Technologies</td>
                  </tr>
                  <tr>
                    <td><strong>Category</strong></td>
                    <td>Multimedia / Media Player</td>
                  </tr>
                  <tr>
                    <td><strong>Platform</strong></td>
                    <td>Windows 10 and Windows 11 (x64)</td>
                  </tr>
                  <tr>
                    <td><strong>Installer Technology</strong></td>
                    <td>NSIS (Nullsoft Scriptable Install System)</td>
                  </tr>
                  <tr>
                    <td><strong>Installer Type</strong></td>
                    <td>EXE (NSIS-compiled)</td>
                  </tr>
                  <tr>
                    <td><strong>Runtime</strong></td>
                    <td>.NET 8.0 (self-contained, bundled)</td>
                  </tr>
                  <tr>
                    <td><strong>Media Engine</strong></td>
                    <td>LibVLC 3.0.24 via LibVLCSharp 3.10.2</td>
                  </tr>
                  <tr>
                    <td><strong>UI Framework</strong></td>
                    <td>WPF (Windows Presentation Foundation)</td>
                  </tr>
                  <tr>
                    <td><strong>Silent Install Command</strong></td>
                    <td><code>ConeicSetup.exe /S</code></td>
                  </tr>
                  <tr>
                    <td><strong>Silent Uninstall Command</strong></td>
                    <td><code>"C:\Program Files\Coneic\uninstall.exe" /S</code></td>
                  </tr>
                  <tr>
                    <td><strong>Privacy Policy URL</strong></td>
                    <td><a href="https://bluecloudai.online/coneic/privacy" style={{ color: 'var(--primary-blue)' }}>https://bluecloudai.online/coneic/privacy</a></td>
                  </tr>
                  <tr>
                    <td><strong>Installer Codes Documentation</strong></td>
                    <td><code>https://bluecloudai.online/coneic/installer-codes</code></td>
                  </tr>
                  <tr>
                    <td><strong>Publisher Website</strong></td>
                    <td><a href="https://bluecloudai.online" style={{ color: 'var(--primary-blue)' }}>https://bluecloudai.online</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Contact Card */}
            <div className="legal-contact-card" style={{ marginTop: '32px' }}>
              <h3 style={{ color: 'var(--deep-navy)', fontSize: '1.2rem', marginBottom: '14px' }}>Publisher Contact</h3>
              <div className="legal-contact-item">
                <ShieldCheck size={18} color="var(--primary-blue)" />
                <span><strong>Developer:</strong> BlueCloud AI Technologies</span>
              </div>
              <div className="legal-contact-item">
                <Globe size={18} color="var(--primary-blue)" />
                <span>
                  <strong>Website:</strong>{' '}
                  <a href="https://bluecloudai.online" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>
                    bluecloudai.online
                  </a>
                </span>
              </div>
              <div className="legal-contact-item">
                <Mail size={18} color="var(--primary-blue)" />
                <span>
                  <strong>Support:</strong>{' '}
                  <a href="mailto:sadeeqsgi@icloud.com" style={{ color: 'var(--primary-blue)', textDecoration: 'underline' }}>
                    sadeeqsgi@icloud.com
                  </a>
                </span>
              </div>
              <div className="legal-contact-item">
                <FileCode size={18} color="var(--primary-blue)" />
                <span><strong>Documentation URL:</strong> <code>https://bluecloudai.online/coneic/installer-codes</code></span>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', fontSize: '0.9rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <span>&copy; 2026 BlueCloud AI Technologies. Coneic.</span>
              <div style={{ display: 'flex', gap: '14px' }}>
                <Link to="/coneic/privacy" style={{ color: '#0284c7' }}>Coneic Privacy Policy</Link>
                <span>•</span>
                <Link to="/privacy" style={{ color: '#0284c7' }}>BlueCloud Privacy</Link>
                <span>•</span>
                <Link to="/terms" style={{ color: '#0284c7' }}>Terms of Service</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ConeicInstallerCodes;
