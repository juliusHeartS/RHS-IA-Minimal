---
type: Dataset
title: GTM_admin1
description: "Dataset csv: GTM_admin1 — 352 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_gtm_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.846Z
file_format: csv
size_bytes: 34216
file_sha256: ad0d4c3eb5d2e1dafea38962c34ac2b58570769918a254ba8403bbce33107c52
encoding: auto
sheet_count: 1
row_count: 352
column_count: 6
resource: data/subnacionales/GTM_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.846Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: GTM_admin1.csv
      n_rows: 352
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: GTM
          max: GTM
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 22
          min: Alta Verapaz
          max: Zacapa
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 16
          min: 2015
          max: 2030
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 352
          min: 185607
          max: 3897177
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
          min: INE Guatemala, proyecciones 2015-2030 base censo 2018
          max: INE Guatemala, proyecciones 2015-2030 base censo 2018
sources:
  - id: original
    resource: data/subnacionales/GTM_admin1.csv
    title: GTM_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/GTM_admin1.csv
    algorithm: sha256
    value: ad0d4c3eb5d2e1dafea38962c34ac2b58570769918a254ba8403bbce33107c52
    size: 34216
    modified_at: 2026-09-13T20:06:29.551Z
---

# GTM_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/GTM_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.03 MB
- **Hojas**: 1
### Hoja: GTM_admin1.csv — 352 filas × 6 columnas
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
