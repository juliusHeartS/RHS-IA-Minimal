# Integracion rhs-okf con rhs-agent

Fecha: 2026-08-05.

Este documento describe la integracion vigente entre `rhs-okf` y `rhs-agent`.

## Responsabilidades

`rhs-agent` es la extension y el agente basado en LLM. Administra el chat, las skills, los comandos `/`, las capacidades de Positron, la conversion mediante herramientas externas, el RAG local/global y la construccion semantica del OKF local.

`rhs-okf` es el motor deterministico de OKF. Provee reglas, packs, identidad, hashes, ledger, conversiones disponibles, perfiles de datos, escritura formal, ciclo de vida y validacion. No contiene un LLM y no debe asumir que el dominio es PAHO, OPS, RHS o Mendoza en su capa generica.

## Forma de integracion vigente

`rhs-agent`/Capibara v2 incluye una copia vendorizada de `rhs-okf` bajo:

```text
/Users/julius3005/Documents/Github/rhs-agent2/src/resources/rhs-okf/
```

Al construir el VSIX, `rhs-agent` empaqueta ese runtime para invocarlo como CLI local. La ruta default en instalacion queda dentro de:

```text
<extension>/resources/rhs-okf/dist/cli.js
```

La integracion principal no es un VSIX separado de `rhs-okf`; tampoco depende de un MCP separado para el flujo `/build-okf`.

## Flujo `/build-okf`

Cuando el usuario escribe `/build-okf` en el chat:

1. `rhs-agent` resuelve el comando a la skill institucional protegida `build-okf`.
2. La skill instruye al agente a usar solamente `Docs/` y `Data/` como fuentes locales.
3. `rhs-agent` reutiliza Markdown, llama a `pdfstruct-rust` para PDF y a Pandoc para formatos de oficina admitidos.
4. `rhs-agent` perfila `Data/` con las capacidades disponibles.
5. El LLM de `rhs-agent` interpreta documentos y datos, redacta conceptos y relaciones, y mantiene procedencia.
6. `rhs-agent` invoca `rhs-okf ingest <workspace> --prepared-manifest Docs/.pdfstruct-manifest.json --json` para escribir, validar identidad, crear fingerprints y generar conceptos derivados de gobernanza cuando el pack lo soporte.
7. `rhs-agent` invoca `rhs-okf verify <workspace> --json` y revisa todos los niveles: `minimal`, `pack`, `ingest`, `provenance`, `ledger` y `profile`.
8. Si la ingesta OKF valida, `rhs-agent` actualiza el RAG local.
9. El resultado local se escribe en `.okf-local/` o `.rhs-okf/` segun el detector de bundle local, ademas de `.docs_corpus/` y `.rhs-rag/`.

`Indicaciones.md` no configura ni alimenta la construccion OKF. Ese archivo se usa para limitar respuestas, calculos, geografia, formulas o criterios de dominio cuando el agente responde preguntas.

## Capas protegidas

`rhs-agent` provisiona conocimiento institucional en capas separadas:

```text
.rhs-okf/
.baseglobal/
.rhs-rag-canonical/
```

Estas capas no son editables por el usuario ni por `/build-okf`. Cualquier cambio del core requiere gobernanza institucional y versionado separado en `rhs-okf-core`.

## Packs de dominio

`rhs-okf` carga un pack de dominio por:

1. `--pack-root <path>`.
2. `RHS_OKF_PACK_ROOT`.
3. `packs/rhs` como default.

El contrato para construir y consumir packs esta en `docs/pack-contract.md`.

El perfil de gobernanza esta documentado en `docs/okf-profile-governance.md`.
Cuando un pack declara `defaults.source_type` y `defaults.hub_type`, `rhs-okf`
genera conceptos derivados de fuente e hubs. Esos conceptos tienen
`derived: true` y son reconstruibles; no sustituyen las fuentes ni el ledger.

El pack RHS es el default para BPK/PAHO, pero no debe contaminar la capa generica. Si `rhs-agent` trabaja en otro dominio, debe seleccionar un pack externo y pasar esa seleccion al CLI.

## Verificacion esperada

La integracion debe verificarse en tres niveles:

- Pruebas unitarias de `rhs-okf`: pack, ingesta, validacion, perfilado y ausencia de supuestos de dominio en la capa generica.
- Pruebas de gobernanza de `rhs-okf`: fingerprints, seccion `## Evidence`, footnotes coherentes, hubs derivados y deteccion de drift de fuentes.
- Pruebas de `rhs-agent`: resolucion protegida de `/build-okf`, exclusion de fuentes externas, puente OKF a RAG y degradacion fuera de Positron.
- Pruebas instaladas del VSIX: Positron, RHS-IA y Visual Studio Code, con hashes de recursos empaquetados y ejecucion del webview real.

## Estado del MCP

El MCP documentado historicamente puede retomarse como extension futura para busqueda o inspeccion de bundles, pero no es la ruta actual de produccion para construir el OKF local desde `rhs-agent`. Cualquier reactivacion del MCP debe documentarse y probarse como capacidad adicional, no como sustituto del flujo `/build-okf`.
