"""Punto de entrada público de RHS-Agent.

El motor preserva internamente módulos copiados de Hermes para mantener su
comportamiento probado. Esta fachada impide que ese detalle se convierta en
contrato público: el host usa exclusivamente ``capibara`` y variables ``CAPIBARA_*``.
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from . import __version__


def _default_capibara_home() -> Path:
    if sys.platform == "win32":
        base = Path(os.environ.get("LOCALAPPDATA") or (Path.home() / "AppData" / "Local"))
        return base / "capibara"
    return Path.home() / ".capibara"


def configure_runtime_environment(home: str | None = None) -> Path:
    """Fija el contrato público CAPIBARA_* antes de importar el motor copiado."""

    capibara_home = Path(home or os.environ.get("CAPIBARA_HOME") or _default_capibara_home()).expanduser().resolve()
    capibara_home.mkdir(parents=True, exist_ok=True)

    os.environ["CAPIBARA_HOME"] = str(capibara_home)
    os.environ.setdefault("CAPIBARA_SESSION_SOURCE", "capibara-extension")

    translations = {
        "CAPIBARA_LOG_LEVEL": "CAPIBARA_LOG_LEVEL",
        "CAPIBARA_RPC_TIMEOUT_S": "CAPIBARA_TUI_RPC_TIMEOUT_S",
        "CAPIBARA_SHUTDOWN_GRACE_S": "CAPIBARA_TUI_GATEWAY_SHUTDOWN_GRACE_S",
    }
    for public_name, internal_name in translations.items():
        value = os.environ.get(public_name)
        if value is not None:
            os.environ[internal_name] = value

    return capibara_home


def _serve_stdio(home: str | None, extension_instance: str | None, locale: str | None) -> int:
    configure_runtime_environment(home)
    if extension_instance:
        os.environ["CAPIBARA_EXTENSION_INSTANCE"] = extension_instance
    if locale:
        os.environ["CAPIBARA_LOCALE"] = locale
    # Import tardío: todos los módulos que resuelven HOME/config deben observar
    # la traducción anterior desde su primera carga.
    from tui_gateway.entry import main as gateway_main

    gateway_main()
    return 0


def _doctor() -> int:
    home = configure_runtime_environment()
    payload = {
        "name": "RHS-Agent",
        "runtime": "python",
        "version": __version__,
        "capibara_home": str(home),
        "python": sys.executable,
        "protocol": "json-rpc-2.0-ndjson",
    }
    import json

    print(json.dumps(payload, ensure_ascii=False))
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="capibara", description="Runtime Python de RHS-Agent")
    parser.add_argument("--version", action="version", version=f"RHS-Agent {__version__}")
    subcommands = parser.add_subparsers(dest="command", required=True)

    serve = subcommands.add_parser("serve", help="Inicia el runtime JSON-RPC")
    serve.add_argument("--stdio", action="store_true", help="Usa NDJSON por stdin/stdout")
    serve.add_argument("--home", help="Directorio CAPIBARA_HOME administrado por la extensión")
    serve.add_argument("--extension-instance", help="Identidad de la instancia de Positron")
    serve.add_argument("--locale", help="Idioma de la interfaz anfitriona")
    subcommands.add_parser("doctor", help="Comprueba la instalación del runtime")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    if args.command == "serve":
        if not args.stdio:
            raise SystemExit("RHS-Agent solo expone transporte --stdio en esta etapa")
        return _serve_stdio(args.home, args.extension_instance, args.locale)
    if args.command == "doctor":
        return _doctor()
    raise SystemExit(f"Comando desconocido: {args.command}")


if __name__ == "__main__":
    raise SystemExit(main())
