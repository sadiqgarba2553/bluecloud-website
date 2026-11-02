import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { PROJECTS_DATA } from "../data/projects";

export default function Products() {
  const launcher = PROJECTS_DATA.find(
    (item) => item.domain === "bluecloud-launcher",
  );
  const tooldeck = PROJECTS_DATA.find((item) => item.domain === "tool-deck");
  return (
    <>
      <SEO
        title="Products — BlueCloud Apps & Developer Tools"
        description="Download BlueCloud Launcher and Tooldeck for Windows. Explore Coneic Player, Quranly PC, developer tools and upcoming apps."
        path="/products"
      />
      <section className="page-hero container">
        <span className="eyebrow">Our products</span>
        <h1>
          Useful software.
          <br />A considered toolkit.
        </h1>
        <p className="lead">
          Windows apps and local file tools from BlueCloud. Explore what’s
          available today, and what’s still in development.
        </p>
      </section>
      <section
        className="section container"
        id="launcher"
        aria-labelledby="launcher-title"
      >
        <div className="wide-art-section">
          <div className="product-copy">
            <span className="status">Available · Windows · 0.7.0</span>
            <h2 id="launcher-title">BlueCloud Launcher</h2>
            <p>
              One place to install and update Windows apps. Start here to find
              BlueCloud software, including Coneic Player and Quranly PC.
            </p>
            <div className="hero-actions">
              <a className="button" href={launcher.link}>
                Download Launcher{" "}
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
              </a>
              <Link className="text-link" to="#launcher-apps">
                Apps in Launcher
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
          <div className="art-stage">
            <img
              className="artwork od-media "
              src="/bluecloud.svg"
              alt="BlueCloud Launcher full squircle artwork"
              width="1080"
              height="1080"
              decoding="async"
            />
          </div>
        </div>
      </section>
      <section
        className="section container"
        id="tooldeck"
        aria-labelledby="tooldeck-title"
      >
        <div className="wide-art-section">
          <div className="art-stage">
            <img
              className="artwork od-media "
              src="/tooldeck.svg"
              alt="Tooldeck full squircle artwork"
              width="1080"
              height="1080"
              decoding="async"
            />
          </div>
          <div className="product-copy">
            <span className="status">Available · 0.5.1</span>
            <h2 id="tooldeck-title">Tooldeck</h2>
            <p>
              Local tools for PDF, image, audio and video files. A focused
              toolkit for the files you work with every day.
            </p>
            <ul className="file-types" style={{ marginTop: "var(--space-3)" }}>
              <li>PDF</li>
              <li>Images</li>
              <li>Audio</li>
              <li>Video</li>
            </ul>
            <div className="hero-actions">
              <a className="button" href={tooldeck.link}>
                Download Tooldeck{" "}
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
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section container" id="launcher-apps">
        <div className="section-header">
          <div>
            <span className="eyebrow">Also available</span>
            <h2>Find them in Launcher.</h2>
          </div>
          <Link className="text-link" to="#launcher">
            About Launcher
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
        <div className="list-grid">
          <article className="editorial-block" id="coneic-player">
            <div className="tooldeck-heading">
              <img
                className="artwork od-media "
                src="/coneic-player.png"
                alt="Coneic Player full artwork"
                width="128"
                height="128"
                decoding="async"
              />
              <div>
                <h3>Coneic Player</h3>
                <span className="status">
                  Alpha · Available through Launcher
                </span>
              </div>
            </div>
            <p style={{ marginTop: "var(--space-3)" }}>
              Play local music and videos on Windows. Install and update through
              BlueCloud Launcher.
            </p>
            <Link className="text-link" to="#launcher">
              Go to Launcher
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
          </article>
          <article className="editorial-block" id="quranly">
            <div className="tooldeck-heading">
              <img
                className="artwork od-media "
                src="/quranlylogo.png"
                alt="Quranly PC full squircle artwork"
                width="2000"
                height="2000"
                decoding="async"
              />
              <div>
                <h3>Quranly PC</h3>
                <span className="status">
                  Alpha · Available through Launcher
                </span>
              </div>
            </div>
            <p style={{ marginTop: "var(--space-3)" }}>
              Read the Quran and listen to recitations on Windows. Install and
              update through BlueCloud Launcher.
            </p>
            <Link className="text-link" to="#launcher">
              Go to Launcher
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
          </article>
        </div>
      </section>
      <section className="section container">
        <div className="section-header">
          <div>
            <span className="eyebrow">In development</span>
            <h2>Next on the horizon.</h2>
          </div>
        </div>
        <div className="list-grid">
          <article className="editorial-block">
            <div className="tooldeck-heading">
              <img
                className="artwork od-media "
                src="/doc-cloud.svg"
                alt="Doc Cloud full squircle artwork"
                width="1080"
                height="1080"
                decoding="async"
              />
              <div>
                <h3>Doc Cloud</h3>
                <span className="status status-soon">Coming soon</span>
              </div>
            </div>
          </article>
          <article className="editorial-block">
            <div className="tooldeck-heading">
              <img
                className="artwork od-media "
                src="/sheet-cloud.svg"
                alt="Sheet Cloud full squircle artwork"
                width="1080"
                height="1080"
                decoding="async"
              />
              <div>
                <h3>Sheet Cloud</h3>
                <span className="status status-soon">Coming soon</span>
              </div>
            </div>
          </article>
        </div>
        <p className="small muted" style={{ marginTop: "var(--space-4)" }}>
          These apps are in development. Downloads will be available when they
          are released.
        </p>
      </section>
      <section className="section container">
        <div className="section-header">
          <div>
            <p className="eyebrow">For builders</p>
            <h2>Explore beyond the desktop.</h2>
          </div>
        </div>
        <div className="list-grid">
          <article className="editorial-block">
            <h3>Language & workspace tools</h3>
            <p>
              Explore Flux and Prism Studio, alongside the BlueCloud platform
              and developer resources.
            </p>
            <Link className="text-link" to="/platform">
              Explore the platform →
            </Link>
            <Link className="text-link" to="/developers">
              Developer resources →
            </Link>
          </article>
          <article className="editorial-block">
            <h3>AI & automation</h3>
            <p>
              Explore integration ideas and the existing playground for
              summarizing text, reviewing code and outlining a project.
            </p>
            <Link className="text-link" to="/ai-solutions">
              Explore AI capabilities →
            </Link>
            <Link className="text-link" to="/projects">
              Projects & tools →
            </Link>
          </article>
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
