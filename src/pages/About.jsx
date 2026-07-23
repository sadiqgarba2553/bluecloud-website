import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About = () => {
  return (
    <div className="section container">
      <SEO
        title="About BlueCloud Technologies — Nigerian Software Engineering Company"
        description="BlueCloud Technologies is a Nigerian technology company focused on premium web development, AI solutions, and enterprise software. Founded by Sadiq Garba Ibrahim."
        path="/about"
      />
      <h1 className="mb-4">About BlueCloud</h1>
      <p className="mb-4" style={{ fontSize: '1.2rem', maxWidth: '800px' }}>
        BlueCloud is a Nigerian technology company focused on delivering premium web development, AI solutions, applications, and general technical services to forward-thinking enterprises.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-6)' }}>
        <div style={{ backgroundColor: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="mb-2">Our Mission</h3>
          <p>To empower businesses through robust software engineering and applied artificial intelligence, creating solutions that are precise, innovative, and dependable.</p>
        </div>
        <div style={{ backgroundColor: 'var(--light-gray)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="mb-2">Our Vision</h3>
          <p>To be the premier technical partner for enterprises across Africa, recognized for our technical depth and uncompromising quality standards.</p>
        </div>
      </div>

      <div className="text-center" style={{ marginTop: 'var(--spacing-8)', padding: 'var(--spacing-6)', backgroundColor: 'var(--deep-navy)', color: 'var(--white)', borderRadius: 'var(--radius-lg)' }}>
        <h2 style={{ color: 'var(--white)' }} className="mb-3">Meet the Leadership</h2>
        <img src="/imageofceo.PNG" alt="CEO" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto var(--spacing-3)', display: 'block' }} />
        <h3 style={{ color: 'var(--white)', marginBottom: '8px' }}>Sadiq Garba <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--mint-accent)' }}>— Founder / CEO</span></h3>
        <p style={{ color: '#94A3B8', marginBottom: '16px' }}>Driving innovation and technical excellence at BlueCloud.</p>
        <a href="/portfolio.html" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', padding: '8px 24px', fontSize: '0.9rem' }}>View Portfolio</a>
      </div>
    </div>
  );
};

export default About;
