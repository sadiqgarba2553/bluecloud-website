import { useState } from 'react';
import { ExternalLink, TrendingUp, Award } from 'lucide-react';
import SEO from '../components/SEO';

const PROJECTS_DATA = [
  {
    id: 1,
    title: 'Cyberion Company',
    domain: 'cyberioncompany.com.ng',
    category: 'Web',
    tags: ['Enterprise Web', 'Security Portal'],
    bg: '#0A1A2F',
    textColor: '#22D3EE',
    roi: '100% Uptime since launch | 2x Faster Retrieval',
    problem: 'Required a secure, highly scalable portal to manage complex enterprise operations without latency.',
    solution: 'Architected a custom web platform with robust backend security protocols, multi-tier auth, and seamless React frontend.',
    impact: 'Achieved 100% uptime with zero security flags and double the retrieval performance.',
    link: 'https://cyberioncompany.com.ng'
  },
  {
    id: 2,
    title: 'FastData Platform',
    domain: 'fastdata.com.ng',
    category: 'Web',
    tags: ['Data Pipeline', 'Web Engine'],
    bg: '#0B5FFF',
    textColor: '#FFFFFF',
    roi: 'Processing Time Reduced from 4h to 15min',
    problem: 'Analyzing high-volume data streams was taking hours and overloading legacy servers.',
    solution: 'Engineered an asynchronous, highly optimized data processing pipeline for enterprise real-time querying.',
    impact: 'Slashing data batch analysis time by 93.7% while maintaining enterprise precision.',
    link: 'https://fastdata.com.ng'
  },
  {
    id: 3,
    title: 'Flux Programming Language',
    domain: 'flux-language',
    category: 'Tools',
    tags: ['Compiler', 'Developer Tools'],
    imgSrc: '/fluxlanguageimage.png',
    roi: '40% Faster Business Logic Execution',
    problem: 'Existing programming languages lacked specialized domain syntax for accelerated enterprise logic writing.',
    solution: 'Engineered a custom compiler, AST parser, language toolchain, and developer ecosystem from the ground up.',
    impact: 'Empowered internal software engineers to author robust business logic 40% faster.',
    link: '/flux-website/index.html'
  },
  {
    id: 4,
    title: 'Prism Studio App',
    domain: 'prism-studio',
    category: 'App',
    tags: ['Desktop App', 'Workspace Editor'],
    imgSrc: '/prism_studio_icon.png',
    roi: '+30% Developer Productivity Gain',
    problem: 'Software engineering teams had to context-switch across 5 separate applications daily.',
    solution: 'Created a unified, high-performance studio app integrating code editing, previewing, and asset management.',
    impact: 'Increased team productivity by over 30% and unified developer workflows into one interface.',
    link: '/prism-studio/index.html'
  },
  {
    id: 5,
    title: 'Tool Deck Developer Suite',
    domain: 'tool-deck',
    category: 'Web',
    tags: ['Developer Tools', 'Browser Utilities'],
    imgSrc: '/tooldecklogo.png',
    roi: '10,000+ Active Monthly Users',
    problem: 'No central, zero-latency browser suite existed for instant developer utilities and formatters.',
    solution: 'Built a light, superfast web app packed with essential encoding, formatting, and debugging tools.',
    impact: 'Adopted by over 10,000 active monthly developers worldwide for daily utility tasks.',
    link: '/tool-deck/index.html'
  },
  {
    id: 6,
    title: 'Quranly AI & Audio Platform',
    domain: 'quranly',
    category: 'App',
    tags: ['AI & Audio', 'Mobile & PWA', 'Quran Platform'],
    imgSrc: '/quranlylogo.png',
    roi: '100+ Reciters | Sub-Second Audio CDN | Gemini AI Tafsir',
    problem: 'Need for a peaceful, ad-free digital Quran application integrating real-time AI tafsir, global reciter streaming, and offline audio.',
    solution: 'Engineered a high-performance cross-platform Progressive Web & Mobile App powered by Gemini AI, responsive audio playback engine, indexedDB caching, and tajweed study analytics.',
    impact: 'Delivered sub-second audio streaming across global CDNs with seamless offline persistence and multi-device sync.',
    link: '/quranly/'
  },
  {
    id: 7,
    title: 'Tunnel Arcade Gaming Platform',
    domain: 'tunnel',
    category: 'App',
    tags: ['Arcade Gaming', 'PWA & Web Audio', 'Retro Games'],
    imgSrc: '/tunnel_icon.svg',
    roi: '16 Games | 2P Versus & Co-Op | Global Leaderboards | Full Offline PWA',
    problem: 'Web gaming portals are often cluttered with invasive ads, slow heavy bundles, and poor cross-device touch controls.',
    solution: 'Built a next-generation 1980s-90s retro arcade web platform with 16 handcrafted vector games, 2-player local versus/co-op, retro chiptune jukebox, global leaderboards, real-time Web Audio API chiptune synthesis, and 1-click PWA installation.',
    impact: 'Zero-latency 60 FPS performance across desktop, tablet, and mobile with complete offline standalone play capability.',
    link: '/tunnel/index.html'
  },
  {
    id: 8,
    title: 'Mods Social & Creator Platform',
    domain: 'mods-app',
    category: 'App',
    tags: ['Social Media', 'Creator Economy', 'React Native & Web', 'Video Platform'],
    imgSrc: '/mods_logo.png',
    roi: 'Real-Time Feed & Video Streaming | Tiered Verification | Full Cross-Platform Web & Mobile',
    problem: 'Modern creators and online communities require high-fidelity multimedia sharing with zero latency, transparent verification badges, and unified web and mobile apps.',
    solution: 'Engineered a modern social and multimedia streaming platform featuring dynamic video feeds, multi-image carousels, tiered blue and gold verification systems, Supabase real-time database, and responsive dual-layer UI.',
    impact: 'Delivered smooth 60 FPS media feeds with sub-second post distribution, real-time engagement notifications, and seamless cross-platform deployment.',
    link: '/mods/index.html'
  },
  {
    id: 9,
    title: 'CargoLedger Logistics Operating System',
    domain: 'cargoledger',
    category: 'Web',
    tags: ['Logistics & Freight', 'Supply Chain', 'Enterprise ERP', 'Next.js'],
    imgSrc: '/cargoledger_logo.svg',
    roi: 'End-to-End Shipment Tracking | Automated Manifests | 100% Paperless Logistics Pipeline',
    problem: 'Small freight forwarders and logistics operators outgrow spreadsheets and fragmented WhatsApp threads without the budget or flexibility for legacy enterprise ERPs.',
    solution: 'Architected an elegant shipment management platform for logistics operators featuring real-time status pipelines, automated customer updates, digital airway bills, invoice tracking, and bank-ledger precision UI.',
    impact: 'Eliminated manual shipment tracking overhead, boosted manifest generation speed by 75%, and established automated customer milestone transparency.',
    link: '/cargoledger/index.html'
  },
  {
    id: 10,
    title: 'WiFi Master Wireless Security Suite',
    domain: 'wifi-master',
    category: 'Tools',
    tags: ['Cybersecurity', 'Wireless Audit', 'Penetration Testing', 'Python & Web Engine'],
    imgSrc: '/wifi_master_icon.svg',
    roi: 'Aircrack-ng Automation | Handshake Capture | Monitor Mode Toggle | 80% Faster Audit Setup',
    problem: 'Wireless security audits and penetration testing workflows often require executing fragmented CLI commands across multiple separate tools, causing human error and slow diagnostic cycles.',
    solution: 'Engineered an end-to-end Python and web-based automation suite for wireless security diagnostics, automated monitor mode toggling, WPA/WPA2 handshake interception, network scoping, and deauthentication analysis.',
    impact: 'Accelerated wireless penetration testing setup time by 80% while standardizing capture formats and diagnostic logs for security teams.',
    link: '/wifi-master/index.html'
  }
];

