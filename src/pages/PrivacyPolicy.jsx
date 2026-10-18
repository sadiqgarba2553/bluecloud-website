import SEO from '../components/SEO';
import { Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import './LegalPages.css';

const PrivacyPolicy = () => {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="legal-page">
      <SEO
        title="Privacy Policy | BlueCloud Technologies"
        description="Learn how BlueCloud Technologies collects, uses, protects, and handles your personal data in compliance with the Nigeria Data Protection Act (NDPA) and international standards."
        path="/privacy"
        keywords="BlueCloud privacy policy, data protection, NDPA compliance Nigeria, NDPR Abuja, data security, user privacy"
      />

      <div className="legal-header">
        <div className="container">
          <div className="legal-meta-badge">
            <Shield size={16} /> Privacy & Data Governance
          </div>
          <h1>Privacy Policy</h1>
          <p>
            Your privacy and data security are foundational to how BlueCloud builds software and delivers technical solutions.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">
            <div className="legal-highlight-box">
              <p>
                <strong>Effective Date:</strong> {lastUpdated} | <strong>Governing Jurisdiction:</strong> Federal Republic of Nigeria (Nigeria Data Protection Act — NDPA 2023 / NDPR) and relevant global standards (GDPR).
              </p>
            </div>

            <h2>1. Introduction</h2>
            <p>
              BlueCloud Technologies ("BlueCloud", "we", "us", or "our") operates the website <code>bluecloudai.online</code> and provides bespoke enterprise web engineering, artificial intelligence software, cybersecurity architecture, and IT consulting services. We are registered and headquartered in Abuja, Federal Capital Territory, Nigeria.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, use our software products, submit quote requests, or engage our engineering services.
            </p>

            <h2>2. The Data We Collect</h2>
            <p>
              We practice strict data minimization and only collect information that is strictly necessary to fulfill your technical requests and service agreements:
            </p>
            <ul>
              <li>
                <strong>Contact & Identity Data:</strong> Your name, business email address, company name, and phone number when you voluntarily fill out our contact form, request a formal PDF proposal, or communicate with our engineering desk.
              </li>
              <li>
                <strong>Project Specification Data:</strong> High-level project briefs, architectural requirements, estimated timelines, and budget ranges that you submit to evaluate engineering viability.
              </li>
              <li>
                <strong>Technical & Diagnostic Data:</strong> IP address (anonymized), browser type, operating system, device characteristics, screen resolution, and diagnostic logs collected automatically to ensure system uptime, cybersecurity defense, and performance optimization.
              </li>
              <li>
                <strong>Client Portal Credentials:</strong> Encrypted authentication tokens managed via Firebase Authentication when registered clients log in to the BlueCloud Portal. We never store plain-text passwords.
              </li>
            </ul>

            <h2>3. Legal Grounds for Processing</h2>
            <p>
              Under the Nigeria Data Protection Act (NDPA) and applicable international data laws, we process personal information on the following legal bases:
            </p>
            <ul>
              <li><strong>Consent:</strong> When you provide clear, affirmative consent (e.g., submitting a contact form or agreeing to non-essential cookies).</li>
              <li><strong>Contractual Necessity:</strong> To fulfill proposals, development roadmaps, software service-level agreements, and invoicing.</li>
              <li><strong>Legal Compliance:</strong> To adhere to regulatory, tax, or legal requirements within the Federal Republic of Nigeria.</li>
              <li><strong>Legitimate Interests:</strong> To detect security threats, prevent unauthorized access to our infrastructure, and optimize application speed.</li>
            </ul>

            <h2>4. Third-Party Service Providers & Data Processors</h2>
            <p>
              We do not sell, rent, or trade your personal data to third parties. We only engage trusted technical service providers who comply with industry security standards:
            </p>
            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Purpose</th>
                    <th>Location / Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Google Firebase</strong></td>
                    <td>Authentication & Cloud Database</td>
                    <td>ISO 27001, SOC 2, Global</td>
                  </tr>
                  <tr>
                    <td><strong>Web3Forms</strong></td>
                    <td>Serverless Contact Form Delivery</td>
                    <td>Encrypted transmission over TLS</td>
                  </tr>
                  <tr>
                    <td><strong>Vercel</strong></td>
                    <td>Edge Cloud Hosting & CDN</td>
                    <td>GDPR & SOC 2 Type II compliant</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>5. Cookies and Local Storage</h2>
            <p>
              Our website uses essential session cookies and browser <code>localStorage</code> to store preferences (such as your theme, client portal session, and cookie consent choices). You can manage or revoke cookie choices at any time via our Cookie Consent banner or your browser settings. For full details, see our <a href="/cookies">Cookie Policy</a>.
            </p>

            <h2>6. Data Security Measures</h2>
            <p>
              BlueCloud employs enterprise-grade cybersecurity controls to protect your data from unauthorized access, accidental alteration, disclosure, or destruction. These measures include TLS/SSL 256-bit data transit encryption, isolated Firebase security rules, environment variable secret management, and continuous repository auditing.
            </p>

            <h2>7. Your Data Protection Rights</h2>
            <p>
              Subject to applicable Nigerian and international laws, you have the right to:
            </p>
            <ul>
              <li><strong>Request Access:</strong> Obtain a copy of the personal data we hold about you.</li>
              <li><strong>Request Rectification:</strong> Ask us to correct inaccurate or incomplete details.</li>
              <li><strong>Request Erasure:</strong> Request the deletion of your personal records ("Right to be Forgotten") when retention is no longer legally necessary.</li>
              <li><strong>Withdraw Consent:</strong> Revoke consent previously given for marketing communications or data collection at any time.</li>
            </ul>

            <h2>8. Contact Our Data Governance Desk</h2>
            <p>
              If you have any questions about this Privacy Policy, wish to exercise your data protection rights, or have concerns regarding your privacy, please contact:
            </p>

            <div className="legal-contact-card">
              <h3>BlueCloud Technologies — Legal & Privacy Team</h3>
              <div className="legal-contact-item">
                <MapPin size={18} color="var(--primary-blue)" />
                <span>Plot 1743, Cadastral Zone B, Mabushi, Abuja, FCT, Nigeria</span>
              </div>
              <div className="legal-contact-item">
                <Phone size={18} color="var(--primary-blue)" />
                <span>+234 812 553 1111</span>
              </div>
              <div className="legal-contact-item">
                <Mail size={18} color="var(--primary-blue)" />
                <span>sadeeqsgi@icloud.com</span>
              </div>
              <div className="legal-contact-item">
                <Calendar size={18} color="var(--primary-blue)" />
                <span>Response Time: Within 2 business days</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
