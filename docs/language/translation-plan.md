# RHS-IA Display Language System

## Current Goal
RHS-IA ships for Spanish-speaking health workforce researchers in Latin America. The desktop app should start in Spanish by default, without requiring users to download the Microsoft Spanish Language Pack from the Marketplace. English remains the fallback whenever a Spanish translation is missing or the user explicitly switches back.

## Bundled Spanish Language Pack
RHS-IA bundles a local Spanish language pack as `ms-ceintl.vscode-language-pack-es`.

- The packed VSIX lives under `language-packs/`.
- `product.json` lists it in `builtInExtensions` with a local `vsix` path and SHA-256 checksum.
- `scripts/update-spanish-language-pack.mjs` regenerates the pack from a pinned `microsoft/vscode-loc` revision, packages the VSIX, and refreshes the checksum in `product.json`.
- `npm run update-spanish-language-pack` runs the updater directly.
- The build-side bundled-extension validation runs for the built-in extension merge, the dependency cache-key path, and the standalone bundled-extension listing. It checks that the VSIX exists, that its SHA-256 matches `product.json`, and that the embedded manifest version matches.

The bundled pack includes the normal `vscode` translations from Microsoft.

## Product Identity and Migration Boundary
RHS-IA uses stable identifiers such as `rhs-ia`, `.rhs-ia`, `rhs-ia-server`, `rhs-ia-tunnel`, `PAHO.RHSIA`, and `org.paho.rhsia` across the desktop, server, installer, URL protocol, and platform resources. The reverse-DNS organization identifier was not supplied with the product requirements, so `org.paho.rhsia` is an explicit provisional choice; it should be replaced everywhere if PAHO provides an organization-owned identifier before release.

The existing Posit-managed license, update, download, issue, and remote-server CDN URLs remain unchanged because no RHS-IA-owned endpoints were supplied. They are distribution metadata, not local identity/state identifiers, and should be revisited before an independently branded release.

The dev-containers server installer reads `serverApplicationName` and `serverDataFolderName` from the packaged product, so RHS-IA uses `rhs-ia-server` and `~/.rhs-ia-server` while legacy Positron builds retain their fallback names.

## First-Run Default Locale and State Migration
RHS-IA has its own runtime identity and state. Desktop argv and extension state use `~/.rhs-ia` (or `~/.rhs-ia-dev` in a source checkout), while normal application data uses the RHS-IA product name. This keeps RHS-IA and Positron from sharing extensions, caches, locks, or settings.

On a non-portable startup, `src/main.ts` performs a one-time, idempotent migration from the legacy `~/.positron` state directory:

1. Only the legacy `argv.json` runtime configuration is read. The old directory is never modified.
2. The configuration is copied into RHS-IA's `argv.json`; the legacy extension directory and other shared state are deliberately not copied.
3. An explicit `"locale": "es"` or `"locale": "en"` is preserved. If no explicit locale exists, RHS-IA writes `"locale": "es"`.
4. Completion is recorded in RHS-IA's `migration.json`, so later launches do not repeat the migration or overwrite a user choice. Portable launches skip this migration and remain self-contained.

`readArgvConfigSync()` creates a missing `argv.json`, returns the parsed new configuration immediately, and initializes an existing RHS-IA config that has no locale to Spanish. This is what makes the first process Spanish, not only the second launch.

Before `resolveNLSConfiguration(...)`, `ensureBundledSpanishLanguagePackConfigSync(...)` validates the Spanish registration in `userDataPath/languagepacks.json`. It verifies the bundled extension version, translation paths, translation files, and hash. If the app moved or upgraded, only the old bundled Spanish entry is refreshed; unrelated languages and user-managed extensions remain in place.

User control is preserved:

- `--locale` still wins over `argv.json` for the current process.
- An explicit `en` selected through Configure Display Language is persisted in `argv.json`; it is not confused with the product's Spanish default on a later restart or upgrade.
- Existing explicit `es` or `en` values are not replaced by migration or repair.
- The bundled Spanish pack is registered only when the effective locale is Spanish.

## Custom Positron Core Strings
The Positron fork implements specific new text (such as the RHS-IA Assistant Welcome Screen in `chatWidget.ts`) by introducing new string keys (e.g. `positronAssistant.comingSoonTitle`). When a user applies the standard `ms-ceintl` Spanish Language Pack, the pack naturally lacks these new custom keys. The NLS architecture fails the lookup and drops the UI back to the hardcoded English default string.

