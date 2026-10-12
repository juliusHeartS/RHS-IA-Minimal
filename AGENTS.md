# RHS-IA Agent Instructions

This file provides instructions for coding agents working with the RHS-IA fork of Positron and Code OSS.

For detailed project overview, architecture, coding guidelines, and validation steps, see the [Copilot Instructions](.github/copilot-instructions.md).

## RHS-IA Customization Ledger

- When adding, changing, or intentionally removing a customization, update both ledger files in the same change, [customization ledger](docs/upgrades/rhs-customizations.md) and its [machine-readable inventory](docs/upgrades/rhs-customizations.json). Keep stable entry IDs and record the purpose, current behavior, relevant paths, commit evidence when available, and verification steps. Distinguish committed behavior, pending work, and superseded decisions; do not invent commit IDs or claim checks passed without running them.
- Reconcile the ledger with the actual Git history and working tree. An unlisted customization is not permission to discard it. If entries or ledger files are missing, reconstruct the relevant evidence and add them as part of the work. Explicit user instructions take precedence over historical ledger entries.

## Code Hygiene & Formatting Requirements
- **Line Endings:** You MUST use LF (`\n`) line endings for all files. Do NOT use CRLF.
- **Indentation:** You MUST use **tabs (`\t`)** instead of **spaces** for indentation across all core files (including `.css`, `.ts`, `.tsx`, `.js`, `.jsx`, `.py`).
- **Copyright Headers:** Preserve existing Microsoft, Posit, PAHO, and third-party notices. New source files should use the correct copyright owner and applicable repository header; do not replace another owner's notice to make branding uniform.
- **Unicode characters:** For lines containing non-ASCII unicode characters, append `// allow-any-unicode-next-line` (or `# allow-any-unicode-next-line` for Python files) to the preceding line to bypass the strict ASCII-only rule in the precommit hook.
- **Temporary Scripts:** Ensure any temporary execution scripts (like `fix.py` or `format.js`) created in the workspace are either deleted after use or added to `.gitignore`. Otherwise, the hygiene hook will fail when scanning untracked files.

For a detailed guide on the inherited hygiene checks, see [Hygiene Guide for Agents](docs/hygiene-guide-for-agents.md).
