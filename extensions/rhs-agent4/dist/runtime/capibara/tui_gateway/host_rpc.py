"""Solicitudes JSON-RPC síncronas del runtime Python hacia la extensión."""

from __future__ import annotations

import threading
import time
import uuid
from typing import Any

_lock = threading.Lock()
_pending: dict[str, dict[str, Any]] = {}


class HostRpcError(RuntimeError):
    pass


def request(method: str, params: dict | None = None, timeout: float = 300.0, *, consent=None) -> Any:
    from tui_gateway.server import write_json

    request_id = f"host-{uuid.uuid4().hex}"
    event = threading.Event()
    slot: dict[str, Any] = {"event": event, "created_at": time.time(),
                            "params": params or {}, "consent": consent}
    with _lock:
        _pending[request_id] = slot
    try:
        if not write_json(
            {
                "jsonrpc": "2.0",
                "id": request_id,
                "method": method,
                "params": params or {},
            }
        ):
            raise HostRpcError("La extensión cerró el transporte RPC")
        if not event.wait(max(0.1, timeout)):
            raise HostRpcError(f"Timeout esperando {method}")
        if slot.get("error") is not None:
            error = slot["error"]
            if isinstance(error, dict):
                raise HostRpcError(str(error.get("message") or error))
            raise HostRpcError(str(error))
        return slot.get("result")
    finally:
        with _lock:
            _pending.pop(request_id, None)


def resolve_host_approval(session_id: str, session_key: str, approval_id: str, approved: bool) -> dict:
    """Commit consent for one still-live reverse invocation before admitting effects."""
    from tools.approval_ledger import ApprovalConflict
    with _lock:
        slot = next((value for value in _pending.values()
                     if value["params"].get("approvalRequestId") == approval_id
                     and value["params"].get("runtimeSessionId") == session_id), None)
        if slot is None or slot["event"].is_set() or slot.get("consent") is None:
            raise ApprovalConflict("Host invocation is no longer waiting in this live session")
        ledger, operation, key = slot["consent"]
        if key != session_key:
            raise ApprovalConflict("Host approval belongs to another stored session")
        decision = ledger.decide(approval_id, key, "once" if approved else "deny")
        if not approved:
            return {"approved": False, "state": decision["state"]}
        # Idempotent RPC retries acknowledge the same admission, never issue another.
        if decision["state"] != "consumed" and not ledger.consume(approval_id, key, operation):
            raise ApprovalConflict("Host decision could not be admitted for execution")
        return {"approved": True, "state": "consumed"}


def resolve_response(frame: Any) -> bool:
    """Consume una respuesta del host; False indica que no era nuestra."""
    if not isinstance(frame, dict) or frame.get("method") is not None:
        return False
    request_id = str(frame.get("id") or "")
    if not request_id:
        return False
    with _lock:
        slot = _pending.get(request_id)
        if slot is None:
            return False
        slot["result"] = frame.get("result")
        slot["error"] = frame.get("error")
        slot["event"].set()
    return True
