# Features

## Data Cleaning Mode

Enter with `/clean`, or Posit Assistant can do so itself. This mode focuses on rapid data intake and cleaning. When activated, Posit Assistant:

1. **Audits the dataset** — examines column names, units of observation, duplicates, variable types and values, outliers, and data-entry errors.
2. **Drives decisions collaboratively** — every substantive cleaning decision (e.g., variable recoding, outlier handling, duplicate resolution) is presented to the user through the AskUser interface, often with a recommended action highlighted.
3. **Generates a cleaning script** — once all decisions are made, the entire cleaning workflow is converted into a reusable, documented script.

The mode is designed so that the user retains control over judgment calls while the assistant handles the mechanical work of inspection and code generation.

## Plan Mode

Docs: https://posit-dev.github.io/assistant/docs/features/plan-mode/

Enter with `/plan`, or Posit Assistant can do so itself. The assistant examines the codebase using read-only tools, asks clarifying questions, and generates a step-by-step plan document before making any code changes. Plans are saved to `.positai/plans/` in the project root (or `~/.positai/plans/`).

Best for: multi-step features spanning several files, complex refactoring, unfamiliar codebases, or tasks requiring significant architectural decisions.

## Sandbox Mode

Toggle with `/sandbox`, set `sandbox.enabled` in the config file, or click the shield icon. When enabled, OS-level enforcement is applied to bash tool execution:

- **macOS**: Uses Seatbelt (SBPL) sandboxing
- **Linux**: Uses bubblewrap
- **Windows**:: Uses a custom executable

**What sandbox restricts:**
- Filesystem writes limited to the workspace directory and a temporary directory
- Network access blocked
- Reading of sensitive paths blocked (`~/.ssh`, `~/.gnupg`, `~/.aws`)

Sandbox is off by default. The setting persists across sessions.

## Commands

Docs: https://posit-dev.github.io/assistant/docs/features/commands/

| Command | Description |
|---|---|
| `/report` | Create a Quarto document from the conversation |
| `/notebook` | Export conversation as a Jupyter notebook |
| `/savememory` | Create or update project memory file |
| `/compact` | Summarize conversation to reduce token usage |
| `/plan` | Enter Plan mode |
| `/clean` | Enter Data Cleaning mode |
| `/new` or `/clear` | Start a new conversation |
| `/context` | Show session context and token usage |
| `/about` | Show version and build info |
| `/trust` | Mark workspace as trusted |
| `/restricted` | Toggle restricted approval mode |
| `/sandbox` | Toggle sandbox mode |
| `/yolo` | Toggle auto-approve tool calls |

## Chat Features

Docs: https://posit-dev.github.io/assistant/docs/features/chat-features/

- **File attachments**: Drag-and-drop, paste images, paperclip button, or `@` file mentions to reference workspace files. 20MB max file size; text files injected up to 200KB.
- **Thinking effort**: Off / Low / Medium / High — controls how much reasoning the model does before responding. Available for models that support extended thinking.
- **Web search**: Toggle via the globe icon. When enabled, the assistant can search the web and cite sources inline. Availability depends on the model provider.
- **Image support**: Paste or attach images for models with vision capabilities.

## Context Management

Docs: https://posit-dev.github.io/assistant/docs/features/context-management/

- **Session context**: Automatically captures R/Python environment info (loaded packages, variable names and types, console history).
- **Token counter**: Status bar indicator with a detailed Session HUD showing token breakdown.
- **Auto-compaction**: Triggers when approaching the context limit (configurable via `autoCompactTokenBuffer`, default 30k tokens). Summarizes older messages to free space.
- **Micro-compaction**: Silently trims older tool results above a threshold (default 150k tokens, preserves the last 8 user turns).
- **Manual compaction**: `/compact` command to summarize on demand.

## Conversations

Docs: https://posit-dev.github.io/assistant/docs/features/conversations/

Conversations are auto-saved and support branching: editing an earlier message creates a new branch rather than overwriting history. Conversations can be exported to Markdown, HTML, or JSON, and imported from HTML or JSON.
