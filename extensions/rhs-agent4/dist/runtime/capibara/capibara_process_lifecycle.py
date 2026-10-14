"""Process identity/liveness and guarded termination copied from pinned gateway/status.py.
Shared by native tools/recovery; no messaging service or gateway daemon controls.
"""
import contextlib
import os
import signal
import subprocess
import sys
from pathlib import Path
from typing import Optional
_IS_WINDOWS = sys.platform == "win32"

def _pid_exists(pid: int) -> bool:
    """Cross-platform "is this PID alive" check that does NOT kill the target. CRITICAL on Windows:
    ``os.kill(pid, 0)`` sends ``CTRL_C_EVENT`` to the whole console group (bpo-14484), so prefer
    psutil, then ctypes ``OpenProcess`` (Windows) / ``os.kill(pid, 0)`` (POSIX). Zombies report
    dead: treating one as alive makes --replace wait forever under systemd Restart=always."""
    pid = int(pid)
    try:
        import psutil  # type: ignore
        # Best-effort zombie check: status-read failures fall through to pid_exists().
        try:
            # A zombie (defunct) process is still in the process table, so ``psutil.pid_exists()`` returns
            # True for it — but it is already dead: SIGKILL has no effect and it cannot be a running
            # gateway. Treating a zombie as alive makes ``--replace`` wait for the old PID to die (it never
            # does, until its parent reaps it), then abort with exit 1 — a silent crash loop under systemd
            # ``Restart=always``, which respawns the gateway before reaping the previous process (issue
            # #42126). Report zombies as dead so the takeover proceeds. Best-effort: any failure to read
            # status (partial/stub psutil, access denied, transient race) falls through to the authoritative
            # ``pid_exists()`` below rather than raising.
            if psutil.Process(pid).status() == psutil.STATUS_ZOMBIE:
                return False
        except getattr(psutil, "NoSuchProcess", ()):
            return False
        except Exception:
            pass
        return bool(psutil.pid_exists(pid))
    except ImportError:
        pass  # Fall through to stdlib fallback.
    if _IS_WINDOWS:
        return _pid_exists_win32_ctypes(pid)
    if _posix_is_zombie(pid):  # a zombie still answers os.kill(pid, 0)
        return False
    try:
        os.kill(pid, 0)  # windows-footgun: ok — POSIX-only branch (the whole point of _pid_exists)
    except PermissionError:
        return True  # Exists but we can't signal it.
    except OSError:  # ProcessLookupError included
        return False
    return True


def _posix_is_zombie(pid: int) -> bool:
    """Zombie via ``/proc/<pid>/stat`` field 3, or ``ps -o state=`` without /proc (macOS/BSD)."""
    try:
        stat_fields = Path(f"/proc/{pid}/stat").read_text(encoding="utf-8").split()
        return len(stat_fields) > 2 and stat_fields[2] == "Z"
    except FileNotFoundError:
        with contextlib.suppress(Exception):
            # --compile-bytecode: uv does NOT write __pycache__ by default (pip does), so without it the
            # first `import <backend>` in the foreground of a user request recompiles every module of the
            # backend *and* its transitive deps (#100461). This covers the whole install;
            # _warm_installed_bytecode below is the belt-and-braces pass for the spec's own roots on any
            # tier.
            # CREATE_NO_WINDOW on Windows — under the desktop GUI's windowless parent, this spawn otherwise
            # flashes a console (#56747).
            r = subprocess.run(
                ["ps", "-o", "state=", "-p", str(pid)],
                capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=5,
            )
            return r.returncode == 0 and r.stdout.strip().startswith("Z")
    except (IndexError, PermissionError, OSError):
        pass
    return False


