# RHS-IA Spanish UI localization audit

Generated from b4533a71a3c664d1bb34c06a92e42861e7bbb744 on 2026-09-13T03:51:36.169Z.

## Executive summary

The baseline audit identified **1588 confirmed gaps** and **19 hardcoded candidates** (1607 findings total). The current scan reports **0 remaining findings** and **0 unresolved dynamic localization calls**.

Spanish runtime bundles now ship for source-built Positron extensions, manifest contributions have local `package.nls.es.json` coverage, audited core strings are covered by the RHS-IA overlay, and the targeted hardcoded UI strings use localization APIs.

## Counts

| Measure | Count |
| --- | ---: |
| Confirmed gaps | 0 |
| Candidates needing runtime verification | 0 |
| Static extension runtime calls extracted | 681 |
| Dynamic extension localization calls counted but not assigned | 0 |

| Priority | Count |
| --- | ---: |

### Findings by surface

| Surface | Findings |
| --- | ---: |

## Confirmed gaps

These findings have a statically demonstrated ineffective Spanish path: the exact source key/string is not in the RHS overlay, not in the pinned main/extension translation, and/or has no shipped Spanish extension bundle.

| ID | Priority | Surface | English source string | Primary location | Localization key | Suggested Spanish |
| --- | --- | --- | --- | --- | --- | --- |

## Candidates needing runtime verification

These are hardcoded literals found in shipped source where static inspection shows no localization call, but a runtime pass should confirm whether the text is reachable in the product path.

| ID | Priority | Surface | English text | Location | Suggested Spanish |
| --- | --- | --- | --- | --- | --- |

## Pipeline and shipping evidence

- The RHS overlay is applied before the pinned Microsoft Spanish pack and English fallback in `src/vs/base/node/nls.ts`.
- This audit verifies all statically resolvable source-built Positron extension `vscode.l10n.t()` calls, manifest placeholders, audited core calls, targeted hardcoded candidates, and placeholder parity.
- Local `bundle.l10n.es.json` and `package.nls.es.json` files fill the Positron-specific coverage absent from the pinned upstream VSIX.
- `build/lib/extensions.ts` excludes `positron-zed`, `positron-javascript`, build-only data-explorer packages, and other non-shipping sources; those are not treated as product gaps.
- The hidden Learn content, user-authored/output content, comments, logs, tests, fixtures, generated duplicates, and proper names were excluded.

## Reproducible audit method

- `rtk read /Users/josu/.codex/RTK.md`
- `rtk git status --short`
- `rtk read AGENTS.md`
- `rtk read docs/upgrades/rhs-customizations.md`
- `rtk read docs/upgrades/rhs-customizations.json`
- `rtk read docs/language/translation-plan.md`
- `rtk proxy unzip -Z1 language-packs/vscode-language-pack-es-1.111.0.vsix`
- `rtk proxy node scripts/validate-spanish-session-localization.mjs`
- `rtk proxy rg -n "vscode.l10n.t|localize(|aria-label|title=|>...<" src extensions`

The extractor parses TypeScript/TSX ASTs for literal `vscode.l10n.t()`, `localize()` and `localize2()` calls, reads manifest `%key%` references, compares exact keys against the RHS overlay and unpacked Spanish VSIX JSON, groups duplicate English strings while retaining affected locations, and adds a small targeted hardcoded-text scan for notebook/R/PDF/control-gallery surfaces.

## Coverage boundaries and limitations

- No fresh packaged-app GUI session was run by this audit; rendered locale behavior still requires packaged-app smoke testing.
- The pinned language pack was inspected from its VSIX contents; upstream translations are treated as effective only when the exact module/key or extension package key was found.
- This is not an exhaustive audit of every upstream extension contribution or every HTML/string assembled at runtime. The report focuses on RHS-IA-owned/source-built surfaces and shipped customizations.

## Ordered remediation backlog

No remediation items remain within the static audit scope. A packaged Spanish-profile smoke test remains a release-validation activity.

Full machine-readable records: [rhs-ia-spanish-ui-inventory.json](./rhs-ia-spanish-ui-inventory.json).
