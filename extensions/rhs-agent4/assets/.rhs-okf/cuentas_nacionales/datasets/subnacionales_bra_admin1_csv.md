---
type: Dataset
title: BRA_admin1
description: "Dataset csv: BRA_admin1 — 1917 filas, 6 columnas"
tags:
  - dataset
  - csv
document_id: subnacionales_bra_admin1_csv
lang: es
status: draft
generated:
  by: rhs-okf/agent-heuristic
  integrated_by: rhs-agent
  at: 2026-09-13T21:14:24.946Z
file_format: csv
size_bytes: 224229
file_sha256: 1889c9fb791cae91ea5d79319a83ac1bf39a19e32cd1d924a88a9f52c4ab6954
encoding: auto
sheet_count: 1
row_count: 1917
column_count: 6
resource: data/subnacionales/BRA_admin1.csv
vintage: 2026-09-13
profiling:
  at: 2026-09-13T21:14:24.946Z
  by: rhs-okf/profiler-duckdb
  depth: deep
  sampled: false
schema:
  sheets:
    - name: BRA_admin1.csv
      n_rows: 1917
      n_columns: 6
      columns:
        - name: iso3
          type: VARCHAR
          null_count: 0
          distinct_count: 1
          min: BRA
          max: BRA
        - name: admin1
          type: VARCHAR
          null_count: 0
          distinct_count: 27
          min: Acre
          max: Tocantins
        - name: anio
          type: BIGINT
          null_count: 0
          distinct_count: 71
          min: 2000
          max: 2070
        - name: poblacion
          type: DOUBLE
          null_count: 0
          distinct_count: 1917
          min: 339804
          max: 46639530
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
          min: IBGE, Projeções da População Revisão 2024 (UF, suma edades simples)
          max: IBGE, Projeções da População Revisão 2024 (UF, suma edades simples)
sources:
  - id: original
    resource: data/subnacionales/BRA_admin1.csv
    title: BRA_admin1.csv
source_fingerprints:
  - resource: data/subnacionales/BRA_admin1.csv
    algorithm: sha256
    value: 1889c9fb791cae91ea5d79319a83ac1bf39a19e32cd1d924a88a9f52c4ab6954
    size: 224229
    modified_at: 2026-09-13T20:06:29.548Z
---

# BRA_admin1
## Descripción
Ficha de metadatos del archivo de datos `data/subnacionales/BRA_admin1.csv`. **No es el dato**: el archivo original se preserva en `sources/data/` y se opera con herramientas (Positron/tablas).
## Estructura
- **Formato**: csv
- **Tamaño**: 0.21 MB
- **Hojas**: 1
### Hoja: BRA_admin1.csv — 1917 filas × 6 columnas
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
