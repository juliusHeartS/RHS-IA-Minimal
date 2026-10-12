# RHS-IA customization and upgrade ledger

This file and [`rhs-customizations.json`](./rhs-customizations.json) are the authoritative record of the RHS-IA fork. The Markdown file is the human upgrade guide; the JSON file supplies stable identifiers, exact paths, commit evidence, classifications, verification obligations, and a machine-readable coverage map. A customization change is incomplete until both files agree. If they disagree, stop the upgrade and reconcile them before resolving the affected code.

The ledger describes the current product, not every experiment in branch history. In particular, old Continue/OPS harness work, RHS Agent and PdfStruct VSIX files, and the source `positron-assistant` implementation do **not** currently ship. The provider-neutral core hooks and the temporary macOS mock-keychain behavior do remain active.

## September 29 RHS-IA 1.0 handover cleanup

Status: in progress from commit `76184a7e1ec714587f2bc93326606836f6f292ea`; the first handover changes were committed as `d217c119231e694c0f22d8736e41ec309559419c`. They rewrote the README for PAHO IT source-build handover, pointed repository and issue-reporting metadata at RHS-IA, corrected developer and contributor/security guidance, and renamed product-icon assets and their build/runtime references. On 2026-09-29, pinned Node 24 core and macOS arm64 package builds, core and build TypeScript checks, extension compilation, layer checks, the theme migration test, inventory and Spanish-localization validators, hygiene checks, and 105 regenerated colorization fixtures passed. The complete colorization suite fails in three RHS-IA light theme fixtures; the [branding audit](rhs-ia-branding-audit.md) records this and the remaining 42,245 matching text lines. The audit and validation records below are historical and must not be read as a pass for this cleanup. Branch publication and deletion have not started; they require completed branding validation, live remote-state review, and preservation of open pull requests.

The icon source path is `rhs-ia-product-icons/rhs-ia.png`. After the handover commit, the user requested restoration of the previous application artwork. The original macOS, server, and Windows icon bytes have been restored under the RHS-IA resource filenames; Linux and source PNG bytes already matched the earlier assets. The old Windows artwork visibly contains the Positron mark, which is now retained by user preference and recorded in the [branding audit](rhs-ia-branding-audit.md). The one-source `update-icons.sh` generator was removed because running it would overwrite these distinct restored assets. The macOS arm64 package rebuilt successfully on 2026-09-29 and contains the byte-identical restored icon at `RHS-IA.app/Contents/Resources/RHS-IA.icns`; Windows and server packaging remain unverified. The default dark theme is named `Default RHS-IA Dark`; existing `Default Positron Dark` settings migrate to that ID. An unused `positron_light.json` theme file was removed. Windows AppX publisher identity and Linux package maintainer metadata still contain upstream values; platform packages are not certified for distribution. The remaining textual and path references require a full exception-by-exception reconciliation before the cleanup can be called complete.

### October 1 follow-up

The RHS-IA Light selector mismatch was repaired and all 108 colorization fixtures now pass. Visible application and extension copy, nine Spanish overlay values, selected diagnostics, workflow display names, product metadata, and installer labels were updated without changing compatibility-sensitive localization keys, extension IDs, or persisted settings. The upstream newsletter action and disabled AppX manifest were removed. Linux DEB/RPM generation requires `RHS_IA_LINUX_MAINTAINER` in `Name <email>` form. Fresh pinned Node 24 `core-ci` and macOS arm64 package builds passed; the focused Vitest run passed 80 tests with seven skips, and the Spanish overlay validator passed 413 keys. The fresh packaged `product.json`, `Info.plist`, and restored icon were inspected. The [branding audit](rhs-ia-branding-audit.md) records the substantial remaining source, workflow, dependency, compatibility, and binary-artifact items, so branch publication and deletion remain gated. The GitHub repository could not be read through the current connection or local HTTPS credentials on 2026-10-01.

The September 29 notes above describe the historical handover checkpoint. The disabled AppX manifest with false publisher metadata was deleted in this follow-up, and Linux package builds now require an explicit RHS-IA maintainer value. Platform packages are still not certified for distribution. The local branch is `RHS-IA-1.0` and is the only local branch. Eleven contained local branches were removed; the two divergent tips were preserved under annotated tags `rhs-ia-backup-asistente-rhs-rebrand-2026-10-01` and `rhs-ia-backup-rhs-ia-rebrand-2026-10-01` before their branch names were removed. GitHub publication, default-branch change, and remote-branch deletion have not started.

## Audit boundary

| Item | Audited value |
| --- | --- |
| Audit time | 2026-09-11T00:44:16Z |
| Branch | `remove-certificates` |
| Audited HEAD | `3d8c16bb3925966353472481ecb4cc828886ce1c` |
| Positron baseline | tag `2026.07.1-5`, commit `d3cdd608df5afa3378c24c9a9c81b01fe1433a87` |
| Pre-merge fork tip | `a2766036b4a95378842a450c4d7c4eb8951087d6` |
| Older common ancestor | tag `2026.06.0-211`, commit `d5f94f072b1083b8237930739cb6525c6e12e1da` |
| Fork-only commits relative to the audited baseline | 78 |
| Audited diff | 4,497 file records; 47,805 insertions; 1,332,171 deletions |
| Name-status digest | SHA-256 `5c18b13a2ad638f9bea8a851027f61914c40c57e6e8103c93b5ebfc1cf51f8d3` |
| Pre-existing working-tree change | `AGENTS.md`, owned by the coordinator and preserved |

