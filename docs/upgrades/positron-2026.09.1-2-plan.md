# RHS-IA upgrade to Positron 2026.09.1-2

Status: implementation handoff; no upgrade has been applied by this plan.
Prepared: 2026-09-10 America/Guayaquil (2026-09-11 UTC).

## Assignment for the implementing model

Merge the pinned stable Positron release into the current RHS-IA fork, preserve the current customizations and temporary macOS credential workaround, rebuild macOS arm64, and verify the actual packaged application. Work locally; do not push, publish, replace an installed application, or introduce a signing/credential migration as part of this upgrade. Complete the phases below in order, recording evidence and remaining blockers. Do not treat compilation alone as completion.

Repository: `/Users/josu/Documents/PAHO/RHS-IA/RHS-IA` (the inner directory, not its parent or the sibling `positron` checkout).

Read these files before editing:

- `/Users/josu/.codex/RTK.md` and repository `AGENTS.md`.
- `.github/copilot-instructions.md` and applicable nested instructions.
- [Customization inventory](rhs-customizations.json) and [companion ledger](rhs-customizations.md). Use all 20 stable IDs as the preservation checklist. Reconcile discrepancies with current source/history; an unlisted change is not disposable.

The current user explicitly requires preservation of the certificate workaround. The ledger's open questions do not require stopping routine preservation work. Keep unresolved product decisions unchanged; ask only if an essential upgrade change cannot preserve the existing behavior.

Every shell command must start with `rtk`; use `rtk proxy` for commands whose complete output/exit status matters. Run command blocks from the inner repository, sequentially unless explicitly independent. Use the selected Node runtime consistently in every new shell. Follow LF, source-header, tab-indentation, localization, and hygiene requirements for any source edits.

## 1. Pinned release and inspected baseline

| Item | Verified value |
| --- | --- |
| Latest stable upstream | `2026.09.1-2`; not draft or prerelease |
| Published | `2026-09-04T20:40:28Z` |
| Target commit | `467ff390dd8b4ffc8972ebb84d9e05a1fd5a4fe2` |
| Current branch | `update-positron-2026.09.1-2` |
| Current HEAD when planning | `283cd00af40cb3d16a9be3544c35028d956aab82` |
| Tracked/untracked status before adding this plan | Clean |
| Existing Positron baseline | `2026.07.1-5` = `d3cdd608df5afa3378c24c9a9c81b01fe1433a87` |
| Previous integration commit | `72044d265ae096943dd549b5fdb0ed006b559462` |
| Actual merge base of current HEAD and target | `7b3fe7ddfd1f8f70134592f6df93d0bf6f6241ec` |
| Upstream remote | `positron`: `https://github.com/posit-dev/positron.git` |
| Fork remote | `origin`: `https://github.com/juliusHeartS/RHS-IA.git` |
| Current Ark gitlink/checkout | `d0569ccab5eb0f77597d4ad91f5db91971e7e8bc` |

