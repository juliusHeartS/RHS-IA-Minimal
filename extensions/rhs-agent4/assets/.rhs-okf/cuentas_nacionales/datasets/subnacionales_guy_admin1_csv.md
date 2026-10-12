---
type: Dataset
title: GUY_admin1
description: "Dataset csv: GUY_admin1 — 20 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_guy_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.870Z
file_format: csv
size_bytes: 3314
file_sha256: db2ee818c891d278cf9c630255380f61ea48cae6e9b3b55ebcd40be6423c1d72
encoding: auto
sheet_count: 1
row_count: 20
column_count: 6
resource: data/subnacionales/GUY_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.870Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: GUY_admin1.csv
      n_rows: 20
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: GUY
          max: GUY
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 10
          min: Region 1 (Barima-Waini)
          max: Region 9 (Upper Takutu-Upper Essequibo)
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 2
          min: 2012
          max: 2022
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 20
          min: 11077
          max: 347759
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
          min: Guyana Bureau of Statistics, Preliminary Census 2022 Tabla 1.6 (población por región, 2012 y 2022)
          max: Guyana Bureau of Statistics, Preliminary Census 2022 Tabla 1.6 (población por región, 2012 y 2022)
sources:
  - id: original
    resource: data/subnacionales/GUY_admin1.csv
    title: GUY_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/GUY_admin1.csv
    algorithm: sha256
    value: db2ee818c891d278cf9c630255380f61ea48cae6e9b3b55ebcd40be6423c1d72
    size: 3314
    modified_at: 2026-09-13T20:06:29.551Z
---

# GUY_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/GUY_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: GUY_admin1.csv — 20 filas × 6 columnas
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
