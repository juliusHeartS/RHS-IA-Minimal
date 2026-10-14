"""Durable consent ledger adapted for Capibara from Goose decision semantics.

Adapts Goose's request/decision identity and idempotence to SQLite transactions.
Decisions never replay execution. Only the process epoch that owns a pending
request may consume an approved decision, once. Interrupted consumed operations
are uncertain, not retried.
"""
from __future__ import annotations

from contextlib import contextmanager
from contextvars import ContextVar
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import time
from typing import Any


class ApprovalConflict(ValueError):
    """The response belongs to another operation, epoch, or terminal state."""


class ApprovalOutcomeUncertain(RuntimeError):
    """The effect completed, but its durable result could not be recorded."""


class ApprovalLedger:
    def __init__(self, path: Path, epoch: str):
        if not epoch:
            raise ValueError("Approval owner epoch is required")
        self.path, self.epoch = Path(path), epoch
        self.path.parent.mkdir(parents=True, exist_ok=True)
        # No secrets in this ledger: raw arguments become a digest; display is
        # redacted by the caller using the same production redactor as the UI.
        descriptor = os.open(self.path, os.O_CREAT | os.O_RDWR, 0o600)
        os.close(descriptor)
        with self._transaction() as conn:
            conn.execute("""CREATE TABLE IF NOT EXISTS approvals (
                request_id TEXT PRIMARY KEY, session_key TEXT NOT NULL,
                epoch TEXT NOT NULL, turn_id TEXT NOT NULL, tool_call_id TEXT NOT NULL,
                source TEXT NOT NULL, operation_digest TEXT NOT NULL,
                display_json TEXT NOT NULL, choices_json TEXT NOT NULL,
                state TEXT NOT NULL, choice TEXT, reason TEXT,
                created REAL NOT NULL, updated REAL NOT NULL,
                result_digest TEXT, acknowledged INTEGER NOT NULL DEFAULT 0
            )""")
            conn.execute("CREATE INDEX IF NOT EXISTS approvals_session ON approvals(session_key, created)")
            conn.execute("CREATE TABLE IF NOT EXISTS approval_owners (epoch TEXT PRIMARY KEY, pid INTEGER NOT NULL, born REAL)")
            try:
                import psutil
                born = psutil.Process(os.getpid()).create_time()
            except Exception:
                born = None
            owner = conn.execute("SELECT pid, born FROM approval_owners WHERE epoch=?", (epoch,)).fetchone()
            if owner is not None and (owner["pid"] != os.getpid() or owner["born"] != born):
                raise ApprovalConflict("Approval owner epoch already belongs to a different process")
            conn.execute("INSERT OR IGNORE INTO approval_owners VALUES (?, ?, ?)", (epoch, os.getpid(), born))

    @contextmanager
    def _transaction(self):
        conn = sqlite3.connect(self.path, timeout=10, isolation_level=None)
        conn.row_factory = sqlite3.Row
        try:
            conn.execute("PRAGMA synchronous=FULL")
            conn.execute("BEGIN IMMEDIATE")
            yield conn
            conn.execute("COMMIT")
        except BaseException:
            if conn.in_transaction:
                conn.execute("ROLLBACK")
            raise
        finally:
            conn.close()

    @staticmethod
    def digest(value: Any) -> str:
        canonical = json.dumps(value, ensure_ascii=True, sort_keys=True, separators=(",", ":"), allow_nan=False)
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    def register(self, request_id: str, session_key: str, *, source: str,
                 operation: dict, display: dict, choices: list[str],
                 turn_id: str = "", tool_call_id: str = "") -> dict:
        if not request_id or not session_key or source not in ("runtime", "host"):
            raise ValueError("Approval request identity is incomplete")
        if source == "host" and (not turn_id or not tool_call_id):
            raise ValueError("Host approval requires a turn and tool occurrence")
        if not choices or any(c not in ("once", "session", "always", "deny") for c in choices):
            raise ValueError("Invalid approval choices")
        encoded_display = json.dumps(display, ensure_ascii=True, sort_keys=True)
        if len(encoded_display.encode("utf-8")) > 65536:
            raise ValueError("Approval display exceeds the durable record limit")
        digest = self.digest(operation)
        expected = (session_key, self.epoch, turn_id, tool_call_id, source, digest)
        now = time.time()
        with self._transaction() as conn:
            row = conn.execute("SELECT * FROM approvals WHERE request_id=?", (request_id,)).fetchone()
            if row is not None:
                actual = tuple(row[c] for c in ("session_key", "epoch", "turn_id", "tool_call_id", "source", "operation_digest"))
                if actual != expected or json.loads(row["choices_json"]) != choices:
                    raise ApprovalConflict("Request identity already belongs to a different operation")
                return self._public(row)
            conn.execute("""INSERT INTO approvals
                (request_id, session_key, epoch, turn_id, tool_call_id, source, operation_digest,
                 display_json, choices_json, state, created, updated)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)""",
                (request_id, *expected, encoded_display, json.dumps(choices), now, now))
            return self._public(conn.execute("SELECT * FROM approvals WHERE request_id=?", (request_id,)).fetchone())

    def _owned(self, conn, request_id, session_key):
        row = conn.execute("SELECT * FROM approvals WHERE request_id=? AND session_key=?",
                           (request_id, session_key)).fetchone()
        if row is None or row["epoch"] != self.epoch:
            raise ApprovalConflict("Approval does not belong to this live session and owner epoch")
        return row

    def decide(self, request_id: str, session_key: str, choice: str, reason: str | None = None) -> dict:
        with self._transaction() as conn:
            row = self._owned(conn, request_id, session_key)
            if choice not in json.loads(row["choices_json"]):
                raise ApprovalConflict("Choice was not offered for this operation")
            if row["choice"] is not None:
                if row["choice"] != choice:
                    raise ApprovalConflict("Approval already has a different decision")
                if row["state"] in ("decided", "consumed", "completed", "denied"):
                    return self._public(row)
                raise ApprovalConflict("Decision no longer authorizes this operation")
            if row["state"] != "pending":
                raise ApprovalConflict("Approval is no longer pending")
            conn.execute("UPDATE approvals SET state=?, choice=?, reason=?, updated=? WHERE request_id=?",
                         ("denied" if choice == "deny" else "decided", choice, reason, time.time(), request_id))
            return self._public(conn.execute("SELECT * FROM approvals WHERE request_id=?", (request_id,)).fetchone())

    def consume(self, request_id: str, session_key: str, operation: dict) -> bool:
        with self._transaction() as conn:
            row = self._owned(conn, request_id, session_key)
            if row["operation_digest"] != self.digest(operation):
                raise ApprovalConflict("Approval arguments or workspace changed")
            if row["state"] != "decided" or row["choice"] == "deny":
                return False
            conn.execute("UPDATE approvals SET state='consumed', updated=? WHERE request_id=?",
                         (time.time(), request_id))
            return True

    def finish(self, request_id: str, session_key: str, result: Any) -> None:
        with self._transaction() as conn:
            row = self._owned(conn, request_id, session_key)
            if row["state"] == "completed":
                if row["result_digest"] != self.digest(result):
                    raise ApprovalConflict("Operation already has a different result")
                return
            if row["state"] != "consumed":
                raise ApprovalConflict("Operation was not admitted for execution")
            conn.execute("UPDATE approvals SET state='completed', result_digest=?, updated=? WHERE request_id=?",
                         (self.digest(result), time.time(), request_id))

    def close(self, request_id: str, session_key: str, state: str) -> None:
        if state not in ("cancelled", "expired", "notify_failed", "uncertain"):
            raise ValueError("Invalid terminal approval state")
        with self._transaction() as conn:
            row = self._owned(conn, request_id, session_key)
            if row["state"] in ("pending", "decided", "consumed"):
                # Once admitted, losing the worker cannot prove a side effect
                # did not happen. Cancellation is not a rollback promise.
                final = "uncertain" if row["state"] == "consumed" else state
                conn.execute("UPDATE approvals SET state=?, updated=? WHERE request_id=?",
                             (final, time.time(), request_id))

    def acknowledge(self, request_id: str, session_key: str) -> None:
        with self._transaction() as conn:
            self._owned(conn, request_id, session_key)
            conn.execute("UPDATE approvals SET acknowledged=1, updated=? WHERE request_id=?",
                         (time.time(), request_id))

    def recover_abandoned(self) -> int:
        """Compatibility entrypoint: only proved inactive owners are recoverable."""
        return self.recover_inactive_owners()

    def recover_inactive_owners(self) -> int:
        """Recover only proved dead/reused owners, never live sibling windows."""
        try:
            import psutil
        except ImportError:
            return 0
        conn = sqlite3.connect(self.path, timeout=10)
        try:
            owners = conn.execute("""SELECT DISTINCT o.epoch, o.pid, o.born
                FROM approval_owners o JOIN approvals a ON a.epoch=o.epoch
                WHERE o.epoch!=? AND a.state IN ('pending', 'decided', 'consumed') LIMIT 256""",
                (self.epoch,)).fetchall()
        finally:
            conn.close()
        dead = []
        for epoch, pid, born in owners:
            try:
                process_born = psutil.Process(pid).create_time()
                if born is not None and process_born != born:
                    dead.append(epoch)
            except psutil.NoSuchProcess:
                dead.append(epoch)
            except (psutil.AccessDenied, OSError):
                pass  # Unknown liveness fails closed, not a revocation claim.
        if not dead:
            return 0
        changed = 0
        with self._transaction() as conn:
            for epoch in dead:
                changed += conn.execute("""UPDATE approvals
                    SET state=CASE WHEN state='consumed' THEN 'uncertain' ELSE 'abandoned' END, updated=?
                    WHERE epoch=? AND state IN ('pending', 'decided', 'consumed')""",
                    (time.time(), epoch)).rowcount
        return changed

    def list(self, session_key: str) -> list[dict]:
        conn = sqlite3.connect(self.path, timeout=10)
        conn.row_factory = sqlite3.Row
        try:
            return [self._public(row) for row in conn.execute(
                "SELECT * FROM approvals WHERE session_key=? ORDER BY created, request_id", (session_key,))]
        finally:
            conn.close()

    def find(self, request_id: str, session_key: str) -> dict | None:
        conn = sqlite3.connect(self.path, timeout=10)
        conn.row_factory = sqlite3.Row
        try:
            row = conn.execute("SELECT * FROM approvals WHERE request_id=? AND session_key=?",
                               (request_id, session_key)).fetchone()
            return self._public(row) if row is not None else None
        finally:
            conn.close()

    @staticmethod
    def _public(row) -> dict:
        record = dict(row)
        record["display"] = json.loads(record.pop("display_json"))
        record["choices"] = json.loads(record.pop("choices_json"))
        return record


