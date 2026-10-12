---
type: Dataset
title: BHS_admin1
description: "Dataset csv: BHS_admin1 — 8 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_bhs_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:24.637Z
file_format: csv
size_bytes: 994
file_sha256: 4a71b445b974c8879843b8315c13b01862db32219c97b49f8e314e393f0216bd
encoding: auto
sheet_count: 1
row_count: 8
column_count: 6
resource: data/subnacionales/BHS_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:24.637Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: BHS_admin1.csv
      n_rows: 8
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: BHS
          max: BHS
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 4
          min: Abaco
          max: Other Islands
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 2
          min: 2010
          max: 2022
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 8
          min: 16695
          max: 296732
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
          min: BNSI Bahamas, Census 2022 Figura 8 (población por isla/grupo, 2010 y 2022)
          max: BNSI Bahamas, Census 2022 Figura 8 (población por isla/grupo, 2010 y 2022)
sources:
  - id: original
    resource: data/subnacionales/BHS_admin1.csv
    title: BHS_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/BHS_admin1.csv
    algorithm: sha256
    value: 4a71b445b974c8879843b8315c13b01862db32219c97b49f8e314e393f0216bd
    size: 994
    modified_at: 2026-09-13T20:06:29.547Z
---

# BHS_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/BHS_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: BHS_admin1.csv — 8 filas × 6 columnas
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