The input digest comes from `git diff --name-status 2026.07.1-5..HEAD`. Git skipped exhaustive rename detection because the deletion set exceeded its default limit. The two detected renames are therefore treated as path-state evidence, not as proof of a semantic move. These ledger files were created by the audit and are excluded from the audited product delta.

### Audit validation result

The ledger integrity check passed with 20 unique customization IDs, 94 implementation-path records, resolvable commit evidence, and all 4,497 diff records assigned across 36 path groups. The live Git grouping agrees with the stored coverage counts.

The extension inventory, Spanish localization (370 keys and two extension bundles), Darwin bundled-extension check, documentation manifest/translation/branding/exclusion/link/offline/search audits, four documentation QA tests, and five activity-bar migration tests passed. An existing macOS arm64 package was inspected and contained RHS-IA identity, `rhsIaUseMockKeychain: true`, the required empty auto-update array, all 11 bootstrap VSIX files, and `kcserver 0.1.66` as Mach-O arm64; this was artifact inspection, not a fresh build.

The RHS startup suite has one known failure: 10 tests pass, while line 131 expects `darwinBundleIdentifier` `org.paho.rhsia` instead of the current temporary `co.posit.positron` state. This is the `RHS-MAC-001` test/product mismatch. No application code or identifier was changed as part of this documentation audit.

## September 2026.09.1-2 upgrade status

Status: implementation validated and staged. The pinned upstream release is resolved, the compile and customization gates pass, and the merge commit plus final package acceptance remain.

| Item | Current value |
| --- | --- |
| Recorded UTC | `2026-09-11T19:35:32Z` |
| Branch | `update-positron-2026.09.1-2` |
| Pre-merge HEAD | `39856b15272f7db1bbf8d8b2ec3c389e59a49cb6` |
| Safety tag | `rhs-ia-before-2026.09.1-2` |
| Target tag | `2026.09.1-2` |
| Target commit | `467ff390dd8b4ffc8972ebb84d9e05a1fd5a4fe2` |
| Merge base | `7b3fe7ddfd1f8f70134592f6df93d0bf6f6241ec` |
| Merge state | September merge and Quarto single-architecture follow-up committed; automated package acceptance passed |
| Required Node | `24.18.0` arm64, installed from the official checksum-verified archive |
| Electron target | `42.6.0` |
| Supervisor target | `0.1.68` |
| Quarto target | `1.10.18` |

Completed in this working tree:

- Preserved RHS identity, Spanish startup, temporary mock-Keychain values, curated catalogs, empty auto-update list, and intentional assistant/Copilot exclusions.
- Took September's product and dependency schema while neutralizing `defaultChatAgent` with empty IDs and URLs.
- Updated Quarto to `1.10.18` using the four official filename-specific SHA-256 checksums from the Quarto download manifest.
- Updated the startup test to assert `co.posit.positron`, `rhsIaUseMockKeychain: true`, the neutralized chat-agent contract, and the empty auto-update list.
- Strengthened `scripts/validate-rhs-ia-extension-inventory.mjs` to require the approved built-in and bootstrap IDs and an exactly empty auto-update array.
- Moved the Spanish welcome overlay from the deleted `positronWelcomePageStart` module to `common/gettingStartedPositronWelcomeContent`, and added translations for ten new September console, variable, and submission strings.
- Restored the exact September Ark gitlink and clean checkout at `5564f488e539cfdd344f583a7aeb40250f7d20d3`.
- Removed the stale assistant-layout E2E preset and skipped suite after confirming the layout registration and command remain intentionally absent.
- Initialized `ai-lib` at `a05f21e952887e91bdad60966ab74a230336587f` and completed `npm ci` with Node `24.18.0` arm64 / npm `11.16.0`.
- Rebased desktop, extension, remote, hygiene, Copilot-runtime, and Quarto build logic on September's gulp facade and task APIs while keeping source Copilot and `positron-assistant` excluded.
- Reapplied permanent RHS-IA update disablement to the September state machine and verified that the update workbench contributions remain unregistered.
- Adapted September's redesigned React welcome page to retain the PAHO and RHS-IA marks and RHS-specific copy.
- Updated layer-checker inputs for Positron TSX/API declarations and declared `parse5` directly for the offline documentation build.
- Refreshed Supervisor/Kallichore to `0.1.68`, built Ark `0.1.252-301-5564f48`, and moved ignored residual builds for excluded source assistants outside the repository.

Interim checks completed:

- Core native TypeScript, all selected local extensions, and build-tool TypeScript pass with zero errors.
- The extension inventory, 388-key Spanish localization, Darwin bundled-extension, and all six layer/type-boundary projects pass.
- The RHS startup/activity-bar suites pass 16/16. Focused assistant, provider, update, and welcome suites pass 86/86 across eight files; the former `RHS-MAC-001` known failure is resolved.
- The documentation generate/build/check/test/bundle pipeline passes for 50 English and 50 Spanish pages, including all four documentation QA tests.
- Quarto's cold and warm cache paths pass: the official 247,503,295-byte macOS archive matches SHA-256 `ddd6a71a9e0448ab15fb655bc589e11cb6589a248ec35ccd7f7f44137531688e`, and the cached binary reports `1.10.18`.
- Quarto's explicit invalid-archive path fails closed, an isolated corrupt cache self-recovers through a verified redownload, and the versioned extraction/output paths retain only the target architecture.
- The normal precommit hook passes against the 84-file `AUTO_MERGE` resolution delta with zero errors.
- Sequential `core-ci` and `vscode-darwin-arm64-min-ci` builds pass after the final source correction; the package reports 27,640 build-audited paths within the 195-character path budget.
- Packaged identity/runtime checks pass for RHS-IA, Electron `42.6.0` arm64, Supervisor `0.1.68`, Quarto `1.10.18` with only aarch64 tools, and Ark `5564f488`; catalog inclusions and exclusions match the ledger.
- The isolated CLI exits cleanly, while a disposable GUI launch shows Spanish startup, PAHO/RHS-IA welcome branding, no update action, and the bundled Spanish documentation offline.
- Signing remains intentionally non-production: ad-hoc/linker-signed, no Team ID, and no signing configuration changes.

