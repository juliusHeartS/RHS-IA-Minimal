"""Contrato JSON-RPC público de RHS-Agent sobre el motor TUI copiado.

Los handlers de Hermes permanecen disponibles como implementación interna.
Esta capa fija los nombres, versiones y errores que consume rhs-agent4.
"""

from __future__ import annotations

import os
import platform
import sys
import time

from .method_ctx import HandlerRegistry
from .event_replay import replay_epoch as _replay_epoch

_registry = HandlerRegistry()
method = _registry.method

PROTOCOL_VERSION = 1
RUNTIME_VERSION = "4.0.0"
_EXCLUDED_PUBLIC_METHODS = {
    "billing.auto_reload",
    "billing.charge",
    "billing.charge_status",
    "billing.state",
    "billing.step_up",
    "browser.controller.detach",
    "browser.controller.heartbeat",
    "browser.controller.register",
    "browser.controller.result",
    "browser.manage",
    "cli.exec",
    "clipboard.paste",
    "diagnostics.share_nous",
    "gateway.capabilities",
    "handoff.fail",
    "handoff.request",
    "handoff.state",
    "image.generate",
    "message.react",
	"mcp.catalog",
	"mcp.servers.add",
	"mcp.servers.list",
	"mcp.servers.oauth.callback",
	"mcp.servers.oauth.poll",
	"mcp.servers.oauth.start",
	"mcp.servers.remove",
	"mcp.servers.set_api_key",
	"mcp.servers.test",
	"mcp.setup.respond",
    "model.save_key",
    "pet.cancel",
    "pet.cells",
    "pet.disable",
    "pet.export",
    "pet.gallery",
    "pet.generate",
    "pet.generate.status",
    "pet.hatch",
    "pet.info",
    "pet.info.meta",
    "pet.remove",
    "pet.rename",
    "pet.scale",
    "pet.select",
    "pet.thumb",
	"plugins.list",
	"plugins.manage",
	"preview.act.respond",
	"preview.read.respond",
	"preview.restart",
	"profiles.configure",
	"profiles.create",
	"profiles.describe",
	"profiles.get_asset",
	"profiles.list",
	"profiles.set_asset",
	"reload.mcp",
	"shell.exec",
    "subscription.change",
    "subscription.preview",
    "subscription.resume",
    "subscription.state",
    "subscription.upgrade",
	"system.battery",
	"tour.respond",
    "voice.record",
    "voice.toggle",
    "voice.tts",
    "wake.feed",
    "wake.pause",
    "wake.resume",
    "wake.start",
    "wake.status",
    "wake.stop",
	"window.read.respond",
}
_runtime_state: dict = {
    "initialized": False,
    "extension": {},
    "workspace": {},
    "capabilities": {},
    "started_at": time.time(),
}


def _alias(rid, params: dict, target: str, methods: dict, error):
    handler = methods.get(target)
    if handler is None:
        return error(rid, -32601, f"Método interno no disponible: {target}")
    return handler(rid, params)


def _project_scoped_alias(rid, params: dict, target: str, methods: dict, error):
    """Run management RPCs against the owning chat's project-local profile."""
    session_id = str(params.get("session_id") or "")
    from tui_gateway import server

    session = server._sessions.get(session_id) if session_id else None
    profile_home = session.get("profile_home") if session else None
    if not profile_home:
        return _alias(rid, params, target, methods, error)
    from hermes_constants import reset_hermes_home_override, set_hermes_home_override

    token = set_hermes_home_override(str(profile_home))
    try:
        return _alias(rid, params, target, methods, error)
    finally:
        reset_hermes_home_override(token)


def _unavailable(rid, capability: str, error):
    return error(
        rid,
        -32004,
        f"capability_unavailable: {capability}",
        {"capability": capability, "deferred": True},
    )


