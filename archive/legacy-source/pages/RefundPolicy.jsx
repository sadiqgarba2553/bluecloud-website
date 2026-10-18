import SEO from '../components/SEO';
import { RefreshCw, MapPin, Phone, Mail } from 'lucide-react';
import './LegalPages.css';

const RefundPolicy = () => {
  const lastUpdated = "September 15, 2026";

  return (
    <div className="legal-page">
      <SEO
        title="Refund & Cancellation Policy | BlueCloud Technologies"
        description="Understand BlueCloud Technologies' transparent refund, milestone acceptance, and cancellation policies for digital engineering and software services."
        path="/refund"
        keywords="BlueCloud refund policy, software project refund Nigeria, service cancellation policy Abuja"
      />

      <div className="legal-header">
        <div className="container">
          <div className="legal-meta-badge">
            <RefreshCw size={16} /> Financial Transparency
          </div>
          <h1>Refund & Cancellation Policy</h1>
          <p>
            We pride ourselves on technical excellence, transparent milestones, and mutual clarity regarding project payments and refunds.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="legal-container">
          <div className="legal-content">
            <div className="legal-highlight-box">
              <p>
                <strong>Last Updated:</strong> {lastUpdated} | <strong>Applies To:</strong> All bespoke software engineering, AI deployment, consulting, and web development contracts.
              </p>
            </div>

            <h2>1. Nature of Our Services</h2>
            <p>
              BlueCloud Technologies delivers custom, labor-intensive software engineering, architectural consulting, UI/UX design, and AI model implementations. Because engineering resources, specialized cloud compute, and dedicated developer hours are deployed upon contract commencement, our refund terms are structured around project milestones.
            </p>

            <h2>2. Discovery & Initial Project Deposits</h2>
            <p>
              Initial deposits (typically 30% to 50% depending on the project scope) fund comprehensive discovery workshops, technical architecture blueprints, wireframing, and environment provisioning:
            </p>
            <ul>
              <li>
                <strong>Prior to Kickoff:</strong> If a client requests cancellation in writing within forty-eight (48) hours of contract execution and before architectural work has commenced, a 90% refund of the deposit will be issued (less 10% administrative and transaction gateway fees).
              </li>
              <li>
                <strong>After Discovery Commencement:</strong> Once technical architecture diagrams, wireframes, or code scaffolds have been initiated, the initial deposit becomes non-refundable to cover expended engineering hours.
              </li>
            </ul>

            <h2>3. Milestone-Based Development</h2>
            <p>
              Most projects are segmented into clear, verifiable deliverables (e.g., Milestone 1: UX/Architecture Scaffolding; Milestone 2: Core Frontend & Backend API; Milestone 3: QA, Staging & Integration; Milestone 4: Production Deployment):
            </p>
            <ul>
              <li>
                <strong>Approval & Acceptance:</strong> When a milestone is demonstrated and accepted by the client, the corresponding milestone payment is final and non-refundable.
              </li>
              <li>
                <strong>Revision Cycle:</strong> Each milestone includes up to two (2) rounds of revisions within the agreed scope to ensure the deliverable meets documented specifications before final sign-off.
              </li>
              <li>
                <strong>Incomplete Milestones:</strong> If a project is terminated mid-stream by mutual agreement, the client will only be billed on a pro-rata basis for verified work completed up to the termination date.
              </li>
            </ul>

            <h2>4. Maintenance & Monthly Retainer Services</h2>
            <p>
              For ongoing SLA maintenance, DevOps retainers, and continuous AI monitoring packages:
            </p>
            <ul>
              <li>Retainer agreements may be cancelled at any time by providing thirty (30) days prior written notice.</li>
              <li>Fees paid for the current active billing cycle are non-refundable, and BlueCloud will continue providing maintenance support until the end of that billing period.</li>
            </ul>

            <h2>5. Out-of-Scope Requests & Revisions</h2>
            <p>
              Requests for features, architecture shifts, or redesigns outside the initial Statement of Work (SOW) are treated as Change Orders. Refusal to pay for requested out-of-scope additions does not constitute grounds for requesting a refund on already completed in-scope deliverables.
            </p>

            <h2>6. Requesting a Review or Dispute</h2>
            <p>
              If you believe a deliverable materially fails to meet agreed written specifications, please submit a formal review request within seven (7) business days of deliverable handover:
            </p>
            <ol>
              <li>Detail the specific functional requirements that deviate from the contract.</li>
              <li>Provide reproduction steps, test cases, or screenshots.</li>
              <li>Our lead architect will investigate and provide corrective remediation or a financial adjustment within five (5) business days.</li>
            </ol>

            <div className="legal-contact-card">
              <h3>BlueCloud Technologies — Billing & Finance Desk</h3>
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
                <span>sadeeqsgi@icloud.com</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