No dependency, compile, packaging, or automated acceptance blocker remains. Manual release follow-up is limited to a disposable secret save/read across full macOS restarts and an in-place upgrade; startup ordering and the mock-Keychain product contract are verified, but that end-to-end credential migration exercise was not automated here.

September delta coverage is complete: `git diff --name-status 467ff390dd8b4ffc8972ebb84d9e05a1fd5a4fe2 HEAD` yields 4,596 records (367 added, 133 modified, 4,095 deleted, one exact rename), digest SHA-256 `c93c0ccdd3a3e64eaacce88f13246d7645a172831b4538096e89b7149b9c651d`, with zero unassigned records. The largest assigned groups are `extensions/copilot/` (4,085, `RHS-EXT-002`), `extensions/rhs-ia-documentation/` (265, `RHS-DOC-001`), `src/` (68), `.agents/` (54), and `build/` (43). The complete group map is in the JSON companion; the July coverage map above remains historical evidence.

Hygiene note: the conflict-marker findings in `.claude/skills/merge-upstream-vscode/SKILL.md` and `.claude/skills/merge-upstream-vscode/references/package-json.md` are intentional examples in upstream documentation. Historical/generated paths classified by `RHS-DEV-001` and `RHS-GEN-001` also retain pre-existing whitespace findings; current integration edits are whitespace-clean and no unmerged or untracked repository files remain.

## How to use this ledger during an upstream upgrade

1. Record the old fork HEAD, the exact new upstream commit/tag, the merge base, and the dirty-worktree state before changing anything.
2. Recompute the baseline-to-fork name-status inventory and compare it with the JSON coverage map. New or unassigned path groups must be classified before conflict resolution.
3. Resolve each conflict according to its stable ledger ID and integration rule:
   - `preserve`: retain RHS-IA behavior unless an explicit product decision changes it.
   - `intentionally_excluded`: keep the component absent even if upstream restores it.
   - `upstream_owned_with_rhs_adaptation`: accept the upstream implementation, then reapply the narrow RHS identity/policy adaptation.
   - `do_not_ship`: retain only as development evidence or history; exclude from release assembly.
   - `investigate_before_change`: do not guess; obtain the missing product, security, provenance, or retention decision.
4. Recheck current paths, removed paths, product catalogs, package inputs, and user-profile migrations. A clean source diff is not evidence that a packaged artifact is correct.
5. Compile before targeted tests when TypeScript changes. Run the entry-specific checks below and inspect final packaged contents whenever packaging, extensions, Electron startup, credentials, or remote-server code changes.
6. Update both ledger files with the new baseline, evidence, paths, decisions, risks, and verification results. Do not mark an open question resolved without recording its decision and owner.

## Current customization index

| ID | Area | Status | Integration rule | Upgrade intent |
| --- | --- | --- | --- | --- |
| `RHS-ID-001` | Product identity | Active | Preserve | Keep RHS-IA names, protocols, storage roots, and installer identity; do not silently relabel unresolved Posit-owned metadata. |
| `RHS-ID-002` | Legacy profile migration | Active | Preserve | Keep early, narrow migration of `argv.json`; do not bulk-migrate credentials or extension state. |
| `RHS-MAC-001` | macOS credentials | Active, temporary | Preserve | Keep mock-keychain until an explicit signed/notarized credential-migration plan replaces it. |
| `RHS-L10N-001` | Spanish startup | Active | Preserve | Keep Spanish as the new-profile default and bundle the pinned offline language pack. |
| `RHS-L10N-002` | Spanish overlays | Active | Upstream-owned + RHS adaptation | Reapply RHS/session/Python/R translations after upstream NLS changes. |
| `RHS-UI-001` | Branding and welcome | Active | Preserve | Keep PAHO/RHS-IA artwork, copy, and platform assets. |
| `RHS-UI-002` | Theme | Active | Preserve | Keep both RHS-IA theme names and migrate the old dark setting. |
| `RHS-UI-003` | Default layout | Active | Upstream-owned + RHS adaptation | Keep simplified defaults and one-time migrations without overwriting later user choices. |
| `RHS-DOC-001` | Offline documentation | Active | Preserve | Ship bilingual offline docs and their Help/Welcome integrations. |
| `RHS-AST-001` | Assistant hooks | Active | Upstream-owned + RHS adaptation | Keep provider-neutral hooks and gates; do not claim an assistant extension ships. |
| `RHS-EXT-001` | Curated extensions | Active | Preserve | Keep exact catalogs, empty auto-update array, validators, and VSIX integrity checks. |
| `RHS-EXT-002` | Extension exclusions | Intentionally removed | Intentionally excluded | Keep Copilot Chat, GitHub PR, Publisher, source assistant, and retired layouts absent. |
| `RHS-UPD-001` | Self-update | Active | Preserve | Keep Positron desktop self-update disabled across services and UI entry points. |
| `RHS-PKG-001` | Packaging | Active | Upstream-owned + RHS adaptation | Reapply RHS labels/assets to each final desktop, CLI, server, and REH artifact. |
| `RHS-PKG-002` | Quarto runtime | Active | Upstream-owned + RHS adaptation | Preserve pinned, checksummed Quarto preparation and target filtering. |
| `RHS-PKG-003` | Kallichore invariant | Active guard | Upstream-owned + RHS adaptation | Match manifest, marker, executable version, and architecture in source and package. |
| `RHS-REMOTE-001` | Remote server | Active | Upstream-owned + RHS adaptation | Preserve RHS paths while resolving the remaining Posit CDN/artifact dependency. |
| `RHS-HIST-001` | Retired AI/RAG work | Superseded history | Do not ship | Keep removed experiments removed; use their history only as evidence. |
| `RHS-DEV-001` | Developer tooling | Developer-only | Do not ship | Preserve maintainership aids without including them in release assembly. |
| `RHS-GEN-001` | Generated/temporary paths | Generated or temporary | Investigate before change | Do not grant product status; obtain a separate retention/cleanup decision. |

