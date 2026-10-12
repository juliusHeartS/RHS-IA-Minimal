---
type: Dataset
title: DMA_admin1
description: "Dataset csv: DMA_admin1 — 10 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_dma_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.459Z
file_format: csv
size_bytes: 1342
file_sha256: 492162e36e970235c75218942fb170588124b0477739646f383eb5abaa0598ba
encoding: auto
sheet_count: 1
row_count: 10
column_count: 6
resource: data/subnacionales/DMA_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.459Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: DMA_admin1.csv
      n_rows: 10
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: DMA
          max: DMA
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 10
          min: Saint Andrew
          max: Saint Peter
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 1
          min: 2011
          max: 2011
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 10
          min: 1430
          max: 21241
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
          min: Dominica CSO, Census 2011 (población por parroquia; censo 2022 sin desglose publicado)
          max: Dominica CSO, Census 2011 (población por parroquia; censo 2022 sin desglose publicado)
sources:
  - id: original
    resource: data/subnacionales/DMA_admin1.csv
    title: DMA_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/DMA_admin1.csv
    algorithm: sha256
    value: 492162e36e970235c75218942fb170588124b0477739646f383eb5abaa0598ba
    size: 1342
    modified_at: 2026-09-13T20:06:29.550Z
---

# DMA_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/DMA_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.00 MB
- **Hojas**: 1
### Hoja: DMA_admin1.csv — 10 filas × 6 columnas
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
