import { Monitor, Cpu, Smartphone, Briefcase, Share2, Palette, Film, CheckCircle, Download, FileText, ExternalLink, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SEO from '../components/SEO';
import TechStackExplorer from '../components/TechStackExplorer';
import ResourceDownloads from '../components/ResourceDownloads';
import SMELaunchpad from '../components/SMELaunchpad';
import './Services.css';

const faqData = [
  {
    question: 'How much does it cost to build a website in Nigeria?',
    answer: 'Website costs vary based on complexity. A basic corporate website starts from ₦150,000, while custom web applications with advanced features like AI integration, user dashboards, and API backends range from ₦500,000 to ₦5,000,000+. BlueCloud provides transparent pricing through our Rate Card and offers free consultations to scope your project accurately.',
  },
  {
    question: 'What services does BlueCloud Technologies offer?',
    answer: 'BlueCloud offers a comprehensive suite of technology and creative services: Website Development, AI Solutions & Automation, Mobile/Desktop App Development, Social Media Management, Graphics Design, Video Editing, and Technical Consulting & Support. We serve clients across Nigeria and worldwide.',
  },
  {
    question: 'How long does it take to build a web application?',
    answer: 'A standard corporate website takes 2-4 weeks. Custom web applications typically take 4-12 weeks depending on complexity, features, and integrations required. Enterprise-grade platforms with AI integration, security layers, and multiple user roles can take 3-6 months. We provide detailed timelines during our initial consultation.',
  },
  {
    question: 'Does BlueCloud work with clients outside Nigeria?',
    answer: 'Yes. While BlueCloud is headquartered in Abuja, Nigeria, we serve clients worldwide. We work with businesses across Africa, the UK, and the US, providing remote collaboration through modern project management tools, regular video calls, and transparent progress reporting.',
  },
  {
    question: 'Can BlueCloud integrate AI into my existing business systems?',
    answer: 'Absolutely. We specialize in integrating AI capabilities into existing business workflows. This includes AI chatbots, predictive analytics dashboards, automated document processing, intelligent automation pipelines, and custom machine learning models tailored to your industry. We assess your current infrastructure and design AI solutions that work with your existing systems.',
  },
  {
    question: 'Does BlueCloud offer ongoing support after project delivery?',
    answer: 'Yes. We provide 24/7 technical support, maintenance packages, and ongoing development services. Our enterprise clients benefit from SLA-backed support with guaranteed response times. We also offer retainer packages for businesses that need continuous development and optimization.',
  },
];

const Services = () => {
  const [openFaq, setOpenFaq] = useState(null);

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
        description="Explore our full suite of services including web development, AI solutions, social media management, graphics design, video editing, and technical consulting. Based in Abuja, Nigeria."
        path="/services"
        keywords="web development services Nigeria, AI solutions Abuja, social media management Nigeria, graphics design Abuja, video editing services, technical consulting Nigeria, website cost Nigeria, app development Nigeria, BlueCloud services, hire developer Nigeria"
        faq={faqData}
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

        {/* Small Business & SME Launchpad */}
        <SMELaunchpad />

        {/* Tech Stack Explorer Component */}
        <TechStackExplorer />

        {/* Free Technical Resource Downloads Component */}
        <ResourceDownloads />

        {/* FAQ Section — targets Google FAQ Rich Results */}
        <section className="faq-section" id="faq" style={{ marginTop: 'var(--spacing-8)' }}>
          <div className="text-center mb-6">
            <h2>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--slate-text)', maxWidth: '600px', margin: '0 auto' }}>
              Common questions about our services, pricing, and process.
            </p>
          </div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqData.map((item, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--light-gray)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--spacing-2)',
                  overflow: 'hidden',
                  backgroundColor: 'var(--white)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--heading-color)',
                    textAlign: 'left',
                    gap: 'var(--spacing-2)',
                  }}
                  aria-expanded={openFaq === index}
                  id={`faq-btn-${index}`}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                      color: 'var(--primary-blue)',
                    }}
                  />
                </button>
                {openFaq === index && (
                  <div
                    style={{
                      padding: '0 var(--spacing-4) var(--spacing-3)',
                      color: 'var(--slate-text)',
                      lineHeight: 1.7,
                      fontSize: '0.95rem',
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
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
