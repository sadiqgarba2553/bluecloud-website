import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'AI Solutions', path: '/ai-solutions' },
    { name: 'Rate Card', path: '/rate-card' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo-link">
          <div className="logo-placeholder" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/icon_no_background.PNG" alt="BlueCloud" style={{ height: '32px', marginRight: 'var(--spacing-1)' }} />
            <span className="logo-text">BLUECLOUD</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          {/* Mobile CTA (only shows when menu open on small screens) */}
          {isMenuOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)' }}>
              <Link to="/portal/login" className="btn-secondary" onClick={() => setIsMenuOpen(false)} style={{ textAlign: 'center' }}>
                Client Login
              </Link>
              <Link to="/contact" className="btn-primary" onClick={() => setIsMenuOpen(false)} style={{ textAlign: 'center' }}>
                Get a Quote
              </Link>
            </div>
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="header-cta" style={{ alignItems: 'center', gap: 'var(--spacing-3)' }}>
          <Link to="/portal/login" style={{ color: 'var(--slate-text)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>
            Client Login
          </Link>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle navigation">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
