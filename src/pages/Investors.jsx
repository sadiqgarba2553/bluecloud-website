import SEO from '../components/SEO';
import InvestorPortal from '../components/InvestorPortal';

const Investors = () => {
  return (
    <div>
      <SEO
        title="Investor Relations & Global 10-Year Strategy — BLUECLOUD"
        description="Explore BLUECLOUD's 10-year global technology vision, market moats, and strategic investment portal."
        path="/investors"
      />
      <div className="container">
        <InvestorPortal />
      </div>
    </div>
  );
};

export default Investors;
