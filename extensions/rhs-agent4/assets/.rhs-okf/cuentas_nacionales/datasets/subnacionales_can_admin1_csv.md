---
type: Dataset
title: CAN_admin1
description: "Dataset csv: CAN_admin1 — 1020 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_can_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.114Z
file_format: csv
size_bytes: 103002
file_sha256: 6d3f6b94cdeaad3a99b3f13a41a8e665464b16ec7b10bb5008b8999abb177e3c
encoding: auto
sheet_count: 1
row_count: 1020
column_count: 6
resource: data/subnacionales/CAN_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.114Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: CAN_admin1.csv
      n_rows: 1020
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: CAN
          max: CAN
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 14
          min: Alberta
          max: Yukon
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 80
          min: 1971
          max: 2050
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 1005
          min: 18991
          max: 19181700
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
          min: Statistics Canada 17-10-0005 (est) y 17-10-0057 M (proy)
          max: Statistics Canada 17-10-0005 (est) y 17-10-0057 M (proy)
sources:
  - id: original
    resource: data/subnacionales/CAN_admin1.csv
    title: CAN_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/CAN_admin1.csv
    algorithm: sha256
    value: 6d3f6b94cdeaad3a99b3f13a41a8e665464b16ec7b10bb5008b8999abb177e3c
    size: 103002
    modified_at: 2026-09-13T20:06:29.548Z
---

# CAN_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/CAN_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.10 MB
- **Hojas**: 1
### Hoja: CAN_admin1.csv — 1020 filas × 6 columnas
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
