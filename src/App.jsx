import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Page Imports
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import AISolutions from './pages/AISolutions';
import Careers from './pages/Careers';
import Contact from './pages/Contact';

// Portal Imports
import PortalLogin from './pages/PortalLogin';
import PortalDashboard from './pages/PortalDashboard';

function App() {
  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith('/portal');

  return (
    <div className="app-container">
      {!isPortalRoute && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/ai-solutions" element={<AISolutions />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Portal Routes */}
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
        </Routes>
      </main>
      {!isPortalRoute && <Footer />}
    </div>
  );
}

export default App;
