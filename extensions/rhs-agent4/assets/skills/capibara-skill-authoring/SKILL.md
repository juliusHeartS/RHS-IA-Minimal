---
name: capibara-skill-authoring
modeSlugs: [code]
description: Author Cuy SKILL.md files — frontmatter rules, structure, references, and the safety contract. Use when the user asks to add, edit, or review a Cuy skill in the global (~/.rhs-agent/skills) or project (.rhs/skills) tree.
version: "1.0.0-capibara"
author: Cuy (adapted from Hermes Agent skill-authoring)
license: MIT
metadata:
  author: Cuy (adaptado de Hermes Agent skill-authoring)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
dependencies:
  tools: [list_files, read_file, write_to_file, edit_file]
---

# Authoring Cuy Skills

## Overview

A skill is a `SKILL.md` file plus optional resources under `references/`, `scripts/`, `templates/` or `assets/`. `SkillsManager` discovers metadata first and loads instructions and resources on demand.

There are three skill trees:

1. **Built-in** — `<extensionPath>/assets/skills/<name>/SKILL.md`. Shipped with the extension, **read-only and protected** (`protectedSkills.ts`). The model cannot create or modify these. To add a built-in, edit the source repo and rebuild the vsix.
2. **Global (user)** — `capibara.skills.userDir` (default `~/.rhs-agent/skills`), overridable in settings. Personal, shared across the user's workspaces.
3. **Project** — `<workspace>/.rhs/skills/<name>/SKILL.md`. Lives in the repo, shared with everyone who clones it.

Precedence on name conflict is project > global > built-in for unprotected names. A protected built-in name cannot be replaced at runtime.

This skill is about creating/editing skills in the **global** and **project** trees. Built-in skills are edited in the source repo, not at runtime.

## When to Use

- The user asks you to add a skill "for me" (→ global) or "in this repo" (→ project).
- You're writing a reusable Cuy workflow that should persist across sessions.
- You're editing an existing user/project skill.

## Required frontmatter (enforced by `SkillsManager.readMetadata`)

The parser uses YAML frontmatter through `gray-matter`. Hard requirements:

- Starts with `---` on the first line (no leading blank line or BOM).
- `name:` field present, and its value MUST equal the directory name.
- `name` must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase kebab, digits, hyphens), ≤ 64 chars.
- `description:` field present, ≤ 1024 chars and non-empty. A concise single line
  is preferred, but folded YAML is supported.
- Non-empty body after the closing `---`.

## Optional frontmatter

The parser accepts these at top level; selected compatibility fields are also read from `metadata:`:

- `version:` — e.g. `"1.0"`.
- `platforms:` — a list gating the skill by OS. Values: `macos`, `windows`, `linux` (darwin maps to `macos`). Omit to allow all platforms.
- `modeSlugs:` — a list gating the skill to specific modes (e.g. `[code, debug]`). Omit to make the skill available in all modes.
- `policy:` — `implicit` or `explicit-only`.
- `triggers:` and `exclusions:` — routing evidence.
- `dependencies:` — required/optional `tools`, `binaries` and `env` entries.

Peer-matched shape:

```yaml
---
name: my-skill-name
description: Use when <trigger>. <one-line behavior>.
version: "1.0"
license: MIT
platforms: [macos, linux, windows]
policy: implicit
dependencies:
  tools: [read_file]
  optionalBinaries: [pandoc]
---
```

## Size limits

- Description: ≤ 1024 chars (enforced).
- Total `SKILL.md`: aim for 8-15k chars. Split longer detail and executable resources into the typed resource directories.

## Peer-matched structure

```
# <Title>

## Overview
One or two paragraphs: what and why.

## When to Use
- Bulleted triggers
- "Don't use for:" counter-triggers

## <Topic sections>
- Quick-reference tables
- Code blocks with exact commands/recipes

## Common Pitfalls
Numbered mistakes and their fixes.

## Verification Checklist
- [ ] post-action verifications
```

`Overview` + `When to Use` + actionable body + pitfalls are the minimum for the skill to feel like a peer.

