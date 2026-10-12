---
name: test-driven-development
modeSlugs: [code]
description: TDD — enforce RED-GREEN-REFACTOR, tests before code. Use for new features, bug fixes, refactoring, and behavior changes. No production code without a failing test first.
version: "1.1.0-capibara"
author: Cuy (adapted from Hermes Agent / obra/superpowers)
license: MIT
metadata:
  author: Cuy (adaptado de Hermes Agent / obra/superpowers)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
---

# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**Violating the letter of the rules is violating the spirit of the rules.**

## When to Use

**Always:** new features, bug fixes, refactoring, behavior changes.

**Exceptions (ask the user first):** throwaway prototypes, generated code, configuration files.

Thinking "skip TDD just this once"? Stop. That's rationalization.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over. Don't keep it as "reference", don't "adapt" it while writing tests, don't look at it. Implement fresh from tests. Period.

## Red-Green-Refactor Cycle

### RED — Write a failing test

Write one minimal test showing what should happen.

**Good test (R/testthat):**
```r
test_that("retry_operation retries failed operations 3 times", {
  attempts <- new.env(parent = emptyenv())
  attempts$n <- 0
  operation <- function() {
    attempts$n <- attempts$n + 1
    if (attempts$n < 3) stop("fail")
    "success"
  }
  expect_equal(retry_operation(operation), "success")
  expect_equal(attempts$n, 3)
})
```

**Good test (TypeScript/vitest):**
```ts
it("retries failed operations 3 times", () => {
  let attempts = 0
  const operation = () => {
    attempts += 1
    if (attempts < 3) throw new Error("fail")
    return "success"
  }
  expect(retryOperation(operation)).toBe("success")
  expect(attempts).toBe(3)
})
```

Clear name, tests real behavior, one thing. Requirements:
- One behavior per test
- Clear descriptive name ("and" in name? Split it)
- Real code, not mocks (unless truly unavoidable)
- Name describes behavior, not implementation

### Verify RED — Watch it fail

**MANDATORY. Never skip.** Run the specific test and confirm it fails for the right reason (feature missing, not a typo).

- TypeScript: `execute_command` → `pnpm test -- --run path/to/test.test.ts` (vitest).
- R: `execute_code` (r) → `testthat::test_file("tests/testthat/test_xxx.R")`, or `execute_command` → `Rscript -e "testthat::test_file(...)"`.
- Python: `execute_code` (python) or `execute_command` → `pytest tests/test_feature.py::test_name -v`.
- Rust: `execute_command` → `cargo test test_name`.

If the test passes immediately, you're testing existing behavior — fix the test. If it errors, fix the error and re-run until it fails correctly.

### GREEN — Minimal code

Write the simplest code to pass the test. Nothing more. Don't add features, refactor other code, or "improve" beyond the test.

Cheating is OK in GREEN: hardcode returns, copy-paste, duplicate code, skip edge cases. Fix it in REFACTOR.

### Verify GREEN — Watch it pass

**MANDATORY.** Run the specific test, then the relevant suite to check for regressions. Output should be pristine (no errors, warnings).

- Test fails? Fix the code, not the test.
- Other tests fail? Fix regressions now.

### REFACTOR — Clean up

After green only: remove duplication, improve names, extract helpers, simplify expressions. Keep tests green throughout. Don't add behavior. If tests fail during refactor: undo immediately, take smaller steps.

### Repeat

Next failing test for next behavior. One cycle at a time.

## Why order matters

**"I'll write tests after to verify it works"** — tests written after code pass immediately. Passing immediately proves nothing: might test the wrong thing, might test implementation not behavior, might miss edge cases, you never saw it catch the bug. Test-first forces you to see the test fail, proving it actually tests something.

**"I already manually tested all the edge cases"** — manual testing is ad-hoc. No record, can't re-run when code changes, easy to forget cases under pressure. Automated tests are systematic.

**"Deleting X hours of work is wasteful"** — sunk cost fallacy. The time is already gone. Delete and rewrite with TDD (high confidence) vs keep and add tests after (low confidence, likely bugs). The "waste" is keeping code you can't trust.

## Common rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Tests after achieve same goals" | Tests-after = "what does this do?" Tests-first = "what should this do?" |
| "Already manually tested" | Ad-hoc ≠ systematic. No record, can't re-run. |
| "Deleting X hours is wasteful" | Sunk cost fallacy. Keeping unverified code is technical debt. |
| "Keep as reference, write tests first" | You'll adapt it. That's testing after. Delete means delete. |
| "Need to explore first" | Fine. Throw away exploration, start with TDD. |
| "Test hard = design unclear" | Listen to the test. Hard to test = hard to use. |
| "TDD will slow me down" | TDD faster than debugging. Pragmatic = test-first. |
| "Existing code has no tests" | You're improving it. Add tests for the code you touch. |

## Red flags — STOP and start over

If you catch yourself doing any of these, delete the code and restart with TDD:
- Code before test
- Test after implementation
- Test passes immediately on first run
- Can't explain why test failed
- Tests added "later"
- Rationalizing "just this once"
- "Keep as reference" or "adapt existing code"
- "Already spent X hours, deleting is wasteful"

## Verification checklist

Before marking work complete:
- [ ] Every new function/method has a test
- [ ] Watched each test fail before implementing
- [ ] Each test failed for expected reason (feature missing, not typo)
- [ ] Wrote minimal code to pass each test
- [ ] All tests pass
- [ ] Output pristine (no errors, warnings)
- [ ] Tests use real code (mocks only if unavoidable)
- [ ] Edge cases and errors covered

Can't check all boxes? You skipped TDD. Start over.

## When stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test | Write the wished-for API. Write the assertion first. Ask the user. |
| Test too complicated | Design too complicated. Simplify the interface. |
| Must mock everything | Code too coupled. Use dependency injection. |
| Test setup huge | Extract helpers. Still complex? Simplify the design. |

## Cuy tool integration

### Running tests
- **TypeScript / the capibara extension** → `execute_command`: `pnpm test` (vitest) and `pnpm check-types` (tsc).
- **R** → `execute_code` (r): `testthat::test_file(...)` / `devtools::test()`; or `execute_command`: `Rscript -e "..."`.
- **Python** → `execute_code` (python) or `execute_command`: `pytest`.
- **Rust** → `execute_command`: `cargo test`, `cargo clippy`.

When `execute_command` is not available, ask the user to run the command and paste the output.

### No subagent dispatch
Cuy has no `delegate_task`. Enforce TDD yourself, in sequence, in the same context: write the failing test, watch it fail, write minimal code, watch it pass, refactor, commit. The discipline is the same without fan-out.

### With systematic-debugging
Bug found? Write a failing test reproducing it. Follow the TDD cycle. The test proves the fix and prevents regression. Never fix bugs without a test.

## Testing anti-patterns

- **Testing mock behavior instead of real behavior** — mocks verify interactions, not replace the system under test.
- **Testing implementation details** — test behavior/results, not internal method calls.
- **Happy path only** — always test edge cases, errors, and boundaries.
- **Brittle tests** — tests verify behavior, not structure; refactoring shouldn't break them.

## Final rule

```
Production code → test exists and failed first
Otherwise → not TDD
```

No exceptions without the user's explicit permission.
