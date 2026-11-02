import {
  Monitor,
  Cpu,
  Smartphone,
  Briefcase,
  Share2,
  Palette,
  Film,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SEO from "../components/SEO";
import TechStackExplorer from "../components/TechStackExplorer";
import ResourceDownloads from "../components/ResourceDownloads";
import SMELaunchpad from "../components/SMELaunchpad";
import "./Services.css";

const faqData = [
  {
    question: "How much does it cost to build a website in Nigeria?",
    answer:
      "Website costs vary based on complexity. A basic corporate website starts from ₦150,000, while custom web applications with advanced features like AI integration, user dashboards, and API backends range from ₦500,000 to ₦5,000,000+. BlueCloud provides transparent pricing through our Rate Card and offers free consultations to scope your project accurately.",
  },
  {
    question: "What services does BlueCloud Technologies offer?",
    answer:
      "BlueCloud offers a comprehensive suite of technology and creative services: Website Development, AI Solutions & Automation, Mobile/Desktop App Development, Social Media Management, Graphics Design, Video Editing, and Technical Consulting & Support. We serve clients across Nigeria and worldwide.",
  },
  {
    question: "How long does it take to build a web application?",
    answer:
      "A standard corporate website takes 2-4 weeks. Custom web applications typically take 4-12 weeks depending on complexity, features, and integrations required. Enterprise-grade platforms with AI integration, security layers, and multiple user roles can take 3-6 months. We provide detailed timelines during our initial consultation.",
  },
  {
    question: "Does BlueCloud work with clients outside Nigeria?",
    answer:
      "Yes. While BlueCloud is headquartered in Abuja, Nigeria, we serve clients worldwide. We work with businesses across Africa, the UK, and the US, providing remote collaboration through modern project management tools, regular video calls, and transparent progress reporting.",
  },
  {
    question: "Can BlueCloud integrate AI into my existing business systems?",
    answer:
      "Absolutely. We specialize in integrating AI capabilities into existing business workflows. This includes AI chatbots, predictive analytics dashboards, automated document processing, intelligent automation pipelines, and custom machine learning models tailored to your industry. We assess your current infrastructure and design AI solutions that work with your existing systems.",
  },
  {
    question: "Does BlueCloud offer ongoing support after project delivery?",
    answer:
      "Support, maintenance and ongoing development can be scoped into your agreement. Response times, availability targets and retainer arrangements depend on the project.",
  },
];

const Services = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    {
      id: "web",
      title: "Website Development",
      icon: <Monitor size={40} />,
      description:
        "Websites, customer portals and web applications designed around your customers and operations. We work across the interface, backend and integrations.",
      capabilities: [
        "Custom Web Applications",
        "Corporate Websites & Portals",
        "E-commerce Solutions",
        "Frontend & Backend Engineering",
        "CMS Integration",
      ],
    },
    {
      id: "ai",
      title: "AI Solutions & Automation",
      icon: <Cpu size={40} />,
      description:
        "Connect AI to a specific workflow: document processing, assistants, analysis or automation. Start with the task and choose a model and integration approach that fits.",
      capabilities: [
        "Workflow Automation",
        "Predictive Analytics",
        "AI Chatbots & Virtual Assistants",
        "Data Integration & Processing",
        "Custom ML Model Deployment",
      ],
    },
    {
      id: "app",
      title: "Application Development",
      icon: <Smartphone size={40} />,
      description:
        "Native and cross-platform application development tailored for iOS, Android, and Desktop environments. We focus on intuitive interfaces, offline capabilities, and seamless API integrations.",
      capabilities: [
        "iOS & Android Apps",
        "Cross-Platform Development (React Native/Flutter)",
        "Desktop Applications",
        "UI/UX Design Strategy",
        "App Maintenance & Scaling",
      ],
    },
    {
      id: "social-media",
      title: "Social Media Management",
      icon: <Share2 size={40} />,
      description:
        "Build a powerful, consistent online presence with our end-to-end social media management services. We craft compelling content strategies, manage your brand voice, and drive measurable engagement across all major platforms.",
      capabilities: [
        "Content Strategy & Calendar Planning",
        "Platform Management (Instagram, X, LinkedIn, Facebook, TikTok)",
        "Community Engagement & Growth",
        "Analytics & Performance Reporting",
        "Paid Social Advertising Campaigns",
      ],
    },
    {
      id: "graphics",
      title: "Graphics Design",
      icon: <Palette size={40} />,
      description:
        "A coherent visual identity for your business, from logos and presentation design to digital and print materials.",
      capabilities: [
        "Brand Identity & Logo Design",
        "Marketing & Promotional Materials",
        "Social Media Graphics & Templates",
        "Presentation Design (Pitch Decks)",
        "Print & Digital Collateral",
      ],
    },
    {
      id: "video",
      title: "Video Editing",
      icon: <Film size={40} />,
      description:
        "Editing, sound, colour and captions for clear, purposeful video. Support for company presentations, campaigns and short-form content.",
      capabilities: [
        "Corporate & Promotional Videos",
        "Short-Form Social Media Content (Reels, TikToks, Shorts)",
        "Motion Graphics & Animations",
        "Color Grading & Audio Mixing",
        "Subtitle & Caption Integration",
      ],
    },
    {
      id: "consulting",
      title: "Technical Consulting & Support",
      icon: <Briefcase size={40} />,
      description:
        "Work through architecture decisions, existing systems, deployment and maintenance. Agree requirements and support arrangements before implementation.",
      capabilities: [
        "System Architecture Design",
        "Security Audits & Compliance",
        "Cloud Infrastructure Setup",
        "DevOps & CI/CD Pipelines",
        "Support and maintenance planning",
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Services — Development, AI & Creative Work | BlueCloud"
        description="Web and app development, applied AI, consulting, design, video and social media services from BlueCloud in Abuja."
        path="/services"
        faq={faqData}
      />
      <header className="page-hero container">
        <p className="eyebrow">Our services</p>
        <h1>
          Good technology starts
          <br />
          with a clear purpose.
        </h1>
        <p className="lead">
          Software development, applied AI, technical advice and creative work.
          Choose the support that fits your next step.
        </p>
        <div className="hero-actions">
          <Link className="button" to="/contact">
            Discuss your project →
          </Link>
          <Link className="text-link" to="/rate-card">
            View rate card →
          </Link>
        </div>
      </header>
      {services.map((service, index) => (
        <section
          key={service.id}
          className="section container service-detail"
          id={service.id}
          aria-labelledby={`${service.id}-heading`}
        >
          <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
          <h2 id={`${service.id}-heading`}>{service.title}</h2>
          <div>
            <p>{service.description}</p>
            <details className="service-capabilities">
              <summary>Typical capabilities</summary>
              <ul>
                {service.capabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
            </details>
            <Link className="text-link" to="/contact">
              Discuss this service →
            </Link>
            {service.id === "social-media" && (
              <a className="text-link" href="/BlueCloud_Rate_Card.pdf" download>
                Download rate card ↓
              </a>
            )}
          </div>
        </section>
      ))}
      <section className="section container">
        <div className="services-layout">
          <div className="section-intro">
            <p className="eyebrow">For your organization</p>
            <h2>Plan around the way you work.</h2>
          </div>
          <div>
            <p className="lead muted">
              Cloud infrastructure, business systems and project planning.
              Explore the existing calculators, ERP examples and proposal tools.
            </p>
            <Link className="text-link" to="/enterprise">
              Enterprise offerings & tools →
            </Link>
          </div>
        </div>
      </section>
      <section className="section container" aria-labelledby="planning-heading">
        <div className="section-header">
          <div>
            <p className="eyebrow">Plan your next step</p>
            <h2 id="planning-heading">Packages, tools & resources.</h2>
          </div>
        </div>
        <details className="planning-tools">
          <summary>Small business packages</summary>
          <SMELaunchpad />
        </details>
        <details className="planning-tools">
          <summary>Explore the technology stack</summary>
          <TechStackExplorer />
        </details>
        <details className="planning-tools">
          <summary>Download technical guides</summary>
          <ResourceDownloads />
        </details>
      </section>
      <section className="section container" id="faq">
        <div className="services-layout">
          <div className="section-intro">
            <p className="eyebrow">Questions, answered</p>
            <h2>A little more detail.</h2>
          </div>
          <div className="service-faq">
            {faqData.map((item, index) => (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={openFaq === index}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    {item.question}
                    <ChevronDown size={20} aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} hidden={openFaq !== index}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="contact-band">
        <div className="container contact-grid">
          <h2>What are you working on?</h2>
          <div>
            <p>
              Tell us what you need to achieve. We’ll work through the scope and
              next steps with you.
            </p>
            <Link to="/contact" className="button button-inverse">
              Tell us about your project →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default Services;
