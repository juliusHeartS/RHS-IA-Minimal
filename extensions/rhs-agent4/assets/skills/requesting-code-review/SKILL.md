---
name: requesting-code-review
modeSlugs: [code]
description: Pre-commit verification — security scan, baseline-aware quality gates, an independent-minded review pass, and an auto-fix loop. Use after implementing a feature or bug fix, before commit/push, or when the user says "commit", "ship", "verify", "review before merge".
version: "2.0.0-capibara"
author: Cuy (adapted from Hermes Agent / obra/superpowers + MorAlekss)
license: MIT
metadata:
  author: Cuy (adaptado de Hermes Agent / obra/superpowers + MorAlekss)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
---

# Pre-Commit Code Verification

Automated verification pipeline before code lands. Static scans, baseline-aware quality gates, an independent-minded review pass, and an auto-fix loop.

**Core principle:** Don't verify your own work uncritically. Adopt a deliberately skeptical, fresh-eyes stance for the review pass — assume the diff is wrong until it proves itself.

## How this differs from Hermes

Hermes spawns an independent reviewer subagent (and a third "fix agent") via `delegate_task` so a fresh context judges the work. Cuy has no subagent dispatch, so you run the review pass **as a distinct, deliberately skeptical pass in the same context** — read the diff as if you'd never seen it, apply the fail-closed rules below, and don't rationalize your own implementation. The discipline of a separate, adversarial pass is what carries over; the fresh context is what's lost, so be extra harsh.

## When to Use

- After implementing a feature or bug fix, before `git commit` or `git push`.
- When the user says "commit", "push", "ship", "done", "verify", or "review before merge".
- After completing a task with 2+ file edits in a git repo.

**Skip for:** documentation-only changes, pure config tweaks, or when the user says "skip verification".

## Step 1 — Get the diff

Run via `execute_command` (or ask the user to run and paste):

```bash
git diff --cached
```

If empty, try `git diff` then `git diff HEAD~1 HEAD`.

If `git diff --cached` is empty but `git diff` shows changes, tell the user to `git add <files>` first. If still empty, run `git status` — nothing to verify.

If the diff exceeds 15,000 characters, split by file:
```bash
git diff --name-only
git diff HEAD -- specific_file.ext
```

## Step 2 — Static security scan

Scan added lines only. Any match is a security concern fed into Step 5. Run via `execute_command` (or ask the user):

```bash
# Hardcoded secrets
git diff --cached | grep "^+" | grep -iE "(api_key|secret|password|token|passwd)\s*=\s*['\"][^'\"]{6,}['\"]"

# Shell injection
git diff --cached | grep "^+" | grep -E "os\.system\(|subprocess.*shell=True|exec\(["

# Dangerous eval/exec
git diff --cached | grep "^+" | grep -E "\beval\(|\bexec\("

# Unsafe deserialization
git diff --cached | grep "^+" | grep -E "pickle\.loads?\(|yaml\.load\("

# SQL injection (string formatting in queries)
git diff --cached | grep "^+" | grep -E "execute\(f\"|\.format\(.*SELECT|\.format\(.*INSERT|paste0\(.*SELECT"
```

For R/Python analysis code, also watch for: `eval(parse(text=...))` with user input, `system()`/`system2()` with unescaped input, and `readRDS()` of untrusted files.

## Step 3 — Baseline tests and linting

Detect the project language and run the appropriate tools. Capture the failure count BEFORE your changes as **baseline_failures** (stash changes, run, pop — or run on a clean checkout). Only NEW failures introduced by your changes block the commit.

**Test frameworks (auto-detect by project files):**
```bash
# TypeScript / the capibara extension
pnpm test -- --passWithNoTests 2>&1 | tail -5
pnpm check-types 2>&1 | tail -5

# Python
python -m pytest --tb=no -q 2>&1 | tail -5

# R
Rscript -e "devtools::test()" 2>&1 | tail -10

# Rust
cargo test 2>&1 | tail -5
```

**Linting and type checking (run only if installed):**
```bash
# TypeScript
npx eslint . 2>&1 | tail -10
npx tsc --noEmit 2>&1 | tail -10

# Python
ruff check . 2>&1 | tail -10
mypy . --ignore-missing-imports 2>&1 | tail -10

# Rust
cargo clippy -- -D warnings 2>&1 | tail -10
```

Run these via `execute_code` (R/Python in Positron) or `execute_command`; when neither is available, ask the user to run and paste the output.

