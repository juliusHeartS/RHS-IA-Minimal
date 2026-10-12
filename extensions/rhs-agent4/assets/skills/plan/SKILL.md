---
name: plan
modeSlugs: [code]
description: Plan mode — write an actionable markdown plan to .capibara/plans/ without executing. Bite-sized tasks, exact paths, complete code. Use when the user wants a plan instead of execution.
version: "2.0.0-capibara"
author: Cuy (adapted from Hermes Agent / obra/superpowers)
license: MIT
metadata:
  author: Cuy (adaptado de Hermes Agent / obra/superpowers)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
---

# Plan Mode

Use this skill when the user wants a plan instead of execution.

## Core behavior

For this turn, you are planning only.

- Do not implement code.
- Do not edit project files except the plan markdown file.
- Do not run mutating commands, commit, push, or perform external actions.
- You may inspect the repo or other context with read-only tools (`read_file`, `list_files`) when needed.
- Your deliverable is a markdown plan saved inside the active workspace under `.capibara/plans/`.

## Output requirements

Write a markdown plan that is concrete and actionable.

Include, when relevant:
- Goal
- Current context / assumptions
- Proposed approach
- Step-by-step plan
- Files likely to change
- Tests / validation
- Risks, tradeoffs, and open questions

If the task is code-related, include exact file paths, likely test targets, and verification steps.

## Save location

Save the plan with the `write_to_file` tool (or `execute_code` writing the file from the active session) under:

- `.capibara/plans/YYYY-MM-DD_HHMMSS-<slug>.md` (relative to the workspace root)

If no timestamp is available, use `.capibara/plans/<slug>.md`.

## Interaction style

- If the request is clear enough, write the plan directly.
- If no explicit instruction accompanies the request, infer the task from the current conversation context.
- If it is genuinely underspecified, ask a brief clarifying question (`ask_user_question`) instead of guessing.
- After saving the plan, reply briefly with what you planned and the saved path.

---

# Writing the Plan Well

The rest of this skill is the craft of authoring a *good* implementation plan — the content that goes inside the markdown file above.

## Overview

Write comprehensive implementation plans assuming the implementer has zero context for the codebase and questionable taste. Document everything they need: which files to touch, complete code, testing commands, docs to check, how to verify. Give them bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume the implementer is a skilled developer but knows almost nothing about the toolset or problem domain.

**Core principle:** A good plan makes implementation obvious. If someone has to guess, the plan is incomplete.

## Bite-Sized Task Granularity

**Each task = 2-5 minutes of focused work.**

Every step is one action:
- "Write the failing test" — step
- "Run it to make sure it fails" — step
- "Implement the minimal code to make the test pass" — step
- "Run the tests and make sure they pass" — step
- "Commit" — step

**Right size:**

```markdown
### Task 1: Create User model with email field
[10 lines, 1 file]

### Task 2: Add password hash field to User
[8 lines, 1 file]

### Task 3: Create password hashing utility
[15 lines, 1 file]
```

## Plan Document Structure

### Header (Required)

Every plan MUST start with:

```markdown
# [Feature Name] Implementation Plan

> Implement this plan task-by-task in the same session, reviewing each task against the plan before proceeding to the next.

**Goal:** [One sentence describing what this builds]
**Architecture:** [2-3 sentences about approach]
**Tech Stack:** [Key technologies/libraries]
```

### Task Structure

Each task follows this format:

````markdown
### Task N: [Descriptive Name]

**Objective:** What this task accomplishes (one sentence)

**Files:**
- Create: `exact/path/to/new_file.ext`
- Modify: `exact/path/to/existing.ext:45-67` (line numbers if known)
- Test: `tests/path/to/test_file.ext`

**Step 1: Write failing test**

[code — in the project's language: R (testthat), Python (pytest), TypeScript (vitest), or Rust (cargo test)]

**Step 2: Run test to verify failure**

Run the project's test command targeting this test. Expected: FAIL — "function not defined".

**Step 3: Write minimal implementation**

[code]

**Step 4: Run test to verify pass**

Run the same test command. Expected: PASS.

**Step 5: Commit**

```bash
git add tests/path/test.ext src/path/file.ext
git commit -m "feat: add specific feature"
```
````

## Choosing the test runner

Map the file under test to its runner:
- TypeScript / the capibara extension itself → `pnpm test` (vitest) and `pnpm check-types` (tsc).
- R package / analysis → `Rscript -e "devtools::test()"` or `testthat::test_file(...)`, run via `execute_code` (language `r`) or `execute_command`.
- Python analysis → `pytest`, run via `execute_code` (language `python`) or `execute_command`.
- Rust → `cargo test`, run via `execute_command`.

## Writing Process

### Step 1: Understand requirements
Read the feature requirements, design documents, acceptance criteria, and constraints.

### Step 2: Explore the codebase
Use `list_files` and `read_file` to understand the project structure, find similar features, and check existing tests.

### Step 3: Design approach
Decide architecture pattern, file organization, dependencies, and testing strategy.

### Step 4: Write tasks
Order: setup/infrastructure → core functionality (TDD for each) → edge cases → integration → cleanup/documentation.

### Step 5: Add complete details
For each task: exact file paths, complete copy-pasteable code, exact commands with expected output, and verification steps.

### Step 6: Review the plan
- [ ] Tasks are sequential and logical
- [ ] Each task is bite-sized (2-5 min)
- [ ] File paths are exact
- [ ] Code examples are complete (copy-pasteable)
- [ ] Commands are exact with expected output
- [ ] DRY, YAGNI, TDD applied

## Principles

### DRY (Don't Repeat Yourself)
Extract shared logic; use it everywhere instead of copy-paste.

### YAGNI (You Aren't Gonna Need It)
Implement only what is needed now; do not add speculative flexibility.

### TDD (Test-Driven Development)
Every task that produces code includes the full TDD cycle: write failing test → verify failure → minimal code → verify pass. See the `test-driven-development` skill.

### Frequent commits
Commit after every task.

## Execution handoff

After saving the plan, offer the execution approach:

> "Plan complete and saved to `<path>`. Ready to implement it task-by-task in this session — I'll review each task against the plan before proceeding to the next. Shall I proceed?"

Cuy has no subagent dispatch: implement the tasks sequentially in the same context, reviewing each against the plan before moving on.

## Remember

```
Bite-sized tasks (2-5 min each)
Exact file paths
Complete code (copy-pasteable)
Exact commands with expected output
Verification steps
DRY, YAGNI, TDD
Frequent commits
```

**A good plan makes implementation obvious.**
