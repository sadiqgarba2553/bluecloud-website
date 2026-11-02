# BlueCloud AI Technologies — visual system

## Direction and workflow

Quiet, editorial technology: real software, specific services, confident typography and deliberate proportions. No gradients, glass, neon, decoration, fake metrics or exaggerated credibility claims. This specification supersedes the navigation-only note.

The installed `frontend-design` skill and typography, colour and anti-AI-slop craft references from the [official design repository](https://github.com/nexu-io/open-design) actively guide this implementation. Local Codex generated separate homepage, supporting-page, token and component-pattern files. The retrieved artifact bundle was translated into native React. Reference-only disabled downloads and enquiry previews were replaced with existing release links and real submission handlers.

## Tokens

Canonical values are in `src/styles/tokens.css`.

| Role | Value |
| --- | --- |
| Paper / surface | `#F6F7F9` / `#FFFFFF` |
| Ink / muted text | `#171C26` / `#545D6D` |
| Action / hover | `#0B5FFF` / `#004BD6` |
| Selected surface | `#EDF2FC` |
| Divider / control boundary | `#D8DDE5` / `#7B8493` |
| Inverse supporting text | `#BFC7D4` |
| Error / confirmed success | `#AE2538` / `#17613F` |

Use one action accent; semantic feedback has pale solid surfaces. Legacy token names map to these roles. Pale inverse accents belong on dark panels.

## Typography

Self-hosted Manrope variable, weights 400 / 550 / 600, with Segoe UI and sans-serif fallback and font-display swap. Font and SIL Open Font License live in `public/fonts`. No external font service is needed.

Scale: 12 / 14 / 16 / 20 / 24 / responsive 32–48 / responsive 40–76px. Heading leading 1.12–1.3, body 1.6–1.7. Tight display tracking, neutral body tracking, +.08em uppercase labels. Paragraph measure about 65 characters. Avoid bold paragraphs and competing display sizes.

## Grid, spacing and composition

8px rhythm: 8, 16, 24, 32, 40, 48, 64, 80, 96, 112px. Container maximum 1160px; responsive gutters 24–48px. Sections use 80px desktop and 64px mobile spacing; mobile introductions use 48px.

Use normal-flow grid/flex with bounded measures and `minmax(0,1fr)`. Hero 2.5:1; selected products 1.35:1; service editorial split 1:1.8. Vary density without turning every section into a card. Mobile becomes a deliberate single-column composition.

## Borders and artwork

1px dividers, 4px controls, 8px meaningful panels. Preserve complete supplied company/app artwork and the consistent superellipse silhouette. Never clip adjacent labels with a logo container. Keep natural rectangular photography. No invented product screenshots or replacement logos. Reserve restrained elevation for actual overlay panels.

## Controls and interactions

- Buttons: 48px minimum height, 14px text, explicit hover/focus/pending/disabled states. Primary blue; secondary solid white with visible border; lower-priority ink links with restrained arrows.
- Forms: visible labels, required/email validation, appropriate autocomplete and real integrations. Pending actions prevent duplicates. Errors retain values and offer retry/contact guidance. Success requires a successful response.
- Dialogs: native dialog, focus containment, Escape, labelled close action and focus return. Closing never submits.
- Disclosures: native details/summary organizes existing packages, technology filters and downloads. FAQs associate buttons with answer regions. Filters/selectors expose pressed/checked/current states.
- Coming-soon products: clear status, no release date claim and no download action.

## Navigation

Home / Products / Services / Developers / About remain the five main links. Client login and Start a project are utilities. Active state combines dark text, blue line and an accessible current value.

Mobile disclosure activates at 960px. Opening focuses the first link; Escape returns focus to its toggle. Outside selection, focus exit, navigation and resizing close it. Intermediate widths reduce utilities before links collide. Footer preserves secondary pages, legal URLs and client/admin access. Existing routes, aliases and standalone product pages remain. Provide skip navigation, scroll/hash restoration and a useful not-found page.

## Pages and honest content

Home uses a concise proposition, asymmetric real-product showcase, numbered service rows, short approach and contact band. Products distinguishes available software, Launcher companions and upcoming Doc Cloud/Sheet Cloud; downloads use the shared catalog. Services retains all service hashes, enterprise entry, planning resources and FAQs. Developers presents real tools and a future API waitlist. About includes the founder and source course certificates, not company accreditation. Contact retains its submission service.

Secondary pages and tools share typography, controls, borders and solid surfaces. Preserve authentication, dashboards, calculators, simulations, downloads and APIs. Label ERP/simulation data as examples and calculator assumptions as illustrative. Roadmaps are intentions. Never present failed requests as completed analysis, or invent customers, guarantees, certifications, awards or measured performance gains.

## Motion, responsiveness and accessibility

State-only colour/border transitions around 120–180ms. No entrance choreography, parallax, decoration or hover scaling. Loading feedback is readable text; reduced-motion disables nonessential movement.

Review 1440, 1024, 768, 390 and 320px widths. Prevent document overflow, preserve reading order and keep focus visible. Use semantic headings, labelled controls, meaningful links and keyboard activation. Status needs words as well as colour. Contrast targets: 4.5:1 normal text, 3:1 large text/control boundaries. Honour forced-colour preferences.

## Implementation and validation

Shared compositions: `src/styles/site.css`. Retained-tool adaptation: `src/styles/legacy.css`. React owns state and routing; pages and assistant load on demand. Preserve backend configuration and security behavior.

Work stays on `design/bluecloud-premium-redesign`. No production deployment or data changes. Intercept submissions for testing; never send production enquiries, password-reset emails or test records. Completed checks and account-dependent limits belong in `docs/redesign-validation.md`.
