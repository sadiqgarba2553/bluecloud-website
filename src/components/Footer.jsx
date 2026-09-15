import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-container">
          
          {/* Brand Info */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
              <img 
                src="/icon_no_background.PNG" 
                alt="BlueCloud Technologies Logo" 
                style={{ height: '32px', marginRight: 'var(--spacing-1)' }} 
              />
              <span className="logo-text" style={{ marginBottom: 0 }}>BLUECLOUD</span>
            </div>
            <p>
              BlueCloud Technologies delivers enterprise web development, applied AI solutions, and software engineering. Registered and headquartered in Abuja, Nigeria.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="BlueCloud Facebook Profile" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://twitter.com/sadeeqsgi" target="_blank" rel="noopener noreferrer" aria-label="BlueCloud Twitter Profile" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://wa.me/2348125531111" target="_blank" rel="noopener noreferrer" aria-label="Chat with BlueCloud on WhatsApp" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
              <a href="https://www.instagram.com/bluecloud.ai/" target="_blank" rel="noopener noreferrer" aria-label="Follow BlueCloud on Instagram" className="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Platform & Solutions</h4>
            <ul>
              <li><Link to="/platform">Platform Ecosystem</Link></li>
              <li><Link to="/developers">Developer API Hub</Link></li>
              <li><Link to="/enterprise">Enterprise & SLAs</Link></li>
              <li><Link to="/ai-solutions">AI Solutions</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><a href="/portfolio.html" target="_blank" rel="noopener noreferrer">Founder Portfolio</a></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/portal/admin">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="footer-links">
            <h4>Legal & Governance</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy (NDPA/GDPR)</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/refund">Refund & Cancellation</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/rate-card">Transparent Pricing</Link></li>
              <li style={{ marginTop: '8px', color: '#94A3B8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--cyan-accent)" />
                NDPA 2023 Compliant
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4>Headquarters</h4>
            <div className="contact-item">
              <MapPin size={18} />
              <span>Plot 1743, Cadastral Zone B, Mabushi, Abuja, FCT, Nigeria</span>
            </div>
            <div className="contact-item">
              <Phone size={18} />
              <span>+234 812 553 1111</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>sadeeqsgi@icloud.com</span>
            </div>
            <div className="contact-item">
              <Clock size={18} />
              <span>Mon - Fri: 9:00 AM - 6:00 PM (WAT)</span>
            </div>
          </div>

        </div>

        {/* Copyright & Quick Legal Links */}
        <div className="footer-bottom">
          <p style={{ marginBottom: '8px' }}>
            &copy; {currentYear} BlueCloud Technologies. All rights reserved. Registered in the Federal Republic of Nigeria.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem' }}>
            <Link to="/privacy" style={{ color: '#94A3B8' }}>Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms" style={{ color: '#94A3B8' }}>Terms of Service</Link>
            <span>•</span>
            <Link to="/refund" style={{ color: '#94A3B8' }}>Refund Policy</Link>
            <span>•</span>
            <Link to="/cookies" style={{ color: '#94A3B8' }}>Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
