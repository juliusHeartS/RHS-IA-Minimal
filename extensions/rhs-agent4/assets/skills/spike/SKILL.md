---
name: spike
modeSlugs: [code]
description: Throwaway experiments to validate an idea before a real build. Use when the user wants to feel out an idea, compare approaches, or surface unknowns — "let me try this", "is this even possible?", "compare A vs B", "quick prototype of Z".
version: "1.0.0-capibara"
author: Cuy (adapted from Hermes Agent / GSD get-shit-done)
license: MIT
metadata:
  author: Cuy (adaptado de Hermes Agent / GSD get-shit-done)
  version: "1.0"
  prompt-visible: false
policy: explicit-only
---

# Spike

Use this skill when the user wants to **feel out an idea** before committing to a real build — validating feasibility, comparing approaches, or surfacing unknowns that no amount of research will answer. Spikes are disposable by design. Throw them away once they've paid their debt.

Load this when the user says things like "let me try this", "I want to see if X works", "spike this out", "before I commit to Y", "quick prototype of Z", "is this even possible?", or "compare A vs B".

## When NOT to use

- The answer is knowable from docs or reading code — just do research, don't build.
- The work is production path — use the `plan` skill instead.
- The idea is already validated — jump straight to implementation.

## Core method

Regardless of scale, every spike follows this loop:

```
decompose  →  research  →  build  →  verdict
   ↑__________________________________________↓
                  iterate on findings
```

### 1. Decompose

Break the user's idea into **2-5 independent feasibility questions**. Each question is one spike. Present them as a table with Given/When/Then framing:

| # | Spike | Validates (Given/When/Then) | Risk |
|---|-------|----------------------------|------|
| 001 | websocket-streaming | Given a WS connection, when LLM streams tokens, then client receives chunks < 100ms | High |
| 002a | pdf-parse-pdfjs | Given a multi-page PDF, when parsed with pdfjs, then structured text is extractable | Medium |
| 002b | pdf-parse-camelot | Given a multi-page PDF, when parsed with camelot, then structured text is extractable | Medium |

**Spike types:**
- **standard** — one approach answering one question
- **comparison** — same question, different approaches (shared number, letter suffix `a`/`b`/`c`)

**Good spike questions:** specific feasibility with observable output.
**Bad spike questions:** too broad, no observable output, or just "read the docs about X".

**Order by risk.** The spike most likely to kill the idea runs first.

**Skip decomposition** only if the user already knows exactly what they want to spike and says so.

### 2. Align (for multi-spike ideas)

Present the spike table. Ask: "Build all in this order, or adjust?" Let the user drop, reorder, or re-frame before you write any code.

### 3. Research (per spike, before building)

Spikes are not research-free — you research enough to pick the right approach, then you build. Per spike:

1. **Brief it.** 2-3 sentences: what this spike is, why it matters, key risk.
2. **Surface competing approaches** if there's real choice:

   | Approach | Tool/Library | Pros | Cons | Status |
   |----------|-------------|------|------|--------|
   | ... | ... | ... | ... | maintained / abandoned / beta |

3. **Pick one.** State why. If 2+ are credible, build quick variants within the spike.
4. **Skip research** for pure logic with no external dependencies.

Use capibara tools for the research step:
- `web_search` — find candidate libraries/approaches (when the web toggle is enabled).
- `web_fetch` — read the actual docs pages (returns readable Markdown).
- `execute_command` — check what's installed: `Rscript -e "library(x); packageVersion('x')"`, `python3 -c "import x; print(x.__version__)"`, `cargo --version`, `pnpm list`.

For libraries without docs pages, clone or fetch their `README.md` / `examples/` via `web_fetch` and read with `read_file`.

### 4. Build

One directory per spike. Keep it standalone.

```
spikes/
├── 001-websocket-streaming/
│   ├── README.md
│   └── main.py
├── 002a-pdf-parse-pdfjs/
│   ├── README.md
│   └── parse.js
└── 002b-pdf-parse-camelot/
    ├── README.md
    └── parse.py
```

**Bias toward something the user can interact with.** Spikes fail when the only output is a log line that says "it works." The user wants to *feel* the spike working. Default choices, in order of preference:

1. A runnable script/CLI that takes input and prints observable output
2. A minimal HTML page that demonstrates the behavior
3. A small web server with one endpoint
4. A unit test that exercises the question with recognizable assertions

**Depth over speed.** Never declare "it works" after one happy-path run. Test edge cases. Follow surprising findings. The verdict is only trustworthy when the investigation was honest.

**Avoid** unless the spike specifically requires it: complex package management, build tools/bundlers, Docker, env files, config systems. Hardcode everything — it's a spike.

**Building one spike** — a typical tool sequence (capibara):
- Create the dir and files with `write_to_file` (or `execute_code` writing files from the active session).
- Run the spike with `execute_code` (R/Python in Positron) or `execute_command` (shell/JS/Rust). When `execute_command` is unavailable, ask the user to run it and paste the output.
- Observe output, iterate.

**Comparison spikes (002a / 002b) — build sequentially, in line.** Cuy has no `delegate_task`, so build each variant yourself, one after the other, then write the head-to-head. Keep each variant small enough that sequential building is cheap.

### 5. Verdict

Each spike's `README.md` closes with:

```markdown
## Verdict: VALIDATED | PARTIAL | INVALIDATED

### What worked
- ...

### What didn't
- ...

### Surprises
- ...

### Recommendation for the real build
- ...
```

**VALIDATED** = the core question was answered yes, with evidence.
**PARTIAL** = it works under constraints X, Y, Z — document them.
**INVALIDATED** = doesn't work, for this reason. This is a successful spike.

## Comparison spikes

When two approaches answer the same question (002a / 002b), build them **back to back**, then do a head-to-head comparison:

```markdown
## Head-to-head: pdfjs vs camelot

| Dimension | pdfjs (002a) | camelot (002b) |
|-----------|--------------|----------------|
| Extraction quality | 9/10 structured | 7/10 table-only |
| Setup complexity | npm install, 1 line | pip + ghostscript |
| Perf on 100-page PDF | 3s | 18s |
| Handles rotated text | no | yes |

**Winner:** pdfjs for our use case. Camelot if we need table-first extraction later.
```

## Frontier mode (picking what to spike next)

If spikes already exist and the user says "what should I spike next?", walk the existing directories (`list_files spikes/`) and look for:
- **Integration risks** — two validated spikes that touch the same resource but were tested independently
- **Data handoffs** — spike A's output was assumed compatible with spike B's input; never proven
- **Gaps in the vision** — capabilities assumed but unproven
- **Alternative approaches** — different angles for PARTIAL or INVALIDATED spikes

Propose 2-4 candidates as Given/When/Then. Let the user pick.

## Output

- Create `spikes/` (or `.capibara/spikes/` if the user prefers capibara conventions) in the workspace root.
- One dir per spike: `NNN-descriptive-name/`.
- `README.md` per spike captures question, approach, results, verdict.
- Keep the code throwaway — a spike that takes 2 days to "clean up for production" was a bad spike.

## Attribution

Adapted from the GSD (Get Shit Done) project's `/gsd-spike` workflow — MIT © 2025 Lex Christopherson ([gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done)).
