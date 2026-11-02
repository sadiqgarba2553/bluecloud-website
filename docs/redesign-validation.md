# Redesign validation — 2 November 2026

## Delivery state

The owner subsequently authorized publication to the main domain. The redesign is now live at `https://bluecloudai.online/` (Cloudflare version `07b510eb-9517-4547-99a4-7fdefb567f47`). All 18 deployment checks passed on preview and production. The five primary pages and mobile menu passed live browser checks without page errors or overflow. The served entry bundle matches the local build SHA-256; www redirects to the root domain. The repository was retained at the owner's request. The earlier local-only review record below describes the pre-publication phase.

Implementation is local on `design/bluecloud-premium-redesign`. Existing uncommitted changes were retained. No deployment, production database update, real enquiry, password-reset email or live AI request was made during verification.

The local production preview is served at `http://127.0.0.1:5173/`. Run `npm run build` and `npm run preview -- --host 127.0.0.1 --port 5173 --strictPort` from this checkout to recreate it.

## Design workflow

Read the official repository/README, installed frontend-design skill, typography/colour/anti-AI-slop craft rules, minimal-system conventions and critique template. Local Codex generated a separate reference bundle and completed its own rendering, keyboard, asset and text-scaling review. The bundle was retrieved and adapted into native React, retaining the real downloads, APIs and forms. DESIGN.md records the actual integrated system rather than the reference's placeholder interactions.

The separate design reference reported success. Its static-file font-preload issue was resolved there with an embedded font; this website correctly serves the licensed font from its own `/fonts` path over HTTP.

## Build and source checks

- `npm run build`: pass. Vite emits the production bundle.
- `npm run lint`: pass, no source warnings. The command now scopes lint to maintained website source instead of archived bundled applications.
- `git diff --check`: pass.
- `node --test infrastructure/cloudflare-website/routing.test.mjs`: all 4 tests pass. These cover React entry routing, standalone assets/legacy app URLs, privacy and case-insensitive paths, career/canonical redirects, missing resources and unsupported submissions.
- No separate TypeScript/type-check script is configured; this is a JavaScript/JSX application.

The build retains a size warning for the deferred Firebase SDK chunk (about 564kB before gzip). The main entry is about 274kB before gzip / 85.5kB gzip. Firebase and the assistant are loaded only when their features are needed.

## Browser and visual review

Used the real browser against the production preview, not an HTML mockup.

- Reviewed the homepage, products, services, developers, about, contact and journal layouts through screenshots, and checked retained secondary pages.
- Loaded 19 routes at 1440px: no page exceptions, broken completed images or horizontal document overflow.
- Checked 16 routes at both 390px and 320px (32 checks). Fixed all narrow-width overflow findings.
- Checked 8 representative routes at 1024px and 768px (16 checks).
- Specifically retested mobile/tablet menu operation at 960, 768, 390 and 320px. Fixed the intermediate-width menu visibility conflict found by visual review.
- Retested the updated Products copy at 320px.
- Reduced-motion emulation reports zero-duration button transitions.

Screenshots and local CLI check scripts are in ignored `output/playwright/`. The final desktop, phone and tablet homepage screenshots use the `final-home-` prefix. These artifacts are local review material, not production assets.

## Interactions and links

- All five main links exercised on desktop and mobile. Verified active state, closed-link visibility, initial focus, Escape/focus return, outside close, resize reset and cross-page hash positioning (28 navigation checks).
- Header/footer expose 22 unique internal destinations; all return HTTP 200 locally. Protected client/admin routes redirect unauthenticated visitors to login.
- Both Launcher 0.7.0 and Tooldeck 0.5.1 release download URLs respond HTTP 200 through redirects. No installers were downloaded by this check.
- All four linked PDF resources respond successfully and contain a PDF signature.
- Contact: required fields, email validation, consent, intercepted server failure, value retention, retry, intercepted success and reset verified. Two intercepted requests; zero messages delivered.
- Retained-tool checks cover FAQ disclosure, keyboard package selection, technology and project filtering, platform selection, ERP tabs, cost comparison, estimator recalculation/feature toggles, resource and certificate dialogs, focus return, and password-reset input validation (24 grouped checks).
- AI playground: sample input, tab reset, intercepted successful response and useful intercepted failure response verified. No live AI request was sent.
- Assistant: opens on demand, focuses its input, closes on Escape and returns focus to its trigger.

## Verification limits

Real Firebase writes, signed-in client/admin records, successful email/Google authentication, actual password-reset delivery, live AI service availability and microphone/speech devices were intentionally not exercised. Their existing integrations remain, with clearer frontend states. They need an authorized account or service/device test outside this local-only review.

The existing `tests/ui/website.spec.js` contains assertions for a different earlier app-only information architecture. It was not used as acceptance coverage for this redesign; the current production-preview CLI checks above exercise this site's actual routes and features. No claim is made that those historical assertions pass unchanged.
