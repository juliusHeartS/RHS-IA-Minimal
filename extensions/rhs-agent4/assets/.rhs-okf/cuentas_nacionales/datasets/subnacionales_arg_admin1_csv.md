---
type: Dataset
title: ARG_admin1
description: "Dataset csv: ARG_admin1 — 384 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_arg_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:24.591Z
file_format: csv
size_bytes: 45592
file_sha256: 401cc3801f380646b2f2b5c1318972cdbc81aa3aa218f6c15a1bd83dc80485ae
encoding: auto
sheet_count: 1
row_count: 384
column_count: 6
resource: data/subnacionales/ARG_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:24.591Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: ARG_admin1.csv
      n_rows: 384
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: ARG
          max: ARG
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 24
          min: Ciudad Autónoma de Buenos Aires
          max: Provincia del Neuquén
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 16
          min: 2022
          max: 2037
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 382
          min: 179645
          max: 17575301
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
          min: INDEC, proyecciones provinciales 2022-2040 (base censo 2022)
          max: INDEC, proyecciones provinciales 2022-2040 (base censo 2022)
sources:
  - id: original
    resource: data/subnacionales/ARG_admin1.csv
    title: ARG_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/ARG_admin1.csv
    algorithm: sha256
    value: 401cc3801f380646b2f2b5c1318972cdbc81aa3aa218f6c15a1bd83dc80485ae
    size: 45592
    modified_at: 2026-09-13T20:06:29.546Z
---

# ARG_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/ARG_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.04 MB
- **Hojas**: 1
### Hoja: ARG_admin1.csv — 384 filas × 6 columnas
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
