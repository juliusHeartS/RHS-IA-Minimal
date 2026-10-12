# Customization

## Permissions & Trust

Docs: https://posit-dev.github.io/assistant/docs/features/permissions/

Three approval modes control how tool calls are authorized:

- **Normal** (default): Safe operations (reading files, listing directories) auto-approved; risky operations (editing files, running shell commands) prompt for confirmation.
- **YOLO** (`/yolo`): Auto-approve most operations. Explicitly dangerous operations and deny rules still enforced.
- **Restricted** (`/restricted`): Every operation requires confirmation.

When prompted, users can approve for: a single action, the current session, or persistently for the project (saved to `.positai/settings.json`).

Per-tool permission rules use glob patterns for fine-grained control. Built-in security defaults block reading `.env` and `.Renviron` files. Deny rules are enforced even in YOLO mode.

**Workspace trust**: Projects containing `AGENTS.md` or `.positai/settings.json` trigger a trust prompt on first open. In restricted mode, memory files are not loaded and project config is excluded.

## MCP Servers

Docs: https://posit-dev.github.io/assistant/docs/reference/mcp-servers/

MCP (Model Context Protocol) servers are external tool servers whose tools become available alongside built-in tools. Configured under the `mcpServers` key in settings files.

**Configuration locations:**
- Global: `~/.positai/settings.json`
- Project: `.positai/settings.json`

**Server types:**
- **Local**: Subprocess over stdio. Requires a `command` array; optional `environment`, `enabled`, `timeout`.
- **Remote**: HTTP or SSE. Requires a `url`; optional `headers`, `transport`, `auth`, `enabled`, `timeout`.

**Auth methods for remote servers:** Bearer tokens (with `{env:VAR_NAME}` substitution for secrets), OAuth with dynamic registration (RFC 7591), and pre-registered OAuth clients (`clientId` + `clientSecret`).

Tool names follow the pattern `mcp__<server-name>__<tool-name>`. Set `enabled: false` to disable a server without removing its config.

Example local MCP server config:

```json
{
  "mcpServers": {
    "my-server": {
      "command": ["npx", "-y", "@example/mcp-server"],
      "environment": {
        "API_KEY": "{env:MY_API_KEY}"
      }
    }
  }
}
```

## Skills

Docs: https://posit-dev.github.io/assistant/docs/features/skills/

Skills are specialized knowledge modules that auto-load based on request context. There are a number of built-in skills (which you can see in your existing context).

**Custom skills** can be added at:
- Project level: `.positai/skills/{skill-name}/SKILL.md`
- User level: `~/.positai/skills/{skill-name}/SKILL.md`

Project skills override user skills; both override built-in skills of the same name. Custom skills follow the Agent Skills specification at https://agentskills.io.

Each skill directory contains a required `SKILL.md` with YAML frontmatter (`name` and `description` fields) and optional `scripts/`, `references/`, and `assets/` subdirectories.

## Memory

Docs: https://posit-dev.github.io/assistant/docs/features/memory/

Posit Assistant loads project memory from an `AGENTS.md` file in the project root at the start of every conversation (in trusted workspaces). This file can contain project-specific instructions, coding conventions, and context.

- Create or update via `/savememory` or by editing the file directly.
- Reference other markdown files with `@filename.md` include syntax.
- Only loaded in trusted workspaces.

## Configuration

**Config file reference:** https://posit-dev.github.io/assistant/docs/reference/config-file/

Two config file locations:
- **Global**: `~/.positai/settings.json` — applies to all projects
- **Project**: `.positai/settings.json` — project-specific overrides

Key settings include: `model.id`, `model.provider`, `model.thinkingEffort`, `model.webSearch`, `permission`, `mcpServers`, `sandbox.enabled`, runtime paths, and per-provider connection settings under `providers.{provider}` (`baseUrl` for custom endpoints, `customHeaders` for extra HTTP headers attached to every request — useful for enterprise gateways like Databricks). In Positron, the equivalents are `authentication.{provider}.baseUrl` and `authentication.{provider}.customHeaders`.

**Positron settings reference:** https://posit-dev.github.io/assistant/docs/reference/positron-settings/

Positron uses VS Code-style settings with the `assistant.*` prefix: `assistant.enabled`, `assistant.preferredModel`, `assistant.modelRouting`, `assistant.enableCopilotSdk`, `assistant.sidebarView`, `assistant.experimentalFeatures`, `assistant.mcpServers`, `assistant.aiExcludes`.
