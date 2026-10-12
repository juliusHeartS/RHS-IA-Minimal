---
type: Dataset
title: TTO_admin1
description: "Dataset csv: TTO_admin1 — 15 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_tto_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.647Z
file_format: csv
size_bytes: 1976
file_sha256: 0e28c6abc86bf42373658ecfc7bd698e63d42942230ba3261bd4a122099ffbed
encoding: auto
sheet_count: 1
row_count: 15
column_count: 6
resource: data/subnacionales/TTO_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.647Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: TTO_admin1.csv
      n_rows: 15
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: TTO
          max: TTO
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 15
          min: Arima
          max: Tunapuna-Piarco
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2011
          max: 2011
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 15
          min: 20235
          max: 215119
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
          min: CSO Trinidad y Tobago, Census 2011 (población por ciudad/borough/región + Tobago)
          max: CSO Trinidad y Tobago, Census 2011 (población por ciudad/borough/región + Tobago)
sources:
  - id: original
    resource: data/subnacionales/TTO_admin1.csv
    title: TTO_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/TTO_admin1.csv
    algorithm: sha256
    value: 0e28c6abc86bf42373658ecfc7bd698e63d42942230ba3261bd4a122099ffbed
    size: 1976
    modified_at: 2026-09-13T20:06:29.554Z
---

# TTO_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/TTO_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: TTO_admin1.csv — 15 filas × 6 columnas
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