def get_approval_ledger() -> ApprovalLedger:
    from hermes_constants import get_hermes_home
    from tui_gateway.event_replay import replay_epoch
    ledger = ApprovalLedger(Path(get_hermes_home()) / "approvals.sqlite3", replay_epoch())
    ledger.recover_inactive_owners()
    return ledger


def redacted_approval_display(data: dict) -> dict:
    from agent.redact import redact_sensitive_text
    # Copy only presentation fields, never arbitrary tool arguments or metadata.
    return {key: redact_sensitive_text(str(data[key]), force=True)
            for key in ("command", "description", "tool") if key in data}


_consumed: ContextVar = ContextVar("capibara_consumed_approvals", default=None)


def remember_consumed_approval(ledger: ApprovalLedger, request_id: str, session_key: str) -> None:
    tracking = _consumed.get()
    if tracking is not None:
        tracking.append((ledger, request_id, session_key))


class ConsentExecution:
    def __init__(self):
        self.records = []
        self.finished = False

    def complete(self, result: Any) -> None:
        # A cancellation result does not prove a remote side effect was rolled back.
        uncertain = False
        if isinstance(result, str):
            try:
                decoded = json.loads(result)
                uncertain = isinstance(decoded, dict) and (
                    decoded.get("outcome_uncertain") is True or decoded.get("status") in ("cancelled", "timeout"))
            except (TypeError, ValueError):
                pass
        for ledger, request_id, session_key in self.records:
            try:
                if uncertain:
                    ledger.close(request_id, session_key, "uncertain")
                else:
                    ledger.finish(request_id, session_key, result)
            except Exception as exc:
                raise ApprovalOutcomeUncertain(
                    "The operation may have taken effect, but its approval result could not be persisted. "
                    "Do not repeat it automatically; verify the actual effect first.") from exc
        self.finished = True


@contextmanager
def track_consent_execution():
    """Scope consent to the real dispatcher, not to the UI response or observer hook."""
    scope = ConsentExecution()
    token = _consumed.set(scope.records)
    try:
        yield scope
    finally:
        try:
            if not scope.finished:
                for ledger, request_id, session_key in scope.records:
                    try:
                        ledger.close(request_id, session_key, "uncertain")
                    except Exception:
                        # Do not replace the real tool failure with a cleanup failure.
                        # A consumed row still cannot be replayed or consumed again.
                        import logging
                        logging.getLogger(__name__).exception("Approval outcome remains uncertain")
        finally:
            _consumed.reset(token)
