---
name: capibara-conflict-resolution
modeSlugs: [code]
description: Guidelines for resolving merge conflicts intelligently using git history and commit context. Use when tasks involve merge conflicts, rebasing, PR conflicts, or git conflict resolution; analyzes commit messages, git blame, and code intent to make intelligent resolution decisions.
metadata:
  author: Cuy (adaptado para Capibara 2)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
dependencies:
  tools: [execute_command, read_file, edit_file]
---

# Cuy conflict resolution skill

## When to use this skill

Use this skill when the task involves:

- Resolving merge conflicts for a specific pull request
- Rebasing a branch that has conflicts with the target branch
- Understanding and analyzing conflicting code changes
- Making intelligent decisions about which changes to keep, merge, or discard
- Using git history to inform conflict resolution decisions

## When NOT to use this skill

Do NOT use this skill when:

- There are no merge conflicts to resolve
- The task is about general code review without conflicts
- You're working on fresh code without any merge scenarios

## Running shell commands

Run `git` and `gh` commands through the `execute_command` tool when it is
available; otherwise ask the user to run them and paste the output. Apply a
precise replacement with `edit_file`; use `write_to_file` only when the complete
resolved file has been inspected and a full rewrite is genuinely necessary.

## Workflow overview

This skill resolves merge conflicts by analyzing git history, commit messages, and code changes to make intelligent resolution decisions. Given a PR number (e.g., "#123"), it handles the entire conflict resolution process.

## Initialization steps

### Step 1: Parse PR number

Extract the PR number from input like "#123" or "PR #123". Validate that a PR number was provided.

### Step 2: Fetch PR information

```bash
gh pr view [PR_NUMBER] --json title,body,headRefName,baseRefName
```

Get PR title and description to understand the intent and identify the source and target branches.

### Step 3: Checkout PR branch and prepare for rebase

```bash
gh pr checkout [PR_NUMBER]
git fetch origin main
GIT_EDITOR=true git rebase origin/main
```

- Refuse to overwrite unrelated working-tree changes; never force checkout
- Fetch the latest main branch
- Attempt to rebase onto main to reveal conflicts
- Use `GIT_EDITOR=true` to ensure non-interactive rebase

### Step 4: Check for merge conflicts

```bash
git status --porcelain
git diff --name-only --diff-filter=U
```

Identify files with merge conflicts (marked with 'UU') and create a list of files that need resolution.

## Main workflow phases

### Phase 1: Conflict analysis

Analyze each conflicted file to understand the changes:

1. Read the conflicted file to identify conflict markers
2. Extract the conflicting sections between `<<<<<<<` and `>>>>>>>`
3. Run git blame on both sides of the conflict
4. Fetch commit messages and diffs for relevant commits
5. Analyze the intent behind each change

### Phase 2: Resolution strategy

Determine the best resolution strategy for each conflict:

1. Categorize changes by intent (bugfix, feature, refactor, etc.)
2. Evaluate recency and relevance of changes
3. Check for structural overlap vs formatting differences
4. Identify if changes can be combined or if one should override
5. Consider test updates and related changes

### Phase 3: Conflict resolution

Apply the resolution strategy to resolve conflicts:

1. For each conflict, apply the chosen resolution
2. Replace the complete conflicted block with `edit_file`
3. Validate that resolved code is syntactically correct
4. Stage resolved files with `git add`

### Phase 4: Validation

Verify the resolution and prepare for commit:

1. Run `git status` to confirm all conflicts are resolved
2. Check for any compilation or syntax errors
3. Review the final diff to ensure sensible resolutions
4. Prepare a summary of resolution decisions

## Git commands reference

| Command | Purpose |
|---------|---------|
| `gh pr checkout [PR_NUMBER] --force` | Force checkout the PR branch |
| `git fetch origin main` | Get the latest main branch |
| `GIT_EDITOR=true git rebase origin/main` | Rebase current branch onto main (non-interactive) |
| `git blame -L [start],[end] [commit] -- [file]` | Get commit information for specific lines |
| `git show --format="%H%n%an%n%ae%n%ad%n%s%n%b" --no-patch [sha]` | Get commit metadata |
| `git show [sha] -- [file]` | Get the actual changes made in a commit |
| `git ls-files -u` | List unmerged files with stage information |
| `GIT_EDITOR=true git rebase --continue` | Continue rebase after resolving conflicts |

## Best practices

### Intent-based resolution (high priority)

Always prioritize understanding the intent behind changes rather than just looking at the code differences. Commit messages, PR descriptions, and issue references provide crucial context.

**Example:** When there's a conflict between a bugfix and a refactor, apply the bugfix logic within the refactored structure rather than simply choosing one side.

### Preserve all valuable changes (high priority)

When possible, combine non-conflicting changes from both sides rather than discarding one side entirely. Both sides of a conflict often contain valuable changes that can coexist if properly integrated.

### Preserve conflict boundaries (high priority)

Use the literal block from `<<<<<<<` through `>>>>>>>` as the `old_string` for
`edit_file`. Require an exact unique match and inspect the resulting file.

### Consider related changes (medium priority)

Look beyond the immediate conflict to understand related changes in tests, documentation, or dependent code. A change might seem isolated but could be part of a larger feature or fix.

## Resolution heuristics

| Category | Rule | Exception |
|----------|------|-----------|
| Bugfix vs Feature | Bugfixes generally take precedence | When features include the fix |
| Recent vs Old | More recent changes are often more relevant | When older changes are security patches |
| Test Updates | Changes with test updates are likely more complete | - |
| Formatting vs Logic | Logic changes take precedence over formatting | - |

## Common pitfalls

### Blindly choosing one side

**Problem:** You might lose important changes or introduce regressions.
**Solution:** Always analyze both sides using git blame and commit history.

### Ignoring PR context

**Problem:** The PR description often explains the why behind changes.
**Solution:** Always fetch and read the PR information before resolving.

### Not validating resolved code

**Problem:** Merged code might be syntactically incorrect or introduce logical errors.
**Solution:** Always check for syntax errors and review the final diff.

### Partial conflict replacement

**Problem:** Editing only one marker or one side leaves an invalid file.
**Solution:** Replace the complete conflict block atomically and verify that
`git diff --check` and `git diff --name-only --diff-filter=U` report no residue.

## Quality checklist

### Before resolution

- [ ] Fetch PR title and description for context
- [ ] Identify all files with conflicts
- [ ] Understand the overall change being merged

### During resolution

- [ ] Run git blame on conflicting sections
- [ ] Read commit messages for intent
- [ ] Consider if changes can be combined
- [ ] Escape conflict markers in diffs

### After resolution

- [ ] Verify no conflict markers remain
- [ ] Check for syntax/compilation errors
- [ ] Review the complete diff
- [ ] Document resolution decisions

## Completion criteria

- All merge conflicts have been resolved
- Resolved files have been staged
- No syntax errors in resolved code
- Resolution decisions are documented

## Communication guidelines

When reporting resolution progress:

- Be direct and technical when explaining resolution decisions
- Focus on the rationale behind each conflict resolution
- Provide clear summaries of what was merged and why

### Progress update format

```
Conflict in [file]:
- HEAD: [brief description of changes]
- Incoming: [brief description of changes]
- Resolution: [what was decided and why]
```

### Completion message format

```
Successfully resolved merge conflicts for PR #[number] "[title]".

Resolution Summary:
- [file1]: [brief description of resolution]
- [file2]: [brief description of resolution]

[Key decision explanation if applicable]

All conflicts have been resolved and files have been staged for commit.
```
