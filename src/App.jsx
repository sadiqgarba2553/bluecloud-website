import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatAssistant from "./components/ChatAssistant";
import CookieConsent from "./components/CookieConsent";

// Page Imports
import Home from "./pages/Home";
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const AISolutions = lazy(() => import("./pages/AISolutions"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const RateCard = lazy(() => import("./pages/RateCard"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Platform = lazy(() => import("./pages/Platform"));
const Products = lazy(() => import("./pages/Products"));
const Developers = lazy(() => import("./pages/Developers"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const Investors = lazy(() => import("./pages/Investors"));

// Legal & Compliance Imports
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ConeicPrivacyPolicy = lazy(() => import("./pages/ConeicPrivacyPolicy"));
const ConeicInstallerCodes = lazy(() => import("./pages/ConeicInstallerCodes"));
const Terms = lazy(() => import("./pages/Terms"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));

// Portal Imports
const PortalLogin = lazy(() => import("./pages/PortalLogin"));
const PortalDashboard = lazy(() => import("./pages/PortalDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminRoute = lazy(() => import("./components/AdminRoute"));

function RoutePosition() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      target?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <div className="app-container">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="container section" role="status">
              Loading page...
            </div>
          }
        >
          <RoutePosition />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/ai-solutions" element={<AISolutions />} />
            <Route path="/platform" element={<Platform />} />
            <Route path="/products" element={<Products />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/rate-card" element={<RateCard />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/port" element={<Portfolio />} />
            <Route path="/port/index.html" element={<Portfolio />} />
            <Route path="/portfolio.html" element={<Portfolio />} />

            {/* Legal & Compliance Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/coneic/privacy" element={<ConeicPrivacyPolicy />} />
            <Route
              path="/coneic/privacy-policy"
              element={<ConeicPrivacyPolicy />}
            />
            <Route path="/coneic-privacy" element={<ConeicPrivacyPolicy />} />
            <Route
              path="/coneic/installer-codes"
              element={<ConeicInstallerCodes />}
            />
            <Route
              path="/coneic/installer-exit-codes"
              element={<ConeicInstallerCodes />}
            />
            <Route path="/coneic" element={<ConeicPrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/terms-and-conditions" element={<Terms />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/cookies-policy" element={<CookiesPolicy />} />

            {/* Portal Routes */}
            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/portal/dashboard" element={<PortalDashboard />} />
            <Route
              path="/portal/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="*"
              element={
                <section className="container section">
                  <p className="eyebrow">404</p>
                  <h1>Page not found</h1>
                  <p>Try our products, services, or return to the homepage.</p>
                  <Link className="btn-primary" to="/">
                    Back to home
                  </Link>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ChatAssistant />
      <CookieConsent />
    </div>
  );
}

export default App;
