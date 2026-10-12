---
type: Dataset
title: CRI_admin1
description: "Dataset csv: CRI_admin1 — 224 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_cri_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:25.391Z
file_format: csv
size_bytes: 33621
file_sha256: bafe6059684452699a7343bc14ccaa547a39cf0d26479b47ac97006c23548472
encoding: auto
sheet_count: 1
row_count: 224
column_count: 6
resource: data/subnacionales/CRI_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:25.391Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: CRI_admin1.csv
      n_rows: 224
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: CRI
          max: CRI
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 7
          min: Alajuela
          max: San José
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 32
          min: 1993
          max: 2024
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 224
          min: 237183
          max: 1657287
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
          min: "INEC Costa Rica, población por provincia 1993-2025 (2020-2022 interpolado: celdas corruptas en XLS fuente)"
          max: "INEC Costa Rica, población por provincia 1993-2025 (2020-2022 interpolado: celdas corruptas en XLS fuente)"
sources:
  - id: original
    resource: data/subnacionales/CRI_admin1.csv
    title: CRI_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/CRI_admin1.csv
    algorithm: sha256
    value: bafe6059684452699a7343bc14ccaa547a39cf0d26479b47ac97006c23548472
    size: 33621
    modified_at: 2026-09-13T20:06:29.549Z
---

# CRI_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/CRI_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.03 MB
- **Hojas**: 1
### Hoja: CRI_admin1.csv — 224 filas × 6 columnas
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
