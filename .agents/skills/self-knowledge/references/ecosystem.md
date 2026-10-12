# Ecosystem

## Product History

Posit Assistant evolved from two earlier products:

- **Positron Assistant** — A general-purpose coding assistant in Positron (the IDE). BYOK (bring-your-own-key) model. Helped write and modify code on disk, with agent mode for code execution.
- **Databot** — A specialized exploratory data analysis agent in Positron. Also BYOK. The more direct predecessor to Posit Assistant, though with a much more limited set of tools and functionality.

**Posit Assistant** combines the strengths of both — it is a full-spectrum data science and coding agent, not limited to EDA or general coding alone. It supersedes both Positron Assistant and Databot.

## Platforms

Posit Assistant runs on RStudio and Positron:

**RStudio:**
- Powered by the managed Posit AI service (no BYOK on desktop).
- RStudio itself remains free and open source; the AI features are a paid add-on.

**Positron:**
- Supports Posit AI and direct API keys for other providers (Anthropic, OpenAI, GitHub Copilot, Amazon Bedrock, and others listed in the public docs).

**Enterprise (Posit Workbench):**
BYOK support is available in preview for RStudio Pro and Positron Pro sessions on Posit Workbench 2026.04.0+, supporting Anthropic, AWS Bedrock, Azure Foundry, Google Vertex, and OpenAI.

## Posit AI

Posit AI is a subscription service that unlocks Posit Assistant and Next Edit Suggestions (NES) in RStudio.

- **$20/month**: $15 allocated to API credits for Posit Assistant, $5 covers fixed costs (primarily GPU for NES latency).
- **Free trial**: One-time $5 credit, no credit card required.
- **Credits**: Use-it-or-lose-it monthly; do not roll over. Optional auto-recharge when credits are exhausted.
- **NES**: Context-aware code completions from a specialized model (not a chatbot). Reflects loaded data frames, defined helpers, and imported packages. Unlimited usage on all plans.
- **Privacy**: Zero Data Retention agreement with Anthropic — prompts and responses deleted after generation, never used for model training. Users can opt in to trace data sharing for product improvement, but this is off by default.

Posit AI docs: https://docs.posit.co/posit-ai/
FAQ (pricing, privacy, compatibility): https://docs.posit.co/posit-ai/user/faq/

For detailed questions about pricing, credit usage, privacy/data handling, or compatibility, fetch and read the FAQ page — it is the authoritative source.

## Comparison to Other AI Tools

The Posit AI FAQ at https://docs.posit.co/posit-ai/user/faq/ contains authoritative answers to "How is Posit Assistant different from Claude Code?" and "How is Posit Assistant different from ChatGPT?" Always fetch the FAQ before answering comparison questions.

Key differentiators (from the FAQ and public blog posts):

- **vs. Claude Code or Codex or other agents**: Posit Assistant has direct access to live R and Python sessions, offers adaptive interaction styles (data cleaning mode), and provides data-science-specific prompting.
- **vs. ChatGPT and other web interfaces**: Posit Assistant is embedded in the IDE with live session access for real-time iteration, vs. web interfaces' isolated copy-paste workflow.

**Why not open source?** Revenue from commercial products like Posit AI funds Posit's open source work. The managed service model also allows tuning for quality and reliability. (See FAQ for full answer.)

## Open Source AI Ecosystem

Posit maintains open source packages for building AI-powered data science workflows. These are separate projects from Posit Assistant — they are not dependencies of the assistant codebase — but they share the same vision of making AI useful for data science.

### R Packages

- **ellmer** — LLM chat interface for R. Unified access to Anthropic, OpenAI, Google, AWS Bedrock, and more. Tool calling, streaming, structured data extraction. The foundation most other R packages build on. https://ellmer.tidyverse.org/
- **shinychat** — Chat UI components for Shiny apps. Handles message display, input, history, and rich tool-call UI. The front end to ellmer's back end. https://posit-dev.github.io/shinychat/
- **mcptools** — MCP for R. Use R as an MCP server (expose R functions as tools for LLM apps) or client (let ellmer chats use third-party MCP servers). https://posit-dev.github.io/mcptools/
- **btw** — Context toolkit connecting R and LLMs. Gathers session context (data structures, packages, docs) and exposes it via MCP, clipboard, or programmatic tool registration. The recommended MCP server for R sessions. https://posit-dev.github.io/btw/
- **ragnar** — RAG workflows in R. Document ingestion, heading-aware chunking, embedding generation, DuckDB storage, and retrieval. Integrates with ellmer. https://ragnar.tidyverse.org/
- **vitals** — LLM evaluation framework. Measure how well LLM products perform with tasks, datasets, solvers, and scorers. R port of Python's Inspect framework. https://vitals.tidyverse.org/
- **querychat** — Natural language to SQL for Shiny apps. Uses DuckDB so raw data is never sent to the LLM — only schema information. Built on ellmer and shinychat. https://posit-dev.github.io/querychat/

Note that shinychat and querychat are _also_ available in Python.

### Python Packages

- **chatlas** — LLM chat interface for Python, analogue of ellmer. Same unified interface for OpenAI, Anthropic, Google, and more. Tool calling, streaming, structured extraction, async support. Also includes basic support for evaluation and MCP. https://posit-dev.github.io/chatlas/
- **raghilda** — RAG workflows in Python, equivalent of ragnar. Document processing, semantic chunking, embedding, DuckDB/ChromaDB storage, and retrieval. https://posit-dev.github.io/raghilda/

### How These Relate to Posit Assistant

These packages and Posit Assistant are complementary:

- Posit Assistant is a managed product for interactive data analysis in the IDE.
- The open source packages let developers build their own AI-powered tools, apps, and workflows.

## Keeping Up with News

- **Posit Blog** (https://posit.co/blog): Major announcements, product launches, and technical deep-dives.
- **AI Newsletter**: Biweekly newsletter by Sara Altman and Simon Couch, covering Posit AI developments and the broader AI-for-data-science landscape. Published on the Posit Open Source Blog at https://opensource.posit.co/blog.
