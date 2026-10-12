---
type: Dataset
title: MSR_admin1
description: "Dataset csv: MSR_admin1 — 2 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_msr_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.274Z
file_format: csv
size_bytes: 368
file_sha256: e3a911247d695c24d18ed60ec9ae344c36f56bb1adfc8a56e4358851f56dc92b
encoding: auto
sheet_count: 1
row_count: 2
column_count: 6
resource: data/subnacionales/MSR_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.274Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: MSR_admin1.csv
      n_rows: 2
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: MSR
          max: MSR
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: Montserrat (total, por EA en xlsx oficial)
          max: Montserrat (total, por EA en xlsx oficial)
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 2
          min: 2019
          max: 2023
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 2
          min: 4519
          max: 4738
        - name: tipo
          type: VARCHAR
          null_count: 0
          distinct_count: 2
          min: estimacion
          max: proyeccion
        - name: fuente
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: Montserrat Statistics Department, Mid-Year Population Estimates 2019-2025 (xlsx oficial)
          max: Montserrat Statistics Department, Mid-Year Population Estimates 2019-2025 (xlsx oficial)
sources:
  - id: original
    resource: data/subnacionales/MSR_admin1.csv
    title: MSR_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/MSR_admin1.csv
    algorithm: sha256
    value: e3a911247d695c24d18ed60ec9ae344c36f56bb1adfc8a56e4358851f56dc92b
    size: 368
    modified_at: 2026-09-13T20:06:29.553Z
---

# MSR_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/MSR_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: MSR_admin1.csv — 2 filas × 6 columnas
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
