# Cloudflare website hosting

The owner authorized moving bluecloudai.online from Netlify to Cloudflare on
2026-10-20, after Netlify blocked production deploys for exhausted account credits.
This deployment serves the existing website and its updated company contacts.
App installers, the launcher and the mail Worker remain separate projects.

## Build and publish

Run from the website repository using Node.js, the existing website dependencies,
and an authenticated Wrangler CLI (the migration used Wrangler 4.90.0):

```powershell
npm run build
node infrastructure/cloudflare-website/prepare.mjs
node --test infrastructure/cloudflare-website/routing.test.mjs
npx wrangler@4.90.0 deploy --config infrastructure/cloudflare-website/wrangler.preview.toml
node infrastructure/cloudflare-website/verify.mjs https://bluecloud-website-preview.sadiqgarbaibrahimadeel.workers.dev
npx wrangler@4.90.0 deploy --config infrastructure/cloudflare-website/wrangler.toml
node infrastructure/cloudflare-website/verify.mjs https://bluecloudai.online
```

The preview configuration uses the separate `bluecloud-website-preview` Worker
without production routes. The production command above is the routine publish
command. This migration does not configure GitHub Actions
or grant Cloudflare additional GitHub access; pushing source alone does not publish it.

The production Worker is `bluecloud-website`, with exact root and www zone routes.
workers.dev is disabled after cutover. Most static files bypass application code;
the Worker handles React routes, legacy subsite entry points, case-insensitive
legacy file names and career-page redirects. Static career routes explicitly run
the Worker before assets so old files cannot bypass their redirects.
The proxied root A record points to the reserved placeholder 192.0.2.0 and www
is a proxied CNAME to bluecloudai.online. The Worker serves all responses from its
own uploaded assets, without fetching an external origin or relying on Netlify.
Keep both records proxied and both routes attached. www fallback routes redirect
to the root hostname; matching static assets can be served directly on www.

The preparation step copies the production build to the ignored
`artifacts/cloudflare-website/assets` folder. It excludes development caches,
hidden folders (except .well-known), dependencies and private key/certificate files.
The original Netlify _redirects file is retained in source; its rewrites are handled
by the Worker rather than published as unsupported Cloudflare redirect syntax.
Generated HTML uses revalidation; content-addressed /assets files have immutable caching.

The backend, existing auth identities and form submission integrations are unchanged.
The migration does not move Firebase data or change website administrator credentials.
It does not attach mail.bluecloudai.online to this Worker or modify mail DNS records.
No paid Cloudflare plan was activated.

## Verification and recovery

Four routing checks cover React routes, legacy pages/downloads, redirects and missing
asset handling. The live verifier checks 17 route/download cases and all three new
company addresses in the deployed bundle. Download range responses may fall back to
a full response; the verifier checks the full file's SHA-256 in that case.

The initial asset set contains 674 files (45.7 MiB); no individual file exceeds 25 MiB.
The previous Netlify production file manifest is retained in the ignored migration
artifacts. Its only intentionally replaced public asset is the website JavaScript
entry; Netlify-specific redirect rules are implemented in the Worker.

Before the move, the proxied root A record was 75.2.60.5 and the proxied www CNAME
target was boisterous-druid-7ef152.netlify.app. Private local migration records include
the pre-cutover mail routing snapshot and website DNS details. If rollback is needed,
first restore Netlify's credit allowance, remove these two website Worker routes,
and restore those two website records. Leave mail/MX/SPF/DKIM/DMARC records intact.
Rollback to a previous healthy Cloudflare Worker version is preferable while Netlify
remains unable to publish. Never replace the mail Worker as part of a website rollback.

References:
- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/workers/configuration/routing/routes/
