import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import "./DeveloperPortal.css";

export default function DeveloperPortal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [useCase, setUseCase] = useState("Enterprise System Integration");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "api_waitlist"), {
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim(),
        useCase,
        status: "pending_early_access",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch {
      setError(
        "Your request could not be saved. Please retry or email info@bluecloudai.online.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="dev-portal-container">
      <header className="page-intro dev-portal-header">
        <p className="eyebrow">For developers</p>
        <h1>
          Tools to build with.
          <br />
          Room to explore.
        </h1>
        <p>
          Explore BlueCloud developer tools and register your interest in future
          API access.
        </p>
      </header>
      <section
        className="developer-resources"
        aria-labelledby="developer-tools-heading"
      >
        <h2 id="developer-tools-heading">Explore the tools</h2>
        <a href="/flux-website/index.html">
          <span>Flux language</span>
          <span>Language reference and compiler tooling</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a href="/prism-studio/index.html">
          <span>Prism Studio</span>
          <span>Code editing and workspace tools</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a href="/tool-deck/index.html">
          <span>Browser utilities</span>
          <span>Everyday formatting and file tools</span>
          <span aria-hidden="true">↗</span>
        </a>
      </section>
      <section
        className="developer-access"
        aria-labelledby="developer-access-heading"
      >
        <div>
          <p className="eyebrow">In development</p>
          <h2 id="developer-access-heading">API access is coming.</h2>
          <p>
            Our public API and SDK are not yet available. Leave your details and
            intended use case to request future access. Registration does not
            issue an API key.
          </p>
        </div>
        <div>
          {submitted ? (
            <div className="form-feedback" role="status">
              <h3>Interest registered</h3>
              <p>Thank you. We have saved your request and contact details.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
              <div className="form-group">
                <label htmlFor="developer-name">Full name</label>
                <input
                  id="developer-name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="developer-email">Email address</label>
                <input
                  id="developer-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="developer-organization">
                  Organization <span className="muted">(optional)</span>
                </label>
                <input
                  id="developer-organization"
                  autoComplete="organization"
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="developer-use-case">
                  What would you like to build?
                </label>
                <select
                  id="developer-use-case"
                  value={useCase}
                  onChange={(event) => setUseCase(event.target.value)}
                >
                  <option>Enterprise System Integration</option>
                  <option>SaaS Mobile/Web App</option>
                  <option>Custom AI Model Pipeline</option>
                  <option>Flux Language Development</option>
                </select>
              </div>
              {error && (
                <p role="alert" className="form-feedback error">
                  {error}
                </p>
              )}
              <p className="form-note">
                Your details are handled under our{" "}
                <a href="/privacy">privacy policy</a>.
              </p>
              <button className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving your request..." : "Register interest"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