**Baseline comparison:** if baseline was clean and your changes introduce failures, that's a regression. If baseline already had failures, only count NEW ones.

## Step 4 — Self-review checklist

Quick scan before the skeptical review pass:

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Input validation on user-provided data
- [ ] SQL queries use parameterized statements
- [ ] File operations validate paths (no traversal)
- [ ] External calls have error handling
- [ ] No debug print/console.log/cat() left behind
- [ ] No commented-out code
- [ ] New code has tests (if a test suite exists)

## Step 5 — Skeptical review pass

Perform a deliberate, adversarial review of the diff. Adopt the stance that you have no investment in how these changes were made. Read the diff and the static scan results, and produce a JSON verdict applying the fail-closed rules strictly.

Fail-closed rules:
- `security_concerns` non-empty → `passed` must be `false`
- `logic_errors` non-empty → `passed` must be `false`
- Cannot parse diff → `passed` must be `false`
- Only set `passed=true` when BOTH lists are empty

Security (auto-FAIL): hardcoded secrets, backdoors, data exfiltration, shell injection, SQL injection, path traversal, `eval()`/`exec()` with user input, `pickle.loads()`/`yaml.load()`, obfuscated commands, `eval(parse(text=...))` with user input.

Logic errors (auto-FAIL): wrong conditional logic, missing error handling for I/O/network/DB, off-by-one errors, race conditions, code contradicts intent.

Suggestions (non-blocking): missing tests, style, performance, naming.

Produce ONLY this JSON:

```json
{
  "passed": true,
  "security_concerns": [],
  "logic_errors": [],
  "suggestions": [],
  "summary": "one sentence verdict"
}
```

## Step 6 — Evaluate results

Combine results from Steps 2, 3, and 5.

**All passed:** proceed to Step 8 (commit).
**Any failures:** report what failed, then proceed to Step 7 (auto-fix).

```
VERIFICATION FAILED

Security issues: [list from static scan + review]
Logic errors: [list from review]
Regressions: [new test failures vs baseline]
New lint errors: [details]
Suggestions (non-blocking): [list]
```

## Step 7 — Auto-fix loop

**Maximum 2 fix-and-reverify cycles.**

Perform a fix pass — as a distinct step, not interleaved with the review. Fix ONLY the reported issues: do not refactor, rename, or change anything else; do not add features. Describe what you changed and why.

After the fix pass, re-run Steps 1-6 (full verification cycle).
- Passed → proceed to Step 8.
- Failed and attempts < 2 → repeat Step 7.
- Failed after 2 attempts → escalate to the user with the remaining issues and suggest `git stash` or `git reset` to undo.

## Step 8 — Commit

If verification passed, run via `execute_command` (or ask the user):

```bash
git add -A && git commit -m "[verified] <description>"
```

The `[verified]` prefix indicates the skeptical review pass approved this change.

## Reference: Common patterns to flag

### Python
```python
# Bad: SQL injection
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
# Good: parameterized
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))

# Bad: shell injection
os.system(f"ls {user_input}")
# Good: safe subprocess
subprocess.run(["ls", user_input], check=True)
```

### R
```r
# Bad: arbitrary code execution with user input
eval(parse(text = user_input))
# Good: validate and use fixed logic, never parse user text

# Bad: shell injection
system(paste("ls", user_input))
# Good: system2 with explicit args
system2("ls", args = c(shQuote(user_input)))
```

### JavaScript / TypeScript
```javascript
// Bad: XSS
element.innerHTML = userInput
// Good: safe
element.textContent = userInput
```

## Integration with other skills

- **test-driven-development:** this pipeline verifies TDD discipline was followed — tests exist, tests pass, no regressions.
- **plan:** validates implementation matches the plan requirements.
- **systematic-debugging:** when verification fails, debug the root cause; don't guess-fix.

## Pitfalls

- **Empty diff** — check `git status`, tell the user nothing to verify.
- **Not a git repo** — skip and tell the user.
- **Large diff (>15k chars)** — split by file, review each separately.
- **Review pass rationalizes the implementation** — that defeats the skill. Re-read the diff cold and apply the fail-closed rules literally.
- **False positives** — if a finding flags something intentional, note it in the fix prompt.
- **No test framework found** — skip regression check; the review verdict still runs.
- **Lint tools not installed** — skip that check silently, don't fail.
- **Auto-fix introduces new issues** — counts as a new failure; the cycle continues.
