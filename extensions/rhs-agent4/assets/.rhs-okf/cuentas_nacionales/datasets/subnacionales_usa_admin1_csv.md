---
type: Dataset
title: USA_admin1
description: "Dataset csv: USA_admin1 — 312 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_usa_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.769Z
file_format: csv
size_bytes: 31485
file_sha256: 6e6a7ee3caf068b815e2162bd5edbfcd9a67c9dd6f7e25e738ecb2aabd7f5d67
encoding: auto
sheet_count: 1
row_count: 312
column_count: 6
resource: data/subnacionales/USA_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.769Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: USA_admin1.csv
      n_rows: 312
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: USA
          max: USA
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 52
          min: Alabama
          max: Wyoming
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 6
          min: 2020
          max: 2025
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 312
          min: 577669
          max: 39527808
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
          min: US Census Bureau, Vintage 2025 state population estimates
          max: US Census Bureau, Vintage 2025 state population estimates
sources:
  - id: original
    resource: data/subnacionales/USA_admin1.csv
    title: USA_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/USA_admin1.csv
    algorithm: sha256
    value: 6e6a7ee3caf068b815e2162bd5edbfcd9a67c9dd6f7e25e738ecb2aabd7f5d67
    size: 31485
    modified_at: 2026-09-13T20:06:29.555Z
---

# USA_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/USA_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.03 MB
- **Hojas**: 1
### Hoja: USA_admin1.csv — 312 filas × 6 columnas
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
