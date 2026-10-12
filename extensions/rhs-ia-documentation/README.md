# RHS-IA Offline Documentation

Built-in extension `paho.rhs-ia-documentation`, version 0.0.5. It owns the Documentation webview in the RHS-IA Auxiliary Bar; the Help menu and documentation shortcut focus that same view. Contextual R/Python help remains in Language Help.

## Language behavior

Documentation follows `vscode.env.language`, the application's resolved UI language. Spanish and regional Spanish variants use `es`; English and unsupported languages use `en`. RHS-IA supplies the Spanish default and preserves explicit English choices. Use the application's display-language action and restart to change both the UI and documentation. The extension has no independent language selector, setting, or saved preference.

English is the canonical authoring language. All 50 canonical pages have matching Spanish document IDs and paths. Titles, toolbar text, accessibility labels, and navigation are localized. Missing/stale Spanish pages are excluded from development output; the reader shows their English counterpart with a Spanish notice. Production builds require full current coverage.

## Search and navigation

Search uses bundled `media/search/en/index.json` and `media/search/es/index.json`, selected by the UI language. Results include the page title, section, excerpt, and stable anchor. Matching ignores accents and requires all query terms; results are ranked and limited to 20. No network service is used.

The reader includes expandable contents, an on-page outline, previous/next links, and Back/Forward/Home controls. Up to 100 history entries and scroll positions are saved using locale-neutral IDs. Command Palette actions open the documentation home or focus search.

Authored `rhs-doc-action:settings`, `rhs-doc-action:keyboard-shortcuts`, and `rhs-doc-action:extensions` links invoke only the fixed commands in `manifests/actions.json`; command arguments and arbitrary command URIs are unsupported. Both the link audit and reader use that allowlist.

The responsive reader uses VS Code theme colors, contained code/table scrolling, and responsive images. Manual visual acceptance of Phase D is pending.

## Source layout

- `docs-src/en/`, `docs-src/es/`: canonical and translated QMD sources.
- `docs-src/shared/images/`: approved language-neutral RHS-IA images.
- `localization/`: reader strings and Spanish navigation titles.
- `manifests/translations.json`: explicit translation review hashes/status.
- `manifests/terminology.json`, `policies/spanish-ui-labels.md`: terminology and actual UI-label evidence.
- `media/docs/en/`, `media/docs/es/`: generated offline articles/assets.
- `src/navigation.generated.ts`: generated page registry and localized reader strings.

Generated files must not be edited manually. Runtime reads only bundled media; it uses no localhost server or network-dependent assets. External reference links open through the system browser and accept HTTPS only.

## Build and check

Run shell commands through `rtk`. After TypeScript changes, generate the registry and run `rtk npm run gulp compile-extensions` from the RHS-IA repository root before running audits/tests. The development launcher intentionally resolves UI language to English; use a packaged RHS-IA executable to test the Spanish language pack.

From this extension directory:

```sh
rtk npm run generate-navigation
rtk npm run build-docs
rtk npm run check-docs
rtk npm run test-docs
rtk npm run bundle
```

`build-docs` uses Quarto when available on PATH or through `QUARTO_PATH`. The repository's `.build/quarto/bin/quarto` can be passed as an absolute path. Otherwise it uses the local Markdown renderer. `--markdown` explicitly exercises the fallback. Both paths add article titles and retain explicit heading IDs. Quarto runs in a temporary directory because it ignores projects below hidden directories such as `.build`; end users do not need Quarto.

A development build with incomplete translation is available with:

```sh
rtk proxy node scripts/build-docs.mjs --allow-incomplete
rtk proxy node scripts/audit-links.mjs --allow-incomplete
```

Run extension integration tests from the repository root:

```sh
rtk npm run test-extension -- --label rhs-ia-documentation
```

Set `INTEGRATION_TEST_ELECTRON_PATH` to a packaged RHS-IA executable to test localized UI behavior; `RHS_IA_DOCS_TEST_LOCALE=es` asserts that the host actually selected Spanish. `API_TESTS_EXTRA_ARGS` accepts launch options such as `--locale=en` or `--locale=es-MX` (and replaces the default launch argument list).

## Translation maintenance

Read `policies/translation.md`. Update Spanish after English changes; keep slugs, explicit heading IDs, code, links, assets, and identifiers identical. After editorial review, record the exact approved files:

```sh
rtk proxy node scripts/audit-translations.mjs --mark-current user-interface/layout
rtk npm run audit-translations
```

`--sync` records missing/stale statuses without updating approved hashes. A hash match proves synchronization, not semantic accuracy. Mechanical checks cover structure, headings, anchors, links, images, code, inline identifiers, protected terms, forbidden terminology, and matching untranslated prose. Editorial review checks meaning and actual UI labels.

Packaging runs the strict translation/build/audit pipeline, including exact search-index/article consistency, before bundling the extension. Feature screenshot recreation and Agent documentation remain deferred. Upstream provenance is retained in `upstream/baseline.json`; the exact upstream commit is unknown and the snapshot is identified by hashes.
