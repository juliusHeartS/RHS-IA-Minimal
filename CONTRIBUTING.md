# Contributing to RHS-IA

RHS-IA is a PAHO-oriented application based on Positron and Code OSS. File RHS-IA-specific bugs and proposals in this repository's [issues](https://github.com/juliusHeartS/RHS-IA/issues). Check for an existing issue before opening a new one. Upstream issues belong to their respective upstream projects.

Before changing code, read [AGENTS.md](AGENTS.md), the [coding instructions](.github/copilot-instructions.md), and the [customization ledger](docs/upgrades/rhs-customizations.md). Keep the ledger's Markdown and JSON files synchronized for product customizations. Compile before running relevant tests, preserve copyright and license notices, and describe the observed validation in each pull request.

The built-in R and Python integrations derive from the upstream Positron extensions at [`extensions/positron-r`](extensions/positron-r) and [`extensions/positron-python`](extensions/positron-python). Their upstream package IDs and runtime contracts need coordinated migration before renaming. The R kernel lives in the Ark submodule.

Use the [pull request template](.github/pull_request_template.md) to state scope, affected platforms, validation, and remaining limitations. This repository does not claim that a Posit contributor license agreement applies to RHS-IA contributions. Upstream contributions must follow the upstream project's own rules.
