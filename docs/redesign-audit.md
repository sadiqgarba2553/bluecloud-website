# BlueCloud redesign audit

## Scope

The owner's November 2026 brief authorizes a complete website redesign, superseding the older app-only restriction in AGENTS.md. Work is local on `design/bluecloud-premium-redesign`; production deployment and production data changes are excluded.

The checkout contained uncommitted website/navigation/logo work before this branch was created. Those changes are preserved. App source and release artifacts are outside the redesign.

## Existing functionality to retain

- React Router pages and aliases in App.jsx, including blog articles and legal URLs.
- Products and app release links; Doc Cloud and Sheet Cloud remain coming soon.
- Platform explorer, industry examples, AI playground, service FAQs, technology filtering and package selection.
- Project scope estimator, infrastructure cost calculator, proposal/investor/developer inquiry forms and downloadable PDFs.
- Firebase email/Google authentication, protected admin and client dashboards.
- Contact submission through the existing form service; chat, speech input/output and lead capture.
- Founder portfolio, course certificate previews, career applications and existing standalone product destinations.

## Findings

- Repetitive homepage card grids and generic claims obscure the actual software and services.
- Existing typography mixes multiple unavailable font names; a self-hosted family will improve consistency.
- Gradients, blur, decorative entrances, exaggerated claims and stale future release dates conflict with the new brief.
- Several Firestore forms acknowledge success in their catch handlers. These must show a useful failure state instead.
- The contact form uses blocking alerts; password reset is a dead link; several selectors and dialogs lack keyboard handling.
- The AI playground displays invented success after API failure. Live failures must be explicit, and fixed samples must be labelled.
- The default lint command scans archived, bundled application code. Limit the website check to its maintained source.
- Existing website Playwright specs describe a different app-only website and contain obsolete route/header expectations. They cannot validate this brief unchanged.

## Baseline validation

- Vite production build passes before the visual redesign, with a large-chunk warning.
- Cloudflare routing tests: 4 pass. Preserve their URL and asset behavior.
- Source lint identifies pre-existing unused imports and a shared blog data export warning; archive lint produces unrelated bundled-code findings.

## Validation boundaries

Use intercepted requests for submission success/failure checks. Do not send test inquiries, request password-reset messages, create production records, or sign in to user accounts. Verify real authentication configuration and backend handlers by code review; document account-dependent checks that cannot be completed locally.
