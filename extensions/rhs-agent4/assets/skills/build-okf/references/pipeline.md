---
title: Pipeline determinista OKF y RAG
description: Comandos exactos, preparación documental, perfilado de Data y orden obligatorio del pipeline local.
---

# Pipeline determinista OKF y RAG

## Preparar documentos

Inventariar recursivamente sólo `Docs/` y `Data/`.

- PDF: comprobar determinísticamente que exista un Markdown final no vacío con
  el mismo nombre base, ya sea adyacente al PDF o en la carpeta Markdown
  paralela. Si existe, reutilizarlo y no invocar `process_pdf`. Si falta, cargar
  `pdfstruct` e invocar `process_pdf` únicamente para ese PDF; nunca procesar
  toda la carpeta como sustituto de la comprobación.
- DOCX, ODT, RTF, HTML y EPUB: usar Pandoc cuando esté disponible. Crear un
  Markdown visible bajo `Docs/` con el mismo nombre base y conservar la fuente.
- MD, Markdown y TXT: usar directamente o copiar como Markdown canónico.
- PPTX: no declarar soporte sin verificar el extractor durante la ejecución.

Si falta el Markdown final de un PDF, volver a `/pdfstruct` para producirlo. Un
fallo se informa con la ruta concreta y no elimina los Markdown que ya fueron
producidos para los demás documentos.

## Ejecutar el pipeline

Ejecutar un solo comando por llamada a `execute_command`. No agregar pipes,
comentarios shell, analizadores auxiliares, cadenas `&&` ni envolturas `2>&1`.
Conservar y leer la salida JSON original.

El manifiesto es un índice derivado, no la autoridad para decidir si falta un
Markdown. El runtime lo reconcilia con el inventario actual antes de la ingesta.
Nunca ejecutar `rhs-okf ingest` sin `--prepared-manifest` dentro de este flujo:
esa variante permite que `rhs-okf` intente convertir PDF por su cuenta.

Si el manifiesto es completo y coherente, ejecutar:

```text
rhs-okf ingest <workspace> --prepared-manifest Docs/.pdfstruct-manifest.json --bundle-dir .okf-local --json
```

Después del enriquecimiento semántico y de una segunda verificación exitosa,
ejecutar:

```text
rhs-okf verify <workspace> --bundle-dir .okf-local --json
rhs-rag ingest --input <workspace>/.docs_corpus --doc-type project --lancedb-dir <workspace>/.rhs-rag/lancedb --prune-missing --json
```

`--input` y `--lancedb-dir` son obligatorios. No usar entrada posicional ni
`--db`. No ejecutar `rhs-okf reset` dentro del flujo ni como recuperación de un
error.

Interpretar `summary.governance.sources` y `summary.governance.hubs` como
conceptos de gobernanza derivados, no como fuentes del usuario. En la
verificación revisar `minimal`, `pack`, `ingest`, `provenance`, `ledger` y
`profile`. Los errores de `profile` son fallos de gobernanza; sus advertencias
son deuda de calidad que debe reportarse.

## Perfilar Data

Conservar siempre el perfil determinista de CSV, TSV, JSON, JSONL, Parquet,
XLS, XLSX y ODS soportados. Sólo después del pipeline determinista puede usarse
R o Python para enriquecimiento.

Antes de ese enriquecimiento, comprobar la matriz de capacidades de Positron:
ejecución, sesiones activas, inspección de variables, resumen de tablas,
gráficos y disponibilidad del perfilado. Si una capacidad falta, registrar la
degradación y continuar. No llamar a `inspect_variables` o
`get_table_summary` a ciegas. Para `execute_code`, usar `language: r` o
`language: python`, nunca `languageId`.

## Interpretación semántica

Usar el LLM para comprender dominio, jerarquías, relaciones, calidad de títulos
y descripciones después de la ingesta determinista. La edición semántica está
limitada a los conceptos `draft` generados durante la ejecución actual y a sus
`index.md`; no se editan conceptos humanos, conceptos estables ni fuentes.

La edición debe seguir OKF v0.2:

- expresar jerarquía con carpetas e `index.md`;
- expresar relaciones en prosa y enlaces Markdown resolubles, no con una
  taxonomía o campo `relationship` inventado;
- conservar `type`, `document_id`, `status`, `generated`, `sources`,
  `source_file`, fingerprints, extracción y estados de revisión gobernados;
- mejorar `title`, `description`, `tags` y el cuerpo sólo con evidencia de
  `Docs/`, `Data/` o el concepto enlazado;
- usar secciones estructurales como `# Schema`, `# Examples` o `# Computation`
  cuando correspondan, sin fabricar columnas, claves o resultados;
- dejar `status: draft` y no declarar `verified` humano. Una relación entre
  datasets debe indicar las columnas candidatas y exigir comprobación con R o
  Python antes de calcular.

Después de editar, ejecutar `rhs-okf verify` y corregir sus errores antes de
construir el RAG. Las advertencias de perfil se reportan como deuda de calidad.