## The safety contract (user-signed)

Skill creation and modification goes through `SkillAutoCreator`, which enforces:

- **Never silent overwrite.** Any create/update produces a diff and shows the user **four buttons**: Aplicar / Editar / Rechazar / Pospone 24h.
- **Built-in skills are protected** — proposals to modify a protected name are blocked before any write.
- **Audit log** at `~/.capibara/audit-skills.jsonl` (every create/update appended).
- **Rejection log** at `~/.capibara/skill-rejections.json` with a 30-day TTL (a rejected proposal won't be re-proposed for 30 days).

When you author a skill, propose it through this flow — do not `write_to_file` a skill directly to bypass the contract. Direct file writes into the skill trees are for the human, or for built-in editing in the source repo.

## Router skills and resources

`SkillsManager` catalogs resources without loading their bodies. The model loads
one with `args: "kind:name"`, where kind is `reference`, `script`, `template` or
`asset`. Bare names remain compatible with references. Resource resolution is
confined to the skill directory and capped at 128 KB. Loading a script displays
its content; it never executes it.

For a broad topic, make `SKILL.md` an index that maps tasks to resources:

```markdown
## Reading the reference files

This skill is an index. Load only the required resource by invoking the skill
tool again with `args: "reference:topic-name"` or `args: "script:verify.sh"`.
```

Do not use workspace `read_file` to resolve bundled resources.

## Workflow

1. **Decide the tree.** "For me" → global (`~/.rhs-agent/skills`). "In this repo" → project (`.rhs/skills`). Never write into the built-in tree at runtime.
2. **Survey peers.** `list_files` the target tree, `read_file` 2-3 peer skills to match tone and structure. Don't duplicate an existing skill — extend it instead.
3. **Pick a kebab name** that equals the directory you'll create.
4. **Draft** the SKILL.md, declare policy and dependencies, and use typed resources for specialized material.
5. **Propose through `SkillAutoCreator`** (the safety contract) — the user sees the diff and the four buttons.
6. **Verify** discovery and availability. Mutable skill roots are watched and refresh without requiring a new task.

## Cross-referencing other skills

Reference other skills by name in the body prose ("see the `plan` skill"). A project or global skill with the same name overrides a built-in for resolution, so prefer referencing skills that exist in all three trees (the built-ins) to stay portable.

## Editing existing user/project skills

- **Small fix (typo, added pitfall, tightened trigger):** propose a patch through `SkillAutoCreator` (the diff + four buttons flow).
- **Major rewrite:** propose the full new content through `SkillAutoCreator`.
- **Adding supporting files:** use the appropriate typed resource directory and keep `SKILL.md` as the router.

## Common pitfalls

1. **`name` differs from directory name.** Discovery rejects the skill.
2. **Description too generic.** Describe the trigger class and exclusions.
3. **Missing dependencies.** The skill becomes degraded and must not claim execution.
4. **Writing into the built-in tree at runtime.** It is protected and read-only.
5. **Bypassing the safety contract.** Always expose the diff and approval flow.
6. **Executing a loaded script implicitly.** Loading and execution are separate operations.
7. **Dead resource links.** Use the `kind:name` mechanism, not workspace paths.

## Verification checklist

- [ ] File is at `<tree>/<name>/SKILL.md` (global or project, not built-in)
- [ ] Frontmatter starts at line 1 with `---`, closes with `\n---\n`
- [ ] `name` equals the directory name, matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤ 64 chars
- [ ] `description` is concise, ≤ 1024 chars and describes when to use the skill
- [ ] `policy`, dependencies and resources match real runtime capabilities
- [ ] Total file ≤ ~15k chars; specialized detail uses typed resources
- [ ] Structure: `# Title` → `## Overview` → `## When to Use` → body → `## Common Pitfalls` → `## Verification Checklist`
- [ ] Proposed through `SkillAutoCreator` (diff + four buttons), not direct `write_to_file`
- [ ] Audit entry written to `~/.capibara/audit-skills.jsonl`
