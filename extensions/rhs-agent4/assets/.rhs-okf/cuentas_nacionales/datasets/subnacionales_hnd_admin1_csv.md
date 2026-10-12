---
type: Dataset
title: HND_admin1
description: "Dataset csv: HND_admin1 — 324 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_hnd_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.928Z
file_format: csv
size_bytes: 37133
file_sha256: 0efb52aaaaf05fd3aa8dc44d6c918457edd629bba9721ffe6282109cedfb27e6
encoding: auto
sheet_count: 1
row_count: 324
column_count: 6
resource: data/subnacionales/HND_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.928Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: HND_admin1.csv
      n_rows: 324
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: HND
          max: HND
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 18
          min: Atlántida
          max: Yoro
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 18
          min: 2013
          max: 2030
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 324
          min: 62423
          max: 2123509
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
          min: "INE Honduras Tomo 10: proyecciones departamentales 2013-2030 (censo 2013)"
          max: "INE Honduras Tomo 10: proyecciones departamentales 2013-2030 (censo 2013)"
sources:
  - id: original
    resource: data/subnacionales/HND_admin1.csv
    title: HND_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/HND_admin1.csv
    algorithm: sha256
    value: 0efb52aaaaf05fd3aa8dc44d6c918457edd629bba9721ffe6282109cedfb27e6
    size: 37133
    modified_at: 2026-09-13T20:06:29.551Z
---

# HND_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/HND_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.04 MB
- **Hojas**: 1
### Hoja: HND_admin1.csv — 324 filas × 6 columnas
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
