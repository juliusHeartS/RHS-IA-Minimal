"""Proxies de herramientas protegidas cuya implementación vive en Positron."""

from __future__ import annotations

import json
import re
import threading
import uuid
from typing import Any

from tools.registry import registry, tool_error

_installed: set[str] = set()
_registration_lock = threading.RLock()

# Mirrors the host's explicit read-only surface, plus interface-only actions.
# Unknown host tools fail conservatively: they require a durable decision.
_NO_EFFECT_CONSENT = frozenset({
    "inspect_variables", "view_plot", "get_table_summary", "read_file", "list_files",
    "document_search", "web_search", "web_fetch", "attempt_completion", "search_files",
    "codebase_search", "read_command_output", "ask_user_question", "update_todo_list",
})

# These are product integration aliases, not replacements for native tools.
# Wire requests retain the host's historical names and therefore its approvals,
# workspace/task validation and Positron session binding.
HOST_TOOL_ALIASES = {
	"execute_code": "positron_execute_code",
    "read_file": "workspace_read_file",
    "search_files": "workspace_search_files",
    "web_search": "institutional_web_search",
}

# The runtime-facing name is explicit, while the extension keeps Cuy's
# historical wire/tool name for approvals and the Positron implementation.
HOST_TOOL_WIRE_NAMES = {
	"positron_execute_code": "execute_code",
	"workspace_read_file": "read_file",
	"workspace_search_files": "search_files",
	"institutional_web_search": "web_search",
}


def mother_tool_binding_header() -> str:
    """Render compatibility instructions without modifying protected skill files."""
    bindings = "; ".join(f"`{old}` → `{new}`" for old, new in HOST_TOOL_ALIASES.items())
    return (
        "[RHS-Agent — institutional skill tool bindings]\n"
        "This protected skill uses historical host tool names. In this skill only, "
        f"resolve those names as follows: {bindings}. "
        "The unprefixed native tools have different schemas and must not receive "
        "the legacy host arguments. Use positron_execute_code for the chat's live "
        "R/Python console; native execute_code is not a Positron session. "
        "A binding does not grant access to a tool absent from this turn.\n\n"
    )


def _invoke(name: str, args: dict, **kwargs) -> str:
    ledger = None
    approval_id = session_key = ""
    try:
        from capibara_session_context import get_session_env
        from tui_gateway.host_rpc import request
        try:
            from agent.runtime_cwd import resolve_context_cwd

            workspace = str(resolve_context_cwd() or "")
        except Exception:
            workspace = ""

        params = {
                "tool": name,
                "arguments": args,
                "sessionId": get_session_env("CAPIBARA_SESSION_ID", ""),
                "runtimeSessionId": get_session_env("CAPIBARA_UI_SESSION_ID", ""),
                "workspace": workspace,
            }
        consent = None
        if name not in _NO_EFFECT_CONSENT:
            from tools.approval_context import current_approval_identity
            from tools.approval_ledger import get_approval_ledger, redacted_approval_display
            identity = current_approval_identity()
            session_key = params["sessionId"]
            if not params["runtimeSessionId"] or not workspace:
                raise ValueError("Host invocation requires a live session and workspace")
            approval_id = "host-consent-" + uuid.uuid4().hex
            operation = {**params, "turnId": identity["turn_id"], "toolCallId": identity["tool_call_id"]}
            ledger = get_approval_ledger()
            ledger.register(approval_id, session_key, source="host", operation=operation,
                            display=redacted_approval_display({"tool": name}), choices=["once", "deny"],
                            turn_id=identity["turn_id"], tool_call_id=identity["tool_call_id"])
            params["approvalRequestId"] = approval_id
            params["turnId"] = identity["turn_id"]
            params["toolCallId"] = identity["tool_call_id"]
            consent = (ledger, operation, session_key)
        result = request("host.tool.invoke", params, consent=consent)
        if ledger is not None:
            record = ledger.find(approval_id, session_key)
            if record["state"] == "consumed":
                if isinstance(result, dict) and result.get("ok") is False:
                    ledger.close(approval_id, session_key, "uncertain")
                    return json.dumps({"error": str(result.get("error") or result.get("content")),
                                       "outcome_uncertain": True,
                                       "instruction": "Do not repeat automatically; verify the actual effect first."})
                ledger.finish(approval_id, session_key, result)
            elif record["state"] == "pending":
                # Parameter validation may return before the protected callback.
                if not isinstance(result, dict) or result.get("ok") is not False:
                    ledger.close(approval_id, session_key, "uncertain")
                    raise ValueError("Host reported success without durable consent")
                ledger.close(approval_id, session_key, "cancelled")
        if isinstance(result, dict) and result.get("ok") is False:
            return tool_error(str(result.get("error") or result.get("content") or "La herramienta del host falló"))
        content = result.get("content") if isinstance(result, dict) else result
        return content if isinstance(content, str) else json.dumps(content, ensure_ascii=False)
    except Exception as exc:
        if ledger is not None and approval_id:
            try:
                record = ledger.find(approval_id, session_key)
                uncertain = record["state"] in ("consumed", "uncertain")
                ledger.close(approval_id, session_key, "uncertain" if uncertain else "cancelled")
                if uncertain:
                    return json.dumps({"error": str(exc), "outcome_uncertain": True,
                                       "instruction": "Do not repeat automatically; verify the actual effect first."})
            except Exception:
                # A failed audit write after possible execution is never retry-safe.
                return json.dumps({"error": str(exc), "outcome_uncertain": True,
                                   "instruction": "Approval journal unavailable; verify the actual effect before retrying."})
        return tool_error(f"Herramienta protegida del host no disponible: {exc}")


