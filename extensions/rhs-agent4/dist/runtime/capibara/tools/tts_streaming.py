"""Compatibilidad del bucle de turno con la interrupción de voz de Hermes.

Capibara no expone voz ni TTS. El motor copiado, sin embargo, usa este latch
para anotar de forma segura que una respuesta fue interrumpida. Conservamos
exactamente ese contrato pequeño sin importar proveedores, audio o micrófono.
"""

from __future__ import annotations

import time
from typing import Optional

SPEECH_INTERRUPTED_NOTE = (
    "[Nota: el usuario interrumpió la respuesta anterior antes de que terminara.]"
)
_INTERRUPT_TTL_S = 120.0
_interrupted_at: Optional[float] = None


def mark_speech_interrupted() -> None:
    global _interrupted_at
    _interrupted_at = time.monotonic()


def take_speech_interrupted() -> bool:
    global _interrupted_at
    interrupted_at, _interrupted_at = _interrupted_at, None
    return (
        interrupted_at is not None
        and time.monotonic() - interrupted_at < _INTERRUPT_TTL_S
    )
