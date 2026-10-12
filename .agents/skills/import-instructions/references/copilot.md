# GitHub Copilot / VS Code Source Formats

## copilot-instructions.md

Plain markdown, no frontmatter. Contains general project-level instructions for Copilot.

```markdown
When working on this project, follow these conventions:
- Use TypeScript strict mode
- Prefer functional components with hooks
...
```

## AGENTS.md

Plain markdown, no frontmatter. In Copilot/VS Code, same role as `copilot-instructions.md` but uses the newer naming convention. Nested `AGENTS.md` files in subdirectories scope to that subtree in Copilot.

In Posit Assistant, `AGENTS.md` at the workspace root is automatically loaded as project-level context for every conversation. It does not read nested `AGENTS.md` files.

## *.instructions.md

YAML frontmatter with `description` (when to apply) and optional `applyTo` (glob pattern for automatic application to matching files):

```yaml
---
description: "Rules for writing unit tests"
applyTo: "**/*.test.ts"
---

Use vitest for all tests. Prefer `describe`/`it` blocks.
Always include at least one assertion per test.
```

When `applyTo` is present, the instructions are automatically included when the user is working with matching files. When absent, the instructions are available on-demand.

## *.prompt.md

YAML frontmatter with `description` and optional `mode` field. Body is a reusable prompt template:

```yaml
---
description: "Generate a React component with tests"
mode: "agent"
---

Create a new React component named ${{name}} in the appropriate directory.
Include unit tests and a Storybook story.
```

The `${{variable}}` syntax defines prompt parameters the user fills in.

## *.agent.md

YAML frontmatter defining a custom agent persona with `description`, optional `tools`, and optional `instructions` fields:

```yaml
---
description: "Database migration specialist"
tools:
  - codebase
  - terminal
instructions:
  - file: .github/instructions/sql-conventions.instructions.md
---

You are a database migration specialist. When writing migrations:
- Always include both up and down migrations
- Use transactions for data migrations
```

Agents can reference other instruction files via the `instructions` field.

## Settings-based instructions

Found in `.vscode/settings.json` under `github.copilot.chat.*` keys. Each setting is an array of instruction entries:

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    { "text": "Use TypeScript strict mode for all new files" },
    { "file": ".github/instructions/style.md" },
    { "text": "Prefer early returns", "language": "typescript" }
  ]
}
```

Entry types:
- `{ text: string }` — inline instruction text
- `{ file: string }` — path to a file containing instructions (relative to workspace root)
- Optional `language` field — restricts the instruction to a specific language context