def install_host_tools(definitions: list[dict[str, Any]]) -> list[str]:
    """Replace the host surface, without shadowing any native/plugin tool.

    Validate the complete incoming list before changing registrations. The RPC
    server serializes this method; the lock also keeps direct callers and the
    exposure snapshot consistent. Registry generation invalidates schema caches.
    """
    prepared: dict[str, tuple[str, str, dict]] = {}
    for definition in definitions:
        if not isinstance(definition, dict):
            raise ValueError("Cada definición del host debe ser un objeto")
        host_name = str(definition.get("name") or "").strip()
        description = str(definition.get("description") or "").strip()
        parameters = definition.get("input_schema")
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]{0,63}", host_name) or not isinstance(parameters, dict):
            raise ValueError("Nombre o esquema de herramienta del host inválido")
        name = HOST_TOOL_ALIASES.get(host_name, host_name)
        wire_name = HOST_TOOL_WIRE_NAMES.get(name, host_name)
        if name in prepared:
            raise ValueError(f"Nombre de herramienta duplicado: {name}")
        if host_name in {"execute_code", "positron_execute_code"}:
            description += " This is the live Positron analytical session, not the native execute_code executor."
        prepared[name] = (wire_name, description, parameters)
    with _registration_lock:
        for name in prepared:
            existing = registry.get_entry(name)
            if existing and (name not in _installed or existing.toolset != "capibara-host"):
                raise ValueError(f"El host no puede sustituir la herramienta existente: {name}")
        for name, (host_name, description, parameters) in prepared.items():
            registry.register(
                name=name,
                toolset="capibara-host",
                schema={"name": name, "description": description, "parameters": parameters},
                handler=lambda args, _name=host_name, **kwargs: _invoke(_name, args, **kwargs),
                description=description,
                emoji="🌱",
            )
        for stale in _installed - prepared.keys():
            existing = registry.get_entry(stale)
            if existing and existing.toolset == "capibara-host":
                registry.deregister(stale)
        _installed.clear()
        _installed.update(prepared)
        return list(prepared)


def installed_host_tool_names() -> set[str]:
    with _registration_lock:
        return set(_installed)
