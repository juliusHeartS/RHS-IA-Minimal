---
type: Dataset
title: VGB_admin1
description: "Dataset csv: VGB_admin1 — 1 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_vgb_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:26.864Z
file_format: csv
size_bytes: 226
file_sha256: ee4f745e6333f1897a6be0b0d28f7b29a47a0a7f121204e4a7498fc85724e735
encoding: auto
sheet_count: 1
row_count: 1
column_count: 6
resource: data/subnacionales/VGB_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:26.864Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: VGB_admin1.csv
      n_rows: 1
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: VGB
          max: VGB
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: BVI (total, desglose por distrito pendiente)
          max: BVI (total, desglose por distrito pendiente)
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2020
          max: 2020
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 1
          min: 30037
          max: 30037
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
          min: BVI Central Statistics Office, Census 2020 (total preliminar enumerado; desglose por distrito no publicado)
          max: BVI Central Statistics Office, Census 2020 (total preliminar enumerado; desglose por distrito no publicado)
sources:
  - id: original
    resource: data/subnacionales/VGB_admin1.csv
    title: VGB_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/VGB_admin1.csv
    algorithm: sha256
    value: ee4f745e6333f1897a6be0b0d28f7b29a47a0a7f121204e4a7498fc85724e735
    size: 226
    modified_at: 2026-09-13T20:06:29.556Z
---

# VGB_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/VGB_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: VGB_admin1.csv — 1 filas × 6 columnas
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
