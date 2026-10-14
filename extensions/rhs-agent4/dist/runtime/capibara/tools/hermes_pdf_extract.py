"""Durable PDF adapter for Capibara's Hermes document extractor.

The normal Hermes ``read_file`` path is intentionally ephemeral.  This small
JSON command-line adapter is used by the host's durable ``process_pdf`` tool:
it reuses ``read_extract`` (including its allowlisted lazy dependency install),
adds provenance, and never mutates the source PDF.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from pathlib import Path

from tools.read_extract import ExtractionError, extract_document_text


def _page_count(path: Path) -> int | None:
    if shutil.which("pdfinfo"):
        try:
            result = subprocess.run(
                ["pdfinfo", str(path)],
                capture_output=True,
                text=True,
                timeout=20,
                check=False,
            )
            for line in result.stdout.splitlines():
                if line.lower().startswith("pages:"):
                    value = line.split(":", 1)[1].strip()
                    if value.isdigit():
                        return int(value)
        except (OSError, subprocess.SubprocessError):
            pass
    return None


def _canonical_markdown(path: Path, markdown: str, pages: int | None) -> tuple[str, list[str]]:
    body = markdown.replace("\r\n", "\n").rstrip() + "\n"
    warnings: list[str] = []
    header = ["<!-- CAPIBARA PDF ENGINE: hermes -->", f"<!-- SOURCE: {path.name} -->"]
    if pages:
        header.append(f"<!-- SOURCE PAGES: {pages} -->")
    if "<!-- PAGE:" not in body:
        if pages == 1:
            body = f"<!-- PAGE: 1 / 1 -->\n\n{body}"
        elif pages and pages > 1:
            # anydoc preserves document structure but does not expose page
            # boundaries. Do not invent false boundaries; record the limitation
            # so the caller can decide whether to use pdfstruct instead.
            warnings.append("Hermes produjo Markdown sin marcadores de página; se conserva el orden documental y se deja constancia en el manifiesto.")
    return "\n".join(header) + "\n\n" + body, warnings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    args = parser.parse_args()
    source = args.pdf.expanduser().resolve()
    try:
        pages = _page_count(source)
        markdown = extract_document_text(str(source))
        if markdown.lstrip().startswith("[NEEDS OCR:"):
            raise ExtractionError(markdown.strip())
        if not markdown.strip():
            raise ExtractionError("Document contains no extractable text")
        result, warnings = _canonical_markdown(source, markdown, pages)
        print(json.dumps({
            "ok": True,
            "engine": "hermes",
            "markdown": result,
            "pageCount": pages,
            "warnings": warnings,
        }, ensure_ascii=False))
        return 0
    except Exception as exc:  # noqa: BLE001 - serialized for the TypeScript fallback
        print(json.dumps({
            "ok": False,
            "engine": "hermes",
            "error": f"{type(exc).__name__}: {exc}",
        }, ensure_ascii=False))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
