# Data-profiler de rhs-okf

> Especificación del componente que **estudia** los archivos de `Data/` para generar un concepto OKF `Dataset`.
> Principio rector: **Data NO se convierte a markdown, NO se vectoriza, NO entra al corpus/RAG.** Se perfila y se opera con herramientas (Positron/tablas del agente).
> v1.1 — 2026-08-05. **Sin Python en rhs-okf.**

## 1. Objetivo y restricciones

Dado un archivo en `Data/`, producir una **ficha de metadatos** (no el dato) que el agente pueda leer para saber qué hay adentro, y apuntar al original preservado.

Restricciones duras:
- **Sin Python.** Motor en Node/TS; el cómputo analítico en **DuckDB** (C++ nativo vía `duckdb-node`).
- **No se markdowniza el dato.** El concepto `Dataset` describe; el dato queda en `Data/`.
- **No se vectoriza / no entra al RAG.** Sólo `Docs` va al corpus.
- **Streaming, sin cargar el archivo entero en memoria** (archivos pueden ser gigantescos).
- **No se modifica el original** en `Data/` (read-only; sólo se lee).
- **Presupuesto de tiempo** por archivo: configurable; perfil rápido siempre, perfil profundo sólo si cabe o por muestreo.

## 2. Formatos y herramienta por formato

| Formato | Ext | Cómo se perfila | Notas |
|---|---|---|---|
| CSV | .csv | DuckDB `read_csv_auto` | detectar delim/encoding/header |
| TSV | .tsv | DuckDB `read_csv_auto` (sep tab) | |
| JSON/JSONL | .json .jsonl | DuckDB `read_json_auto` | anidado -> aplanar/`structure` |
| Parquet | .parquet | DuckDB `read_parquet` | columnar, ideal para stats |
| Excel | .xlsx .xls | **Node lib** (sheetjs/xlsx) para estructura de hojas + volcar hoja a CSV temp -> DuckDB stats | DuckDB no lee xlsx nativo; si madura extensión duckdb-xlsx, se simplifica |
| ODS | .ods | **Node lib** (sheetjs/xlsx) para estructura de hojas + volcar hoja a CSV temp -> DuckDB stats | mismo contrato que Excel; soporte estructural, no ETL |
| DBF | .dbf | futuro | fuera del MVP |

Detección de formato: por extensión + sniffer de magic bytes (no confiar sólo en extensión).

## 3. Niveles de perfil

**Quick (siempre, barato):**
- Metadatos de archivo: `name`, `format`, `size_bytes`, `sha256`, `modified`.
- Estructura: hojas (xlsx) o una "hoja virtual" (csv/parquet/json); `n_rows`, `n_columns`.
- Nombres de columnas + tipos inferidos (DuckDB `DESCRIBE`).
- Muestra mínima: primeras N filas (p. ej. 5).

**Deep (opt-in o si `size < umbral`, p. ej. 500 MB; si no, por muestreo):**
- Por columna: `null_count`, `null_pct`, `distinct_count`, `min`, `max`, `sample_values` (pocos).
- Para categóricas con pocos distinct: lista de categorías (top K).
- Para numéricas: min/máx/percentiles básicos (opcional).

Para archivos gigantes, las stats profundas se calculan sobre una **muestra** (reservoir/sample) o se omiten; nunca se carga todo en Node.

## 4. Qué extrae (campos del perfil)

```
profiling:
  at: <ISO8601>
  by: rhs-okf/profiler-duckdb-<version>
  depth: quick | deep
  sampled: false | true        # si las stats vienen de muestra
  sample_rows: 5
encoding: <auto|null>
sheet_count: <int>
row_count: <int>
column_count: <int>
schema:
  sheets:
    - name: <hoja>
      n_rows: <int>
      n_columns: <int>
      columns:
        - name: <col>
          type: <inferido>      # integer|double|varchar|date|boolean|...
          null_count: <int>
          null_pct: <0..1>
          distinct_count: <int>
          min: <valor>
          max: <valor>
          sample_values: [<v>, <v>, <v>]
```

Los valores escalares devueltos por DuckDB se normalizan antes de escribir el perfil: `bigint` dentro del rango entero seguro de JavaScript pasa a `number`; fuera de ese rango pasa a texto. Las fechas se serializan como ISO-8601. Esto mantiene el perfil portable para YAML/JSON sin perder trazabilidad.

## 5. Consultas DuckDB (esquema)

Para una tabla `t` (registrada vía `read_csv_auto`/`read_parquet`/`read_json_auto`):

```sql
-- total y estructura
SELECT COUNT(*) AS n_rows FROM t;
DESCRIBE t;                       -- columnas + tipos

-- por columna c (deep)
SELECT
  COUNT(*) AS n,
  COUNT("c") AS non_null,
  COUNT(DISTINCT "c") AS distinct,
  MIN("c") AS min_v,
  MAX("c") AS max_v
FROM t;

-- muestra
SELECT * FROM t LIMIT 5;
```

Excel: primero con lib Node se enumeran hojas y encabezados; para stats se exporta la hoja a un CSV temporal y se perfilan esas columnas con DuckDB; el CSV temporal se borra al terminar.

## 6. Salida: concepto OKF `Dataset`

El generador OKF toma el perfil y escribe `datasets/<document_id>.md`:

- Frontmatter `type: Dataset` con `resource` → original en `Data/`, `file_sha256`, `vintage`, `profiling`, `schema` (§4).
- `generated.by: rhs-okf/profiler-duckdb-<v>`, `status: draft` (necesita revisión humana para `stable`).
- Cuerpo: descripción legible del dataset (qué es, hojas/variables, cobertura temporal si se infiere, advertencias de calidad p. ej. muchos nulls).
- `document_id = <file_stem>[_<ISO3>][_<vintage>]`.

Reingesta de datos (serie viva, §13): si el `file_sha256` cambia pero `document_id` coincide => actualizar in situ, refrescar `schema`/`profiling`, subir `generated.at`, **reiniciar `verified`**, agregar entrada `revisions`, y guardar `vintage` (snapshot del dato para citar versiones, útil en Fase 2 indicadores).

## 7. Casos límite

- Archivo enorme (> umbral): sólo `quick` + stats por muestreo; marcar `sampled: true`.
- Encoding raro (latin1/UTF-16): DuckDB `read_csv_auto` detecta; si falla, probar encodings explícitos; registrar en `profiling.notes`.
- CSV sin header: detectar y tratar primera fila como datos o como header según heurística; registrar.
- Excel multi-hoja: una entrada `sheets[]` por hoja; el `document_id` queda a nivel archivo (un `Dataset` por archivo), no por hoja.
- Hoja con encabezado no en fila 1: detectar fila de header; registrar `header_row`.
- Archivo corrupto/ilegible: registrar error en `profiling.error`, `status: draft`, no abortar el lote.

## 8. No-objetivos

- No limpiar ni transformar el dato (no ETL, no normalización).
- No cargar el dato en el agente como texto.
- No generar gráficos ni análisis (eso lo hace el agente con Positron sobre el `resource`).
- No inferir semántica RHS (eso lo hace el LLM del generador OKF a partir del perfil, proponiendo `description`/`tags`).
