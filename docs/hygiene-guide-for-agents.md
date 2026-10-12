# Hygiene Guide for AI Agents

The RHS-IA fork inherits a strict `precommit` hygiene check (`build/hygiene.ts`). This check scans modified and untracked files for code quality and consistency. Failure to comply can block `git commit`.

As an AI Agent, you must adhere to the following rules when modifying or creating files:

## 1. Indentation
**Rule**: You MUST use **tabs (`\t`)** instead of **spaces** for indentation.
- This applies to almost all source files including TypeScript, JavaScript, CSS, and Python (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.py`).
- Replacing spaces with tabs is mandatory. Using 2 or 4 spaces will result in a `Bad whitespace indentation` error.

## 2. Line Endings
**Rule**: You MUST use **Unix LF (`\n`)** line endings.
- Do NOT use CRLF (`\r\n`). Ensure any file modifications or new files maintain LF line endings.

## 3. Copyright Headers
**Rule**: Preserve the existing copyright owner and license notice. Code derived from Positron uses its Posit notice; Code OSS files commonly use Microsoft's MIT notice. New RHS-IA code needs a truthful header appropriate to its actual owner and license. The inherited checker may require a recognized header format; never change ownership just to satisfy a check. For a Posit-authored TypeScript/JavaScript file, the existing header is typically:
```typescript
/*---------------------------------------------------------------------------------------------
 *  Copyright (C) 2025-2026 Posit Software, PBC. All rights reserved.
 *  Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
 *--------------------------------------------------------------------------------------------*/
```
For a Posit-authored Python file, the existing header is typically:
```python
# ---------------------------------------------------------------------------------------------
# Copyright (c) 2025-2026 Posit Software, PBC. All rights reserved.
# Licensed under the Elastic License 2.0. See LICENSE.txt for license information.
# ---------------------------------------------------------------------------------------------
```
- Missing or malformed headers can throw a `Missing or bad copyright statement` error.

## 4. Unicode Restrictions
**Rule**: The codebase enforces an ASCII-only policy.
- If you absolutely must include non-ASCII unicode characters (e.g., `ñ`, `í`, `─`, `❌`) in a file, you must append an ignore directive to the preceding line.
- For TypeScript/JavaScript: Add `// allow-any-unicode-next-line` on the line above the unicode character.
- For Python: Add `# allow-any-unicode-next-line` on the line above the unicode character.

## 5. Temporary Scratch Scripts
**Rule**: Do not leave untracked scratch scripts in the workspace.
- The `hygiene` hook scans untracked files in the root directory. If you create temporary scripts (e.g., `fix_hygiene.py`, `script.js`) to perform automated tasks, you MUST delete them when finished, otherwise they will fail the hygiene check during the user's next commit.