## Authoritative details

### `RHS-ID-001` — RHS-IA identity and namespaces

`product.json`, `src/vs/platform/product/common/product.ts`, `package.json`, packaging scripts, resources, and server manifests establish the RHS-IA family:

- desktop/product name `RHS-IA`, application name `rhs-ia`;
- local data `.rhs-ia`, shared data `.rhs-ia-shared`;
- server executable `rhs-ia-server`, server data `.rhs-ia-server`;
- URL protocol `rhs-ia` and Linux icon `org.paho.rhsia`;
- Windows AppUserModelId `PAHO.RHSIA` and fork-owned installer GUIDs.

This is not yet a total legal/distribution-identity migration. As of 2026-10-01, `companyName` is `RHS-IA`, `licenseName` is `Elastic License 2.0`, and release-notes/download URLs point to the RHS-IA repository. License URLs, trusted domains, extension-gallery endpoints, and some remote distribution fields still point to Posit/upstream. Repository and issue-reporting URLs also target RHS-IA. PAHO must still confirm legal and distribution ownership; preserve actual upstream dependency URLs until there is a working replacement.

The 2026-10-08 working-tree wording update describes RHS-IA as a PAHO-oriented application based on Positron in `README.md` and `CONTRIBUTING.md`. The translation guide and upgrade records use the same provenance wording or refer to product-identity cleanup. Exact historical backup-tag names, upstream component descriptions, copyright notices, and compatibility identifiers remain accurate. This is a documentation-only change; verification consists of a tracked-text wording scan, JSON parsing, targeted hygiene, and `git diff --check`.

The subsequent 2026-10-08 README screenshot addition copies the user-supplied RHS-IA interface image into the repository at `assets/interfaz_agent.png` and embeds it beneath the introduction using that relative path. The caption identifies the optional RHS-Agent extension and simulated data shown. Verify that the asset is not ignored, matches the supplied image byte for byte, and resolves from the README within the repository; no external workspace asset path is published.

Verification: inspect final platform manifests and packaged `product.json`, launch desktop and CLI with disposable profiles, and test the storage migration in `RHS-ID-002`.

### `RHS-ID-002` — narrow early profile migration

`src/main.ts` invokes `src/vs/platform/languagePacks/node/rhsIaStartup.ts` early enough to migrate supported startup state before normal argument, locale, and credential initialization. It migrates only legacy `argv.json` from `.positron` to `.rhs-ia`. Extensions, caches, global state, and credentials are deliberately outside its contract, and portable mode stays isolated.

Verification must cover fresh profiles, existing RHS profiles, legacy Positron profiles, explicit English, Spanish regional locales, and portable mode. Do not broaden the migration during conflict resolution without a privacy, security, rollback, and ownership design.

### `RHS-MAC-001` — temporary mock-keychain workaround

The current macOS state is intentional and must be preserved through routine upstream upgrades:

- `product.json`: `rhsIaUseMockKeychain: true`;
- `src/main.ts`: append Chromium's `use-mock-keychain` switch on macOS before credential initialization;
- bundle identifier: `co.posit.positron`;
- profile UUIDs: `0501C5DF-0DC9-4217-9C18-A5595A125743` and `BEA2CCD2-3F74-4174-9C0E-606A6F13B050`.

Commit `24eb0c2870ead44c2af6be636d9c28b571f2b7de` is titled “Temporarily restored certificate,” but the code did **not** restore an Apple certificate. It switched to Chromium's mock Keychain after ad-hoc builds changed the Electron executable hash and Safe Storage failed across restarts. Mock-keychain uses a known password/weak obfuscation; use only disposable, non-sensitive credentials in verification.

Replacement requires an explicit PAHO bundle ID, Developer ID signing, entitlements, notarization, and credential migration. Test a packaged app across full restarts and an in-place upgrade. A source-only or development launch is insufficient. The September startup test now asserts `co.posit.positron` and the preserved mock-keychain flag; the earlier `org.paho.rhsia` assertion is no longer current.

### `RHS-L10N-001` and `RHS-L10N-002` — Spanish-first product

New profiles default to `es`, while explicit current or legacy English choices remain English. Clearing a locale preference writes `en`, because removing the preference would otherwise return to the product's Spanish default. The bundled offline pack is:

| Field | Value |
| --- | --- |
| Extension | `ms-ceintl.vscode-language-pack-es` |
| Version | `1.111.0` |
| VSIX | `language-packs/vscode-language-pack-es-1.111.0.vsix` |
| SHA-256 | `35b5256b7ee58bfb7cd64def2ab7b36ff90a01cc69ba5f0e4b53a0a6a0defbfc` |
| Source | `microsoft/vscode-loc` commit `a18342021e6a1ac3329497351e50cfb33dbac367` |

