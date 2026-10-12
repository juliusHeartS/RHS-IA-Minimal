# Translation Policy

English is canonical. Translate only the verified RHS-IA English sources, never the upstream website. Spanish uses neutral technical language.

Documentation follows the active UI language through `vscode.env.language`. Spanish variants resolve to `es`; other unsupported languages fall back to `en`. RHS-IA owns Spanish defaults, explicit English selection, command-line overrides, and restart behavior. The extension has no language selector, command, setting, or stored language preference.

Keep identical document IDs, filesystem slugs, explicit heading IDs (`{#anchor}`), links, image paths, code blocks, and inline code. Translate titles, prose, link labels, image alt text, and navigation labels. Shared images live in `docs-src/shared/images` and are copied into each locale bundle.

Use `manifests/terminology.json`. Distinguish concepts, displayed UI labels, command IDs, setting keys, code identifiers, and brands. Code, packages, extension IDs, command IDs, settings keys, environment variables, paths, URLs, and brand names are not translated. Use the actual bundled Spanish UI labels; keep English-only labels in English. Record UI-label evidence in `policies/spanish-ui-labels.md`.

## Translation state

`manifests/translations.json` has exactly one entry for every canonical page, including `home`. `source_revision` and `translation_revision` are SHA-256 hashes of the complete UTF-8 source files. A page is current only if both hashes match and its status is `current`. English or Spanish edits make the computed state stale. Run `rtk proxy node scripts/audit-translations.mjs --sync` to persist missing/stale states without changing approved hashes.

After reviewing a translated page, run `rtk proxy node scripts/audit-translations.mjs --mark-current PAGE_ID ...`. Explicit page IDs are required. This validates parity before recording hashes; it must not be used to bless an English change without updating/reviewing the Spanish page. Hashes establish synchronization, not translation quality.

`rtk proxy node scripts/audit-translations.mjs` requires all pages current. `--allow-incomplete` permits missing/stale pages for development but still reports parity errors in existing translations. `build-docs` is strict by default; `--allow-incomplete` renders only current translations and supports visible English fallback.

QA compares block and heading structure, stable anchors, link and image targets, code blocks, inline identifiers, protected terms, and forbidden glossary variants. Matching long English prose is flagged for editorial review. Necessary exceptions belong in `manifests/translation-review.json` under `allowedUntranslated[pageId]` as `{ "text": "exact paragraph", "reason": "specific justification" }`. These mechanical checks supplement editorial review; they do not prove semantic equivalence.

The Phase C content baseline contains 50 pages. Agent, upstream Assistant, updates, Publisher, migration guides, and screenshot recreation remain outside this work.
