---
type: Dataset
title: BLZ_admin1
description: "Dataset csv: BLZ_admin1 — 66 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_blz_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:24.662Z
file_format: csv
size_bytes: 7408
file_sha256: c78acf31f783874fe1f096228af92cc3924dfcb6936f135c11f9e7f9cd366f12
encoding: auto
sheet_count: 1
row_count: 66
column_count: 6
resource: data/subnacionales/BLZ_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:24.662Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: BLZ_admin1.csv
      n_rows: 66
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: BLZ
          max: BLZ
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 6
          min: Belize
          max: Toledo
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 11
          min: 2015
          max: 2026
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 66
          min: 33879.17
          max: 118909.91
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
          min: SIB Belice, mid-year estimates by district 2015-2026 (Tabla 2.1 total)
          max: SIB Belice, mid-year estimates by district 2015-2026 (Tabla 2.1 total)
sources:
  - id: original
    resource: data/subnacionales/BLZ_admin1.csv
    title: BLZ_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/BLZ_admin1.csv
    algorithm: sha256
    value: c78acf31f783874fe1f096228af92cc3924dfcb6936f135c11f9e7f9cd366f12
    size: 7408
    modified_at: 2026-09-13T20:06:29.547Z
---

# BLZ_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/BLZ_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.01 MB
- **Hojas**: 1
### Hoja: BLZ_admin1.csv — 66 filas × 6 columnas
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
