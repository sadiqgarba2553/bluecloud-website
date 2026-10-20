import SEO from '../components/SEO';
import { FileText, MapPin, Phone, Mail } from 'lucide-react';
import './LegalPages.css';

const Terms = () => {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="legal-page">
      <SEO
        title="Terms & Conditions | BlueCloud Technologies"
        description="Review the terms and conditions governing the use of BlueCloud Technologies' web platform, software engineering engagements, and consulting services."
        path="/terms"
        keywords="BlueCloud terms and conditions, software contract terms, service agreement Nigeria, engineering terms Abuja"
      />

      <div className="legal-header">
        <div className="container">
          <div className="legal-meta-badge">
            <FileText size={16} /> Legal Agreement
          </div>
          <h1>Terms & Conditions</h1>
          <p>
            Please read these terms and conditions carefully before engaging BlueCloud Technologies for software engineering or accessing our digital platforms.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">
            <div className="legal-highlight-box">
              <p>
                <strong>Last Updated:</strong> {lastUpdated} | <strong>Governing Law:</strong> Laws of the Federal Republic of Nigeria.
              </p>
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By visiting, browsing, or using the website <code>bluecloudai.online</code>, or by commissioning software development, AI model integration, or technical consulting from BlueCloud Technologies ("BlueCloud", "we", "us"), you agree to be legally bound by these Terms and Conditions ("Terms"). If you disagree with any part of these Terms, you must refrain from using our platforms and services.
            </p>

            <h2>2. Scope of Services</h2>
            <p>
              BlueCloud provides enterprise digital engineering services, which may include:
            </p>
            <ul>
              <li>Custom web and cloud software application development.</li>
              <li>Applied artificial intelligence (AI), machine learning pipelines, and LLM integrations.</li>
              <li>Cybersecurity audits, network diagnostics, and penetration testing assessments.</li>
              <li>Digital transformation, API development, and technical IT consulting.</li>
            </ul>
            <p>
              Specific project timelines, deliverables, payment milestones, and technical specifications are governed by a mutually executed Statement of Work (SOW) or written service proposal.
            </p>

            <h2>3. Client Responsibilities & Data Accuracy</h2>
            <p>
              To ensure timely delivery, clients agree to:
            </p>
            <ul>
              <li>Provide accurate, lawful, and complete project specifications, assets, and branding materials.</li>
              <li>Ensure all content, images, and brand assets provided to BlueCloud do not infringe any third-party copyright or trademark rights.</li>
              <li>Review project milestones and provide feedback or approval within five (5) business days of submission.</li>
            </ul>

            <h2>4. Intellectual Property Rights</h2>
            <p>
              <strong>Deliverables:</strong> Upon full and final settlement of all agreed invoices and milestone fees, BlueCloud transfers all rights, title, and ownership of custom bespoke software code and graphical deliverables created specifically for the client.
            </p>
            <p>
              <strong>Pre-Existing IP & Open Source:</strong> BlueCloud retains full ownership of its pre-existing proprietary frameworks, boilerplates, internal algorithms, and general developer utilities. Any open-source libraries or third-party APIs used in client projects remain subject to their respective open-source licenses (e.g., MIT, Apache 2.0).
            </p>

            <h2>5. Payment Terms & Invoicing</h2>
            <ul>
              <li>All project quotes are provided in Nigerian Naira (NGN) or United States Dollars (USD) as designated in the agreement.</li>
              <li>Standard engineering contracts operate on milestone billing (e.g., discovery deposit, design/architecture milestone, alpha/beta deployment, and final release).</li>
              <li>Invoices are payable within fourteen (14) calendar days of issuance unless otherwise stated in the Statement of Work.</li>
            </ul>

            <h2>6. Warranties & Disclaimers</h2>
            <p>
              BlueCloud warrants that services will be performed in a professional, workmanlike manner consistent with recognized modern software engineering standards.
            </p>
            <p>
              Except as expressly stated in a formal Service Level Agreement (SLA), our digital products, website utilities, and demo apps are provided on an "as-is" and "as-available" basis. We do not warrant that third-party APIs, telecom networks, or external cloud hosts will operate uninterrupted or free from outages outside our reasonable control.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable Nigerian law, BlueCloud Technologies, its officers, directors, and developers shall not be liable for any indirect, punitive, incidental, special, or consequential damages resulting from lost business profits, data corruption, or operational interruption arising out of the use of our services or website.
            </p>

            <h2>8. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any controversy or dispute arising out of or relating to these Terms shall first be submitted to good-faith amicable negotiation between the parties. If unresolved within thirty (30) days, the dispute shall be resolved through arbitration or courts located in Abuja, Federal Capital Territory, Nigeria.
            </p>

            <h2>9. Contact Information</h2>
            <div className="legal-contact-card">
              <h3>BlueCloud Technologies — Contracts & Legal Administration</h3>
              <div className="legal-contact-item">
                <MapPin size={18} color="var(--primary-blue)" />
                <span>Plot 1743, Cadastral Zone B, Mabushi, Abuja, FCT, Nigeria</span>
              </div>
              <div className="legal-contact-item">
                <Phone size={18} color="var(--primary-blue)" />
                <span>+234 812 553 1111</span>
              </div>
              <div className="legal-contact-item">
                <Mail size={18} color="var(--primary-blue)" />
                <span>support@bluecloudai.online</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
