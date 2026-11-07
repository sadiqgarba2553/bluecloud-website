import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import CloudApps from "../components/CloudApps";

export default function Home() {
  return (
    <>
      <SEO
        title="BlueCloud AI Technologies — Software & Digital Services"
        description="Windows and Linux apps, web and application development, applied AI integrations and creative services from BlueCloud in Abuja, Nigeria."
        path="/"
      />
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-labels">
          <span className="eyebrow">Software &amp; digital services</span>
          <span className="eyebrow">Abuja, Nigeria</span>
        </div>
        <div className="hero-grid">
          <h1 id="hero-title">
            <span>Thoughtful software.</span>
            <span>Practical technology.</span>
          </h1>
          <div className="hero-aside">
            <p>
              Windows and Linux apps, websites and useful AI integrations. Technical
              thinking and creative work, brought together by BlueCloud.
            </p>
            <Link className="text-link" to="/about">
              Get to know BlueCloud
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
        <div className="hero-actions">
          <Link className="button " to="/contact">
            Discuss your project
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
          <a className="button button-secondary" href="/linux/">Download Linux apps →</a>
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
      </section>
      <section className="section container" aria-labelledby="products-heading">
        <div className="section-header">
          <div>
            <span className="eyebrow">01 / Selected software</span>
            <h2 id="products-heading">Built for everyday work.</h2>
          </div>
          <Link className="text-link" to="/products">
            All products
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
        <div className="product-layout">
          <article className="product-feature launcher-feature">
            <div className="feature-top">
              <span className="eyebrow">BlueCloud Launcher</span>
              <span className="status">Available · Windows &amp; Linux</span>
            </div>
            <div className="flagship">
              <div>
                <h3>
                  Your apps.
                  <br />
                  One starting point.
                </h3>
                <p>Install and update your Windows or Linux apps with BlueCloud Launcher.</p>
              </div>
              <img
                className="artwork od-media "
                src="/bluecloud.svg"
                alt="BlueCloud Launcher squircle artwork"
                width="1080"
                height="1080"
                decoding="async"
                loading="lazy"
              />
            </div>
            <div className="feature-bottom">
              <span className="small muted">Windows &amp; Linux</span>
              <Link className="text-link" to="/products#launcher">
                Explore Launcher
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
          </article>
          <article className="product-feature tooldeck-feature">
            <div className="feature-top">
              <span className="eyebrow">Local file tools</span>
              <span className="status">Available · 0.5.1</span>
            </div>
            <div className="tooldeck-heading">
              <img
                className="artwork od-media "
                src="/tooldeck.svg"
                alt="Tooldeck squircle artwork"
                width="1080"
                height="1080"
                decoding="async"
                loading="lazy"
              />
              <div>
                <h3>Tooldeck</h3>
                <p>Everyday files. Handled locally.</p>
              </div>
            </div>
            <p>
              A practical set of local tools for working with your documents and
              media.
            </p>
            <ul className="file-types" aria-label="Supported tool categories">
              <li>PDF</li>
              <li>Images</li>
              <li>Audio</li>
              <li>Video</li>
            </ul>
            <div className="feature-bottom">
              <span className="small muted">For your file workflow</span>
              <Link className="text-link" to="/products#tooldeck">
                Explore Tooldeck
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
          </article>
        </div>
        <div
          className="companion-products"
          aria-label="More apps available through Launcher"
        >
          <Link className="companion" to="/products#coneic-player">
            <img
              className="artwork od-media "
              src="/coneic-player.png"
              alt=""
              width="128"
              height="128"
              decoding="async"
              loading="lazy"
            />
            <div className="od-field">
              <strong>Coneic Player</strong>
              <span className="small">Available through Launcher</span>
            </div>
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
          <Link className="companion" to="/products#quranly">
            <img
              className="artwork od-media "
              src="/quranlylogo.png"
              alt=""
              width="2000"
              height="2000"
              decoding="async"
              loading="lazy"
            />
            <div className="od-field">
              <strong>Quranly PC</strong>
              <span className="small">Available through Launcher</span>
            </div>
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
        <div style={{ marginTop: 'var(--space-6)' }}>
          <div className="section-header"><div><span className="eyebrow">Available for Linux</span><h2>Your Cloud workspace is ready.</h2></div><a className="text-link" href="/linux/">All Linux downloads →</a></div>
          <CloudApps />
        </div>
      </section>
      <section className="section container" aria-labelledby="services-heading">
        <div className="services-layout">
          <div className="section-intro">
            <span className="eyebrow">02 / What we do</span>
            <h2 id="services-heading">
              Technology,
              <br />
              made useful.
            </h2>
            <p>
              From a focused piece of software to a complete digital project.
              Bring us the problem you’re trying to solve.
            </p>
            <Link className="text-link" to="/services">
              Explore our services
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
          <div>
            <Link className="service-row" to="/services#web">
              <span className="number">01</span>
              <div>
                <h3>Software &amp; web development</h3>
                <p>
                  Websites, web apps and Windows desktop software, built around
                  the work you need to do.
                </p>
              </div>
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
                <path d="M5 19 19 5M5 5h14v14" />
              </svg>
            </Link>
            <Link className="service-row" to="/ai-solutions">
              <span className="number">02</span>
              <div>
                <h3>Applied AI integrations</h3>
                <p>
                  Connect AI to a useful workflow. Start with the problem, then
                  choose the technology.
                </p>
              </div>
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
                <path d="M5 19 19 5M5 5h14v14" />
              </svg>
            </Link>
            <Link className="service-row" to="/services#consulting">
              <span className="number">03</span>
              <div>
                <h3>Technical consulting</h3>
                <p>
                  Work through technical decisions, system requirements and the
                  next steps for your project.
                </p>
              </div>
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
                <path d="M5 19 19 5M5 5h14v14" />
              </svg>
            </Link>
            <Link className="service-row" to="/services#graphics">
              <span className="number">04</span>
              <div>
                <h3>Design, video &amp; social</h3>
                <p>
                  A considered visual identity, a clear story and creative
                  content for your digital presence.
                </p>
              </div>
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
                <path d="M5 19 19 5M5 5h14v14" />
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
      <section className="contact-band" aria-labelledby="contact-heading">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Let’s talk</span>
            <h2 id="contact-heading">What are you working on?</h2>
          </div>
          <div>
            <p>
              A new product, a better workflow, or a problem that needs a fresh
              technical perspective. Let’s start there.
            </p>
            <Link className="button button-inverse" to="/contact">
              Tell us about your project
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
    </>
  );
}
