import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('bluecloud_cookie_consent');
      if (!consent) {
        // Delay slightly for smooth page entry
        const timer = setTimeout(() => setVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is blocked by user privacy modes
      setVisible(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('bluecloud_cookie_consent', 'accepted');
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
    setVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('bluecloud_cookie_consent', 'declined');
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="cookie-banner-wrapper" aria-label="Cookie consent banner" role="dialog" aria-modal="false">
      <div className="cookie-banner">
        <div className="cookie-header">
          <div className="cookie-icon-box" aria-hidden="true">
            <Cookie size={20} />
          </div>
          <h4>Cookie & Privacy Preferences</h4>
        </div>

        <p className="cookie-text">
          We use essential cookies and lightweight browser storage to ensure site reliability, secure client portals, and analyze performance. By clicking "Accept All", you agree to our storage practices as described in our{' '}
          <Link to="/cookies" onClick={() => setVisible(false)}>Cookie Policy</Link> and{' '}
          <Link to="/privacy" onClick={() => setVisible(false)}>Privacy Policy</Link>.
        </p>

        <div className="cookie-actions">
          <button 
            type="button" 
            className="cookie-btn-decline" 
            onClick={handleDecline}
            aria-label="Decline non-essential cookies"
          >
            Decline Non-Essential
          </button>
          <button 
            type="button" 
            className="cookie-btn-accept" 
            onClick={handleAccept}
            aria-label="Accept all cookies"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