const Projects = () => {
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === filter || p.tags.includes(filter));


  return (
    <div className="section container">
      <SEO
        title="Our Projects & Case Studies — BlueCloud Portfolio"
        description="Explore our enterprise deployments, ROI metrics, and technical case studies including Cyberion, FastData, WiFi Master, CargoLedger, Mods App, Flux Language, Prism Studio, Tool Deck, and Quranly."
        path="/projects"
        keywords="BlueCloud projects, web development portfolio Nigeria, case studies, WiFi Master, CargoLedger, Mods App, Cyberion, FastData, Flux programming language, Prism Studio, Tool Deck, Quranly, cybersecurity Nigeria, tech portfolio Abuja"
      />
      <div className="text-center mb-6">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>
          <TrendingUp size={18} /> Verified Case Studies & Impact Metrics
        </div>
        <h1>Our Case Studies & Portfolio</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', color: 'var(--slate-text)' }}>
          Explore our recent enterprise software deployments, technical solutions, and verified ROI metrics.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'center', marginBottom: 'var(--spacing-5)', flexWrap: 'wrap' }}>
        {['All', 'Web', 'App', 'Tools'].map((cat) => (
          <button 
            key={cat}
            className={filter === cat ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
        <a href="/portfolio.html" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Founder Portfolio <ExternalLink size={14} />
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-4)' }}>
        {filteredProjects.map((project) => (
          <div key={project.id} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--light-gray)', backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
            {project.imgSrc ? (
              <img src={project.imgSrc} alt={project.title} style={{ width: '100%', height: '180px', objectFit: 'contain', backgroundColor: 'var(--light-gray)', padding: '20px' }} />
            ) : (
              <div style={{ height: '180px', backgroundColor: project.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: project.textColor, fontSize: '1.4rem', fontWeight: 'bold' }}>
                {project.title}
              </div>
            )}

            <div style={{ padding: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {project.tags.map((t, idx) => (
                  <span key={idx} style={{ backgroundColor: 'var(--light-gray)', color: 'var(--primary-blue)', fontSize: '0.75rem', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                    {t}
                  </span>
                ))}
              </div>

              <h3 className="mb-2" style={{ fontSize: '1.2rem' }}>{project.title}</h3>

              {/* ROI Metrics Tag */}
              <div style={{ backgroundColor: 'rgba(11, 95, 255, 0.08)', border: '1px solid rgba(11, 95, 255, 0.2)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary-blue)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} /> {project.roi}
              </div>

              <div style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--slate-text)' }}>
                <p style={{ marginBottom: '4px' }}><strong>Problem:</strong> {project.problem}</p>
                <p style={{ marginBottom: '4px' }}><strong>Solution:</strong> {project.solution}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Visit Solution <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;