@method("runtime.initialize")
def _(
    rid,
    params: dict,
    _state=_runtime_state,
    _protocol=PROTOCOL_VERSION,
    _runtime_version=RUNTIME_VERSION,
    _platform=platform,
    _sys=sys,
    _os=os,
    _epoch=_replay_epoch,
) -> dict:
    requested = params.get("protocolVersion")
    if requested != _protocol:
        return _err(
            rid,
            -32001,
            f"Versión de protocolo incompatible: extensión={requested!r}, runtime={_protocol}",
            {"acceptedProtocolVersion": _protocol},
        )
    _state["initialized"] = True
    _state["extension"] = {
        "version": params.get("extensionVersion"),
        "instanceId": params.get("extensionInstanceId"),
        "host": params.get("host"),
        "locale": params.get("locale"),
        "accessProfile": params.get("accessProfile"),
        "approvalPolicy": params.get("approvalPolicy"),
    }
    _state["capabilities"] = dict(params.get("capabilities") or {})
    return _ok(
        rid,
        {
            "name": "RHS-Agent",
            "runtimeVersion": _runtime_version,
            "protocolVersion": _protocol,
            "runtimeEpoch": _epoch(),
            "python": {
                "version": _platform.python_version(),
                "executable": _sys.executable,
                "platform": _sys.platform,
            },
            "state": "ready",
            "migrations": {"status": "ready", "error": _db_error},
            "capabilities": {
                "sessions": True,
                "streaming": True,
                "approvals": True,
                "memory": True,
                "skills": True,
                "subagents": True,
                "cron": True,
                "mcp": False,
                "hostTools": bool(_state.get("capabilities", {}).get("hostTools")),
                "eventReplay": True,
            },
            "methods": sorted(_methods),
            "capibaraHome": _os.environ.get("CAPIBARA_HOME"),
        },
    )


@method("runtime.health")
def _(rid, params: dict, _state=_runtime_state, _time=time, _epoch=_replay_epoch) -> dict:
    return _ok(
        rid,
        {
            "ok": True,
            "initialized": bool(_state.get("initialized")),
            "uptimeSeconds": max(0.0, _time.time() - float(_state["started_at"])),
            "runtimeEpoch": _epoch(),
            "sessions": len(_sessions),
            "database": "ready" if _db_error is None else "error",
            "databaseError": _db_error,
        },
    )


@method("runtime.shutdown")
def _(rid, params: dict) -> dict:
    from .chatgpt_auth import auth
    auth.stop()
    # El supervisor cierra stdin/termina el hijo después de recibir este ACK.
    return _ok(rid, {"accepted": True})


@method("workspace.bind")
def _(rid, params: dict, _state=_runtime_state) -> dict:
    workspace = {
        "workspaceId": params.get("workspaceId"),
        "path": params.get("path"),
        "folders": list(params.get("folders") or []),
        "projectId": params.get("projectId"),
    }
    _state["workspace"] = workspace
    capabilities = dict(_state.get("capabilities") or {})
    capabilities.update(dict(params.get("capabilities") or {}))
    _state["capabilities"] = capabilities
    return _ok(rid, {"bound": True, "workspace": workspace})


@method("workspace.capabilities.update")
def _(rid, params: dict, _state=_runtime_state) -> dict:
    capabilities = dict(_state.get("capabilities") or {})
    capabilities.update(dict(params.get("capabilities") or {}))
    _state["capabilities"] = capabilities
    return _ok(rid, {"updated": True, "capabilities": _state["capabilities"]})


@method("session.context.update")
def _(rid, params: dict) -> dict:
    """Refresh the Cuy institutional contract on the existing Hermes session.

    The context is ephemeral and supplied by the extension for every turn; it
    is not a second memory store and is never used to replace Hermes' durable
    chat history.
    """
    from tui_gateway import server

    session, err = server._sess(params, rid)
    if err:
        return err
    if session.get("running"):
        return _err(rid, 4009, "session busy")
    context = params.get("context")
    if not isinstance(context, str) or not context.strip():
        return _err(rid, 4004, "context required")
    context = context.strip()
    session["capibara_context"] = context
    decision = params.get("decision")
    if isinstance(decision, dict):
        # Structured supervisor state is ephemeral turn routing, not memory.
        # The native Hermes loop remains the planner; model_tools uses this only
        # to prevent a live Positron analysis from falling into native execute_code.
        session["capibara_decision"] = dict(decision)
    agent = session.get("agent")
    if agent is not None:
        base = str(getattr(agent, "_capibara_base_ephemeral_system_prompt", "") or "")
        agent._capibara_context = context
        if isinstance(decision, dict):
            agent._capibara_decision = dict(decision)
        agent.ephemeral_system_prompt = "\n\n".join(part for part in (base, context) if part)
    return _ok(rid, {"updated": True, "length": len(context)})


