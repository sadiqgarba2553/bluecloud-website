import { Link } from "react-router-dom";

const groups = [
  {
    name: "Company",
    links: [
      ["About BlueCloud", "/about"],
      ["Projects", "/projects"],
      ["Journal", "/blog"],
      ["Careers", "/careers"],
      ["Contact", "/contact"],
      ["Founder portfolio", "/portfolio"],
      ["Investors & partners", "/investors"],
    ],
  },
  {
    name: "Explore",
    links: [
      ["Products", "/products"],
      ["Services", "/services"],
      ["Developers", "/developers"],
      ["Platform", "/platform"],
      ["AI solutions", "/ai-solutions"],
      ["Enterprise services", "/enterprise"],
      ["Rate card", "/rate-card"],
    ],
  },
  {
    name: "Resources",
    links: [
      ["Client login", "/portal/login"],
      ["Admin portal", "/portal/admin"],
      ["Privacy policy", "/privacy"],
      ["Coneic privacy", "/coneic/privacy"],
      ["Terms", "/terms"],
      ["Refund policy", "/refund"],
      ["Cookies", "/cookies"],
    ],
  },
];
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="brand" to="/" aria-label="BlueCloud home">
              <img
                className="brand-logo artwork"
                src="/bluecloud.svg"
                width="40"
                height="40"
                alt=""
              />
              <span className="brand-name">BlueCloud</span>
            </Link>
            <p>
              Thoughtful software.
              <br />
              Practical technology.
            </p>
            <p>Abuja, Nigeria</p>
            <a className="footer-email" href="mailto:info@bluecloudai.online">
              info@bluecloudai.online
            </a>
            <div className="footer-socials">
              <a
                href="https://twitter.com/sadeeqsgi"
                target="_blank"
                rel="noopener noreferrer"
              >
                X
              </a>
              <a
                href="https://www.instagram.com/bluecloud.ai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/2348125531111"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
          {groups.map((group) => (
            <nav
              className="footer-group"
              key={group.name}
              aria-label={group.name}
            >
              <h2>{group.name}</h2>
              <ul>
                {group.links.map(([label, path]) => (
                  <li key={path}>
                    <Link to={path}>{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} BlueCloud AI Technologies</p>
          <p>Software, services & considered solutions.</p>
        </div>
      </div>
    </footer>
  );
}