Release verification sources: [official current release notes](https://positron.posit.co/release-notes), [release page](https://github.com/posit-dev/positron/releases/tag/2026.09.1-2), [latest-release API](https://api.github.com/repos/posit-dev/positron/releases/latest), and [tag object API](https://api.github.com/repos/posit-dev/positron/git/ref/tags/2026.09.1-2). The tag API resolves directly to the commit above. This is the fixed target of this plan; do not silently substitute a later release or `positron/main`.

The planning task fetched the release into `FETCH_HEAD` and ran `git merge-tree`; it did not merge, switch branches, install dependencies, or build. `FETCH_HEAD` is mutable: fetch and verify the named tag again during implementation.

The ledger was audited at `3d8c16bb3925966353472481ecb4cc828886ce1c`, before the ledger commit. Its recorded `remove-certificates` branch and pre-existing `AGENTS.md` modification are historical audit facts, not current dirtiness. The current branch includes the July merge, later fixes, mock Keychain, offline documentation, and the ledger itself.

### Historical evidence to retain

The prior tasks were read when preparing this plan:

- [Plan Positron base update](thread://019faa69-918d-7aa3-82d9-69bba00c754a?hostId=local): merge an immutable release tag; preserve RHS intent; inspect conflict-free overlaps; compile, package, and exercise the packaged CLI.
- [Diagnose Positron certificate issue](thread://019ffcd5-ae5b-7bf1-b265-d50b9693d05b?hostId=local): changing an ad-hoc executable broke Keychain authorization; the implemented workaround is Chromium mock Keychain. Source, staged, and packaged Supervisor binaries all need independent verification.

This file captures the necessary findings; the implementer need not reread those tasks unless investigating history. If using a live task reference, read it with `read_thread` first.

Do not copy the July task's old assistant smoke checklist literally: the current ledger establishes that RHS Agent, PdfStruct, old Continue/OPS/RAG implementations, and source `positron-assistant` do **not** ship. An extension installed in a developer's old profile is not evidence of a bundled product feature. The new offline documentation extension **does** ship.

## 2. Preservation contract

| Ledger IDs | Required resulting behavior |
| --- | --- |
| `RHS-ID-001`, `RHS-ID-002` | RHS-IA names, protocol, installer identity, `.rhs-ia`, `.rhs-ia-shared`, `.rhs-ia-server`; early `argv.json`-only legacy migration, with portable isolation. Do not copy credentials, caches, or extension state from Positron. |
| `RHS-MAC-001` | Preserve the exact temporary mock-Keychain behavior and current macOS identifiers described below. |
| `RHS-L10N-001`, `RHS-L10N-002` | Spanish for new profiles, explicit English respected, offline Spanish pack and RHS/session/Python/R overlays; update affected NLS keys/placeholders for September. |
| `RHS-UI-001`, `RHS-UI-002`, `RHS-UI-003` | PAHO artwork, RHS welcome content, `Default RHS-IA Light`, simplified view/status defaults, and one-time migrations that respect later user choices. Keep the current dark-theme name pending its separate decision. |
| `RHS-DOC-001` | `paho.rhs-ia-documentation@0.0.5`, bilingual offline HTML/search/navigation, Help/Welcome and Cmd/Ctrl+Shift+H entry points, safe allowlisted actions and external links. |
| `RHS-AST-001` | Provider-neutral core hooks, model/provider gates, branded hooks, and `nativeChatSetupEnabled: false`. No implicit installation of an assistant package. |
| `RHS-EXT-001`, `RHS-EXT-002` | Curated catalog membership, offline VSIX validation, Git/git-base, required empty auto-update array; preserve source, catalog, build, and CI exclusions. |
| `RHS-UPD-001` | Desktop self-update remains disabled in services, startup contributions, configuration, menus, commands, badges, and post-update UI. |
| `RHS-PKG-001`, `RHS-PKG-002`, `RHS-PKG-003` | RHS package names/assets, checksummed Quarto preparation/cache and architecture filtering, Supervisor manifest/marker/executable agreement. |
| `RHS-REMOTE-001` | RHS remote install/launch paths, names and reconnect behavior; retain unresolved endpoint ownership decisions. |
| `RHS-HIST-001`, `RHS-DEV-001`, `RHS-GEN-001` | Keep retired components absent and developer/generated material out of packages. Preserve developer instructions; do not run old `resolve_*.sh` helpers or perform unrelated repository cleanup. |

### macOS workaround: exact non-negotiable state

Preserve these `product.json` values:

```json
{
  "rhsIaUseMockKeychain": true,
  "darwinBundleIdentifier": "co.posit.positron",
  "darwinProfileUUID": "0501C5DF-0DC9-4217-9C18-A5595A125743",
  "darwinProfilePayloadUUID": "BEA2CCD2-3F74-4174-9C0E-606A6F13B050"
}
```

Confirm the profile property names against the saved pre-merge product before editing. In `src/main.ts`, retain the macOS-only, product-flag-gated `app.commandLine.appendSwitch('use-mock-keychain')` before Electron readiness and any credential initialization. It currently runs just after CLI parsing, before startup-state migration and command-line configuration. Reassess ordering after upstream startup changes even if Git merges this file cleanly.

Commit `24eb0c2870ead44c2af6be636d9c28b571f2b7de` implemented this state; despite its subject, it restored no signing certificate. Changing the bundle ID alone is not the workaround. Do not disable the flag, move it to late renderer/extension startup, change the bundle ID to satisfy an old test, alter Keychain ACLs, delete Keychain items, or replace this mechanism with disabled TLS verification.

Mock Keychain is an existing internal-testing compromise with a publicly known encryption secret. Use only disposable values for verification. Keep the ledger's production signing/notarization/credential-migration question open; this upgrade does not solve it. Existing builds are ad-hoc/linker signed, not Developer ID signed or notarized.

## 3. Merge forecast and decision rules

A non-checkout `git merge-tree --write-tree --name-only HEAD <target>` preview returned exit 1, as expected for conflicts:

- 950 conflict paths: 857 within `extensions/copilot/`, 1 within `extensions/positron-assistant/`, and 92 elsewhere.
- Relative to the July tag, current RHS changes 4,499 paths, the target changes 7,938, and 1,006 overlap. Of those overlaps, 84 are outside the two excluded source-extension trees.
- Relative to the **actual merge base**, the corresponding side inventories contain 4,637 and 8,105 paths. July's patch tag is not the merge base of the September release line.
- Default diff rename detection warned that exhaustive detection was skipped. Counts and rename labels are planning evidence, not a semantic classification or a guaranteed future conflict count.

Regenerate the report if HEAD changes. Review both actual-base side diffs and July-tag-to-fork customization diffs: some conflicts are between upstream release-line changes, with no RHS customization at that path.

### Resolve in these batches

1. **Excluded extension source and injection paths.** Preserve deletion of `extensions/copilot/` and `extensions/positron-assistant/`, including newly added conflict-free files under those directories. Remove resurrected Copilot-only download/build/CI files and callers. Preserve `excludedExtensions` entries for `github`, `github-authentication`, and `copilot`. Keep Git and git-base. Root `@github/copilot` dependencies may support upstream core agent-host code; do not remove them based on a substring match.
2. **Rename traps and upstream-only conflicts.** Resolve these before bulk deletion outside the excluded directories. Git matched the old assistant `esbuild.mts` to both RHS documentation and new upstream skills: restore `extensions/rhs-ia-documentation/esbuild.mts` from the pre-merge RHS tip and retain/adapt the target's `extensions/positron-skills/esbuild.mts` as independent files. Do not delete the documentation builder. For moved core prompts/XML, `extensions/next-edit-suggestions/src/log.ts`, new CSS, and `positronSettings.contribution.ts`, inspect target consumers and retain needed upstream functionality with RHS gates. A rename from an excluded tree does not make its destination forbidden. Some mappings from old TS files to new CSS are plainly unreliable similarity matches.
3. **Product, dependencies, build and packaging.** Merge `product.json` field by field; accept required upstream schema additions and platform/dependency versions while reapplying identity and catalog policy. Preserve RHS scripts in `package.json` while taking the target engine dependency graph and lockfiles. Resolve `build/gulpfile*.ts`, `build/lib/extensions.ts`, `build/lib/quarto.ts`, platform pipelines, and `remote/` by intent. Preserve documentation assembly and VSIX validation.
4. **Startup, layout, UI, updates and assistant contracts.** Review `src/main.ts`, product services, menubars, auxiliary/status/titlebar code, `chat.contribution.ts`, `chatWidget.ts`, core assistant interfaces/implementations/tests, `positronCustomViews.ts`, welcome TS/CSS, Help resources and update services. Keep the retired `positronAssistantLayout.ts` deleted, adapting new references and layout registrations accordingly. Do not revive the removed `positronChat.css` import (fixed in `cad3ccf370751070c47dafff779b6ce83d8f6b07`).
5. **Runtime extensions, tests and notices.** Port R/Python session localization; accept target changes to uncustomized runtime/authentication files after checking history. `NOTICE`, authentication code and Python `nativeAPI.ts` have no July-tag-to-RHS delta despite preview conflicts, so target versions are normally appropriate after provenance review. Keep required notices. Adapt tests to RHS behavior; retain tests for supported functionality and gate suites requiring intentionally absent extensions rather than restoring those extensions.
6. **Semantic audit of clean merges.** Review all overlapping/customized paths plus new upstream entry points. Welcome/empty-editor branding, documentation commands, assistant activation, update controls, bootstrap metadata, remote scripts and startup ordering can regress without conflict markers. Classify new source extensions such as `positron-skills` and `next-edit-suggestions` based on their actual activation/dependencies; preserve general functionality while preventing automatic acquisition/activation of excluded providers.

Never use repository-wide `ours`, `theirs`, `-X ours`, `-X theirs`, `--allow-unrelated-histories`, or the old scripted conflict resolvers. During this merge, ours is the saved RHS tip and theirs is the pinned September commit. File-level side selection is appropriate only after ownership review.

## 4. Execute with checkpoints

### Phase A: protect and inventory

Run from the inner repository:

```bash
rtk proxy git status --short --branch
rtk proxy git rev-parse HEAD
rtk proxy git remote -v
rtk proxy git submodule status --recursive
rtk proxy git -C extensions/positron-r/ark status --short
rtk proxy git log --oneline 2026.07.1-5..HEAD
```

If this plan is the only untracked file, review and commit it as a documentation checkpoint, or copy it outside the checkout before merging. Do not overwrite or commit unrelated user changes. Snapshot any intervening changes intentionally before proceeding, and use the resulting HEAD as the safety-tag target. Keep a known-good existing app as a rollback artifact before any build overwrites the sibling output directory.

On the current upgrade branch, create an annotated local safety tag `rhs-ia-before-2026.09.1-2` at that actual pre-merge HEAD. Check for an existing tag first; reuse only if it points to the intended checkpoint, otherwise use a distinct dated tag without moving the old one. No push is required. Record its full commit in the implementation report.

```bash
rtk proxy git fetch positron tag 2026.09.1-2
rtk proxy git rev-parse '2026.09.1-2^{commit}'
rtk proxy git merge-base HEAD 2026.09.1-2
rtk proxy git merge-base --is-ancestor 2026.07.1-5 HEAD
rtk proxy git diff --name-status 2026.07.1-5 HEAD
rtk proxy git merge-tree --write-tree --name-only HEAD 2026.09.1-2
```

The fetched commit must equal the pinned SHA. Save full preview output outside source or in an explicitly excluded evidence directory; exit 1 here means predicted conflicts, not a checkout merge. Produce customization and overlap inventories and map each affected area to the ledger. Keep historical audit counts separate from new counts, including a stated treatment of ledger/plan files.

Exit gate: recoverable pre-merge source and app, verified release commit, no unprotected user changes, ledger reconciliation complete.

### Phase B: merge and resolve

```bash
rtk proxy git config rerere.enabled true
rtk proxy git merge --no-ff --no-commit 2026.09.1-2
rtk proxy git diff --name-only --diff-filter=U
```

Resolve in the batches in section 3. Stage only reviewed resolutions. The merge remains unfinished while conflicts exist. Keep a short resolution record with path/group, ledger IDs, selected behavior, and required check; do not paste hundreds of deleted Copilot paths into progress updates.

After conflicts are resolved, refresh clean Ark checkout to the target gitlink with `rtk proxy git submodule update --init --recursive`. Never use `--force` on a dirty submodule. Validate that the expected gitlink is checked out before extension install scripts consume it.

Exit gate: no unmerged entries; no unintended assistant/Copilot restoration; every affected customization has a decision; both documentation and upstream build scripts survived the rename conflicts.

### Phase C: exact runtime and dependency refresh

The following values were read from the pinned release source, not inferred from the July task:

| Component | Current RHS | September target / rule |
| --- | --- | --- |
| Root `.nvmrc` | `22.22.1` | `24.18.0` |
| npm | Prior successful build used `10.9.4` | Target preinstall permits npm `<12`; use the supported npm shipped with the selected Node and record its exact version. Do not reuse July's `<11.2` restriction. |
| Root `.npmrc` Electron | `39.8.8` | `42.6.0`, build ID `14623276` |
| `remote/.npmrc` Node | `22.22.1` | `24.18.0`, build ID `455160` |
| `build/.npmrc` native headers | `22.22.1` | Still `22.22.1` intentionally; upstream avoids tree-sitter/C++20 incompatibility. Do not align every header target to root Node. |
| Root `package.json` engine version | `1.118.0` | `1.130.0`; do not replace this with the Positron calendar version. |
| `product.positronVersion` | `2026.07.1` | `2026.09.1` |
| Supervisor `positron.binaryDependencies.kallichore` | `0.1.66` | `0.1.68` |
| Quarto CLI | RHS pinned `1.9.38` | Upstream target `1.10.18`; port RHS cache/checksum/filter behavior to this version. |

Read the target install scripts before running them. Activate Node 24.18.0 using the existing version manager, or prepend its verified installation directory to PATH for each tool shell. Verify `node --version`, `npm --version`, and `node -p process.arch` through RTK; expected architecture here is arm64. Do not bypass the Node version check.

Under that toolchain, use the repository install workflow with scripts enabled:

```bash
rtk proxy env VSCODE_FORCE_INSTALL=1 npm ci
```

Refresh root, build, remote and built-in extension dependencies through the target pre/postinstall workflow. `VSCODE_FORCE_INSTALL=1` bypasses dependency-state shortcuts. Inspect failures before changing source or lockfiles; verify the runtime, lockfile/package agreement, local `file:` links, and native build logs. If an upstream lockfile issue remains, make the smallest justified lock update with the correct npm and review the diff; do not bulk-upgrade dependencies.

Previous failures to guard against: stale `@types/markdown-it` in extension-editing, unresolved `positron-data-explorer-protocol` in DuckDB, missing PDF-server test typings, missing `ai-provider-bridge/credential-shaping`, and ignored install scripts leaving `@vscode/policy-watcher` or Git's `@vscode/fs-copyfile` unusable. Do not patch TypeScript to conceal stale installs. Do not leave `--ignore-scripts` as the final environment.

Rebuild native modules for the correct Electron or Node ABI using the repo's runtime-specific configuration. Refresh ignored Supervisor and Ark/kernel binary caches with target installers. For Supervisor, use `npm --prefix extensions/positron-supervisor run install-kallichore` through RTK if needed, then check the actual executable; the installer can trust a marker and can prefer a sibling developer build. If the marker and binary disagree, move aside only that identified generated cache and reinstall. Do not merely edit `VERSION`.

Port Quarto's preparation before `getQuartoBinaries`, `QUARTO_ARCHIVE`, `QUARTO_CACHE_DIR`, `.build/quarto-cache/<version>`, checksums and opposite-architecture filtering. Obtain authoritative checksums for `1.10.18`; never carry `1.9.38` hashes forward or disable verification. Validate cold, warm, corrupt-cache, explicit-archive and explicit-cache behavior if that helper changes, as expected here.

Use a fresh output/staging state. Move aside only verified generated directories/artifacts that need regeneration, such as `.build/extensions`, `.build/electron`, `out*` and the target sibling bundle, or use reviewed upstream clean tasks. Do not use `git clean -xfd`, delete profile data, or copy an older Electron executable into the new app. A new isolated checkout is an alternative if local caches cannot be reliably inventoried; make its build output location explicit.

Exit gate: successful supported-toolchain installation, clean submodule state, target native/runtime versions, no unexplained lock churn or stale generated dependencies.

### Phase D: catalogs and product contracts

Preserve the six current built-in catalog IDs and eleven bootstrap IDs in the ledger, allowing the target's updates for those approved IDs. Keep target-specific `type` filters: Workbench/SLC catalog entries are not necessarily desktop-shipped extensions. Keep the source-built documentation extension independently of the marketplace catalog.

Expected version changes for retained catalog entries:

| ID | July | September |
| --- | --- | --- |
| `rstudio.rstudio-workbench` | `2026.7.5` | `2026.9.5` |
| `charliermarsh.ruff` | `2026.56.0` | `2026.76.0` |
| `meta.pyrefly` | `1.1.1` | `1.2.0` |
| `quarto.quarto` | `1.134.0` | `1.136.0` |
| `posit.air-vscode` | `0.26.0` | `0.28.0` |
| `posit.shiny` | `1.4.1` | `1.4.2` |

Use the target catalog's matching checksums/metadata, not just version substitutions. Keep `.github/workflows/extensions-tag-map.json` synchronized. The target also contains forbidden Publisher, GitHub PR and Posit Assistant bootstrap entries: exclude them again. Preserve the offline Spanish pack `1.111.0` and its recorded hash unless compatibility testing proves an update necessary; if updated, use its repository script, record provenance and hash in both ledgers, and test offline behavior.

`builtInExtensionsEnabledWithAutoUpdates` must be **present and exactly `[]`**. The July packaged CLI crashed when the field was removed. Keep the inventory validator's array assertion, and strengthen it to verify emptiness and required retained membership if needed; a forbidden-ID-only test does not prove Quarto/Shiny survived. Retain checks for all assembly paths, adapt any renamed files, and add new injection paths discovered in this merge.

Keep `nativeChatSetupEnabled: false`. Preserve required new product fields with safe, policy-compatible empty values when appropriate instead of deleting required schema. Maintain the unresolved company/legal/gallery/remote metadata values; do not opportunistically rewrite them.

Check `build/utils.ts`, `versions/show-version.cjs` and packaging output before choosing release numbering. The target source itself has `positronBuildNumber: 0`; packaging computes a build number and defaults the channel to `dailies`. Record the actual fork build number, quality and fork commit separately from upstream tag `2026.09.1-2`. Do not assume source metadata alone will display `-2`, misrepresent a fork as the signed upstream binary, or change the unresolved remote channel merely to match a label.

Exit gate: parseable product metadata, explicit required defaults, intended extension IDs/versions and schema, paired ledger updates for actual customization changes.

## 5. Validation and packaging gates

### Compile before running tests or validators

Use the target toolchain and fix compilation failures first. Do not use `npm run compile`.

```bash
rtk proxy npm run compile-check-ts-native
rtk proxy npm run gulp compile-extensions
rtk proxy npm --prefix build run typecheck
```

### Focused regression checks

```bash
rtk proxy npm run validate-rhs-ia-extension-inventory
rtk proxy npm run validate-spanish-session-localization
rtk proxy npm run validate-bundled-extensions
rtk proxy npx vitest run src/vs/platform/languagePacks/test/node/rhsIaStartup.vitest.ts src/vs/workbench/browser/parts/activitybar/rhsIaActivityBarMigration.vitest.ts
rtk proxy npm run valid-layers-check
```

Also run targeted tests for every changed assistant/provider/runtime/update implementation, following target paths after moves. Do not run an unbounded all-tests sweep to compensate for missing targeted checks.

Known baseline test mismatch: `rhsIaStartup.vitest.ts` previously expected `org.paho.rhsia` at line 131 while current product deliberately uses `co.posit.positron` (10 passed, 1 failed in the ledger audit). Update that assertion deliberately to the preserved temporary contract and add meaningful checks for the flag/order where appropriate; do not change product identity or delete the identity test. Update the ledger's recorded known-failure status only after a passing run.

The July task reported upstream layering-check limitations. Rerun on this target; do not carry that exemption forward automatically. If a failure is claimed upstream-only, reproduce the same diagnostic on the pinned target in an isolated checkout/toolchain and report it accurately. Any new RHS compilation/layering failure must be fixed.

Documentation checks (in addition to extension compilation):

```bash
rtk proxy npm --prefix extensions/rhs-ia-documentation run generate-navigation
rtk proxy npm --prefix extensions/rhs-ia-documentation run build-docs
rtk proxy npm --prefix extensions/rhs-ia-documentation run check-docs
rtk proxy npm --prefix extensions/rhs-ia-documentation run test-docs
rtk proxy npm --prefix extensions/rhs-ia-documentation run bundle
```

Review generated documentation diffs. Update only upgrade-affected pages/screens/links in both languages where necessary; do not replace the entire website snapshot during the base merge. Preserve CC BY-SA attribution and the documented unresolved upstream snapshot commit.

### Build macOS arm64, in this order

```bash
rtk proxy env CI=1 VSCODE_ARCH=arm64 npm run gulp core-ci
rtk proxy env CI=1 VSCODE_ARCH=arm64 npm run gulp vscode-darwin-arm64-min-ci
```

Do not run these concurrently. If caches, extension binaries, dependencies, metadata or source change after `core-ci`, regenerate the affected staging with `core-ci` again before packaging. A prior incident repackaged old `0.1.64` even after source cache was corrected to `0.1.66` because `.build/extensions` was stale.

For the current checkout layout the expected app is:

`/Users/josu/Documents/PAHO/RHS-IA/VSCode-darwin-arm64/RHS-IA.app`

### Verify the final artifact, not merely source/staging

Record these checks against the newly built app:

1. `Contents/Info.plist` and packaged `Contents/Resources/app/product.json`: RHS identity, exact temporary bundle/profile IDs, mock flag true, empty auto-update list, intended extension catalog, engine/version/commit metadata. Verify Electron **42.6.0** from the packaged framework/runtime and arm64 architecture; an application version string alone does not prove the Electron version.
2. Compiled `Contents/Resources/app/out/main.js` (or its actual bundled successor): mock-Keychain switch remains reachable before credential initialization. Runtime child-process arguments confirm `--use-mock-keychain` without passing it manually in the smoke-launch command.
3. Supervisor manifest requirement, `resources/kallichore/VERSION`, `kcserver --version`, and `file kcserver` all agree on **0.1.68 / arm64**, in the checkout, `.build/extensions/positron-supervisor`, and packaged `extensions/positron-supervisor`. Record all three layers. Do the analogous target-manifest check for Ark/kernel binaries and Quarto **1.10.18**; do not invent an Ark version from the gitlink.
4. Actual packaged source/built-in/bootstrap directories and VSIX manifests/checksums include Spanish and documentation, Git/git-base, Quarto/Shiny/Air/Ruff/Jupyter/Debugpy/Pyrefly as applicable. Do not confuse bootstrap VSIXs with already installed extension folders.
5. Forbidden IDs and injection artifacts are absent from the package. Preserve supported core dependencies even if their package names contain `copilot`. Developer `.rhs-rag`, `TempAcuerdos`, `resolve_*.sh` and retired VSIX artifacts must not ship.
6. Invoke the packaged CLI under `Contents/Resources/app/bin/` (discover its actual filename) with disposable data/extensions directories and `--list-extensions --show-versions`. It must exit successfully; after first-launch bootstrap the expected bootstrap IDs must be discoverable. Inspect source-built extensions separately, since CLI lists may omit built-ins. A success against the developer's populated profile is insufficient.
7. Inspect signing metadata and `codesign --verify --deep --strict --verbose=2` result through RTK and record it honestly. The raw internal package may retain the baseline ad-hoc verification limitation; do not claim Developer ID/notarization or create/import a certificate. Distribution signing remains separate.

### Packaged smoke matrix

Use disposable profiles and credentials; keep the normal user profile and existing app intact. Fully quit test apps and their Supervisor processes between launches, stopping only processes belonging to the test. Explicit profile flags may not isolate all early home-directory migration/bootstrap paths, so use a dedicated macOS test account or otherwise verify every storage path; do not repurpose HOME blindly.

| Scenario | Pass condition |
| --- | --- |
| Fresh offline profile | Spanish default, offline language pack and docs, RHS artwork/light theme, no unwanted assistant/update acquisition. |
| Explicit English / Spanish regional / portable | Explicit language honored; documented regional behavior; portable and legacy migration remain isolated. |
| Existing RHS profile and legacy argv fixture | Only permitted startup settings migrate; later layout/language choices survive full restart. |
| Documentation in both languages | Help/Welcome/shortcut open docs; search, accents, history, anchors, links and allowlisted actions work offline as applicable; external HTTPS opens correctly; arbitrary command URIs remain blocked. |
| New welcome/empty editor | September environment checks remain useful, with RHS branding/docs links and no resurrected provider onboarding or removed layout. Check both light/dark themes. |
| Extensions | Expected built-in/bootstrap extensions visible/functional; hidden-by-default views can be deliberately opened; exclusions remain absent. |
| R/Python | Start both runtimes, execute `1 + 1`, inspect variables/plots, interrupt/restart, no Supervisor mismatch warning; test new import/console paths affected by merge. |
| Quarto and Shiny | Render/preview a disposable Quarto document and start a minimal Shiny example with the intended interpreter. |
| Provider-neutral core | No missing-extension startup errors; disabled native Chat stays disabled; conditional Fix/Explain/provider actions obey availability/settings. Do not install an unapproved assistant to make this pass. |
| Updates online/offline | No update feed polling, download, update menu/palette action, titlebar/badge or post-update prompt introduced. |
| Credential restart | A tiny temporary test extension using `ExtensionContext.secrets` stores/reads a non-sensitive sentinel through the packaged extension host; repeat across at least two full quits/relaunches without macOS password prompts. Remove the test extension from deliverables. |
| Credential in-place upgrade | Save the sentinel with a verified pre-upgrade mock-Keychain app in a disposable account/profile, quit it, then launch the new build against that same test state. It reads the value without repeated Keychain prompts. Do not assert this from switch presence alone. |

If a second-machine or interactive check is unavailable, record it as pending and distinguish build-complete from acceptance-complete. Do not promise prompt-free behavior on every Mac based on one local run. For macOS Intel, Windows, Linux and REH/remote flows, preserve/adapt their build paths and run the ledger's target-specific checks on available runners; clearly list untested platforms. Do not label the upgrade validated across all targets after an arm64-only build.

## 6. Finish, record, and recover

Update **both** customization ledgers in the same implementation change:

- Keep stable IDs and global open-question IDs; record new upstream baseline tag/SHA and the actual audited source revision/time.
- Recompute diff coverage, groups/counts/digest with a stated rename-detection method and treatment of ledger/plan files. Do not copy old `4,497` counts or treat the new diff as the same audit.
- Record moved paths, approved catalog/runtime versions, preservation decisions, exact checks run and results, known failures, and manual/platform checks still pending.
- Keep historical evidence available and label superseded audit results; do not invent a future merge commit hash inside files being committed. Add the real integration hash in a subsequent documentation update if needed.
- Keep unresolved production signing, external assistant acquisition, endpoint ownership, documentation provenance and cleanup questions open unless explicitly resolved by the owner.

Before creating the local integration commit:

```bash
rtk proxy git diff --name-only --diff-filter=U
rtk proxy git diff --check
rtk proxy git diff --cached --check
rtk proxy git status --short
```

There must be no unmerged entries. Review the staged diff and run normal repository hygiene/pre-commit checks; do not bypass hooks. Create the merge commit with the verified tag as the second parent. If long validation requires interim checkpoints, use a clearly marked unvalidated merge commit and follow-up fixes, retaining the safety tag; do not describe it as accepted until all relevant gates are complete.

After the integration commit and any fixes:

```bash
rtk proxy git merge-base --is-ancestor 2026.09.1-2 HEAD
rtk proxy git show --no-patch --format=fuller HEAD
rtk proxy git diff --stat 2026.09.1-2 HEAD
rtk proxy git submodule status --recursive
rtk proxy git status --short
```

The ancestry check must succeed. Hand back the source commits, safety tag, final app path, runtime versions, ledger updates, test/build results, credential restart/upgrade evidence and outstanding acceptance limitations. Nothing is pushed automatically.

Recovery: before committing an in-progress merge, `rtk proxy git merge --abort` returns to the protected pre-merge state; preserve any unrelated concurrent edits first. After committing, retain the upgraded branch and use a separate checkout of the safety tag for recovery instead of a destructive reset. Restore the saved known-good app if needed. Profile rollback is only guaranteed for the disposable test data; never delete the user's profile or credentials as a rollback shortcut.

## Completion checklist

- [ ] Exact target tag is in RHS ancestry; current customizations reviewed against all 20 ledger IDs.
- [ ] No retired extensions/assets restored; documentation and Spanish features retained.
- [ ] Mock flag, early switch and temporary macOS identity preserved in source and package.
- [ ] Supported Node/npm and target Electron/Supervisor/Quarto verified; no stale staged binaries.
- [ ] Compilation, focused checks, documentation audits, hygiene and both arm64 CI builds pass, with any independently reproduced upstream exceptions documented.
- [ ] Packaged CLI, bootstrap, UI/runtime and disposable credential restart/upgrade checks completed, or explicit acceptance blockers recorded.
- [ ] Both ledgers updated with new evidence; source clean except explicitly reported user-owned changes; no push/publication performed.
