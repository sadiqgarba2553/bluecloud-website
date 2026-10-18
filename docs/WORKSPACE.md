# BlueCloud workspace

**Scope correction:** the website has been restored to its original source and live presentation at the owner's request. Active work is only on the separate Windows launcher and Tooldeck. Website-related consolidation descriptions below are historical; the original public assets and pages are active again.

Consolidated 18 October 2026. Website source remains at the repository root to preserve its existing Vite deployment. Product source lives in `apps/`. Shared public product metadata is in `packages/product-catalog/`.

| Product | Authoritative BlueCloud source | Original preserved location |
| --- | --- | --- |
| Website | `src/`, `public/`, root build files | Git history; existing edited packaging references retained |
| Quranly PC | `apps/quranly/` | Desktop `quranly pc` repository, including its pending changes |
| Coneic | `apps/coneic/` | Desktop `Coneic-VLC` source repository |
| Tooldeck | `apps/tooldeck/` | `archive/tooldeck-original/` and `archive/legacy-public/tool-deck/` |
| Launcher | `apps/launcher/` | New BlueCloud project |

The original external projects have not been deleted. The BlueCloud checkout contains their source snapshots, including current uncommitted source changes. Git history bundles of the original repositories are in ignored `artifacts/consolidation/`. The former root `quranly/` source was already deleted in the working tree; its replacement is the current Desktop project's source under `apps/quranly/`.

Coneic's native WSL build environment is `ConeicBuild`, with Linux-side source/build data under `/root/coneic/`. Keep its generated toolchain and build tree on Linux. The Windows source checkout is imported into BlueCloud; native rebuilds follow `apps/coneic/CONEIC.md` and the native build documentation. The tested existing alpha-r2 portable runtime is copied into ignored `artifacts/coneic/Coneic/` for release packaging; this consolidation does not claim a fresh VLC recompilation.

Unrelated website demos, service portals, old marketing pages and their assets are retained in `archive/`; they are excluded from the Vite public directory and application packaging. Existing legal/privacy and Coneic packaging references remain available. Root `.agents/` skills are retained. Environment files, dependency directories, private release keys, local histories and generated installers are ignored.

Future work should use the BlueCloud copies. The preserved Desktop repositories are recovery copies; changes there do not automatically synchronize into this workspace.
