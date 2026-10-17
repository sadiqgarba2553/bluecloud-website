import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CookieConsent from './components/CookieConsent';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AISolutions from './pages/AISolutions';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import RateCard from './pages/RateCard';
import Portfolio from './pages/Portfolio';
import Platform from './pages/Platform';
import Developers from './pages/Developers';
import Enterprise from './pages/Enterprise';
import Investors from './pages/Investors';

// Legal & Compliance Imports
import PrivacyPolicy from './pages/PrivacyPolicy';
import ConeicPrivacyPolicy from './pages/ConeicPrivacyPolicy';
import ConeicInstallerCodes from './pages/ConeicInstallerCodes';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import CookiesPolicy from './pages/CookiesPolicy';

// Portal Imports
import PortalLogin from './pages/PortalLogin';
import PortalDashboard from './pages/PortalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/ai-solutions" element={<AISolutions />} />
          <Route path="/platform" element={<Platform />} />
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
          <Route path="/coneic/privacy-policy" element={<ConeicPrivacyPolicy />} />
          <Route path="/coneic-privacy" element={<ConeicPrivacyPolicy />} />
          <Route path="/coneic/installer-codes" element={<ConeicInstallerCodes />} />
          <Route path="/coneic/installer-exit-codes" element={<ConeicInstallerCodes />} />
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
          <Route path="/portal/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
      <CookieConsent />
    </div>
  );
}

export default App;
