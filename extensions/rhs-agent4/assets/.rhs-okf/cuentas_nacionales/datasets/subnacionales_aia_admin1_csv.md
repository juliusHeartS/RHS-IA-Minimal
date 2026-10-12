---
type: Dataset
title: AIA_admin1
description: "Dataset csv: AIA_admin1 — 224 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_aia_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:24.527Z
file_format: csv
size_bytes: 25909
file_sha256: 9491f7e878dc8f31adb3106cad3be34d83031b952482f8ece6752a46436e9ed0
encoding: auto
sheet_count: 1
row_count: 224
column_count: 6
resource: data/subnacionales/AIA_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:24.527Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: AIA_admin1.csv
      n_rows: 224
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: AIA
          max: AIA
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 15
          min: Blowing Point
          max: West End
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 5
          min: 1974
          max: 2011
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 214
          min: 0.04
          max: 1689
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
          min: Anguilla Statistics Department, población por distrito (censos 1974-2011)
          max: Anguilla Statistics Department, población por distrito (censos 1974-2011)
sources:
  - id: original
    resource: data/subnacionales/AIA_admin1.csv
    title: AIA_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/AIA_admin1.csv
    algorithm: sha256
    value: 9491f7e878dc8f31adb3106cad3be34d83031b952482f8ece6752a46436e9ed0
    size: 25909
    modified_at: 2026-09-13T20:06:29.546Z
---

# AIA_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/AIA_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.02 MB
- **Hojas**: 1
### Hoja: AIA_admin1.csv — 224 filas × 6 columnas
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
