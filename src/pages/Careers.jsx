import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Careers = () => {
  return (
    <div className="section container">
      <SEO
        title="Careers at BlueCloud Technologies | Join Our Team"
        description="Join BlueCloud Technologies and build the future of software engineering, artificial intelligence, and enterprise technology in Nigeria."
        path="/careers"
      />
      <div className="text-center mb-6">
        <h1>Join BlueCloud</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          We are always looking for exceptional engineering talent to help us build the future of enterprise software and AI.
        </p>
      </div>

      <div style={{ backgroundColor: 'var(--light-gray)', padding: 'var(--spacing-5)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--spacing-6)' }}>
        <h2 className="mb-3">Our Culture</h2>
        <p className="mb-3">
          At BlueCloud, we value technical precision, continuous learning, and a problem-solving mindset. We work on challenging projects that require deep technical knowledge and a commitment to quality.
        </p>
        <p>
          If you are passionate about writing clean code, exploring new AI frameworks, or designing scalable architectures, you'll fit right in.
        </p>
      </div>

      <h2 className="mb-4">Open Positions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        
        <div style={{ border: '1px solid var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
          <div>
            <h3 className="mb-1">Senior Frontend Engineer</h3>
            <p style={{ color: 'var(--slate-text)' }}>React, TypeScript, CSS Architecture • Remote / Abuja</p>
          </div>
          <Link to="/contact" className="btn-secondary">Apply Now</Link>
        </div>

        <div style={{ border: '1px solid var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
          <div>
            <h3 className="mb-1">AI / ML Engineer</h3>
            <p style={{ color: 'var(--slate-text)' }}>Python, TensorFlow, PyTorch • Remote / Abuja</p>
          </div>
          <Link to="/contact" className="btn-secondary">Apply Now</Link>
        </div>

        <div style={{ border: '1px solid var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
          <div>
            <h3 className="mb-1">Technical Support Specialist</h3>
            <p style={{ color: 'var(--slate-text)' }}>IT Infrastructure, Customer Success • Abuja</p>
          </div>
          <Link to="/contact" className="btn-secondary">Apply Now</Link>
        </div>

      </div>

      <div className="text-center" style={{ marginTop: 'var(--spacing-6)' }}>
        <p>Don't see a perfect fit? We're always open to meeting talented people.</p>
        <Link to="/contact" style={{ display: 'inline-block', marginTop: 'var(--spacing-2)', fontWeight: 'bold' }}>Send us your resume &rarr;</Link>
      </div>
    </div>
  );
};

export default Careers;
