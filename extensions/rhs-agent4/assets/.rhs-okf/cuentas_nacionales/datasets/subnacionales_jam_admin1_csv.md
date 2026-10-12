---
type: Dataset
title: JAM_admin1
description: "Dataset csv: JAM_admin1 — 14 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_jam_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.971Z
file_format: csv
size_bytes: 1890
file_sha256: 19b7009aba65a4efe0c9c03f42edcfa54350393c26ba6c00315faec859d9aafe
encoding: auto
sheet_count: 1
row_count: 14
column_count: 6
resource: data/subnacionales/JAM_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.971Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: JAM_admin1.csv
      n_rows: 14
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: JAM
          max: JAM
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 14
          min: Clarendon
          max: Westmoreland
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2011
          max: 2011
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 14
          min: 69471
          max: 572059
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
          min: STATIN Jamaica, Census 2011 (población por parroquia; censo 2022 pendiente de desglose)
          max: STATIN Jamaica, Census 2011 (población por parroquia; censo 2022 pendiente de desglose)
sources:
  - id: original
    resource: data/subnacionales/JAM_admin1.csv
    title: JAM_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/JAM_admin1.csv
    algorithm: sha256
    value: 19b7009aba65a4efe0c9c03f42edcfa54350393c26ba6c00315faec859d9aafe
    size: 1890
    modified_at: 2026-09-13T20:06:29.552Z
---

# JAM_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/JAM_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: JAM_admin1.csv — 14 filas × 6 columnas
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