@method("host.tools.register")
def _(rid, params: dict) -> dict:
    from tools.capibara_host_tools import install_host_tools

    definitions = params.get("definitions")
    if not isinstance(definitions, list):
        return _err(rid, -32602, "definitions debe ser una lista")
    try:
        installed = install_host_tools(definitions)
    except ValueError as exc:
        return _err(rid, -32602, str(exc))
    return _ok(rid, {"installed": installed, "count": len(installed)})


@method("host.tools.probe")
def _(rid, params: dict) -> dict:
    """Comprueba el transporte inverso usando el mismo método que las tools.

    No ejecuta una herramienta local ni omite la política del host: Positron
    recibe y valida ``host.tool.invoke`` exactamente como durante un turno.
    Es útil para diagnóstico y para probar el paquete antes de involucrar al
    modelo, que podría decidir legítimamente no producir un tool call.
    """
    from tui_gateway.host_rpc import HostRpcError, request

    try:
        result = request(
            "host.tool.invoke",
            {
                "tool": params.get("tool"),
                "arguments": params.get("arguments") or {},
                "sessionId": params.get("sessionId") or "",
                "runtimeSessionId": params.get("runtimeSessionId") or "",
                "workspace": params.get("workspace") or "",
            },
            timeout=float(params.get("timeout") or 30.0),
        )
    except HostRpcError as exc:
        return _err(rid, -32011, f"host bridge: {exc}")
    return _ok(rid, {"ok": True, "response": result})


@method("session.search")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    # session.list ya consulta la base autoritativa. El filtrado textual más
    # rico se incorporará sobre FTS sin crear una segunda transcripción.
    return _alias_fn(rid, params, "session.list", _methods, _err)


@method("session.fork")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    return _alias_fn(rid, params, "session.branch", _methods, _err)


@method("session.export")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    return _alias_fn(rid, params, "session.save", _methods, _err)


@method("session.truncate")
def _(rid, params: dict) -> dict:
    """Elimina un turno de usuario y toda su cola usando el rewind seguro.

    Hermes ya contiene la transacción durable y las verificaciones contra
    carreras; esta superficie separada permite que la UI borre sin fabricar un
    nuevo prompt. Se exige identidad durable de fila además del ordinal.
    """
    session, err = _sess(params, rid)
    if err:
        return err
    if session.get("running"):
        return _err(rid, 4009, "session busy")
    row_id = params.get("row_id")
    ordinal = params.get("user_ordinal")
    if not isinstance(row_id, int) or isinstance(row_id, bool):
        return _err(rid, 4004, "row_id durable requerido")
    if not isinstance(ordinal, int) or isinstance(ordinal, bool) or ordinal < 0:
        return _err(rid, 4004, "user_ordinal válido requerido")
    with session["history_lock"]:
        if session.get("running"):
            return _err(rid, 4009, "session busy")
        history = _history_without_ephemeral_scaffolding(session.get("history", []))
        found = _resolve_truncate_row_id(session, history, row_id)
        if found is None:
            return _err(rid, 4018, "target user message is no longer in session history")
        resolved_ordinal, _ = found
        if resolved_ordinal != ordinal:
            return _err(rid, 4030, "user_ordinal no coincide con row_id")
        try:
            installed, _removed_turn, rewound_count = _rewind_active_session_history(
                session, ordinal
            )
        except Exception as exc:
            return _err(rid, 5008, f"truncate: {exc}")
    _emit("sessions.changed", "", {})
    return _ok(
        rid,
        {
            "removed": rewound_count,
            "count": len(installed),
            "messages": _history_to_messages(installed),
        },
    )


