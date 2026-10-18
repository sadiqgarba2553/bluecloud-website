import SEO from '../components/SEO';
import { Cookie, MapPin, Phone, Mail } from 'lucide-react';
import './LegalPages.css';

const CookiesPolicy = () => {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="legal-page">
      <SEO
        title="Cookie Policy | BlueCloud Technologies"
        description="Learn how BlueCloud Technologies uses cookies, local storage, and similar technologies to deliver a secure, fast, and responsive web experience."
        path="/cookies"
        keywords="BlueCloud cookie policy, web cookies Nigeria, cookie consent, local storage privacy"
      />

      <div className="legal-header">
        <div className="container">
          <div className="legal-meta-badge">
            <Cookie size={16} /> Privacy & Tracking
          </div>
          <h1>Cookie Policy</h1>
          <p>
            Transparency regarding how and why we store session tokens, preferences, and lightweight browser state.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">
            <div className="legal-highlight-box">
              <p>
                <strong>Last Updated:</strong> {lastUpdated} | <strong>Related Policy:</strong> See also our <a href="/privacy">Privacy Policy</a>.
              </p>
            </div>

            <h2>1. What Are Cookies and Local Storage?</h2>
            <p>
              Cookies are small text files placed on your computer, tablet, or mobile device by websites you visit. Similar client-side storage technologies, such as HTML5 <code>localStorage</code> and <code>sessionStorage</code>, store key-value pairs locally inside your browser sandbox.
            </p>
            <p>
              These technologies help make websites work efficiently, remember your customized preferences, and secure client portal sessions.
            </p>

            <h2>2. Categories of Cookies We Use</h2>
            <p>
              BlueCloud minimizes cookie usage. We categorize our cookies and local storage tokens as follows:
            </p>

            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Example Items</th>
                    <th>Purpose & Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Strictly Necessary</strong></td>
                    <td><code>bluecloud_cookie_consent</code>, Firebase Auth Session</td>
                    <td>Essential for core platform functionality, security verification, and remembering your cookie preference. Cannot be disabled without breaking site functions.</td>
                  </tr>
                  <tr>
                    <td><strong>Functional & Preferences</strong></td>
                    <td><code>theme_mode</code>, UI view toggles</td>
                    <td>Remembers your visual settings (such as dark/light mode toggles or recent filter selections) across page refreshes.</td>
                  </tr>
                  <tr>
                    <td><strong>Security & Anti-Abuse</strong></td>
                    <td>Rate-limiting & session fingerprint tokens</td>
                    <td>Protects forms and APIs against automated spam bots and distributed denial-of-service attempts.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>3. Third-Party Cookies & Embeds</h2>
            <p>
              When you interact with interactive embeds on our website (such as Google Maps on our Contact page or YouTube video explainers), the third-party provider may place their own diagnostic or session cookies according to their respective privacy policies. We configure external embeds with <code>loading="lazy"</code> and strict referrer policies to protect your browsing integrity.
            </p>

            <h2>4. How to Manage and Disable Cookies</h2>
            <p>
              You have the right to decide whether to accept or decline non-essential cookies. You can exercise your preferences directly through:
            </p>
            <ul>
              <li>
                <strong>BlueCloud Cookie Consent Banner:</strong> When you first arrive on our site, you can select "Accept All" or "Decline Non-Essential". You can reset this choice at any time by clearing your browser cache.
              </li>
              <li>
                <strong>Browser Settings:</strong> Most modern browsers (Chrome, Firefox, Safari, Edge) allow you to block or delete cookies through their privacy settings. Please note that blocking essential cookies may affect your ability to log into the BlueCloud Client Portal.
              </li>
            </ul>

            <h2>5. Contact Us</h2>
            <div className="legal-contact-card">
              <h3>BlueCloud Technologies — Technical Compliance Desk</h3>
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
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
