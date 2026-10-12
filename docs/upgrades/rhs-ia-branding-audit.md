# RHS-IA 1.0 branding audit and exception register

Status: **open**. RHS-IA is based on Positron. This register separates references that must remain for attribution or compatibility from work still required to complete the RHS-IA product-identity cleanup. It does not authorize a blanket exclusion for any source directory.

## Audit method and boundary

The audit scans the current tracked superproject tree case-insensitively for `positron` in text lines and tracked path names. It excludes this audit file from its own counts. It also inspects known binary branding assets and the initialized `ai-lib` and Ark submodule boundaries. It does not rewrite Git history, tags, third-party licenses, submodule repositories, or external dependency identities. Generated output and packaged applications outside the tracked checkout require separate inspection.

At the 2026-09-29 baseline, the unmodified tracked superproject contained 79,420 matching lines in 3,689 text files and 4,681 matching paths. The 2026-09-29 working tree contained 42,245 matching lines in 3,564 text files and 4,650 matching paths. After the 2026-10-01 follow-up, the working tree contains **38,969 matching lines in 3,538 text files and 4,649 matching paths**. This counts readable tracked and newly added files, excludes this audit file, and does not treat a falling count as acceptance. `src/vs/workbench/` accounts for 19,649 lines; the colorization fixtures have no remaining `positron_light` keys.

## Required or narrowly retained references

| Category | Concrete examples | Reason and disposition |
| --- | --- | --- |
| License, copyright, and provenance | `LICENSE.txt`, `NOTICE`, `ThirdPartyNotices.txt`, original Posit copyright headers, imported documentation's `upstream/baseline.json` and `manifests/upstream-references.json` | Keep accurate origin and ownership. `LICENSE.txt` prohibits altering the licensor's notices. Review each imported document's provenance individually. |
| External code and extension identity | `.gitmodules` URLs for Posit's `ai-lib` and Ark; `posit.assistant` integration ID; Posit-published R/Python extensions and their package IDs | These are real dependencies or interoperability contracts. Rename only with a replacement package, consumer migration, and validation of existing installations. |
| Existing user data and application identity | `.positron/argv.json` input for the narrow startup migration; `co.posit.positron` macOS bundle identifier; existing theme ID `Default Positron Dark` in `migrateThemeSettingsId` | Keep the exact legacy input where needed to preserve existing profiles. The dark theme's visible name is RHS-IA; only the old stored ID remains as a migration input. Bundle-ID replacement needs signing and credential migration. |
| External distribution and protocol endpoints | Posit CDN URLs, `positron-reh` server archive names, licensed Posit extension URLs, protocol/schema values consumed by upstream clients | Do not invent a PAHO endpoint. Verify replacement hosting, artifact signing, protocol migration, and client compatibility first. |

## User-requested icon restoration

The previous application icon artwork is retained at the renamed RHS-IA resource paths. The restored macOS and server icons show the existing IA mark. The restored Windows tile, installer, and `.ico` assets show the Positron mark; this is a deliberate visual exception requested after the first handover commit. The source PNG and Linux image already matched the earlier bytes. The single-source icon regeneration script was removed because it would replace this distinct artwork. The macOS arm64 package was rebuilt and its icon matches the restored source byte for byte; Windows and server packages remain unverified. This decision applies to the binary images, not to product names or other removable Positron references.

## 2026-10-01 follow-up completed in the working tree

- Repaired RHS-IA Light token selectors and regenerated the colorization snapshots. All 108 colorization fixtures pass; the three CSS, SCSS, and JSON failures recorded on 2026-09-29 are resolved.
- Replaced hundreds of visible application and extension messages, Spanish overlay values, workflow display names, and test expectations with RHS-IA branding while preserving localization keys and runtime identifiers. The Spanish overlay validator passes with 413 core keys; the focused UI suites pass with 80 tests and seven skips.
- Corrected `product.json` company, license label, release-notes, and download fields; retained the disabled updater and documented external service URLs. The macOS bundle identifier remains a credential-compatibility exception. Build tooling now takes the company label from product metadata.
- Removed the upstream newsletter action, corrected visible help/reporting links, and updated installer labels. Linux DEB/RPM builds now require an explicit `RHS_IA_LINUX_MAINTAINER` rather than publishing Posit maintainer data. Removed the disabled AppX manifest with its false publisher metadata.
- The pinned Node 24 `core-ci` and macOS arm64 package builds pass on 2026-10-01. The fresh packaged `product.json` contains the RHS-IA company, product name, license label, and release URLs; `Info.plist` displays RHS-IA and retains the documented `co.posit.positron` bundle identifier. The packaged icon is byte-identical to the restored source. This is artifact inspection, not a full GUI acceptance test.

## Outstanding removable or unverified references

- `src/vs/workbench/` and `extensions/positron-*/` contain many source paths, symbols, command IDs, settings, and localized strings. They need subsystem-by-subsystem import and persisted-state migration, not a global replacement. Some are external extension APIs; others are removable internal names.
- Many source paths, symbols, tests, and developer instructions still carry the inherited name. In particular, most `src/vs/workbench/` and `extensions/positron-*/` occurrences have not been classified individually. A source-wide rename could break extension APIs, settings, or persisted state.
- Workflow display names and the PR DMG application's path have been corrected, but many CI jobs still invoke upstream infrastructure, credentials, and artifact identifiers. Each workflow needs an owner and an executable RHS-IA replacement or explicit disablement before PAHO IT can rely on it.
- The product metadata now uses RHS-IA company and Elastic License 2.0 labels, but PAHO legal ownership and distribution sign-off remain open. The remote-server, gallery, and licensed extension endpoints still depend on Posit services. Linux packages require a maintainer value; Windows packaging and server artifacts have not been rebuilt and inspected.
- The prebuilt Windows updater executable contains embedded Positron strings even though desktop self-update is disabled. Its inclusion and behavior need a Windows package review. The Windows icon artwork remains a known user-approved visual exception.
- Tracked executable and font files can contain embedded Positron strings. Inspect application screens visually; do not infer binary branding from filenames or a text grep. The restored Windows icon exception above is known and must be called out in any release review.

## Release gate

The current local branch is `RHS-IA-1.0` (Git branch names cannot contain spaces). It is the only remaining local branch. Eleven old local branch tips were already contained in it; two divergent tips were first preserved as local annotated tags, `rhs-ia-backup-asistente-rhs-rebrand-2026-10-01` and `rhs-ia-backup-rhs-ia-rebrand-2026-10-01`. The branch has not been published or made the GitHub default, and no remote branch was deleted.

Before setting `RHS-IA-1.0` as the GitHub default or deleting remote branches, classify every residual reference to a specific required category or migrate it with tests. Re-audit tracked paths, text, submodules, and packaged assets; test the supported platform and existing-profile behavior; verify a new backup containing the completed commit; and resolve open GitHub pull requests and branch permissions. This gate is not yet met.
