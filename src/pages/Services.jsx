import { Monitor, Cpu, Smartphone, Briefcase, Share2, Palette, Film, CheckCircle, Download, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './Services.css';

const Services = () => {
  const services = [
    {
      id: 'web',
      title: 'Website Development',
      icon: <Monitor size={40} />,
      description: 'We build high-performance, secure, and scalable web applications designed to elevate your enterprise. From complex corporate portals to robust SaaS platforms, our engineering ensures a flawless user experience across all devices.',
      capabilities: [
        'Custom Web Applications',
        'Corporate Websites & Portals',
        'E-commerce Solutions',
        'Frontend & Backend Engineering',
        'CMS Integration'
      ]
    },
    {
      id: 'ai',
      title: 'AI Solutions & Automation',
      icon: <Cpu size={40} />,
      description: 'Transform your operations with applied Artificial Intelligence. We implement intelligent automation, machine learning models, and advanced data processing tools to streamline workflows and reduce overhead.',
      capabilities: [
        'Workflow Automation',
        'Predictive Analytics',
        'AI Chatbots & Virtual Assistants',
        'Data Integration & Processing',
        'Custom ML Model Deployment'
      ]
    },
    {
      id: 'app',
      title: 'Application Development',
      icon: <Smartphone size={40} />,
      description: 'Native and cross-platform application development tailored for iOS, Android, and Desktop environments. We focus on intuitive interfaces, offline capabilities, and seamless API integrations.',
      capabilities: [
        'iOS & Android Apps',
        'Cross-Platform Development (React Native/Flutter)',
        'Desktop Applications',
        'UI/UX Design Strategy',
        'App Maintenance & Scaling'
      ]
    },
    {
      id: 'social-media',
      title: 'Social Media Management',
      icon: <Share2 size={40} />,
      description: 'Build a powerful, consistent online presence with our end-to-end social media management services. We craft compelling content strategies, manage your brand voice, and drive measurable engagement across all major platforms.',
      capabilities: [
        'Content Strategy & Calendar Planning',
        'Platform Management (Instagram, X, LinkedIn, Facebook, TikTok)',
        'Community Engagement & Growth',
        'Analytics & Performance Reporting',
        'Paid Social Advertising Campaigns'
      ]
    },
    {
      id: 'graphics',
      title: 'Graphics Design',
      icon: <Palette size={40} />,
      description: 'Visuals that communicate, captivate, and convert. Our design team crafts brand identities, marketing materials, and digital assets that make your business impossible to ignore.',
      capabilities: [
        'Brand Identity & Logo Design',
        'Marketing & Promotional Materials',
        'Social Media Graphics & Templates',
        'Presentation Design (Pitch Decks)',
        'Print & Digital Collateral'
      ]
    },
    {
      id: 'video',
      title: 'Video Editing',
      icon: <Film size={40} />,
      description: 'Cinematic, engaging video content that tells your story with impact. From raw footage to polished final cuts, we handle every aspect of post-production to deliver videos that keep audiences watching.',
      capabilities: [
        'Corporate & Promotional Videos',
        'Short-Form Social Media Content (Reels, TikToks, Shorts)',
        'Motion Graphics & Animations',
        'Color Grading & Audio Mixing',
        'Subtitle & Caption Integration'
      ]
    },
    {
      id: 'consulting',
      title: 'Technical Consulting & Support',
      icon: <Briefcase size={40} />,
      description: 'Strategic IT guidance to future-proof your digital infrastructure. We audit existing systems, recommend architectural improvements, and provide ongoing technical support to keep your business running smoothly.',
      capabilities: [
        'System Architecture Design',
        'Security Audits & Compliance',
        'Cloud Infrastructure Setup',
        'DevOps & CI/CD Pipelines',
        '24/7 Technical Support'
      ]
    }
  ];

  return (
    <div>
      <SEO
        title="Services — Web Development, AI, Social Media, Design & Video | BlueCloud Technologies"
        description="Explore our full suite of services including web development, AI solutions, social media management, graphics design, video editing, and technical consulting."
        path="/services"
      />
      <div className="services-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive, enterprise-grade technical and creative solutions — from cutting-edge software to stunning content creation.</p>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 'var(--spacing-8)' }}>
        {services.map((service) => (
          <section key={service.id} className="service-detail-section" id={service.id}>
            <div className="service-detail-grid">
              <div className="service-detail-content">
                <div className="service-icon-large">
                  {service.icon}
                </div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                
                <h3 style={{ fontSize: '1.1rem', marginTop: 'var(--spacing-3)', marginBottom: 'var(--spacing-2)' }}>
                  Key Capabilities
                </h3>
                <ul className="capabilities-list">
                  {service.capabilities.map((cap, idx) => (
                    <li key={idx}>
                      <CheckCircle size={20} />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>

                {/* Rate Card CTA for Social Media */}
                {service.id === 'social-media' && (
                  <div className="rate-card-inline-cta">
                    <FileText size={22} />
                    <div>
                      <span className="rate-card-label">Transparent Pricing Available</span>
                      <p className="rate-card-sub">Download our Social Media Management Rate Card to see our packages and pricing.</p>
                    </div>
                    <div className="rate-card-actions">
                      <Link to="/rate-card" className="btn-primary rate-card-btn">
                        <ExternalLink size={16} /> View Rate Card
                      </Link>
                      <a
                        href="/BlueCloud_Rate_Card.pdf"
                        download="BlueCloud_Rate_Card.pdf"
                        className="btn-secondary rate-card-btn"
                      >
                        <Download size={16} /> Download PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="service-detail-visual">
                {service.title} Abstract Visual
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Final CTA */}
      <section className="section section-dark text-center">
        <div className="container">
          <h2 className="mb-2">Need a Custom Solution?</h2>
          <p className="mb-4">Whether it's tech, content, or creative — BlueCloud delivers. Let's build something great together.</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary" style={{ backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}>
              Schedule a Consultation
            </Link>
            <Link to="/rate-card" className="btn-secondary" style={{ borderColor: 'var(--cyan-accent)', color: 'var(--cyan-accent)' }}>
              View Rate Card
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
