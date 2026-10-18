import SEO from '../components/SEO';

const Portfolio = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <SEO
        title="Sadiq Garba Ibrahim — Founder & Engineer Portfolio"
        description="Portfolio of Sadiq Garba Ibrahim — Software Engineer, Cybersecurity Specialist, and Founder of BlueCloud Technologies."
        path="/portfolio"
      />
      <iframe
        src="/portfolio.html"
        title="Sadiq Garba Ibrahim Portfolio"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          display: 'block'
        }}
      />
    </div>
  );
};

export default Portfolio;
