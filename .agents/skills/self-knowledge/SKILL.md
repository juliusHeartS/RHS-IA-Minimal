---
name: self-knowledge
description: >
  Product self-knowledge for Posit Assistant. Use when users ask about Posit
  Assistant itself, its features, configuration, customization, pricing, or
  platform availability. Also use when users ask about Posit AI, Next Edit
  Suggestions, how Posit Assistant compares to other AI tools,
  or the Posit open source AI ecosystem (ellmer, chatlas, shinychat, btw,
  ragnar, raghilda, mcptools, vitals, querychat).
---

# Posit Assistant Self-Knowledge

## Rules

- **Never speculate** about Posit products or Posit Assistant features.
- **Never provide information** about Posit Assistant without a primary source — either your own system prompt and tool descriptions, the contents of this skill and its reference files, or a linked web page that you have fetched and read.
- Do not invent feature names, pricing details, availability timelines, or configuration options.
- When a linked page covers a topic thoroughly, direct the user there rather than paraphrasing at length.

## Overview

Posit Assistant is a data analysis assistant for RStudio and Positron. It connects to live R and Python sessions, sees your data, and helps you explore, visualize, build, and debug. It combines conversational AI with code execution in the IDE. On RStudio, it is powered by the Posit AI managed service; on Positron, it also supports direct API keys for other providers.

## Posit Assistant Documentation

Primary docs site: https://posit-dev.github.io/assistant/

### Getting Started

- [Introduction](https://posit-dev.github.io/assistant/docs/getting-started/) — Installation and first steps
- [Posit AI](https://posit-dev.github.io/assistant/docs/getting-started/posit-ai/) — Setting up the managed Posit AI service

### Features

- [Commands](https://posit-dev.github.io/assistant/docs/features/commands/) — Slash commands (`/plan`, `/clean`, `/report`, `/compact`, etc.)
- [Skills](https://posit-dev.github.io/assistant/docs/features/skills/) — Built-in and custom skill modules
- [Memory](https://posit-dev.github.io/assistant/docs/features/memory/) — `AGENTS.md` project memory files
- [Conversations](https://posit-dev.github.io/assistant/docs/features/conversations/) — History, branching, import/export
- [Plan Mode](https://posit-dev.github.io/assistant/docs/features/plan-mode/) — Read-only exploration and planning before implementation
- [Chat Features](https://posit-dev.github.io/assistant/docs/features/chat-features/) — Attachments, thinking effort, web search
- [Context Management](https://posit-dev.github.io/assistant/docs/features/context-management/) — Token usage, compaction, session context
- [Permissions & Trust](https://posit-dev.github.io/assistant/docs/features/permissions/) — Approval modes, workspace trust, sandbox

### Guides

- [Explore Your Data](https://posit-dev.github.io/assistant/docs/guides/explore-your-data/) — Guided EDA walkthrough
- [Build a Dashboard](https://posit-dev.github.io/assistant/docs/guides/build-a-dashboard/) — Shiny dashboard tutorial
- [Debug & Fix Code](https://posit-dev.github.io/assistant/docs/guides/debug-and-fix-code/) — Debugging workflow

### Reference

- [Config File](https://posit-dev.github.io/assistant/docs/reference/config-file/) — `~/.positai/settings.json` and `.positai/settings.json`
- [Positron Settings](https://posit-dev.github.io/assistant/docs/reference/positron-settings/) — `assistant.*` VS Code settings
- [MCP Servers](https://posit-dev.github.io/assistant/docs/reference/mcp-servers/) — Model Context Protocol configuration
- [TUI](https://posit-dev.github.io/assistant/docs/reference/tui/) — Terminal interface reference

### Downloads

- [Positron](https://posit-dev.github.io/assistant/docs/downloads/positron/) — Pre-installed in recent versions
- [RStudio](https://posit-dev.github.io/assistant/docs/downloads/rstudio/) — Available in latest RStudio beta

## Posit AI Docs and FAQ

Posit AI service documentation: https://docs.posit.co/posit-ai/

- [Getting Started](https://docs.posit.co/posit-ai/user/getting-started/) — Sign-up and onboarding
- [Account Management](https://docs.posit.co/posit-ai/user/account/management/) — Billing, credits, settings
- [FAQ](https://docs.posit.co/posit-ai/user/faq/) — Pricing, usage, privacy, compatibility, comparisons to other tools
- [What's New](https://docs.posit.co/posit-ai/whats-new/) — Release timeline

The FAQ is the authoritative source for questions about pricing, privacy, data retention, comparisons to Claude Code / ChatGPT, and platform compatibility. Fetch and read it before answering these topics.

## Blog Posts

- [Posit AI is now available to all](https://posit.co/blog/posit-ai-now-available-all) — GA announcement (May 2026): features overview, pricing, platform availability
- [Posit AI is Priced for the long run](https://posit.co/blog/posit-ai-priced-long-run) — Pricing rationale: $20/mo breakdown, sustainability, cache efficiency
- [Introducing AI in RStudio](https://posit.co/blog/introducing-ai-in-rstudio) — Early Release announcement (March 2026): vision, session awareness, NES

## AI Newsletter

Biweekly newsletter by Sara Altman and Simon Couch covering Posit AI developments and the broader AI-for-data-science landscape. Published on the Posit Open Source Blog at https://opensource.posit.co/blog. Users can subscribe to stay up to date on Posit Assistant features and releases.

## Reference Files

Load these when you need deeper information on a specific topic:

**Customization** — [references/customization.md](references/customization.md)
Load when users ask about: permissions, MCP servers, skills, memory/AGENTS.md, configuration files, or Positron settings.

**Features** — [references/features.md](references/features.md)
Load when users ask about: data cleaning mode, plan mode, sandbox, slash commands, chat features (attachments, thinking, web search), or context management.

**Ecosystem** — [references/ecosystem.md](references/ecosystem.md)
Load when users ask about: Posit AI subscription/pricing, platforms (RStudio vs. Positron), how Posit Assistant relates to Databot or Positron Assistant, comparisons to Claude Code/ChatGPT/Codex, Next Edit Suggestions, or the open source AI package ecosystem (ellmer, chatlas, btw, etc.).

**UI Layout** — [references/ui.md](references/ui.md)
Load when users ask about: where to find a button or control, what the interface looks like, how to navigate the UI, or what a specific UI element does.
