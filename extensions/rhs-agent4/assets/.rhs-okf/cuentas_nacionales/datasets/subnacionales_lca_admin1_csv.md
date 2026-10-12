---
type: Dataset
title: LCA_admin1
description: "Dataset csv: LCA_admin1 — 20 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_lca_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.018Z
file_format: csv
size_bytes: 2340
file_sha256: e1f1d3483955ad5f29842b89a88b1e0538730ce6ad92d93e431176a647bfe285
encoding: auto
sheet_count: 1
row_count: 20
column_count: 6
resource: data/subnacionales/LCA_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.018Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: LCA_admin1.csv
      n_rows: 20
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: LCA
          max: LCA
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 10
          min: Anse La Raye
          max: Vieux Fort
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 2
          min: 2010
          max: 2022
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 19
          min: 2044
          max: 65656
        - name: tipo
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: estimacion
          max: estimacion
        - name: fuente
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: St. Lucia CSO, Census 2022 provisional Table A.1 (población por distrito)
          max: St. Lucia CSO, Census 2022 provisional Table A.1 (población por distrito)
sources:
  - id: original
    resource: data/subnacionales/LCA_admin1.csv
    title: LCA_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/LCA_admin1.csv
    algorithm: sha256
    value: e1f1d3483955ad5f29842b89a88b1e0538730ce6ad92d93e431176a647bfe285
    size: 2340
    modified_at: 2026-09-13T20:06:29.552Z
---

# LCA_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/LCA_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: LCA_admin1.csv — 20 filas × 6 columnas
- `iso3` (VARCHAR), nulls: 0
- `admin1` (VARCHAR), nulls: 0
- `anio` (BIGINT), nulls: 0
- `poblacion` (DOUBLE), nulls: 0
- `tipo` (VARCHAR), nulls: 0
- `fuente` (VARCHAR), nulls: 0
## Trazabilidad
Perfil generado por rhs-okf/profiler-duckdb.[^original]
## Evidence
- Archivo de datos original preservado y perfilado sin sustituir el dato.[^original]
[^original]: Archivo original preservado en sources/data/
_Perfil de dataset integrado en CoreOKF._
