# BlueCloud

One workspace for the BlueCloud website, Coneic Player, Quranly PC, Tooldeck and the Windows launcher.

| Project | Location | Status |
| --- | --- | --- |
| Product website | `src/`, `public/` | React/Vite; app catalog, downloads, releases and support |
| BlueCloud Launcher | `apps/launcher/` | Windows alpha; signed-feed installs and updates |
| Coneic Player | `apps/coneic/` | Native VLC fork; existing validated 0.2.1 alpha-r2 runtime |
| Quranly PC | `apps/quranly/` | React/Electron Windows 0.1.0 alpha |
| Tooldeck | `apps/tooldeck/` | Fifteen local utilities; web and Windows alpha |

## Setup

Use Node.js 24 and npm. Windows x64 is required for desktop packaging. The website and Tooldeck web build also work on other development platforms.

```powershell
npm ci
npm ci --prefix apps/launcher
npm ci --prefix apps/quranly
npm run prepare:launcher
```

For Quranly's optional online services, copy `apps/quranly/.env.example` into the appropriate ignored local environment files. Use only client-publishable configuration in Vite variables. Local account configuration was retained during consolidation; no service credentials or private release keys are committed.

```powershell
npm run dev                 # website preview
npm run build               # website + bundled Tooldeck web app → dist/
npm run build:tooldeck
npm run build:quranly
npm run desktop:launcher
npm run desktop:tooldeck
npm run package:launcher     # artifacts/launcher/
npm run package:tooldeck     # artifacts/tooldeck/
npm run package:quranly      # artifacts/quranly/
```

The production website serves Tooldeck at `/tool-deck/`. Other app pages are `/apps/coneic`, `/apps/quranly`, `/apps/tooldeck`, plus `/launcher`, `/downloads`, `/releases` and `/support`. The root `dist/` is the deployment output. Existing SPA redirects and a cache-retirement service worker are included. Ads, unrelated demos, obsolete portals and unsupported marketing claims have been removed from the deployed site.

## Verify

```powershell
npm test
npm --prefix apps/quranly test
npm run build
npm run test:ui
```

Browser checks use installed Microsoft Edge. Desktop checks need the Tooldeck unpacked build in `artifacts/tooldeck/win-unpacked/`. Launcher tests use a disposable app copy, a temporary Windows profile, ephemeral signing keys and controlled release responses; they exercise a real version A → B installation and reject a tampered package. These fixtures do not bypass trust checks in production. Website and Tooldeck tests cover desktop/mobile routes and real local PDF/QR/text operations with external requests blocked. Generated screenshots and test output are in ignored `artifacts/`.

## Releases and architecture

The launcher uses Supabase for a read-only, signed release feed. Binary packages are delivered directly from immutable GitHub release asset URLs; users install and update from BlueCloud without browsing GitHub. There is no launcher login requirement. Website downloads are a generated public catalog. The initial release is Windows x64 alpha.

See [release instructions](docs/RELEASING.md), [workspace migration notes](docs/WORKSPACE.md), [launcher details](apps/launcher/README.md), [Tooldeck scope](apps/tooldeck/README.md) and [the roadmap](BLUECLOUD-ROADMAP.md).

Coneic keeps its native build tooling and component notices; its corresponding source must accompany distributed binaries. Linux build intermediates remain in the `ConeicBuild` WSL environment for toolchain compatibility. Source snapshots are under BlueCloud; originals and Git history bundles are retained as described in the migration notes. Unrelated older projects are archived outside the deployment directory.

Windows publisher signing, a broader update pilot, automatic background updates, additional channels and platforms remain future milestones. An alpha release is not a Microsoft Store certification or a stable release.
