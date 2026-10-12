---
name: import-instructions
description: >
  Import AI coding assistant instruction files into Posit Assistant skills.
  Use when a user wants to convert instruction files from Copilot, Claude Code,
  or VS Code/Positron into SKILL.md format. Covers .github/copilot-instructions.md,
  CLAUDE.md, *.instructions.md, *.prompt.md, *.agent.md, *.chatmode.md, and
  settings-based instructions.
compatibility: Positron. Discovers Copilot, CLAUDE.md, and VS Code/Positron instruction files.
license: MIT
---

# Import Instructions

This skill guides you through discovering existing AI coding assistant instruction files in a workspace and converting them into Agent Skills (SKILL.md format) that Posit Assistant can use.

For format details of Copilot/VS Code source types, read `references/copilot.md`. For the target SKILL.md format, use the `create-skill` skill.

## Supported project-level instruction files

Posit Assistant natively reads only these root-level files as project context (loaded for every conversation in a trusted workspace):

- `AGENTS.md` (workspace root, case-sensitive) — the standard ([agentsmd/agents.md](https://github.com/agentsmd/agents.md))
- `DATABOT.md` (workspace root) — legacy name, takes precedence over AGENTS.md

Note: These files are only injected when the workspace is trusted. In untrusted/restricted mode, they are skipped.

Other AI tool instruction files at the workspace root (`CLAUDE.md`, `positron.md`, `gemini.md`, `llms.txt`) are **not** natively read by Posit Assistant. During discovery, if any of these files exist, notify the user that their contents should be moved into `AGENTS.md` to be loaded automatically.

## Step 1: Discover existing instruction sources

Scan for all known instruction file locations and report what you find. Sources are split into workspace-level (committed to the project) and user-level (personal, on the user's machine).

### Previously imported skills

Before scanning sources, check for skills that already exist in all native discovery directories (a skill in any of these could conflict with an import):

- `.positai/skills/*/SKILL.md` (project-level)
- `.agents/skills/*/SKILL.md` (project-level, Agent Skills spec)
- `~/.positai/skills/*/SKILL.md` (user-level)
- `~/.agents/skills/*/SKILL.md` (user-level, Agent Skills spec)
- Any additional directories configured via `skills.paths` in Posit Assistant settings

Record these so you can flag conflicts in Step 2.

### Workspace-level sources

#### General instruction files

- `AGENTS.md` / `DATABOT.md` at workspace root (confirm presence — natively read, no migration needed)
- `CLAUDE.md` / `claude.md`, `positron.md`, `gemini.md`, `llms.txt` at workspace root (not natively read — contents should be merged into `AGENTS.md`)
- `.github/copilot-instructions.md`
- `CLAUDE.md` / `claude.md` in subdirectories (not natively read — should be migrated)
- Nested `AGENTS.md` in subdirectories (not natively read — should be migrated)

#### Pattern-matched instruction files (`*.instructions.md`)

- `.github/instructions/*.instructions.md`
- `.vscode/positron/instructions/*.instructions.md`

#### Prompt files (`*.prompt.md`)

- `.github/prompts/*.prompt.md`
- `.vscode/positron/prompts/*.prompt.md`

#### Agent files (`*.agent.md`)

- `.github/agents/*.agent.md`
- `.vscode/positron/agents/*.agent.md`

#### Legacy chat mode files (`*.chatmode.md`)

Deprecated in favor of `*.agent.md` but may still exist:

- `.github/chatmodes/*.chatmode.md`
- `.vscode/positron/chatmodes/*.chatmode.md`

#### Skill files (from other tools)

- `.github/skills/*/SKILL.md`
- `.agents/skills/*/SKILL.md`
- `.claude/skills/*/SKILL.md`

#### Settings-based instructions (deprecated)

Check `.vscode/settings.json` for these keys, which may contain `{ text: "..." }`, `{ file: "path" }`, or `{ text: "...", language: "python" }` entries. For `file` entries, follow the path (relative to workspace root) and read the referenced file's content. For `language`-scoped entries, preserve the language context in the migrated skill's description:

- `github.copilot.chat.codeGeneration.instructions`
- `github.copilot.chat.testGeneration.instructions`
- `github.copilot.chat.reviewSelection.instructions`
- `github.copilot.chat.commitMessageGeneration.instructions`
- `github.copilot.chat.pullRequestDescriptionGeneration.instructions`

Also check for custom discovery locations configured in these Positron/VS Code settings (in both `.vscode/settings.json` and user-level settings) — these are not Posit Assistant settings, but may point to additional source files to migrate:

- `chat.instructionsFilesLocations`
- `chat.promptFilesLocations`
- `chat.agentFilesLocations`
- `chat.modeFilesLocations` (legacy chatmodes)
- `chat.agentSkillsLocations`

### User-level sources

These are personal instructions on the user's machine. Only check these if the user wants to migrate personal instructions.

#### Instruction files

- `~/.copilot/instructions/*.instructions.md`
- `~/.agents/instructions/*.instructions.md`

#### Agent files

- `~/.copilot/agents/*.agent.md`

#### Claude Code

- `~/.claude/CLAUDE.md` (global instructions)

#### Skill files

- `~/.copilot/skills/*/SKILL.md`
- `~/.agents/skills/*/SKILL.md`
- `~/.claude/skills/*/SKILL.md`

### Other sources

After scanning the locations above, ask the user if they have any other instruction files they'd like to include (e.g., from other editors, custom locations, or project-specific convention files). Any markdown or text file with coding instructions can be converted to a skill.

## Step 2: Present findings and plan the migration

After discovery, present a summary table of what was found. For each source, show:

- File path
- Origin tool (Copilot, Claude Code, VS Code)
- Type (instruction, prompt, agent, skill, settings-based)
- Scope (workspace-wide, pattern-matched with `applyTo` glob, file-type-specific, or feature-specific)
- Brief content summary

If any proposed skills match existing skills found in Step 1, flag them and for each one ask the user whether to **Skip** (keep existing), **Merge** (incorporate new content), or **Replace** (overwrite with imported content).

Then propose a migration plan:

- **Topically focused instructions** → skill per topic
- **Pattern-matched instructions** (`applyTo` globs) → skill per pattern or group related patterns
- **Prompt files** → skill per prompt
- **Agent files** → skill per agent
- **Non-native root instruction files**, `.github/copilot-instructions.md`, nested `AGENTS.md`/`CLAUDE.md` → merge into root `AGENTS.md` (see Step 4)
- **Overlapping sources** covering the same topic → consolidate into a single skill or AGENTS.md section; note conflicts and ask the user which version to prefer

Always write imported skills to `.positai` directories (not `.agents`). `.positai` takes precedence in last-wins ordering and is the Posit Assistant convention:

- Project-specific skills → `.positai/skills/{skill-name}/SKILL.md`
- User-level personal skills → `~/.positai/skills/{skill-name}/SKILL.md`

Ask the user to confirm or adjust the plan before proceeding.

## Step 3: Convert instruction content to skills

Use the `create-skill` skill for SKILL.md format, frontmatter, naming constraints, and directory structure.

For each skill to create, adapt the content — don't just copy-paste. Transform the instructions:

- Remove tool-specific directives (e.g., Copilot's `@workspace`/`#file` references)
- Rewrite for Posit Assistant's tool and capability set
- If the source had an `applyTo` glob, mention the relevant file patterns in the skill description so it is discovered for matching tasks
- If the source had a `description` field, incorporate it into the skill's description

## Step 4: Update project-level AGENTS.md

For content identified in Step 2 as merging into root `AGENTS.md`:

1. If a `DATABOT.md` exists at the workspace root, update that instead — it takes precedence over `AGENTS.md`
2. If no `AGENTS.md` or `DATABOT.md` exists, create `AGENTS.md`
3. If `AGENTS.md` already exists, review and merge the migrated content under a clear section heading
4. Adapt tool-specific language to be tool-agnostic

## Step 5: Summary and cleanup guidance

After migration, present:

- List of created skills and their paths
- Any content added to `AGENTS.md` or `DATABOT.md`
- Sources that were skipped and why
- Conflicts that were resolved and how
- Suggest the user test each skill by working on a task that matches the skill's `description` field — Posit Assistant discovers skills by description relevance, not by name
- Note that the original instruction files can be kept (they won't interfere) or removed at the user's discretion
- Note that organization-level Copilot instructions (`github.copilot.chat.organizationInstructions`) are fetched from GitHub, not stored locally, and cannot be migrated by this skill — an org admin must configure those separately
