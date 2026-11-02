import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const currentPath = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!isMenuOpen) return;
    navRef.current?.querySelector("a")?.focus();
    const media = window.matchMedia("(max-width: 960px)");
    const onResize = () => {
      if (!media.matches) setIsMenuOpen(false);
    };
    const onPointer = (event) => {
      if (!headerRef.current?.contains(event.target)) setIsMenuOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    media.addEventListener("change", onResize);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      media.removeEventListener("change", onResize);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      toggleRef.current?.focus();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Products",
      path: "/products",
      sections: ["/platform", "/ai-solutions", "/projects"],
    },
    {
      name: "Services",
      path: "/services",
      sections: ["/enterprise", "/rate-card"],
    },
    { name: "Developers", path: "/developers" },
    { name: "About", path: "/about" },
  ];

  return (
    <header
      className="site-header header"
      ref={headerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setIsMenuOpen(false);
      }}
    >
      <div className="container header-inner">
        {/* Logo */}
        <Link
          to="/"
          className="brand"
          aria-label="BlueCloud home"
          onClick={closeMenu}
        >
          <div
            className="logo-placeholder"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              className="brand-logo"
              src="/bluecloud.png"
              alt=""
              width="36"
              height="36"
            />
            <span className="brand-name">BlueCloud</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          id="main-navigation"
          ref={navRef}
          aria-label="Main navigation"
          className={`site-nav ${isMenuOpen ? "is-open" : ""}`}
        >
          {navLinks.map((link) => {
            const active =
              currentPath === link.path || link.sections?.includes(currentPath);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link ${active ? "active" : ""}`}
                aria-current={
                  active
                    ? currentPath === link.path
                      ? "page"
                      : "true"
                    : undefined
                }
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            );
          })}
          {/* Mobile CTA — always rendered, visibility handled by nav-menu CSS */}
          <div className="mobile-nav-cta">
            <Link
              to="/portal/login"
              className="btn-secondary"
              onClick={closeMenu}
              style={{ textAlign: "center" }}
            >
              Client Login
            </Link>
            <Link
              to="/contact"
              className="text-link"
              onClick={closeMenu}
              style={{ textAlign: "center" }}
            >
              Start a project
            </Link>
          </div>
        </nav>

        {/* Desktop CTA */}
        <div
          className="header-actions"
          style={{ alignItems: "center", gap: "var(--spacing-3)" }}
        >
          <Link
            to="/portal/login"
            style={{
              color: "var(--slate-text)",
              fontWeight: "600",
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Client Login
          </Link>
          <Link to="/contact" className="text-link">
            Start a project
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          ref={toggleRef}
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          {isMenuOpen ? (
            <>
              <span>Close</span>
              <X size={20} />
            </>
          ) : (
            <>
              <span>Menu</span>
              <Menu size={20} />
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