def _pid_exists_win32_ctypes(pid: int) -> bool:
    """psutil-free Windows liveness probe via OpenProcess/WaitForSingleObject."""
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32  # type: ignore[attr-defined]
        # Pin restypes: default c_int mangles WAIT_* DWORDs into negatives.
        kernel32.OpenProcess.restype = ctypes.c_void_p
        kernel32.WaitForSingleObject.restype = ctypes.c_uint
        kernel32.GetLastError.restype = ctypes.c_uint
        PROCESS_QUERY_LIMITED_INFORMATION, SYNCHRONIZE = 0x1000, 0x100000  # SYNCHRONIZE: for Wait*
        WAIT_TIMEOUT, ERROR_ACCESS_DENIED = 0x00000102, 5
        handle = kernel32.OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | SYNCHRONIZE, False, pid)
        if not handle:
            # ERROR_INVALID_PARAMETER (87): PID definitely gone. ACCESS_DENIED: exists
            # but owned by another user/session. Any other error: conservative False.
            return kernel32.GetLastError() == ERROR_ACCESS_DENIED
        try:
            # WAIT_TIMEOUT = still running; anything else = gone.
            return kernel32.WaitForSingleObject(handle, 0) == WAIT_TIMEOUT
        finally:
            kernel32.CloseHandle(handle)
    except (OSError, AttributeError):
        return False


def terminate_pid(
    pid: int, *, force: bool = False, expected_start_time: Optional[float] = None
) -> None:
    """Terminate a PID; POSIX SIGTERM/SIGKILL, Windows taskkill /T /F for force. Identity guard:
    Windows ``force`` REQUIRES a matching ``expected_start_time`` (taskkill on a recycled PID has
    killed svchost.exe); POSIX optional, but a provided mismatch refuses the kill everywhere.

    On POSIX an expectation is optional, but when the caller provides one and it no longer matches the live
    process, the kill is refused on every platform — a mismatched fingerprint always means the PID was
    recycled. See #89614.
    """
    if force and (_IS_WINDOWS or expected_start_time is not None):
        if expected_start_time is None:
            raise OSError(f"refusing to force-kill PID {pid} without a process start-time guard")
        current_start_time = _get_process_start_time(pid)
        if current_start_time is None:
            raise OSError(f"refusing to force-kill PID {pid}; process start time is unavailable")
        try:
            if not _start_times_agree(current_start_time, expected_start_time):
                raise OSError(f"refusing to force-kill PID {pid}; process identity changed")
        except (TypeError, ValueError) as exc:
            raise OSError(f"refusing to force-kill PID {pid}; malformed start time") from exc
    if not (force and _IS_WINDOWS):
        os.kill(pid, signal.SIGTERM if not force else getattr(signal, "SIGKILL", signal.SIGTERM))
        return
    # Hide flags: a bare taskkill spawn from windowless pythonw.exe would flash a conhost window.
    from hermes_cli._subprocess_compat import windows_hide_flags

    try:
        result = subprocess.run(
            ["taskkill", "/PID", str(pid), "/T", "/F"], capture_output=True, text=True,
            encoding="utf-8", errors="replace", timeout=10, creationflags=windows_hide_flags(),
        )
    except FileNotFoundError:
        os.kill(pid, signal.SIGTERM)
        return
    if result.returncode != 0:
        details = (result.stderr or result.stdout or "").strip()
        raise OSError(details or f"taskkill failed for PID {pid}")


def _get_process_start_time(pid: int) -> Optional[int]:
    """Per-process start-time fingerprint (PID-reuse guard), or None: ``/proc/<pid>/stat`` field 22
    on Linux, else psutil ``create_time()`` in centiseconds. Units differ per platform; the guard
    only compares same-host values."""
    with contextlib.suppress(IndexError, ValueError, OSError):
        return int(Path(f"/proc/{pid}/stat").read_text(encoding="utf-8").split()[21])
    try:
        import psutil  # type: ignore
        return int(round(psutil.Process(pid).create_time() * 100))
    except Exception:
        return None


def get_process_start_time(pid: int) -> Optional[int]:
    """Public wrapper for retrieving a process start time when available."""
    return _get_process_start_time(pid)
