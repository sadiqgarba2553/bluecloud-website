# Active project scope

The owner explicitly requires `bluecloudai.online` to remain in its original state. The launcher is a separate Windows `.exe`, not a replacement website.

- Work only on `apps/launcher/` and `apps/tooldeck/` for the current task. Each app has its own dependencies, commands and installer.
- Do not change the website's root `src/`, `public/`, `index.html`, `package.json`, lockfile, Vite configuration, service worker or deployment configuration as part of app development.
- Keep website deployment separate from app packaging. Do not republish the cancelled combined ecosystem release.
- Quranly and Coneic are outside the current implementation scope. Preserve their original source and existing data.
- Use Supabase if app backend work is needed. Keep credentials and private signing keys out of source control.

The owner's later explicit requests take precedence. Earlier ecosystem roadmap and release documents are historical where they conflict with this scope.
