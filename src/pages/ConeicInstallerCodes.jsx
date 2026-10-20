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
        title="Coneic Installer Return Codes | BlueCloud AI Technologies"
        description="Official NSIS installer exit codes and return values for Coneic Windows desktop media player. Required documentation for Microsoft Partner Center Store submission, Intune, Winget, and SCCM deployments."
        path="/coneic/installer-codes"
        keywords="Coneic installer exit codes, Coneic return codes, NSIS exit codes, Microsoft Store installer documentation, BlueCloud AI Technologies, Coneic media player installer, Windows Store submission codes"
      />

      <div className="legal-header">
        <div className="container">
          <div className="legal-meta-badge">
            <Terminal size={16} /> Microsoft Store &amp; Enterprise Reference
          </div>
          <h1>Coneic Installer Return Codes</h1>
          <p>
            Official installer exit code specification and documentation for the Coneic Windows Desktop Media Player, published by BlueCloud AI Technologies for Microsoft Partner Center Store submission and enterprise silent deployments.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">

            <div className="legal-highlight-box">
              <p>
                <strong>Documentation URL:</strong> <code>https://bluecloudai.online/coneic/installer-codes</code> | <strong>Installer Technology:</strong> NSIS (Nullsoft Scriptable Install System) | <strong>Publisher:</strong> BlueCloud AI Technologies
              </p>
            </div>

            <h2>1. Microsoft Partner Center — Installer Return Codes</h2>
            <p>
              When submitting a desktop application package (.exe) to Microsoft Partner Center, the installer exit codes must be defined so the Windows Store installer engine knows whether an installation succeeded, requires a restart, or failed.
            </p>
            <p>
              Below is the exact mapping to enter in each field of the Microsoft Partner Center <strong>Installer parameters and return codes</strong> form:
            </p>

            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Microsoft Store Field</th>
                    <th>Exit Code</th>
                    <th>Explanation &amp; Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Installation successful</strong></td>
                    <td><code>0</code></td>
                    <td>Installation completed successfully (ERROR_SUCCESS). All application binaries, media codecs, shortcuts, and uninstall keys were written.</td>
                  </tr>
                  <tr>
                    <td><strong>Installation already in progress</strong></td>
                    <td><code>1618</code></td>
                    <td>Another setup process is actively running (ERROR_INSTALL_ALREADY_RUNNING). The installer mutex is held. The user must finish or terminate the existing installation.</td>
                  </tr>
                  <tr>
                    <td><strong>Disk space is full</strong></td>
                    <td><code>112</code></td>
                    <td>The target volume does not have sufficient free disk space to extract files (ERROR_DISK_FULL).</td>
                  </tr>
                  <tr>
                    <td><strong>Reboot required</strong></td>
                    <td><code>3010</code></td>
                    <td>Installation finished but a system restart is required (ERROR_SUCCESS_REBOOT_REQUIRED).</td>
                  </tr>
                  <tr>
                    <td><strong>Network failure</strong></td>
                    <td><code>12029</code></td>
                    <td>Network download or remote resource connection failed (ERROR_INTERNET_CANNOT_CONNECT).</td>
                  </tr>
                  <tr>
                    <td><strong>Package rejected during installation</strong></td>
                    <td><code>1625</code></td>
                    <td>Execution blocked by operating system security policies, missing administrative elevation (UAC), or antivirus restriction (ERROR_INSTALL_PACKAGE_REJECTED).</td>
                  </tr>
                  <tr>
                    <td><strong>Installation cancelled by user</strong></td>
                    <td><code>1602</code></td>
                    <td>The user aborted setup by clicking Cancel, pressing Escape, or closing the installer dialog before completion (ERROR_INSTALL_USEREXIT).</td>
                  </tr>
                  <tr>
                    <td><strong>Application already exists</strong></td>
                    <td><code>1638</code></td>
                    <td>An existing version is already installed (ERROR_PRODUCT_VERSION).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>2. Complete NSIS Exit Code Specification</h2>
            <p>
              Coneic setup packages built with NSIS (Nullsoft Scriptable Install System) adhere to standard Windows process return codes:
            </p>

            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Exit Code</th>
                    <th>Status</th>
                    <th>Standard Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>0</code></td>
                    <td>Success</td>
                    <td>Normal execution completed with no errors.</td>
                  </tr>
                  <tr>
                    <td><code>1</code></td>
                    <td>User Abort</td>
                    <td>Installation was aborted by user interaction (Cancel / Close).</td>
                  </tr>
                  <tr>
                    <td><code>2</code></td>
                    <td>Error / Abort</td>
                    <td>Installation was aborted due to write errors, disk full, permission denied, or script error.</td>
                  </tr>
                  <tr>
                    <td><code>3010</code></td>
                    <td>Reboot Needed</td>
                    <td>Setup succeeded but files are locked pending system reboot.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>3. Silent Installation &amp; Automation Parameters</h2>
            <p>
              For automated enterprise distribution via Microsoft Intune, SCCM, Winget, or PowerShell automation scripts:
            </p>
            <div className="legal-highlight-box">
              <p>
                <strong>Silent Install:</strong> <code>ConeicSetup.exe /S</code><br />
                <strong>Silent Install to Custom Directory:</strong> <code>ConeicSetup.exe /S /D=C:\Program Files\Coneic</code><br />
                <strong>Silent Uninstall:</strong> <code>"C:\Program Files\Coneic\uninstall.exe" /S</code>
              </p>
            </div>
            <p>
              Note: The <code>/S</code> command line parameter is case-sensitive in NSIS installers.
            </p>

            <h2>4. Application Package Details</h2>
            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Application Name</strong></td>
                    <td>Coneic</td>
                  </tr>
                  <tr>
                    <td><strong>Developer &amp; Publisher</strong></td>
                    <td>BlueCloud AI Technologies</td>
                  </tr>
                  <tr>
                    <td><strong>Category</strong></td>
                    <td>Multimedia &amp; Video Player</td>
                  </tr>
                  <tr>
                    <td><strong>Target Operating System</strong></td>
                    <td>Windows 10 / Windows 11 (64-bit)</td>
                  </tr>
                  <tr>
                    <td><strong>Installer Type</strong></td>
                    <td>Standalone Windows Executable (.exe)</td>
                  </tr>
                  <tr>
                    <td><strong>Packaging Engine</strong></td>
                    <td>NSIS (Nullsoft Scriptable Install System)</td>
                  </tr>
                  <tr>
                    <td><strong>Engine</strong></td>
                    <td>LibVLC 3.0.x Media Engine</td>
                  </tr>
                  <tr>
                    <td><strong>Package Download URL</strong></td>
                    <td><code>https://bluecloudai.online/coneic/downloads/1.0.0/Coneic.exe</code></td>
                  </tr>
                  <tr>
                    <td><strong>Privacy Policy URL</strong></td>
                    <td><a href="https://bluecloudai.online/coneic/privacy">https://bluecloudai.online/coneic/privacy</a></td>
                  </tr>
                  <tr>
                    <td><strong>Documentation URL</strong></td>
                    <td><code>https://bluecloudai.online/coneic/installer-codes</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

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
                  <a href="mailto:support@bluecloudai.online">
                    support@bluecloudai.online
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