@method("prompt.cancel")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    return _alias_fn(rid, params, "session.interrupt", _methods, _err)


@method("prompt.steer")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    return _alias_fn(rid, params, "session.steer", _methods, _err)


@method("question.respond")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    return _alias_fn(rid, params, "clarify.respond", _methods, _err)


@method("config.get")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    return _alias_fn(rid, params, "config.show", _methods, _err)


@method("config.patch")
def _(rid, params: dict, _unavailable_fn=_unavailable) -> dict:
    return _unavailable_fn(rid, "config.patch", _err)


@method("providers.list")
def _(rid, params: dict, _unavailable_fn=_unavailable) -> dict:
    return _unavailable_fn(rid, "providers.list", _err)


@method("models.list")
def _(rid, params: dict, _unavailable_fn=_unavailable) -> dict:
    return _unavailable_fn(rid, "models.list", _err)


@method("skills.list")
def _(rid, params: dict, _alias_fn=_project_scoped_alias) -> dict:
    return _alias_fn(rid, {**params, "action": "list"}, "skills.manage", _methods, _err)


@method("skills.inspect")
def _(rid, params: dict, _alias_fn=_project_scoped_alias) -> dict:
    return _alias_fn(rid, {**params, "action": "show"}, "skills.manage", _methods, _err)


@method("skills.install.request")
def _(rid, params: dict, _unavailable_fn=_unavailable) -> dict:
    return _unavailable_fn(rid, "skills.install.request", _err)


@method("cron.list")
def _(rid, params: dict, _alias_fn=_project_scoped_alias) -> dict:
    return _alias_fn(rid, {**params, "action": "list"}, "cron.manage", _methods, _err)


for _public_method, _action in (
    ("cron.create", "add"),
    ("cron.update", "edit"),
    ("cron.run", "run"),
    ("cron.pause", "pause"),
    ("cron.delete", "remove"),
):
    def _cron(rid, params: dict, action=_action, alias_fn=_project_scoped_alias):
        return alias_fn(rid, {**params, "action": action}, "cron.manage", _methods, _err)

    method(_public_method)(_cron)


@method("subagents.list")
def _(rid, params: dict, _alias_fn=_alias) -> dict:
    return _alias_fn(rid, params, "delegation.status", _methods, _err)


@method("mcp.list")
def _(rid, params: dict, _unavailable_fn=_unavailable) -> dict:
    return _unavailable_fn(rid, "mcp.list", _err)


@method("mcp.inspect")
def _(rid, params: dict, _unavailable_fn=_unavailable) -> dict:
    return _unavailable_fn(rid, "mcp.inspect", _err)


@method("mcp.connect.request")
def _(rid, params: dict, _unavailable_fn=_unavailable) -> dict:
    return _unavailable_fn(rid, "mcp.connect.request", _err)


@method("provider.chatgpt.status")
def _(rid, params: dict) -> dict:
    from .chatgpt_auth import auth
    return _ok(rid, auth.status())


@method("provider.chatgpt.start")
def _(rid, params: dict) -> dict:
    from .chatgpt_auth import auth
    if any(session.get("running") for session in _sessions.values()):
        return _err(rid, 4009, "session busy")
    return _ok(rid, auth.start())


@method("provider.chatgpt.cancel")
def _(rid, params: dict) -> dict:
    from .chatgpt_auth import auth
    return _ok(rid, auth.cancel(params.get("flowId")))


@method("provider.chatgpt.disconnect")
def _(rid, params: dict) -> dict:
    from .chatgpt_auth import auth
    if any(session.get("running") for session in _sessions.values()):
        return _err(rid, 4009, "session busy")
    return _ok(rid, auth.disconnect())


def register(target_module) -> None:
    _registry.install(target_module)
    for name in _EXCLUDED_PUBLIC_METHODS:
        target_module._methods.pop(name, None)
