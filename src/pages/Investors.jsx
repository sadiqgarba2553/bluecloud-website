import SEO from '../components/SEO';
import InvestorPortal from '../components/InvestorPortal';

const Investors = () => {
  return (
    <div>
      <SEO
        title="Investor Relations & Global 10-Year Strategy — BLUECLOUD"
        description="Explore BLUECLOUD's 10-year global technology vision, market moats, and strategic investment portal."
        path="/investors"
        keywords="BlueCloud investors, tech investment Nigeria, startup investment Africa, technology vision, BlueCloud strategy, investor relations Abuja"
      />
      <div className="container">
        <InvestorPortal />
      </div>
    </div>
  );
};

export default Investors;
