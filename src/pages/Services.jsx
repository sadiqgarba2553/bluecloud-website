import { Monitor, Cpu, Smartphone, Briefcase, CheckCircle } from 'lucide-react';
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
        title="Services — Web Development, AI, Cybersecurity | BlueCloud Technologies"
        description="Explore our enterprise-grade services including responsive web development, AI-powered solutions, and proactive cybersecurity audits."
        path="/services"
      />
      <div className="services-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive, enterprise-grade technical solutions blending traditional software engineering with cutting-edge AI.</p>
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
          <h2 className="mb-2">Need a Custom Technical Solution?</h2>
          <p className="mb-4">Let's discuss how BlueCloud can engineer the right platform for your needs.</p>
          <Link to="/contact" className="btn-primary" style={{ backgroundColor: 'var(--cyan-accent)', color: 'var(--deep-navy)' }}>
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
