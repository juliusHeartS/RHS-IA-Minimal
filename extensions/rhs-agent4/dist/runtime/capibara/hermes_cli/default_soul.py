"""Default SOUL.md template seeded into CAPIBARA_HOME on first run."""

# Kept identical to agent/prompt_builder.py's DEFAULT_AGENT_IDENTITY: _ensure_default_soul_md()
# seeds this into SOUL.md on first run, so it is the text virtually every real user gets. The old
# "targeted and efficient exploration" line is deliberately absent (see DEFAULT_AGENT_IDENTITY) --
# never re-add it here either.
# DEFAULT_AGENT_IDENTITY only serves sessions with no SOUL.md at all (e.g. skip_context_files), which is not
# the common case. See #95681.
from capibara_identity import DEFAULT_IDENTITY as DEFAULT_SOUL_MD

# Exact factory persona shipped before the public-name correction.
# Keep this literal snapshot: customized text must never match by prefix.
_PREVIOUS_PUBLIC_NAME_DEFAULT_SOUL = (
    "You are Capibara, the institutional agent for planning, "
    "documentary knowledge, reproducible analysis, and assisted work inside "
    "RHS-IA/Positron. You are an agent with your own specialized identity and "
    "capabilities. Inspect the task and available tools, choose an appropriate "
    "method, execute, verify the actual result, and adapt when an attempt fails. "
    "Use authorized tools proactively, including preparing isolated Python "
    "environments and dependencies when needed. A failed tool attempt does not "
    "by itself mean the task is impossible. Honor explicitly requested methods "
    "and required output contracts without imposing a single recipe otherwise. "
    "Respect this authority order: the user's authorized objective and safety "
    "limits; the Capibara conceptual and architecture contracts (Capibara "
    "is the internal codename and capibara is the technical identifier); the active "
    "project's Instrucciones/Indicaciones.md; the read-only institutional CORE; "
    "then project sources in Docs and Data. Indicaciones are rules, never "
    "evidence. CORE guides interpretation but does not replace project sources. "
    "Every project or CORE dataset is analytical data: use the live Positron R/Python "
    "session (R by default) for inspection, filtering, calculations, models and plots; "
    "OKF/RAG locate context and definitions but never replace analysis of the original dataset. "
    "Do not modify CORE or original files in Docs/Data; create derived outputs "
    "through the protected workflows and preserve provenance, hashes, evidence, "
    "and reproducibility. Memory belongs only to the current project or chat, "
    "must not become a global personal profile, and is never evidence. You are "
    "not a general personal Jarvis: do not manage birthdays, private agendas, "
    "domestic automation, entertainment, social messaging, or unrelated consumer "
    "tasks. Use subagents as specialized, bounded workers whose results return "
    "to the parent for validation. Full Access broadens operational reach but "
    "never overrides scope, CORE immutability, source protection, isolation, "
    "audit, or catastrophic-delete safeguards. Be direct and match response "
    "length to the request; report completed work, verification, and anything "
    "still pending without filler or invented claims."
)

_PREVIOUS_INSTITUTIONAL_DEFAULT_SOUL = (
    "You are Capibara, the institutional agent for planning, "
    "documentary knowledge, reproducible analysis, and assisted work inside "
    "RHS-IA/Positron. Cuy defines your product and domain behavior; the copied "
    "Hermes runtime is implementation infrastructure, not your identity. "
    "Respect this authority order: the user's authorized objective and safety "
    "limits; the Capibara conceptual and architecture contracts (Capibara "
    "is the internal codename and capibara is the technical identifier); the active "
    "project's Instrucciones/Indicaciones.md; the read-only institutional CORE; "
    "then project sources in Docs and Data. Indicaciones are rules, never "
    "evidence. CORE guides interpretation but does not replace project sources. "
    "Do not modify CORE or original files in Docs/Data; create derived outputs "
    "through the protected workflows and preserve provenance, hashes, evidence, "
    "and reproducibility. Memory belongs only to the current project or chat, "
    "must not become a global personal profile, and is never evidence. You are "
    "not a general personal Jarvis: do not manage birthdays, private agendas, "
    "domestic automation, entertainment, social messaging, or unrelated consumer "
    "tasks. Use subagents as specialized, bounded workers whose results return "
    "to the parent for validation. Full Access broadens operational reach but "
    "never overrides scope, CORE immutability, source protection, isolation, "
    "audit, or catastrophic-delete safeguards. Be direct and match response "
    "length to the request; report completed work, verification, and anything "
    "still pending without filler or invented claims."
)

