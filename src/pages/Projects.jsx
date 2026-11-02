import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { PROJECTS_DATA } from "../data/projects";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const projects =
    filter === "All"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((item) => item.category === filter);
  return (
    <>
      <SEO
        title="Projects & Software — BlueCloud"
        description="Explore BlueCloud software, developer tools and web projects."
        path="/projects"
      />
      <header className="page-hero container">
        <p className="eyebrow">Selected work</p>
        <h1>Ideas, put to work.</h1>
        <p className="lead">
          Explore our software, language tools and web projects. Available
          releases and work in development are labelled separately.
        </p>
      </header>
      <section className="section container">
        <div
          className="project-filters"
          role="group"
          aria-label="Filter projects"
        >
          {["All", "Web", "App", "Tools"].map((category) => (
            <button
              key={category}
              type="button"
              className={filter === category ? "btn-primary" : "btn-secondary"}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
          <Link className="text-link" to="/portfolio">
            Founder portfolio →
          </Link>
        </div>
        <div className="project-list" aria-live="polite">
          {projects.map((project) => (
            <article className="project-row" key={project.id}>
              <div>
                {project.imgSrc ? (
                  <img
                    className="artwork"
                    src={project.imgSrc}
                    alt=""
                    width="72"
                    height="72"
                    loading="lazy"
                  />
                ) : (
                  <span className="eyebrow">Web project</span>
                )}
              </div>
              <div>
                <p className="eyebrow muted">{project.tags.join(" / ")}</p>
                <h2>{project.title}</h2>
              </div>
              <div>
                <p>{project.solution}</p>
                {project.comingSoon ? (
                  <span className="status status-soon">Coming soon</span>
                ) : (
                  <a
                    className="text-link"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.linkLabel || "Explore project"} ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
