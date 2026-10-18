# BlueCloud ecosystem roadmap

Planning date: 18 October 2026. Implementation is now in progress. Current workspace details and release procedures are recorded in `docs/WORKSPACE.md` and `docs/RELEASING.md`; the phases below preserve the original plan.

## Direction

BlueCloud becomes the home for the website, Coneic Player, Quranly PC, Tooldeck and a Windows launcher. Each product keeps its own identity, version, build process and release schedule. The launcher lets users discover, install, open and update supported BlueCloud apps without visiting GitHub.

Start with Windows x64. Additional operating systems follow after the Windows installation and update flow is reliable. Apps should remain usable independently of the launcher. A BlueCloud account is not required for installing local apps; Quranly keeps its existing account system.

## What is present today

- The BlueCloud root contains a React/Vite website, a `tool deck/` HTML/JavaScript project, Prism Studio and other projects/assets.
- The BlueCloud Git working tree has existing website edits and many pending deletions beneath an earlier `quranly/` directory. Reconcile these with the separate Quranly PC repository before consolidation.
- `C:/Users/Garba Ibrahim/Desktop/quranly pc` is a separate Git repository with React/Vite, Electron, Windows NSIS packaging, tests and mobile project directories. Its package version is `0.1.0-alpha`. Its Windows notes describe an unsigned installer. These are local project records, not a fresh runtime verification.
- `C:/Users/Garba Ibrahim/Desktop/Coneic 0.2.1 Alpha-r2/Coneic` contains a packaged native Windows application and documentation. Its documentation describes a VLC source fork built in WSL; this packaged directory is not the complete source checkout. Locate and inventory the actual source and build environment.
- Tooldeck advertises PDF, image, text and developer tools. Inventory and test each advertised tool before deciding what is complete or promising full offline operation.
- The website currently spreads product details across React pages and static pages, including `public/coneic/`. Audit both when changing product information.

## Target organization

```text
BLUECLOUD/
  apps/
    website/
    launcher/
    quranly/
    tooldeck/
    coneic/             # source checkout or source mirror, build instructions
  packages/
    product-catalog/    # public product metadata and schema
    brand-assets/
    release-schema/    # release metadata validation
  infrastructure/
    releases/          # publishing configuration; no private credentials
  docs/
    products/
    releases/
    architecture/
  artifacts/           # ignored local build outputs and installers
```

This is a target layout, not the first filesystem operation. Preserve independent repository histories during the initial consolidation. Choose the final Git arrangement after reviewing remotes, current changes and release workflows. Avoid accidental nested-repository omissions. Inventory other existing BlueCloud projects before relocating the root website. Keep Coneic's Linux build checkout on a suitable Linux filesystem where its toolchain requires it, with a documented link from the BlueCloud workspace.

## Phase 1 — Establish a safe workspace

1. Inventory source roots, Git remotes, local changes, versions, build commands, output directories and environment-file names without exposing credentials.
2. Back up current work and record baseline commits and file hashes where useful. Resolve which Quranly copy is authoritative by comparing histories and files; do not blindly restore or accept the existing deletions.
3. Locate Coneic's actual source checkout, WSL distribution, build scripts and required caches. Record how to reproduce the delivered alpha.
4. Create the workspace structure. Copy or import projects first, retaining original folders until builds from the new locations pass. Preserve environment configuration locally and keep it out of published source.
5. Fix paths, website asset references, build scripts and deployment working directories as each project moves. Keep generated installers, dependencies and caches out of source imports.
6. Add a useful root README and commands for developing/building each product. Record how other existing BlueCloud projects fit into the workspace.

Exit: every product has a documented authoritative source/build location, histories and local work are preserved, and existing website/app builds still work.

## Phase 2 — Establish the product catalog and accurate website

1. Create a catalog with stable IDs (`coneic`, `quranly`, `tooldeck`, `launcher`), display names, summaries, platform support, release status, screenshots, documentation links and verified download links.
2. Record marketing information separately from signed release instructions. The launcher must never execute an installer simply because a website catalog lists it.
3. Update the home page, product listing, navigation, download area and relevant static product pages. Reconcile duplicate information and outdated claims.
4. Give each main product a page with its real features, current version/channel, system requirements, screenshots, release notes and support information.
5. Label Tooldeck desktop and the launcher as in development until usable builds exist. Check Quranly's older AI/pricing/account descriptions against the actual desktop app. Use Coneic's latest validation records for feature claims.
6. Check existing URLs, redirects, mobile layouts, accessibility and the production website build. Publish through the existing deployment route when implementation is ready.