RHS-IA handles these custom core strings with a local overlay instead of forking Microsoft's language pack data.

`chatWidget.ts` is embedded deep in the internal VS Code Core. At build time, VS Code minifies `localize()` calls into integers via an `nls.keys.json` index. At startup, the language pack resolves translations matching that index inside `nls.ts`.

`src/vs/base/node/nls.ts` loads `src/vs/base/node/sp.positron.nls.ts` when the resolved language is Spanish. During the NLS mapping loop, translations are resolved in this order:

1. RHS-IA/Positron overlay in `sp.positron.nls.ts`.
2. Bundled Microsoft Spanish language pack.
3. English default message.

The Session surface has a larger domain-specific overlay in `src/vs/base/node/sp.positron.session.nls.ts`. It covers the Session container, Console, Variables, Plots, their supporting services, shared action-bar filtering, and both branches of the Welcome screen. `sp.positron.nls.ts` merges this map into the main RHS-IA overlay without adding or changing `localize()` calls, so translation-only updates do not shift the core NLS index.

Run `npm run validate-spanish-session-localization` after changing any of these modules. The validator checks that every scoped core key has a Spanish translation, that format placeholders are preserved, and that the Python and R runtime localization bundles preserve their placeholders.

## Extension Translations

Extensions should use normal VS Code extension localization wherever possible.

- Manifest translations belong in `package.nls.es.json` beside the extension manifest.
- Runtime strings should use the extension's existing localization system.
- The Positron Python and R extensions keep Spanish runtime messages in `l10n/bundle.l10n.es.json`; these cover RHS-IA-generated console banners and session prompts. Output generated by Python, IPython, R, packages, or user code is not application UI and remains unchanged.

## Fresh-Install Testing
Use portable mode to test a true first run. `--user-data-dir` is useful for normal state isolation, but `argv.json` is read from the product or portable runtime location before normal user-data services are available.

```bash
TEST_ROOT="$(mktemp -d)"
VSCODE_PORTABLE="$TEST_ROOT" /path/to/RHS-IA.app/Contents/MacOS/RHS-IA
```

After launch, verify:

```bash
cat "$TEST_ROOT/argv.json"
cat "$TEST_ROOT/user-data/languagepacks.json"
find "$TEST_ROOT/user-data/clp" -name nls.messages.json
```

The expected result is:

- `argv.json` contains `"locale": "es"`.
- `languagepacks.json` contains an `es` entry pointing at the bundled Spanish pack.
- A Spanish `clp` cache is generated.
- The app opens in Spanish without downloading a language pack.

Development caveat: `./scripts/code.sh` sets `VSCODE_DEV=1`, and `resolveNLSConfiguration()` intentionally bypasses language packs in dev mode. Use a packaged app for full UI verification.

## Troubleshooting NLS Index Shifts

During local development, you might encounter a scenario where UI strings appear "jumbled" or shifted (e.g., the "Start Session" button suddenly says "Open Folder").

### The Root Cause
1. **Index-Based Resolution:** VS Code extracts all `localize()` calls during the build process and minifies them into a flat array (`nls.messages.json`). The Microsoft Spanish Language Pack extension (`ms-ceintl`) reads these runtime integer indices to inject Spanish translations.
2. **The Shift:** If you add a *new* `localize()` call into the source code (like adding `positronSearch`), the compiler assigns it a new integer index. This shifts every subsequent index in the entire project down by 1.
3. **The Stale Cache:** To optimize startup times, VS Code heavily caches the final translated array inside a `clp` (Cached Language Pack) folder, using the current Git commit hash as the cache key.
4. **The Bug:** If you test your local build without committing the changes, the Git hash remains the same. The app loads the stale `clp` cache, applying the old array mapping to the new codebase. Because the array shifted, every string after your new injection will pull the wrong translation.

### The Solution
To fix this, you must aggressively purge the `clp` cache directory to force the app to rebuild the language map using the fresh array indices.

Depending on your build environment, delete the `clp` folder inside the user data directory. For example:
- **Dev Build:** `rm -rf ~/.vscode-oss-dev/clp` and `rm -rf ~/Library/Application\ Support/code-oss-dev/clp`
- **Packaged App (RHS-IA, based on Positron):** `rm -rf ~/Library/Application\ Support/RHS-IA/clp`
- **Packaged App (Default Positron):** `rm -rf ~/Library/Application\ Support/Positron/clp`

After deleting the cache, simply restart the application. You do not need to recompile the source code.
