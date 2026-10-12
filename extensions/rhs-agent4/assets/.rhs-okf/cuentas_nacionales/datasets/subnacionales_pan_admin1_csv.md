---
type: Dataset
title: PAN_admin1
description: "Dataset csv: PAN_admin1 — 663 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_pan_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.382Z
file_format: csv
size_bytes: 61527
file_sha256: bfbffae48bf40ba417eca7351894d628430f642316a94f557542d0b811ca1ce3
encoding: auto
sheet_count: 1
row_count: 663
column_count: 6
resource: data/subnacionales/PAN_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.382Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: PAN_admin1.csv
      n_rows: 663
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: PAN
          max: PAN
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 13
          min: Bocas del Toro
          max: Veraguas
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 51
          min: 2000
          max: 2050
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 663
          min: 9445
          max: 1789833
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
          min: INEC Panamá, revisión post-censo 2023 (Cuadro 3)
          max: INEC Panamá, revisión post-censo 2023 (Cuadro 3)
sources:
  - id: original
    resource: data/subnacionales/PAN_admin1.csv
    title: PAN_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/PAN_admin1.csv
    algorithm: sha256
    value: bfbffae48bf40ba417eca7351894d628430f642316a94f557542d0b811ca1ce3
    size: 61527
    modified_at: 2026-09-13T20:06:29.553Z
---

# PAN_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/PAN_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.06 MB
- **Hojas**: 1
### Hoja: PAN_admin1.csv — 663 filas × 6 columnas
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
