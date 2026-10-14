"""RHS-Agent's private, cancellable UI adapter around Hermes' device flow.

Only a whitelist snapshot crosses RPC. No tokens, arbitrary URLs, paths or
upstream exception strings are returned to the Webview or written to logs.
"""
from __future__ import annotations

import threading
import time
import uuid
from contextlib import contextmanager

from hermes_constants import (
    get_process_hermes_home, set_hermes_home_override, reset_hermes_home_override,
)

ISSUER = "https://auth.openai.com"
VERIFICATION_URI = ISSUER + "/codex/device"


@contextmanager
def credential_scope():
    token = set_hermes_home_override(str(get_process_hermes_home()))
    try:
        yield
    finally:
        reset_hermes_home_override(token)


class ChatGptAuth:
    def __init__(self):
        self.lock = threading.RLock()
        self.flow = None
        self.cancel_event = threading.Event()

    def _connected(self):
        from hermes_cli.auth import _auth_store_lock, _load_auth_store
        with credential_scope(), _auth_store_lock():
            # Direct store only: no inheritance or Codex CLI credential import.
            store = _load_auth_store()
            providers = store.get("providers")
            state = providers.get("openai-codex") if isinstance(providers, dict) else None
            tokens = state.get("tokens") if isinstance(state, dict) else None
            return bool(isinstance(tokens, dict) and all(
                isinstance(tokens.get(k), str) and tokens[k].strip()
                for k in ("access_token", "refresh_token")))

    def status(self):
        with self.lock:
            if self.flow and self.flow["status"] in {"requesting", "pending"}:
                if time.monotonic() >= self.flow["deadline"]:
                    self.cancel_event.set()
                    self.flow = {"status": "expired", "flowId": self.flow["flowId"]}
            if self.flow and self.flow["status"] != "connected":
                return {k: v for k, v in self.flow.items() if k != "deadline"}
            return {"status": "connected" if self._connected() else "disconnected"}

    def start(self):
        with self.lock:
            if self.flow and self.flow["status"] in {"requesting", "pending"}:
                return self.status()
            self.cancel_event.set()
            cancel = self.cancel_event = threading.Event()
            flow_id = uuid.uuid4().hex
            self.flow = {"status": "requesting", "flowId": flow_id,
                         "deadline": time.monotonic() + 900}
            threading.Thread(target=self._login, args=(flow_id, cancel), daemon=True).start()
            return self.status()

    def _owns(self, flow_id, cancel):
        return (self.flow and self.flow.get("flowId") == flow_id
                and not cancel.is_set() and time.monotonic() < self.flow.get("deadline", 0))

    def _login(self, flow_id, cancel):
        from hermes_cli.auth_constants import CODEX_OAUTH_CLIENT_ID
        from hermes_cli.auth_codex import (
            _codex_request_device_code, _codex_poll_authorization_code,
            _codex_exchange_authorization_code, _save_codex_tokens,
        )
        try:
            device = _codex_request_device_code(ISSUER, CODEX_OAUTH_CLIENT_ID,
                                               cancel_event=cancel, silent=True)
            user_code = device.get("user_code")
            if not isinstance(user_code, str) or not user_code.strip() or len(user_code) > 64:
                raise ValueError("invalid device code")
            with self.lock:
                if not self._owns(flow_id, cancel):
                    return
                self.flow.update(status="pending", userCode=device["user_code"],
                                 verificationUri=VERIFICATION_URI)
            code = _codex_poll_authorization_code(
                ISSUER, device_auth_id=device["device_auth_id"], user_code=device["user_code"],
                poll_interval=device["interval"], cancel_event=cancel)
            if cancel.is_set():
                return
            tokens = _codex_exchange_authorization_code(ISSUER, CODEX_OAUTH_CLIENT_ID, code)
            if not all(isinstance(tokens.get(k), str) and tokens[k].strip()
                       for k in ("access_token", "refresh_token")):
                raise ValueError("invalid token pair")
            with self.lock:
                if not self._owns(flow_id, cancel):
                    return
                with credential_scope():
                    _save_codex_tokens({k: tokens[k] for k in ("access_token", "refresh_token")})
                self.flow = {"status": "connected"}
        except Exception as exc:
            with self.lock:
                if not self._owns(flow_id, cancel):
                    return
                # Public codes only. Exceptions can contain URLs, bodies and secrets.
                code = getattr(exc, "code", "")
                public = {"device_code_timeout": "expired",
                          "codex_rate_limited": "rate_limited"}.get(code, "login_failed")
                self.flow = {"status": "expired" if public == "expired" else "error",
                             "errorCode": public}

    def cancel(self, flow_id):
        with self.lock:
            if (self.flow and self.flow.get("flowId") == flow_id
                    and self.flow["status"] in {"requesting", "pending"}):
                self.cancel_event.set()
                self.flow = {"status": "cancelled"}
            return self.status()

    def disconnect(self):
        from hermes_cli.auth import clear_provider_auth
        with self.lock:
            self.cancel_event.set()
            with credential_scope():
                clear_provider_auth("openai-codex")
            self.flow = None
            return self.status()

    def stop(self):
        with self.lock:
            self.cancel_event.set()
            self.flow = None


auth = ChatGptAuth()
