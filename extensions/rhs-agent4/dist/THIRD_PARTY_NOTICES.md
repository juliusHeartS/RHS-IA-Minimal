# Third-party notices

## Hermes Agent

Portions of the Python runtime in `runtime/capibara/` are copied and adapted
from Hermes Agent by Nous Research, local commit
`c6f87deb2c38d75518c793790f1cc9afa37f0695`.

Hermes Agent is distributed under the MIT License. The complete notice is in
`LICENSES/Hermes-MIT.txt` and must remain with copies or substantial portions
of that software.

Selected MCP security, transactional transcript repair, stable message/tool
identity and event replay routines were additionally copied and adapted from
Hermes Agent at `47676981f55de91231fdeef2f0eec47e7c209e78`. The complete consumer
primitives from `apps/shared/src/json-rpc-gateway.ts` are adapted to the Positron
stdio boundary in `src/host/runtime/RuntimeEventRecovery.ts`. Provenance and
local adaptations are recorded in `provenance/copy-map.yaml` and the decision log.

## Cuy / rhs-agent2

The extension host, Webview, institutional knowledge system, Positron bridge,
document pipeline and protected tools were copied and adapted from the local
`rhs-agent2` repository at commit
`6d6eba3df8fdee210d493353e582852a3c9fa254`.

That source is distributed under the Apache License 2.0. The complete license
is in the repository root and in `LICENSES/Cuy-Apache-2.0.txt`.

## Sacha Cuy / Capibara modifications

The extension host, Webview, institutional contracts and Positron bridge are
adapted from Sacha Cuy (`rhs-agent3`) into the independent Capibara project
(`rhs-agent4`). Sacha Cuy remains read-only.

## Goose

Selected lifecycle, ACP/MCP and state-machine patterns are used as read-only
references from Goose at commit
`a23a8cd5b138954bc8962cba623c2d8ecd375512`. Capibara's comparison ledger
records evidence before adopting a competing behavior.

The no-redirect policy from `crates/goose/src/agents/extension_manager/streamable_http.rs`
at `c2eb854c66b7d2f62677dde3284d0c6defadbfb4` is adapted to caller-owned HTTPX clients.
Goose's request/decision identity and idempotent confirmation semantics informed
the independently written SQLite consent adapter in `tools/approval_ledger.py`;
this is not a literal copy of the Rust state machine or a claim to embed Goose.
Goose is distributed under Apache-2.0; its full license is preserved in
`LICENSES/Goose-Apache-2.0.txt`.
