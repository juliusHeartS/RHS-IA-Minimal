---
type: Dataset
title: VCT_admin1
description: "Dataset csv: VCT_admin1 — 26 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_vct_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.794Z
file_format: csv
size_bytes: 3288
file_sha256: 3266750415f896eca66294474a848428aa23432e3192581947a7890ed8296e5f
encoding: auto
sheet_count: 1
row_count: 26
column_count: 6
resource: data/subnacionales/VCT_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.794Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: VCT_admin1.csv
      n_rows: 26
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: VCT
          max: VCT
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 13
          min: 01 - Kingstown
          max: 13 - Southern Grenadines
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 2
          min: 2001
          max: 2012
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 26
          min: 2576
          max: 23908
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
          min: SVG Statistical Office, Census 2012 Table B (población por Census Division)
          max: SVG Statistical Office, Census 2012 Table B (población por Census Division)
sources:
  - id: original
    resource: data/subnacionales/VCT_admin1.csv
    title: VCT_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/VCT_admin1.csv
    algorithm: sha256
    value: 3266750415f896eca66294474a848428aa23432e3192581947a7890ed8296e5f
    size: 3288
    modified_at: 2026-09-13T20:06:29.555Z
---

# VCT_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/VCT_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: VCT_admin1.csv — 26 filas × 6 columnas
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