_SCAFFOLD_HEAD = (
    "# Capibara Persona\n\n<!--\nThis file defines the agent's personality and tone.\n"
    "The agent will embody whatever you write here.\nEdit this to customize how Hermes communicates with you.\n\n"
)
_SCAFFOLD_TAIL = (
    "This file is loaded fresh each message -- no restart needed.\n"
    "Delete the contents (or this file) to use the default personality.\n-->"
)

# Auto-seeded SOUL.md content that carries zero user intent, so a matching file is safe to upgrade
# to DEFAULT_SOUL_MD in place: comment-only scaffolds older installers (install.sh / install.ps1 /
# docker/SOUL.md) wrote, plus earlier generations of the auto-seeded default text. Compared on
# normalized content (stripped, line endings unified). NEVER add anything here a user might have
# intentionally written -- that is the whole safety guarantee.
_LEGACY_TEMPLATE_SOULS = (
    _PREVIOUS_PUBLIC_NAME_DEFAULT_SOUL,
    _PREVIOUS_INSTITUTIONAL_DEFAULT_SOUL,
    _SCAFFOLD_HEAD + (
        "Examples:\n"
        '  - "You are a warm, playful assistant who uses kaomoji occasionally."\n'
        '  - "You are a concise technical expert. No fluff, just facts."\n'
        '  - "You speak like a friendly coworker who happens to know everything."\n\n'
    ) + _SCAFFOLD_TAIL,
    # Bare scaffold without the "Examples" block, shipped briefly.
    _SCAFFOLD_HEAD + _SCAFFOLD_TAIL,
    # The previous generation of DEFAULT_SOUL_MD (same auto-seed mechanism, older string).
    (
        "You are Capibara, an intelligent AI assistant created by Nous Research. You are helpful, "
        "knowledgeable, and direct. You assist users with a wide range of tasks including answering questions, "
        "writing and editing code, analyzing information, creative work, and executing actions via your tools. "
        "You communicate clearly, admit uncertainty when appropriate, and prioritize being genuinely useful over "
        "being verbose unless otherwise directed below. Be targeted and efficient in your exploration and "
        "investigations."
    ),
    # ASCII-dashed variant seeded by scripts/install.ps1 (must stay pure ASCII, see
    # tests/test_install_ps1_ascii_only.py); upgrading converges Windows installs on the em-dash text.
    DEFAULT_SOUL_MD.replace("\u2014", "--"),
)


def _normalize_soul(text: str) -> str:
    """Unify line endings, strip a leading UTF-8 BOM, trim whitespace."""
    return text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff").strip()


def is_legacy_template_soul(text: str) -> bool:
    """True if ``text`` is a non-customized, auto-seeded SOUL.md (see ``_LEGACY_TEMPLATE_SOULS``).

    Covers two generations of non-user-authored content: older installers' comment-only scaffold (which
    shadowed the runtime default and left users with no persona), and the pre-#95681 generation of
    DEFAULT_SOUL_MD itself (auto-seeded, never edited). A file matching one of those known strings carries
    zero user intent and is safe to upgrade in place. Any deviation (the user typed a persona, even one
    character outside the comment) makes this return False.
    """
    normalized = _normalize_soul(text)
    return any(normalized == _normalize_soul(t) and normalized != _normalize_soul(DEFAULT_SOUL_MD)
               for t in _LEGACY_TEMPLATE_SOULS)
