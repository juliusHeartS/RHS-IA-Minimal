---
name: simplify-code
modeSlugs: [code]
description: Three-lens cleanup of recent code changes — reuse, quality, efficiency. Use when the user says "simplify", "review my changes", or "clean up my changes". Runs three focused review passes then applies the fixes worth applying.
version: "1.0.0-capibara"
author: Cuy (adapted from Hermes Agent, inspired by Claude Code /simplify)
license: MIT
metadata:
  author: Cuy (adaptado de Hermes Agent, inspirado en Claude Code /simplify)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
dependencies:
  tools: [search_files, read_file, edit_file, execute_command]
---

# Simplify Code — Three-Lens Review & Cleanup

Review your recent code changes with three focused review passes, aggregate their findings, and apply the fixes worth applying.

**Core principle:** Three narrow review passes beat one broad pass. Each one searches the codebase for a single class of problem — reuse, quality, efficiency — without diluting its attention across all three.

## How this differs from Hermes

Hermes fans these out as three parallel subagents (`delegate_task` batch). Cuy has no subagent dispatch, so you run the three passes **sequentially in the same context**, one lens at a time, then aggregate. The lens separation (and giving each pass the complete diff plus repo access) is what matters, not the parallelism.

## When to Use

Trigger when the user says:
- "simplify" / "simplify my changes" / "simplify these changes"
- "review my code" / "review my recent changes" / "clean up my changes"

Optional modifiers — honor them:
- **Focus:** "simplify focus on efficiency" → run only the efficiency lens (or weight aggregation toward it). Lenses: `reuse`, `quality`, `efficiency`.
- **Dry run:** "simplify but don't change anything" / "just report" → run the three passes, present findings, apply NOTHING. Ask before applying.
- **Scope:** "simplify the last commit" / "simplify staged" / "simplify src/foo.ext" → narrow the diff source (Phase 1).

Do NOT auto-run this after every edit. It is a deliberate cleanup pass — invoke it only when the user asks.

## The Process

### Phase 1 — Identify the changes

Capture the diff to review. Run via `execute_command` (or ask the user to run and paste output). Pick the source by what the user asked for, in this default order:

```bash
# 1. Default: uncommitted working-tree changes (tracked files)
git diff

# 2. If that's empty, include staged changes
git diff HEAD

# 3. Scoped variants:
git diff --staged          # "staged changes"
git diff HEAD~1            # "the last commit"
git diff main...HEAD       # "this branch" / "my PR"
git diff -- src/foo.ext    # specific file(s)
```

If `git diff` and `git diff HEAD` are both empty (no repo or no changes), fall back to the files the user explicitly named or that were recently created/edited in this session. If you genuinely can't find any changed code, say so and stop — there's nothing to simplify.

Capture the full diff text. If it's very large (>2000 changed lines), warn the user and offer to scope it down (per-directory, per-commit) before proceeding.

### Phase 2 — Run three review passes (sequentially)

Run each lens as a separate, deliberate pass over the **complete diff**. For each pass, search the codebase with `search_files`, `list_files`, `read_file` and terminal commands such as `rg` when appropriate. Do not reason from the diff alone.

For each lens, report findings as a concrete list: `file:line → problem → suggested fix`, ranked `high` / `medium` / `low` confidence. Skip nits and style-only churn — only flag things that materially improve the code.

Run all three lenses (drop any the user's focus excludes):

**Lens 1 — Code Reuse**
> Review this diff for code that duplicates functionality already in the codebase. Search utility modules, shared helpers, and adjacent files for existing functions, constants, or patterns the new code could call instead of reimplementing. Flag: new functions that duplicate existing ones; hand-rolled logic that an existing utility already does (manual string/path manipulation, custom env checks, ad-hoc type guards, re-implemented parsing). For each, name the existing thing to use and where it lives (`file:line`).

**Lens 2 — Code Quality**
> Review this diff for quality problems. Look for: redundant state (values that duplicate or could be derived; caches that don't need to exist); parameter sprawl (new params bolted on where the function should have been restructured); copy-paste-with-variation (near-duplicate blocks that should share an abstraction); leaky abstractions (exposing internals, breaking an encapsulation boundary); stringly-typed code (raw strings where a constant/enum/registry already exists — check the canonical registries before flagging). For each, give the concrete refactor.

**Lens 3 — Efficiency**
> Review this diff for efficiency problems. Look for: unnecessary work (redundant computation, repeated file reads, duplicate API calls, N+1 access patterns); missed concurrency (independent ops run sequentially); hot-path bloat (heavy/blocking work on startup or per-request paths); TOCTOU anti-patterns (existence pre-checks before an op instead of doing the op and handling the error); memory issues (unbounded growth, missing cleanup, listener/handle leaks); overly broad reads (loading whole files when a slice would do). For each, give the concrete fix and why it's faster or lighter.

### Phase 3 — Aggregate and apply

1. **Merge** the findings into one list, deduping where lenses overlap.
2. **Discard false positives** — you have the most context; drop weak or wrong suggestions silently.
3. **Resolve conflicts.** Lenses can disagree (Lens 1: "use existing util X"; Lens 3: "X is slow, inline it"). Default resolution order: **correctness > the user's stated focus > readability/reuse > micro-perf.** Don't apply a perf "fix" that hurts clarity unless the path is genuinely hot. When two suggestions are mutually exclusive and both defensible, pick the one that touches less code and note the alternative.
4. **Apply** the surviving fixes with `edit_file` for exact replacements or `write_to_file` for new files. Use `execute_command` for repository-native formatters and mechanical transformations. Unless the user asked for a dry run, follow the active approval policy before writing.
5. **Verify** you didn't break anything: run the project's targeted tests for the touched files (not the full suite) via `execute_code`/`execute_command`, and re-run any linter/type check the repo uses (`pnpm check-types`, `pnpm test`, `cargo clippy`, etc.). If a fix breaks a test, revert that one fix and report it.
6. **Summarize** what you changed: a short list of applied fixes grouped by lens, plus any findings you deliberately skipped and why.

## Pitfalls

- **Give the WHOLE diff to each lens.** Splitting the diff across lenses defeats the design — cross-file duplication and N+1s only show up with the full picture.
- **Lenses search, they don't guess.** A reuse finding with no pointer to the existing utility ("there's probably a helper for this") is noise. Require `file:line` evidence; drop findings that lack it.
- **Apply ≠ rewrite.** This is cleanup of the user's recent changes, not a license to refactor the whole module. Keep edits scoped to what the diff touched plus the minimal surrounding change a fix requires.
- **Respect project conventions.** If the repo has `AGENTS.md` / `CLAUDE.md` / `ARCHITECTURE.md` or a linter config, fold those rules into the lens prompts so suggestions match house style instead of fighting it.
- **Large diffs blow context.** If the diff is huge, scope it down before reviewing.

## Related

Use `requesting-code-review` for the pre-commit security/quality gate (it includes a self-review checklist and an independent-review perspective). This skill is the standalone *after-the-fact* cleanup pass.