The base pack is overlaid by `src/vs/base/node/sp.positron.nls.ts` and `sp.positron.session.nls.ts`; Python, R, and other RHS-IA built-in extensions have extension-local Spanish bundles. `ExtHostLocalizationService` falls back to those local bundles when the upstream language pack has no entry for a built-in extension, while continuing to prefer the language-pack bundle when one exists. The overlay covers the React Welcome header, environment setup states and actions, Recent/Connect/startup controls, while the extension bundles cover every Python/R environment-health message. `build/next/nls-plugin.ts` supports the relevant TypeScript/TSX extraction. During a rebase, compare upstream NLS keys and placeholders rather than merely retaining old JSON.

Run `scripts/validate-spanish-session-localization.mjs`, the startup tests, and packaged offline smoke tests. The September validator scans both `common/gettingStartedPositronWelcomeContent.ts` and the React Welcome modules, plus Python/R environment-health call sites. The October 1 checkpoint checked 413 core keys, 39 environment-health keys, and two extension bundles, including placeholder parity. Nine overlay values now say RHS-IA while retaining their existing lookup keys.

The 2026-10-08 working-tree menu repair corrects the stale `topActionBarSessionManager` overlay module to the current `topActionBarSessionPicker` name, adds the recent-folder cleanup command and confirmation translations, and supplies Spanish top-bar actions and clearer interpreter-picker labels. The Python conda picker now routes installation labels, details, progress, and errors through `vscode.l10n.t`, with matching Spanish bundle entries. The validator scans the top bar, folder commands, runtime actions, and Python/R picker call sites, excludes test fixtures, and follows the actual generated/session/curated catalog precedence. It passes with 504 core keys, 47 extension keys, and two extension bundles. Core TypeScript, Python extension compilation, seven conda-picker unit tests, and the focused Welcome/top-bar suites (24 passed, one expected failure) pass. Existing packages require rebuilding; packaged Spanish dropdown acceptance remains pending.

### `RHS-UI-001` and `RHS-UI-002` — branding, welcome, and theme

PAHO/RHS-IA visual identity spans workbench welcome content, `src/vs/workbench/browser/media/logo-ops.png`, RHS light/dark logo assets, the welcome banner, `rhs-ia-product-icons/`, and cross-platform `resources/`. The React Welcome header deliberately restores the historical prominent OPS/RHS-IA logo row and healthcare banner, retains a localized accessible heading, and sends Ayuda to bundled Documentation. The Learn section remains implemented but is hidden at the page composition layer by `SHOW_RHS_IA_LEARN_SECTION = false`; set that switch to `true` to restore it. The default light theme is `Default RHS-IA Light` from `extensions/theme-defaults/themes/rhs_ia_light.json`.

The 2026-10-08 working-tree Welcome change crops the displayed combined OPS/WHO artwork to its first 1280 of 1956 columns, ending in the transparent gap before WHO/OMS. Both `welcomeHeader.css` and the legacy `positronGettingStarted.css` use a 5:1 crop viewport and matching background scale; the original image and theme-aware RHS-IA artwork remain intact. Browser-rendered component previews passed in desktop, narrow, short-window, and dark layouts. Targeted hygiene, core/catalog ESLint, stylelint, and diff checks pass; stylelint reports only suggestions on existing declarations. Packaged Welcome acceptance remains pending.

Review both themes and all major surfaces in a packaged build after upstream DOM, CSS, icon, or color-token changes. The dark theme now uses the RHS-IA name without changing its palette. Existing `Default Positron Dark` user settings migrate through `migrateThemeSettingsId`; the old name remains only as a compatibility input. The October light-theme token repair passes all 108 colorization fixtures. The dark palette still needs visual review. Asset masters and licensing/provenance should be recorded outside the binary exports if they are not already controlled by PAHO.

### `RHS-UI-003` — simplified workbench defaults

`src/vs/workbench/browser/parts/rhsIaWorkbenchLayout.ts` defines the hidden-by-default view containers and status entries. `rhsIaActivityBarMigration.ts` applies the activity/auxiliary defaults and retired-view cleanup; `statusbarModel.ts` applies the status defaults. Current hidden containers include SCM, debug, remote, extensions, testing (`workbench.view.extension.test`), Positron Packages, Connections, Language Help, History, and Preview. Accounts, `status.host`, and `chat.statusBarEntry` are also hidden by default.

The 2026-10-08 working-tree repair applies the defaults during `PaneCompositeBar` registration, including empty profiles and bundled containers registered later by extensions. `CompositeBar.addComposite()` creates new items pinned; skipping the later `pin()` call did not hide them on fresh installations. Registration now explicitly calls the native `CompositeBar.unpin()` API for new default-hidden containers, while cached pin states remain user choices. `SidebarPart` supplies the same option for top/bottom activity bars as `ActivitybarPart` does for the vertical bar. Explorer is the only initially pinned built-in container in the primary sidebar; users can show the others through the normal context menu. Third-party containers, including a separately installed RHS-Agent, retain their normal defaults. The existing auxiliary-bar policy also benefits from the registration fix.

The one-time keys are:

- `rhs-ia.workbench.activityBarDefaults.v2`
- `rhs-ia.workbench.auxiliaryBarDefaults.v2`
- `rhs-ia.workbench.statusBarDefaults.v1`

These migrations establish defaults once; they must not overwrite later user choices on every startup. Auxiliary migration v2 pins `workbench.view.extension.rhs-ia-documentation` at preferred order 0 so Documentation has priority in constrained right-sidebar switchers; the extension manifest supplies the same order for fresh profiles. Retired view IDs and `positronAssistantLayout.ts` remain removed. Test both fresh and upgraded profiles, customize each affected area, restart, and verify the choices persist.

