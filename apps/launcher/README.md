# BlueCloud Launcher

Windows x64 alpha. A compact app suite inspired by the provided launcher reference, with BlueCloud branding, native Windows window controls, grid/table layouts, app filters, search, sorting and settings. Design follows the installed Emil Kowalski design-engineering and Apple design skills: system typography, restrained translucent chrome, immediate press feedback, anchored menus and reduced-motion/transparency/contrast support. Source: https://github.com/emilkowalski/skills

This is a standalone Windows `.exe`, separate from bluecloudai.online. The original website is retained unchanged. From this directory run `npm ci`, then `npm run desktop`. Package with `npm run dist:win`; output goes to `artifacts/launcher/` under BlueCloud. Product metadata and the public release configuration are included in this app directory, so the website does not need to build or serve the launcher.

The renderer is sandboxed and isolated from Node. Its preload exposes only named library operations and fixed product links. Main-process IPC verifies the sender. Release metadata uses an Ed25519 signature with a pinned public key. Downloads use HTTPS, trusted hosts, declared byte counts and SHA-256 checks. ZIP extraction rejects traversal, symbolic links, special files, duplicate file writes and expanded-size overflow. Installation writes into fresh version folders and updates the library registry atomically after validation.

Coneic Player, Quranly PC and Tooldeck are available in the app library when their release feed is published. Use Install all apps for a fresh library or Update all for available app updates. Successful installation changes the action to Open app. Individual uninstall is in each app menu; Uninstall all covers every installed app, including future additions, and preserves app preferences.

The launcher checks the signed server catalog on startup and every 10 minutes, including while minimized. App updates are offered in the library. Launcher updates download and install automatically by default, with Restart now and Later controls and an automatic-update setting. Install per user for updates without administrator prompts; a protected all-users installation may require Windows administrator approval.

Run `npm test` for integrity, extraction and updater checks, and `npm run test:desktop` after packaging Tooldeck for desktop integration checks. `node scripts/smoke-tooldeck-update.cjs` checks the real public Tooldeck update using disposable profiles under ignored artifacts; it requires the archived alpha.1 package locally and downloads the latest signed Tooldeck package.

See `RELEASING.md` in this directory for the standalone publishing workflow, signing, recovery and alpha limits. The release backend is Supabase; no launcher account or database writes are available to clients. The website is outside this workflow.
