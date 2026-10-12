---
name: create-skill
description: Create new Agent Skills following the official specification and best practices. Use when the user wants to create, author, or write a new skill.
license: MIT
---

# Create Skill

This skill guides you through creating new Agent Skills that conform to the official specification.

## Required Steps

Before creating any skill, you MUST:

1. **Fetch the Agent Skills specification** from https://agentskills.io/specification.md
2. **Fetch best practices** from https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices.md

If you think it will help to fetch other documents linked to from those pages, please do so.

Study both documents carefully to understand:
- Required and optional frontmatter fields
- File structure and naming conventions
- Content organization best practices
- How to write effective descriptions and instructions

## Creating the Skill

After studying the specification and best practices:

1. **Determine the skill location**:
   - Project skills: `.positai/skills/{skill-name}/SKILL.md`
   - User skills: `~/.positai/skills/{skill-name}/SKILL.md`
   - Built-in skills: `packages/core/skills/{skill-name}/SKILL.md`

2. **Create the directory structure**:
   ```
   skill-name/
   ├── SKILL.md           # Required: Main skill file
   ├── scripts/           # Optional: Executable scripts
   ├── references/        # Optional: Reference documentation
   └── assets/            # Optional: Supporting files
   ```

3. **Write the SKILL.md** with proper frontmatter and content following the specification

## Name Constraints

Skill names must:
- Be max 64 characters
- Use only lowercase letters, numbers, and hyphens
- Not start or end with hyphens
- Not contain consecutive hyphens (`--`)
- Match the parent directory name
