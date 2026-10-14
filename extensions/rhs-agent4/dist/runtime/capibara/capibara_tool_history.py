"""Versioned interpretation of the product's historical host-tool identifiers.

SQLite remains canonical. This adapter changes only replay projections; raw
rows, arguments, results and provider sidecars retain their original contents.
"""
from __future__ import annotations

from copy import deepcopy

TOOL_SURFACE_VERSION = 1
VERSION_KEY = "_capibara_tool_surface_version"


def validate_tool_surface_version(value: object) -> int:
    # bool is an int subclass, but not a meaningful schema version.
    if type(value) is not int or value < 0 or value > TOOL_SURFACE_VERSION:
        raise ValueError(f"Versión de herramientas del historial no compatible: {value!r}")
    return value


def project_tool_history(message: dict, *, source: str, version: int) -> dict:
    """Return a replay-safe copy. Never infer provenance from the tool arguments."""
    result = deepcopy(message)
    if source != "capibara-extension":
        result[VERSION_KEY] = version
        return result
    validate_tool_surface_version(version)
    result[VERSION_KEY] = TOOL_SURFACE_VERSION
    if version == TOOL_SURFACE_VERSION:
        return result

    from tools.capibara_host_tools import HOST_TOOL_ALIASES

    def rename(item: dict, key: str = "name") -> None:
        name = item.get(key)
        if isinstance(name, str) and name in HOST_TOOL_ALIASES:
            item[key] = HOST_TOOL_ALIASES[name]

    if result.get("role") == "tool":
        rename(result, "tool_name")
        rename(result)  # importers may use the OpenAI role=tool/name spelling.
    if result.get("role") == "assistant":
        calls = result.get("tool_calls")
        for call in calls if isinstance(calls, list) else ():
            if not isinstance(call, dict):
                continue
            if isinstance(call.get("function"), dict):
                rename(call["function"])
            elif call.get("type") == "function_call":
                rename(call)
        # Typed tool-use content is distinct from prose and arbitrary tool JSON.
        content = result.get("content")
        for part in content if isinstance(content, list) else ():
            if isinstance(part, dict) and part.get("type") in {"tool_use", "function_call"}:
                rename(part)
        items = result.get("codex_message_items")
        for part in items if isinstance(items, list) else ():
            if isinstance(part, dict) and part.get("type") == "function_call":
                rename(part)
    return result