Verification for the working-tree repair uses `rhsIaActivityBarDefaults.vitest.ts` to exercise the real pane/composite bars with empty storage, both toolbar orientations, delayed bundled/third-party registration, restored visibility choices, and the upstream defaults with the RHS-IA option disabled. Run it alongside `rhsIaActivityBarMigration.vitest.ts` after `npm run typecheck-client`. Packaged visual acceptance for this repair remains pending; existing application bundles must be rebuilt to include it.

On 2026-10-08, pinned Node 24 `typecheck-client`, the focused test TypeScript check, all 11 activity-bar tests, targeted hygiene, strict ESLint, and `git diff --check` passed. The repository-wide Vitest typecheck still reports 378 errors with the new test excluded, including missing ambient namespaces and unrelated test type mismatches; this repair does not certify that broader check.

### `RHS-DOC-001` — bundled offline documentation

`extensions/rhs-ia-documentation` is a source/built-in extension with publisher `paho`, version `0.0.5`, and extension ID `paho.rhs-ia-documentation`. It contributes the `rhs-ia-documentation` auxiliary container with preferred order 0, `rhs-ia.documentation.view`, Home/Search/Open commands, Help and Welcome integrations, and Cmd/Ctrl+Shift+H. The Welcome header's Ayuda button invokes `rhs-ia.documentation.open`, activating and focusing this bundled right-sidebar view without a marketplace installation.

The extension contains English and Spanish task content, generated HTML, search indexes, manifests, policies, tests, and build scripts. Language follows `vscode.env.language`; there is no separate language selector. Search is accent-insensitive, requires all terms, ranks results, limits output to 20, and uses stable anchors. External HTTPS links open in the system browser. Only allowlisted `rhs-doc-action:` operations may invoke commands; arbitrary command URIs remain blocked.

Content provenance is CC BY-SA 4.0 from a Positron website snapshot. `upstream/baseline.json` records tree hash `ba45702518f379a7f7d12c029c902caa234e454f231fc9f2a0e22273922a0731` over 359 files, but the exact upstream Git commit is unresolved. The extension README also records pending manual visual acceptance. Both gaps must remain visible until resolved.

### `RHS-AST-001`, `RHS-EXT-001`, and `RHS-EXT-002` — assistants and extension policy

The current product has three deliberately separate facts:

1. Provider-neutral core assistant contracts remain, including provider enablement, notebook metadata, branded icons/welcome hooks, and conditional console Fix/Explain integration.
2. Native Chat registration is disabled with `nativeChatSetupEnabled: false`.
3. No current repository source, product catalog, or tracked bundled VSIX supplies `posit.assistant` or RHS Agent.

Do not collapse these facts into “the assistant ships.” `chatWidget.ts` still detects the external extension ID `posit.assistant`, and console actions require that extension plus enabled settings and chat-model context. Production acquisition, version, checksum, license, provider policy, and update channel for that package are unresolved. Workspace-trust and console error copy now use the RHS-IA Assistant name; the external extension ID remains a compatibility contract.

The exact current catalogs are:

**Built-in extensions**

- `ms-vscode.js-debug-companion@1.1.3`
- `ms-vscode.js-debug@1.117.0`
- `ms-vscode.vscode-js-profile-table@1.0.10`
- `ms-ceintl.vscode-language-pack-es@1.111.0`
- `rstudio.rstudio-workbench@2026.9.5`
- `posit.slc@0.6.0`

**Bootstrap extensions**

- `charliermarsh.ruff@2026.76.0`
- `ms-toolsai.vscode-jupyter-cell-tags@0.1.9`
- `ms-toolsai.jupyter-keymap@1.1.2`
- `ms-toolsai.vscode-jupyter-slideshow@0.1.6`
- `ms-toolsai.jupyter-renderers@1.3.0`
- `ms-toolsai.jupyter@2025.9.1`
- `meta.pyrefly@1.2.0`
- `ms-python.debugpy@2026.6.0`
- `quarto.quarto@1.136.0`
- `posit.air-vscode@0.28.0`
- `posit.shiny@1.4.2`

`builtInExtensionsEnabledWithAutoUpdates` must remain present as the array `[]`. Removing it caused a packaged CLI crash because upstream iterates it. `.github/workflows/extensions-tag-map.json` must match the bootstrap catalog. `build/lib/bundledExtensions.ts` validates VSIX manifests, platform, SHA, duplicates, and LFS pointer failures; currently `bundled-extensions/` contains no product VSIX.

The following IDs remain forbidden from product catalogs: `posit.publisher`, `github.vscode-pull-request-github`, `posit.assistant`, and `github.copilot-chat`. The source trees `extensions/copilot/` and `extensions/positron-assistant/` remain deleted. Git and git-base must stay available. Root `@github/copilot` packages are upstream core agent-host dependencies; their presence does not mean the removed Copilot Chat extension ships.

### `RHS-UPD-001` — upstream self-update disabled

The update policy is distributed across configuration, main/browser services, workbench registrations, titlebar/menu code, badges, and post-update UI. Current behavior defaults `update.mode` to `none`, places the desktop update service in `ManuallyDisabled`, does not schedule or fetch an update feed, does not register normal update contributions, and supplies no native macOS update menu item.

The underlying update classes remain for upstream service shape and developer routes. Their presence is not proof that self-update is active. Conversely, preserving only one disabled service is insufficient if upstream introduces another action or startup registration. Test menus, command palette, titlebar, badges, logs, network traffic, and post-update paths in a packaged online build. `docs/AnularUpdate.md` is historical implementation evidence, not current validation.

