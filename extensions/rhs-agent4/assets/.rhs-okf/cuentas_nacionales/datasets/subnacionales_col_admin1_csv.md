---
type: Dataset
title: COL_admin1
description: "Dataset csv: COL_admin1 — 1089 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_col_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.340Z
file_format: csv
size_bytes: 101618
file_sha256: 8477414f2d7387fbabb25919e5f3ac99ee4ed40f0868e9d4e868e6006342b57d
encoding: auto
sheet_count: 1
row_count: 1089
column_count: 6
resource: data/subnacionales/COL_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.340Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: COL_admin1.csv
      n_rows: 1089
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: COL
          max: COL
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 33
          min: Amazonas
          max: Vichada
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 33
          min: 2018
          max: 2050
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 1088
          min: 40774
          max: 7945996
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
          min: DANE, proyecciones departamentales base CNPV 2018
          max: DANE, proyecciones departamentales base CNPV 2018
sources:
  - id: original
    resource: data/subnacionales/COL_admin1.csv
    title: COL_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/COL_admin1.csv
    algorithm: sha256
    value: 8477414f2d7387fbabb25919e5f3ac99ee4ed40f0868e9d4e868e6006342b57d
    size: 101618
    modified_at: 2026-09-13T20:06:29.549Z
---

# COL_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/COL_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.10 MB
- **Hojas**: 1
### Hoja: COL_admin1.csv — 1089 filas × 6 columnas
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