Exit: the website accurately represents what users can download today and what is still planned.

## Phase 3 — Finish Tooldeck and package it for Windows

1. Build a tool matrix: advertised tool, actual implementation, dependencies, sample input/output, offline capability, known limits and release status.
2. Repair navigation, missing pages, incorrect file handling and unfinished tools. Prioritize reliable PDF essentials, image tools and developer/text tools. Ship a smaller working set if advanced conversions require more work.
3. Verify conversion results with representative documents/images, cancellation, invalid inputs, large files and accessible error messages. Audit dependencies fetched from external CDNs before claiming offline support.
4. Add a desktop shell with isolated web content and narrowly scoped file operations. Electron is the initial candidate because Quranly already uses it; verify the fit before committing.
5. Create a versioned Windows installer, app identity, icon, uninstall behavior and documented local data paths. Connect the same release metadata contract planned for the launcher.

Exit: Tooldeck has a tested release scope and a Windows build that installs, opens, processes files and uninstalls correctly.

## Phase 4 — Create a common release pipeline

1. Define release metadata: app ID, semantic version, channel, OS/architecture, minimum supported system/launcher version, release notes, package URL, byte size, cryptographic digest, signature and package type.
2. Use HTTPS artifact storage behind a BlueCloud-owned update address. GitHub may remain part of the build/release process; users interact with BlueCloud download and update screens.
3. Sign public Windows installers and authenticate release metadata with a pinned trust root. A downloaded file's checksum alone is insufficient if an attacker can replace both the file and its metadata.
4. Add an app-specific adapter for install/update/detection. Quranly and Tooldeck can use their Electron/NSIS packaging; Coneic needs an adapter suited to its native package. Do not assume one Electron updater can update every product.
5. Publish packages first, verify availability and signatures, then promote channel metadata. Retain the previous good release and define recovery behavior per app, including data compatibility.
6. Separate alpha/beta/stable channels. Give each app one update coordinator so its own updater and the launcher cannot install simultaneously. Preserve existing notices and source-delivery materials alongside Coneic releases.

Exit: a test release can be published, authenticated, downloaded and replaced by a subsequent version without losing app data.

## Phase 5 — Build the BlueCloud launcher MVP

1. Implement a product library with Install, Open and Update states, installed/latest versions, release notes, progress, cancel/retry and understandable errors.
2. Add verified download caching, package validation, trusted executable paths, an installation registry and app-specific installation adapters. Detect supported existing installs; request the location for unrecognized portable copies.
3. Handle apps that are open, failed installers, interrupted downloads, unavailable servers and offline startup. Queue updates and explain when the app must close. Never report success until the installed version is verified.
4. Offer opt-in automatic updates, per-app controls and release-channel selection. Preserve application settings and downloaded content during updates.
5. Add the launcher's own update path. Start with a basic reliable interface; defer accounts, cloud libraries and a plugin marketplace.

Exit: one launcher can install and open all three products, detect an update, apply it safely and recover from a failed attempt. Test the full flow with installed builds on a clean Windows profile or VM.

## Phase 6 — Pilot and release

1. Run install/update/uninstall tests for fresh users and existing Quranly/Coneic users, including custom paths, standard user accounts, running apps, low disk space and interrupted connections.
2. Verify an actual version A to version B update for each product and the launcher; confirm settings, libraries and downloaded audio survive.
3. Publish a small alpha pilot, collect actionable failure reports and resolve blocking issues before a broader release.
4. Replace website coming-soon states with verified launcher downloads and instructions. Keep direct app installers and manual recovery instructions available.

## Recommended implementation order

Workspace audit and safe consolidation → accurate catalog and website → Tooldeck release scope and desktop build → release infrastructure → launcher MVP → update integration and pilot → public rollout.

Do not estimate a completion date until Coneic's source/build environment and Tooldeck's tool matrix are known. The first implementation milestone is consolidation with working builds, not a launcher UI mockup.

## Technical reference

Electron Builder supports NSIS updates and a generic HTTPS provider for Electron applications. Its integration remains separate from managing arbitrary native apps through a launcher. Use documentation matching the installed dependency version and verify installed-app update behavior:

- https://www.electron.build/v26/docs/features/auto-update/
- https://www.electron.build/v26/docs/targets/