### `RHS-PKG-001` and `RHS-PKG-002` — packaging and Quarto

RHS-specific labels and resources are layered over upstream desktop, CLI, server, and REH packaging. Inspect every final target rather than relying on source configuration or a single platform package.

Quarto preparation in `build/lib/quarto.ts` pins version `1.10.18`, verifies the four official platform-specific SHA-256 checksums, and caches under `.build/quarto-cache/<version>`. `QUARTO_ARCHIVE` and `QUARTO_CACHE_DIR` support controlled inputs. Packaging tasks must prepare the runtime before `getQuartoBinaries`, and macOS packages must filter out the opposite architecture's tools. Test cold, warm, corrupt-cache, explicit-archive, and explicit-cache flows; inspect the packaged executable/version rather than trusting a marker file.

### `RHS-PKG-003` — Kallichore/Supervisor guard

Kallichore is principally upstream-owned. A prior package combined a Supervisor manifest requiring `0.1.66` with a stale `kcserver 0.1.64`. The September source cache has now been refreshed to `0.1.68`; final package inspection remains required. Every relevant source/cache/package layer must contain:

- Supervisor requirement `0.1.68`;
- `resources/kallichore/VERSION` value `0.1.68`;
- executable output `kcserver 0.1.68`;
- Mach-O arm64 architecture.

Every relevant package build must compare the extension manifest, `VERSION`, `kcserver --version`, and the actual binary architecture in both source and final artifact. Cache or filename checks alone are inadequate.

### `RHS-REMOTE-001` — remote identity with unresolved distribution ownership

Remote SSH, dev-container, server, and REH paths use `rhs-ia-server` and `.rhs-ia-server`, including RHS-specific markers, logs, sockets, and executable naming. However, `serverDownloadUrlTemplate` still targets the Posit CDN and `positron-reh` artifact naming. This mixed state is factual and must not be hidden.

Test clean install, upgrade, reconnect, and architecture selection on every supported remote target. Inspect the downloaded archive, checksum, executable, data path, and logs. PAHO must decide whether it will host/sign an RHS-IA server artifact or explicitly retain the Posit distribution dependency.

### `RHS-HIST-001` — superseded assistant/RAG components

Historical commits implemented Continue/OPS harness experiments, local-provider auto-detection, PdfStruct, RHS RAG, and bundled RHS Agent assets. Later commits removed the old Continue/Posit assistants, external assistant assembly, and these VSIX files:

- `bundled-extensions/mac/pdfstruct.vsix`
- `bundled-extensions/mac/rhs-rag.vsix`
- `bundled-extensions/rhs-agent.vsix`

The old macOS RHS Agent work also contained Git LFS pointer stubs in embedded binaries. `.rhs-rag/` now contributes generated LanceDB manifests only; it is not proof of a shipped extension. Keep these components absent from catalogs, assembly inputs, and final packages unless a new, explicitly authorized design supplies source, license, checksum, security review, and distribution ownership.

### `RHS-DEV-001` and `RHS-GEN-001` — non-runtime repository material

`AGENTS.md`, `.agents/`, focused tests/validators, workflow files, and ignore rules are developer-only. They guide changes but should not enter product assembly. The audit began with a coordinator-owned uncommitted `AGENTS.md` edit; this ledger must not overwrite it.

`.rhs-rag/`, `TempAcuerdos/`, `patch.txt`, six `resolve_*.sh` merge helpers, and `versions/2026.05.1.commit` are classified as generated data, working notes, merge residue, or historical markers—not authoritative product source. Cleanup is outside this ledger task and requires an explicit retention decision. Until then, verify that none is packaged or used as the sole source of a production dependency.

## Commit evidence map

The JSON entry records contain full commit IDs. High-value boundaries include:

| Commit | Evidence |
| --- | --- |
| `bd7aa74f73ff9dc7cff0a5e5244fe7b788ed335c` | Initial RHS-IA branding |
| `8feec4c5bb08ef4be3ee0eea1d892390caa73589` | Self-update removal |
| `398daaaa3270829dfe21faa444fbcfc11a90f5d6` | Bundled Spanish language pack |
| `37f1f6aad6bda85a2762f09017296a88b6dd6063` | Multiplatform bundled-extension validation; also records the historical LFS-pointer problem |
| `452e3b5aa923e82df0438b2d30bf83b64c397a1e` | Quarto preparation/cache |
| `6f43feeb890ac1a0761eeecb928657f544da1637` | Removal of old Continue and Posit assistants |
| `2806ce2c485106a8aff25a727fe6d09550551ef4` | Removal of old bundled VSIX files |
| `1841d18a75c49459791fe5c87092de33ac5764b0` | Final extension-removal pass |
| `a2766036b4a95378842a450c4d7c4eb8951087d6` | Testing view ID correction before baseline merge |
| `cad3ccf370751070c47dafff779b6ce83d8f6b07` | Removal of stale `positronChat.css` import after upstream merge |
| `f4c7045c6392939ddec6d627349ba6e504b349b8` | Extension inventory/runtime-array correction |
| `24eb0c2870ead44c2af6be636d9c28b571f2b7de` | Current temporary mock-keychain state |
| `3d8c16bb3925966353472481ecb4cc828886ce1c` | Offline documentation implementation |

Commit subjects are clues, not specifications. The current tree, product/package artifacts, and this ledger determine present status. Author aliases `Josu <josue.ibarra998@gmail.com>` and `juliusHeartS <julius3005@gmail.com>` appear in the fork history; identity equivalence is an inference and is not used as technical evidence.

## Diff coverage

