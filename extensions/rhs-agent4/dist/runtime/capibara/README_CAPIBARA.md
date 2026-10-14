# Capibara Python runtime

This directory contains Capibara's Python runtime, adapted from the selected
Hermes implementation and integrated into the independent Positron extension.
The source repository is read-only and the attribution record lives in
`../../provenance/upstreams.yaml` and the license files.

The runtime is exercised through NDJSON/provider tests and the extension's
Positron-facing contracts. Installed Positron acceptance remains a separate
validation step: a passing unit test or smoke test is not by itself full
product acceptance. See `../../PlanConstruccionCapibara.md` and
`../../docs/CONTRATO_POSITRON_Y_ACEPTACION.md`.

The copy is intentionally substantial. It preserves the mature agent loop,
providers, tools, sessions, context compression, skills, plugins, subagents,
cron, MCP and security infrastructure. Explicit personal, domestic,
recreational, social and messaging-gateway modules were excluded according to
`../../provenance/exclusions.yaml`.

During the initial mechanical-copy stage, internal imports and compatibility
symbols may still use the Hermes name. They are not the public product
contract. The extension, executable, settings, environment and storage surface
use `Capibara`, `capibara`, `CAPIBARA_*` and `.capibara`.

The MIT notice for the copied code is at `../../LICENSES/Hermes-MIT.txt`.
