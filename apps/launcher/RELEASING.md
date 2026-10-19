# Standalone Windows app releases

This workflow publishes desktop app downloads and a signed Supabase update feed. It does not build, replace or modify bluecloudai.online.

Run commands from this directory. Use Node.js 24 and Windows x64.

For the coordinated 0.5 suite, use `node scripts/release.mjs prepare v0.5.0`, then `upload v0.5.0`, `publish v0.5.0` and `verify v0.5.0`. Build Quranly from `apps/quranly`; full packaging now uses that app's current `release/win-unpacked` folder. All three apps have standalone installers alongside their managed ZIPs. The full source archives are generated from the committed release source. Coneic's installer is built with `powershell -NoProfile -File ../coneic/coneic/windows/package-installer.ps1 -App ../../artifacts/coneic/Coneic -OutputDirectory ../../artifacts/coneic` after preparing its native payload.

1. `npm ci` here and in `../tooldeck/` and `../quranly/`. Install the Coneic icon-generation dependency with `python -m pip install -r ../coneic/coneic/windows/requirements-build.txt` before preparing a full app release.
2. Update the relevant app version. The launcher and Tooldeck versions are in their own `package.json`; Coneic and Quranly versions/descriptions are recorded in `products.json`. Build and validate changed apps before publishing.
3. `npm run dist:win` builds the launcher installer. `npm --prefix ../tooldeck run dist:win` builds Tooldeck. Outputs are in the workspace's ignored `artifacts/launcher/` and `artifacts/tooldeck/` directories.
4. Provide the validated complete Coneic runtime in `artifacts/coneic/Coneic/` and the validated Quranly unpacked app in `apps/quranly/release/win-unpacked/`. A complete corresponding Coneic source ZIP named `Coneic-VERSION-source.zip` must be in `artifacts/releases/`. Existing application source, data and website files are not modified by packaging.
5. Commit and push the app source so the source archives describe the final binaries. `node scripts/release.mjs prepare v0.5.0` builds managed app archives, SHA-256 checksums, a signed feed and a publishing manifest in `artifacts/app-releases/v0.5.0/`. Packaging reuses validated unchanged archives where available.
6. Run `node scripts/release.mjs upload v0.5.0`. The tool creates a draft GitHub release and uploads/verifies all files. It uses Git's existing credential helper in memory; tokens are not printed or saved. If an upload is interrupted, rerun the same command to skip already verified assets.
7. `node scripts/release.mjs publish v0.5.0` publishes the verified release. It does not write a website download catalog. Apply the generated `promote-feed.sql` through authorized server-side Supabase tooling only after publication.
8. `node scripts/release.mjs verify v0.5.0` checks the public feed signature, expiry, package URLs and lengths. Test a fresh launcher profile downloading a real app, plus a previous-version update preserving settings.

For a later app-only release that does not change the launcher version, pass a new immutable tag to each command, for example `npm run release:prepare -- apps-2026.10.19`, then the same tag with `release:upload`, `release:publish` and `release:verify`. Users see updates when a listed app's semantic version increases. Existing version URLs must never be overwritten with different bytes.

For a launcher-only fix, bump and build the launcher, then run `node scripts/release.mjs prepare-launcher`. This signs a new feed retaining the currently published app package URLs and uploads only the new launcher, feed and checksums. Continue with the normal upload, publish, promote and verify steps. The original release remains public because its immutable app packages and corresponding source are still used.

The private Ed25519 key is backed up outside build output in `%LOCALAPPDATA%/BlueCloud/ReleaseSigning/release-private.pem`. `BLUECLOUD_SIGNING_KEY` can override this path; the original ignored `artifacts/signing/release-private.pem` remains a fallback. `node scripts/backup-signing-key.mjs` verifies the key and creates the private backup if missing. Never commit or distribute either copy. The matching public key is pinned in `config.json`. Do not regenerate or change it for routine releases. Installed launchers reject untrusted signatures, expired feeds, unexpected download hosts and invalid package contents. Renew the signed feed before its expiry even if no app version changes.

After publishing, `node scripts/smoke-live.cjs update` uses disposable profiles to download and install the real public packages, open Tooldeck and Quranly, smoke-test Coneic playback and verify a real previous-version Tooldeck update retains app preferences. It leaves the website and real user profiles untouched.

The alpha channel is public read-only in Supabase. Only privileged publishing tools can write the release row. No launcher login is needed. Never put service credentials or private signing keys in the launcher.

Managed apps have versioned binary folders; updates switch the registry after package validation and retain the previous version for recovery. App settings and downloaded content live in the apps' existing Windows profiles. Existing standalone installations are not automatically adopted or removed. Users choose when to apply app updates; the launcher checks the server on startup and every 10 minutes, including while minimized. Launcher updates download and verify automatically, then apply through a detached Windows installer when app operations are idle. A 15-second grace period offers Restart now or Later. Staged installers survive a launcher restart and are verified again before execution. Windows can require administrator approval when the launcher is installed in a protected directory. Individual and bulk uninstall remove managed binaries while preserving app profiles.

These Windows alpha installers are currently unsigned. Feed/package verification is separate from Windows publisher signing; a trusted signing certificate and broader release pilot are still needed before a stable release.

For a Tooldeck-only release, build and validate Tooldeck, then run `node scripts/release.mjs prepare-tooldeck`. Use the emitted `tooldeck-vVERSION` tag with upload and publish, promote the generated signed feed, and verify it. This retains the existing launcher, Coneic and Quranly URLs and uploads the Tooldeck managed archive, installer, source and checksums.

For a Quranly-only release, validate and build apps/quranly with npm run dist:win, then run node scripts/release.mjs prepare-quranly. Publish the emitted quranly-vVERSION tag and promote its signed feed using the same sequence as Tooldeck. This retains the launcher, Coneic and Tooldeck URLs. The installer, managed archive, source and engine notices are included.
