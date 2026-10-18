# Active project scope

The owner explicitly requires `bluecloudai.online` to remain in its original state. The launcher is a separate Windows `.exe`, not a replacement website.

- Build `apps/launcher/` and `apps/tooldeck/` as separate Windows applications. Each app has its own dependencies, commands and installer.
- Do not change the website's root `src/`, `public/`, `index.html`, `package.json`, lockfile, Vite configuration, service worker or deployment configuration as part of app development.
- Keep website deployment separate from app packaging. The owner has now authorized a standalone launcher release that distributes Coneic, Quranly and Tooldeck and provides updates. Do not reuse a publication step that writes to the website.
- Package the existing validated Quranly and Coneic builds for launcher distribution. Preserve their original source and existing data; do not redesign them as part of this task.
- Use Supabase if app backend work is needed. Keep credentials and private signing keys out of source control.

The owner subsequently authorized replacing the five pictured website cards (old Quranly, Tunnel, Mods, CargoLedger and WiFi Master) with Quranly PC, Coneic Player and BlueCloud Launcher. Preserve the existing website design and all other sections.

The owner's later explicit requests take precedence. Earlier ecosystem roadmap and release documents are historical where they conflict with this scope.
