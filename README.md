# RHS-IA

RHS-IA is a desktop environment for work on health workforce data, modelling, and planning. This PAHO-oriented application is based on [Positron](https://github.com/posit-dev/positron), which is built on [Code OSS](https://github.com/microsoft/vscode). It combines an editor, R and Python runtime support, notebooks, Quarto, and an offline English and Spanish documentation reader. New application profiles default to Spanish; an explicit English language choice is preserved.

![RHS-IA interface with RHS-Agent, a health workforce chart, and an R session](assets/interfaz_agent.png)

*RHS-IA with the optional RHS-Agent extension, showing simulated health workforce data.*

## Project status

The source is being prepared for a **RHS-IA 1.0** handover. The underlying Code OSS package version and Positron base version are independent of that release name. This repository does not currently publish a verified RHS-IA installer or download channel. Source-build instructions below are for maintainers. The most recent recorded package acceptance in the [customization ledger](docs/upgrades/rhs-customizations.md) was on macOS arm64; it is historical evidence, not a current release certification for macOS, Windows, or Linux.

Current limitations that affect deployment:

- The macOS build uses a temporary mock Keychain and the legacy `co.posit.positron` bundle identifier. Do not store real credentials in test builds. Signing, notarization, and a safe credential migration need a separate release decision.
- Automatic application updates are disabled. A PAHO-owned distribution and update process has not been established.
- Core assistant hooks remain, but this tree does not ship an assistant extension. Assistant functions depend on a separately supplied, approved extension and provider configuration.
- Remote server installation still refers to a Posit-hosted artifact. That dependency has not been validated as an RHS-IA release channel.

See the [customization ledger](docs/upgrades/rhs-customizations.md) for implemented behavior and validation obligations, and the [branding audit](docs/upgrades/rhs-ia-branding-audit.md) for remaining references and release gates.

## Source setup

Use a clean checkout with its two Git submodules. The repository pins Node.js **24.18.0** in [`.nvmrc`](.nvmrc) and declares npm **10.9.2** as its package manager in [`package.json`](package.json). The installed Node 24.18.0 runtime used for prior acceptance reports npm **11.16.0**; that mismatch remains a release-reproducibility issue. The current dependency tree also uses Rust for the Ark R kernel, Python for build and test tooling, and platform-specific native build tools. Install those prerequisites for the target you intend to build. Follow [repository agent guidance](AGENTS.md) when changing source.

From the repository root, with the pinned Node version active:

```sh
rtk git submodule update --init --recursive
rtk npm ci
rtk npm run prelaunch
rtk proxy ./scripts/code.sh
```

`prelaunch` prepares Electron, compiled output, and built-in extensions for the development launcher. The development launcher can resolve to English even when the packaged application's fresh-profile default is Spanish; verify localization in a package with a disposable profile.

For a macOS arm64 package build on an equipped macOS host:

```sh
rtk npm run gulp core-ci
rtk npm run gulp vscode-darwin-arm64-min-ci
```

Linux DEB/RPM packaging additionally requires `RHS_IA_LINUX_MAINTAINER` to contain the approved maintainer in `Name <email>` form. The build deliberately has no upstream contact fallback. Windows Store/AppX packaging is not supported.

These commands build a local artifact; they do not sign, notarize, or publish an installer. Check the actual output, bundled extensions, executable architectures, and startup behavior before distribution. Build targets for other platforms exist in the upstream toolchain but are not validated by this README.

## Validation for maintainers

Compile before running relevant tests. Do not use `npm run compile` for TypeScript in this repository.

```sh
rtk npm run typecheck-client
rtk npm run gulp compile-extensions
rtk npm run validate-rhs-ia-extension-inventory
rtk npm run validate-spanish-session-localization
rtk npm run valid-layers-check
```

For changes under `build/`, also run `rtk npm run typecheck` from that directory. The [offline documentation extension](extensions/rhs-ia-documentation/README.md) documents its own generate, build, audit, test, and bundle sequence. The [hygiene guide](docs/hygiene-guide-for-agents.md) covers source formatting and precommit checks. Use disposable profiles for startup, settings, and credential migration tests.

## Repository map

| Path                                                                   | Purpose                                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`src/`](src/)                                                         | Core desktop and workbench implementation, including RHS-IA startup and UI changes |
| [`extensions/`](extensions/)                                           | Built-in R, Python, theme, and documentation extensions                            |
| [`extensions/rhs-ia-documentation/`](extensions/rhs-ia-documentation/) | Offline bilingual help, search, source pages, and validation scripts               |
| [`build/`](build/) and [`scripts/`](scripts/)                          | Build, packaging, developer launch, and validators                                 |
| [`resources/`](resources/)                                             | Platform product resources                                                         |
| [`docs/upgrades/`](docs/upgrades/)                                     | Customization inventory and upstream-upgrade record                                |
| [`product.json`](product.json)                                         | Product identity, extension catalogs, endpoints, and runtime policy                |

Configuration belongs in the application's settings or the approved provider's configuration flow. Keep API keys and other secrets out of this repository and use disposable credentials for validation. The product catalog includes upstream extension and service identifiers whose names and URLs cannot be changed without replacing those dependencies.

## Maintenance and reporting

Review the [customization ledger](docs/upgrades/rhs-customizations.md) and its [machine-readable inventory](docs/upgrades/rhs-customizations.json) before changing an RHS-IA adaptation or importing a new upstream version. Record both the implementation and its verification in those files. Open an issue in the [RHS-IA repository](https://github.com/juliusHeartS/RHS-IA/issues) for repository-specific problems. Upstream issues belong to their respective upstream projects.

## Attribution and license

RHS-IA modifies Positron by Posit Software, PBC, and Code OSS by Microsoft. It is not an official Positron distribution. Preserve the notices in [`LICENSE.txt`](LICENSE.txt), [`NOTICE`](NOTICE), and [`ThirdPartyNotices.txt`](ThirdPartyNotices.txt), along with the licenses and attribution supplied by individual extensions and submodules. Positron trademarks and copyright remain with their owners. The offline documentation extension has its own [license and provenance](extensions/rhs-ia-documentation/LICENSE.txt).