Every top-level group in the 4,497-record audited diff is assigned in the JSON coverage map. The counts below must sum to 4,497; overlapping ledger IDs classify the same path group from different product perspectives and do not duplicate the count.

| Path group | Count | Ledger IDs |
| --- | ---: | --- |
| `.agents/` | 54 | `RHS-DEV-001` |
| `.gitattributes` | 1 | `RHS-EXT-001` |
| `.github/` | 2 | `RHS-EXT-001`, `RHS-DEV-001` |
| `.gitignore` | 1 | `RHS-DEV-001` |
| `.rhs-rag/` | 6 | `RHS-HIST-001`, `RHS-GEN-001` |
| `.vscode-test.js` | 1 | `RHS-DOC-001` |
| `AGENTS.md` | 1 | `RHS-DEV-001` |
| `TempAcuerdos/` | 2 | `RHS-GEN-001` |
| `build/` | 35 | `RHS-DOC-001`, `RHS-EXT-001`, `RHS-PKG-001`, `RHS-PKG-002` |
| `bundled-extensions/` | 2 | `RHS-EXT-001`, `RHS-HIST-001` |
| `docs/` | 7 | `RHS-DOC-001`, `RHS-UPD-001`, `RHS-DEV-001` |
| `extensions/copilot/` | 3,957 | `RHS-EXT-002` |
| `extensions/open-remote-ssh/` | 1 | `RHS-REMOTE-001` |
| `extensions/positron-assistant/` | 47 | `RHS-AST-001`, `RHS-EXT-002`, `RHS-HIST-001` |
| `extensions/positron-dev-containers/` | 4 | `RHS-REMOTE-001` |
| `extensions/positron-python/` | 3 | `RHS-L10N-002` |
| `extensions/positron-r/` | 3 | `RHS-L10N-002` |
| `extensions/rhs-ia-documentation/` | 265 | `RHS-DOC-001` |
| `extensions/theme-defaults/` | 2 | `RHS-UI-002` |
| `language-packs/` | 1 | `RHS-L10N-001` |
| `package.json` | 1 | `RHS-ID-001`, `RHS-PKG-001` |
| `patch.txt` | 1 | `RHS-GEN-001` |
| `positron-product-icons/` | 1 | `RHS-UI-001` |
| `product.json` | 1 | identity, macOS, localization, theme, assistant, extension, and remote entries |
| `remote/` | 2 | `RHS-PKG-001`, `RHS-REMOTE-001` |
| six `resolve_*.sh` files | 6 | `RHS-GEN-001` |
| `resources/` | 11 | `RHS-UI-001`, `RHS-PKG-001`, `RHS-REMOTE-001` |
| `scripts/` | 6 | `RHS-L10N-001`, `RHS-L10N-002`, `RHS-EXT-001` |
| `src/` | 66 | identity, macOS, localization, UI, docs, assistant, exclusions, and update entries |
| `test/` | 6 | `RHS-DEV-001`, `RHS-PKG-001` |
| `versions/` | 1 | `RHS-GEN-001` |

## Open decisions

| ID | Owner | Required decision |
| --- | --- | --- |
| `Q-001` | Product/security | Final macOS bundle ID, Developer ID signing, entitlements, notarization, and credential migration that can replace mock-keychain. |
| `Q-002` | Product/AI | Exact signed external assistant package, providers, version, checksum, license, update source, and security policy. |
| `Q-003` | Release engineering | PAHO ownership of remote-server hosting/signing and remaining product/legal/gallery endpoints; controlled replacement for disabled self-update. |
| `Q-004` | Documentation | Exact upstream commit for the imported snapshot and completion of packaged-app manual visual acceptance. |
| `Q-005` | Design | Visual acceptance of the renamed dark palette and normalization of remaining RHS-AI/Positron labels. |
| `Q-006` | Repository maintainers | Retention or separate cleanup of generated databases, notes, merge helpers, and historical markers. |

## Minimum verification matrix

| Change touches | Minimum checks before merge |
| --- | --- |
| `product.json`, catalogs, or extension assembly | Inventory validator; bundled-extension validator; inspect packaged `product.json`, built-in/source/bootstrap directories, exact IDs/versions/checksums; packaged CLI smoke test. |
| Electron startup, identifiers, or credentials | Compile; targeted startup tests; packaged macOS save/read test with disposable credentials across full restarts and upgrade; verify switch ordering and bundle/profile IDs. |
| Locale/NLS | Spanish localization validator; startup tests; placeholder audit; fresh/English/regional/portable packaged smoke tests. |
| Welcome, theme, layout, menus, or views | Targeted tests plus manual packaged review in light/dark themes, fresh/upgraded profiles, and user-choice persistence checks. |
| Documentation | Generate navigation; build docs; strict audits; tests; bundle check; offline packaged review of both languages, search, links, actions, history, and anchors. |
| Updates | Packaged online/offline inspection of services, logs/network, menus, commands, badges, titlebar, and post-update paths. |
| Quarto or packaging | Cold/warm/corrupt-cache checks; checksum/version/architecture inspection in every final target artifact. |
| Supervisor/Kallichore | Compare manifest, `VERSION`, executable `--version`, and binary architecture in source and final package. |
| Remote/server | Clean install, upgrade, reconnect, architecture, URL/archive identity, checksum, executable, data directory, and logs. |
| Removed assistant/publisher components | Validator plus source/catalog/assembly/package absence search; confirm Git and git-base remain. |

Passing source tests is necessary but not sufficient for packaging, Electron credentials, extension assembly, or remote delivery. Conversely, a failure caused by a recorded stale assertion must be reported and fixed deliberately; it must not be used to overwrite the authoritative current product state incidentally.
