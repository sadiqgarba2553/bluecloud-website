import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import CertificatesWall from "../components/CertificatesWall";
export default function About() {
  return (
    <>
      <SEO
        title="About BlueCloud AI Technologies"
        description="Software, development, applied AI and creative services from BlueCloud in Abuja, Nigeria. Founded by Sadiq Garba Ibrahim."
        path="/about"
      />
      <section className="page-hero container">
        <span className="eyebrow">About BlueCloud</span>
        <h1>Grounded in useful work.</h1>
        <p className="lead">
          BlueCloud AI Technologies is a technology company in Abuja, Nigeria.
          We make Windows desktop software and provide development, applied AI,
          technical consulting and creative services.
        </p>
      </section>
      <section className="section container">
        <div className="services-layout">
          <div className="section-intro">
            <span className="eyebrow">Our focus</span>
            <h2>
              Practical thinking.
              <br />
              Considered execution.
            </h2>
          </div>
          <div>
            <p className="lead muted">
              Some needs call for a small, focused tool. Others need a complete
              digital product, an integration or a clearer technical plan. The
              starting point is understanding what the work needs to achieve.
            </p>
            <p className="muted" style={{ marginTop: "var(--space-3)" }}>
              Our software and services sit alongside creative design, video and
              social media work — bringing technical and visual thinking to the
              same conversation.
            </p>
            <Link className="text-link" to="/services">
              See what we do
              <svg
                className="od-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      <section className="section approach" aria-labelledby="approach-heading">
        <div className="container approach-grid">
          <div className="section-intro">
            <span className="eyebrow">03 / How we approach it</span>
            <h2 id="approach-heading">
              Clarity first.
              <br />
              Then the build.
            </h2>
          </div>
          <ol className="approach-steps">
            <li className="approach-step">
              <span className="eyebrow">01</span>
              <h3>Understand</h3>
              <p>
                Get clear on the people, the problem and what a useful result
                looks like.
              </p>
            </li>
            <li className="approach-step">
              <span className="eyebrow">02</span>
              <h3>Make</h3>
              <p>
                Shape the solution, make deliberate choices and build around
                real needs.
              </p>
            </li>
            <li className="approach-step">
              <span className="eyebrow">03</span>
              <h3>Refine</h3>
              <p>
                Review the details together and agree the practical next steps.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section className="section container">
        <div className="list-grid">
          <div className="editorial-block">
            <span className="eyebrow">Made by BlueCloud</span>
            <h2>Software you can explore.</h2>
            <p>Get to know our work through the apps available today.</p>
            <Link className="text-link" to="/products">
              Explore our products
              <svg
                className="od-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
          <div className="editorial-block">
            <span className="eyebrow">Based in Abuja, Nigeria</span>
            <h2>Let’s start a conversation.</h2>
            <p>
              Tell us about your project and the support you’re looking for.
            </p>
            <Link className="text-link" to="/contact">
              Contact BlueCloud
              <svg
                className="od-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12h16m-6-6 6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      <section className="section container founder-section">
        <div>
          <p className="eyebrow">The founder</p>
          <h2>Sadiq Garba Ibrahim</h2>
          <p>
            BlueCloud brings together Sadiq’s work in software engineering,
            graphic design and video editing.
          </p>
          <Link className="text-link" to="/portfolio">
            View founder portfolio →
          </Link>
        </div>
        <img
          src="/imageofceo.PNG"
          alt="Sadiq Garba Ibrahim, founder of BlueCloud"
          width="280"
          height="320"
          loading="lazy"
        />
      </section>
      <div className="container">
        <CertificatesWall />
      </div>
    </>
  );
}
