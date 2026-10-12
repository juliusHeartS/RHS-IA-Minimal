---
type: Dataset
title: MEX_admin1
description: "Dataset csv: MEX_admin1 — 3232 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_mex_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.252Z
file_format: csv
size_bytes: 407833
file_sha256: 17c73a7776bc82f62e8a8018d60bd0297defac020b82211065dbc1085e5ebf60
encoding: auto
sheet_count: 1
row_count: 3232
column_count: 6
resource: data/subnacionales/MEX_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.252Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: MEX_admin1.csv
      n_rows: 3232
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: MEX
          max: MEX
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 32
          min: Aguascalientes
          max: Zacatecas
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 101
          min: 1970
          max: 2070
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 3232
          min: 95721
          max: 18474722
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
          min: CONAPO, población a mitad de año por entidad 1950-2070 (conciliación 2020-2070)
          max: CONAPO, población a mitad de año por entidad 1950-2070 (conciliación 2020-2070)
sources:
  - id: original
    resource: data/subnacionales/MEX_admin1.csv
    title: MEX_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/MEX_admin1.csv
    algorithm: sha256
    value: 17c73a7776bc82f62e8a8018d60bd0297defac020b82211065dbc1085e5ebf60
    size: 407833
    modified_at: 2026-09-13T20:06:29.553Z
---

# MEX_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/MEX_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.39 MB
- **Hojas**: 1
### Hoja: MEX_admin1.csv — 3232 filas × 6 columnas
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
