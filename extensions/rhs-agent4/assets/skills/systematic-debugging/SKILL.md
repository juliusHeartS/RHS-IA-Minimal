---
name: systematic-debugging
modeSlugs: [code]
description: "4-phase root cause debugging — understand bugs before fixing. Use for any technical issue: test failures, bugs, unexpected behavior, performance problems, build failures, integration issues."
version: "1.1.0-capibara"
author: Cuy (adapted from Hermes Agent / obra/superpowers)
license: MIT
metadata:
  author: Cuy (adaptado de Hermes Agent / obra/superpowers)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
dependencies:
  tools: [search_files, read_file, list_files, execute_command]
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue: test failures, bugs, unexpected behavior, performance problems, build failures, integration issues.

**Use this ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

**Don't skip when:**
- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)
- Someone wants it fixed NOW (systematic is faster than thrashing)

## The Four Phases

You MUST complete each phase before proceeding to the next.

---

## Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

### 1. Read error messages carefully
- Don't skip past errors or warnings; they often contain the exact solution.
- Read stack traces completely. Note line numbers, file paths, error codes.

**Action:** Use `search_files` or `rg` through `execute_command` to locate the
error and references, then use `read_file` on the relevant source files.

### 2. Reproduce consistently
Can you trigger it reliably? What are the exact steps? Does it happen every time? If not reproducible → gather more data, don't guess.

**Action:** Run the failing test or trigger the bug:
- R: `execute_code` (language `r`) running `testthat::test_file("tests/testthat/test_xxx.R")` or the reproducing expression.
- Python: `execute_code` (language `python`) running `pytest tests/test_module.py::test_name -v` via the shell, or the reproducing script.
- TypeScript / the extension: `execute_command` running `pnpm test -- --run path/to/test` (vitest), or ask the user to run it.
- Shell/git reproduction: `execute_command` when available, otherwise ask the user to run it and paste the output.

### 3. Check recent changes
What changed that could cause this? Git diff, recent commits, new dependencies, config changes.

**Action (git via `execute_command`, or ask the user to run):**
```bash
git log --oneline -10
git diff
git log -p --follow src/problematic_file.ext | head -100
```

### 4. Gather evidence in multi-component systems
WHEN the system has multiple components (API → service → database, CLI → runner → binary, extension → runner → vendor binary): before proposing fixes, add diagnostic instrumentation at each component boundary — log what enters and exits, verify config propagation, check state at each layer. Run once to gather evidence showing WHERE it breaks, then investigate that component.

This is especially relevant in capibara: the extension dispatches to vendored binaries (`pdfstruct`, `rhs-rag`, `obscura`) via runners. When a runner fails, instrument the runner boundary (args, exit code, stderr) before guessing.

### 5. Trace data flow
WHEN the error is deep in the call stack: where does the bad value originate? What called this with the bad value? Keep tracing upstream until you find the source. Fix at the source, not at the symptom.

**Action:** Trace references with `search_files`, `rg` and `read_file`; follow
definitions and callers rather than walking unrelated directories.

### Phase 1 completion checklist
- [ ] Error messages fully read and understood
- [ ] Issue reproduced consistently
- [ ] Recent changes identified and reviewed
- [ ] Evidence gathered (logs, state, data flow)
- [ ] Problem isolated to specific component/code
- [ ] Root cause hypothesis formed

**STOP:** Do not proceed to Phase 2 until you understand WHY it's happening.

---

## Phase 2: Pattern Analysis

Find the pattern before fixing:

1. **Find working examples** — locate similar working code in the same codebase. What works that's similar to what's broken? Use `list_files` + `read_file`.
2. **Compare against references** — if implementing a pattern, read the reference implementation COMPLETELY. Don't skim.
3. **Identify differences** — list every difference between working and broken, however small.
4. **Understand dependencies** — what other components, settings, config, environment does this need?

---

## Phase 3: Hypothesis and Testing

Scientific method:

1. **Form a single hypothesis** — "I think X is the root cause because Y". Write it down. Be specific.
2. **Test minimally** — make the SMALLEST possible change to test the hypothesis. One variable at a time. Don't fix multiple things at once.
3. **Verify before continuing** — did it work? → Phase 4. Didn't work? → form a NEW hypothesis. DON'T add more fixes on top.
4. **When you don't know** — say "I don't understand X". Don't pretend. Ask the user (`ask_user_question`) or research more (`web_search`/`web_fetch`).

---

## Phase 4: Implementation

Fix the root cause, not the symptom:

1. **Create a failing test case** — simplest possible reproduction, automated if possible. MUST have before fixing. Use the `test-driven-development` skill.
2. **Implement a single fix** — address the root cause. ONE change at a time. No "while I'm here" improvements. No bundled refactoring.
3. **Verify the fix** — run the targeted regression test, then the relevant suite. No regressions.
4. **If the fix doesn't work — the Rule of Three:**
   - STOP. Count how many fixes you've tried.
   - If < 3: return to Phase 1, re-analyze with new information.
   - **If ≥ 3: STOP and question the architecture (step 5).** DON'T attempt fix #4 without an architectural discussion.
5. **If 3+ fixes failed: question architecture.** Patterns indicating an architectural problem: each fix reveals new shared state/coupling elsewhere; fixes require "massive refactoring"; each fix creates new symptoms. STOP and question fundamentals — discuss with the user before attempting more fixes. This is NOT a failed hypothesis; this is a wrong architecture.

---

## Red Flags — STOP and follow the process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)
- Each fix reveals a new problem in a different place

**ALL of these mean: STOP. Return to Phase 1.** If 3+ fixes failed, question the architecture (Phase 4 step 5).

## Cuy tool integration

### Investigation tools (Phase 1)
- **`read_file`** — read source with offset/limit and truncation pointers; images returned as blocks when the model supports vision.
- **`search_files`** — regex search with bounded results; prefer `rg` through
  `execute_command` for repository-wide or language-aware terminal workflows.
- **`list_files`** — inspect directory shape after narrowing the scope.
- **`execute_code`** — run R/Python in the active Positron session to reproduce bugs and run analysis-side tests.
- **`execute_command`** — run shell/git/CLI (vitest, Rscript, cargo, the vendored binaries) when available; otherwise ask the user to run and paste output.
- **`web_search` / `web_fetch`** — research error messages and library docs (when the web toggle is enabled).

### No subagent dispatch
Cuy has no `delegate_task`. For multi-component debugging, perform the investigation yourself in sequence in the same context: read the error, reproduce, trace the data flow across components, report findings — do NOT fix until Phase 1 is complete.

### With test-driven-development
When fixing bugs: write a test that reproduces the bug (RED) → debug systematically to find root cause → fix the root cause (GREEN). The test proves the fix and prevents regression. Never fix bugs without a test.

**No shortcuts. No guessing. Systematic always wins.**
