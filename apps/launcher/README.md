# BlueCloud Launcher

Windows x64 alpha. A compact app suite inspired by the provided launcher reference, with BlueCloud branding, native Windows window controls, grid/table layouts, app filters, search, sorting and settings. Design follows the installed Emil Kowalski design-engineering and Apple design skills: system typography, restrained translucent chrome, immediate press feedback, anchored menus and reduced-motion/transparency/contrast support. Source: https://github.com/emilkowalski/skills

Run `npm ci` at the BlueCloud root, `npm ci --prefix apps/launcher`, `npm run prepare:launcher`, then `npm run desktop:launcher`. Package with `npm run package:launcher`.

The renderer is sandboxed and isolated from Node. Its preload exposes only named library operations and fixed product links. Main-process IPC verifies the sender. Release metadata uses an Ed25519 signature with a pinned public key. Downloads use HTTPS, trusted hosts, declared byte counts and SHA-256 checks. ZIP extraction rejects traversal, symbolic links, special files, duplicate file writes and expanded-size overflow. Installation writes into fresh version folders and updates the library registry atomically after validation.

See `docs/RELEASING.md` for publishing, signing, recovery and alpha limits. The release backend is Supabase; no launcher account or database writes are available to clients.
