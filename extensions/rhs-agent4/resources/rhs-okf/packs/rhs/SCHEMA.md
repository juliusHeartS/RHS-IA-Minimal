# Pack RHS — Esquema de frontmatter OKF v0.2

> Especificación del "pack" de dominio **Recursos Humanos para la Salud (RHS/HRH)** para el motor `rhs-okf`.
> Define los `type` de concepto, el frontmatter base (v0.2: confianza/ciclo de vida/provenancia) y los campos por tipo, más las **reglas de `document_id`** que el motor usa para identidad, deduplicación y versionado (§13 de DecisionesArquitectura.md).
> v1 — 2026-07-29.

Este esquema documenta el pack RHS. El contrato agnostico para crear otros packs esta en `docs/pack-contract.md`.

## 1. Convenciones generales

- Todo concepto es un `.md` con frontmatter YAML (`---`) + cuerpo markdown.
- `type` es el único campo siempre obligatorio. Un concepto con sólo `type` es conforme.
- Filenames reservados (no son conceptos): `index.md` (listado de directorio), `log.md` (historial).
- El **concept ID** de OKF es la ruta del archivo sin `.md` (p. ej. `fuentes/atraer_retener_zonas_rurales`).
- `document_id` es el **slug lógico estable** que determina la ruta del concepto: `concept_path = <carpeta_por_type>/<document_id>`. Lo propone el LLM al ingerir; lo puede corregir un humano. Es la clave de identidad entre versiones (mismo `document_id` + hash distinto = nueva versión).
- Idioma: `lang` en `es|en|pt|fr` (mínimo es/en). El cuerpo va en `lang`.

## 2. Frontmatter base (común a todos los tipos) — capa v0.2

```yaml
type: <Tipo>                 # REQUERIDO
title: <display>             # recomendado
description: <una línea>      # recomendado (lo usan index.md y búsqueda)
tags: [tag, tag]             # opcional, categorización cruzada
document_id: <slug>          # REQUERIDO al ingerir (clave lógica = ruta del concepto)
lang: es                     # es|en|pt|fr
status: draft                # draft|stable|deprecated  (default: stable; lo generado nace draft)
generated:                   # quién escribió el contenido y cuándo
  by: rhs-okf/agent-<modelo> # o human:<id>
  at: 2026-07-29T12:00:00-05:00
verified:                    # opcional; lista de confirmaciones
  - by: human:<id>           # human: => revisado por humano (sube a human-reviewed)
    at: 2026-07-29T15:00:00-05:00
stale_after: 2027-07-29      # opcional, fecha absoluta de caducidad
sources:                     # provenancia; id = join key de footnotes
  - id: <stable-key>
    resource: <uri o ruta>   # al original preservado y/o al md del corpus
    title: <fuente>
    author: <actor>          # opcional, señal de credibilidad
    last_modified: 2026-04-02  # opcional, YYYY-MM-DD
# --- ciclo de vida (opcionales) ---
supersedes: /ruta/anterior.md      # este concepto reemplaza a...
superseded_by: /ruta/nueva.md      # ...este concepto fue reemplazado por
revisions:                          # historial de cambios in situ
  - at: 2026-07-29
    by: rhs-okf/agent-<modelo>
    summary: reextracción por pdfstruct v0.2
withdrawn:                           # si se retira/deroga
  at: 2026-07-29
  reason: derogado por resolución X
extractor_version: pdfstruct/0.1.0   # opcional, para rastrear reextracciones
```

Niveles de confianza (derivados de `verified`): sin `verified` ⇒ no verificado; sólo actores no-`human:` ⇒ machine-confirmed; algún `human:` ⇒ human-reviewed. Regla de oro: el motor nunca sobrescribe un concepto con `verified: human:*` o editado a mano; genera una propuesta de actualización (§13).

Atribución por afirmación: en el cuerpo, `[^<sources[].id>]` referencia la entrada de `sources`.

## 3. Tipos de concepto del pack RHS

| `type` | Qué es | Carpeta |
|---|---|---|
| `DocumentoFuente` | Una entrada por documento original ingerido | `fuentes/` |
| `PerfilPais` | Perfil RHS de un país (un año) | `perfiles_pais/` |
| `Hallazgo` | Evidencia/síntesis extraída de fuentes | `hallazgos/` |
| `IndicadorRRHH` | Indicador RHS (densidad, brecha, etc.) | `indicadores/` |
| `RecomendacionPolitica` | Recomendación derivada | `recomendaciones/` |
| `ObjetivoEstrategico` | Objetivo de un plan/estrategia | `plan_estrategico/` |
| `ConceptoClave` | Definición / noción fundamental | `conceptos_clave/` |
| `Norma` | Ley/decreto/resolución/regulación | `normas/` |
| `GuiaMetodologica` | Metodología reutilizable | `guias_metodologicas/` |
| `BuenaPractica` | Caso/lección de un país | `buenas_practicas/` |
| `CooperacionTecnica` | Documento de cooperación técnica | `cooperacion_tecnica/` |
| `Dataset` | Ficha de un archivo de datos (perfil, no el dato) | `datasets/` |
| `Attested Computation` | Indicador con cálculo sancionado (Fase 2) | `computaciones/` |
| `DocumentacionTecnica` | Doc técnica del propio bundle | `documentacion/` |
| `Log` | Historial (sólo `log.md`) | raíz |

## 4. Campos por tipo (además de la base)

### DocumentoFuente
```yaml
type: DocumentoFuente
document_id: atraer_retener_zonas_rurales
year: 2022
organization: OPS/OMS
document_type: Revisión rápida (evidencia)   # política|manual|reporte|paper|norma|...
topic: retencion
priority: Alta                               # Alta|Media|Baja
lang: es
source_file: .docs_corpus/atraer-captar-retener-personal-salud-zonas-rurales.md  # md del corpus
original_path: Docs/atraer-captar-retener-personal-salud-zonas-rurales.pdf      # original preservado
pages: 76
extractor_version: pdfstruct/0.1.0
sources:
  - id: original
    resource: Docs/atraer-captar-retener-personal-salud-zonas-rurales.pdf
    title: PDF original
```
`document_id` = slug del título normalizado. Si el doc tiene código OPS/ISBN, usarlo: `isbn-9789275324721`.

### PerfilPais
```yaml
type: PerfilPais
document_id: ECU-2026
country: ECU              # ISO3
country_name: Ecuador
year: 2026
region: Andina           # subregión OPS
source_documents: [fuentes/fuerza_trabajo_salud_americas_datos.md]
```
`document_id = <ISO3>-<year>`. Nueva edición ⇒ nuevo `document_id` + `supersedes`.

### Hallazgo
```yaml
type: Hallazgo
document_id: enfermeria_mundo_2025_inversion
topic: enfermeria
year: 2025
source_documents: [fuentes/situacion_enfermeria_mundo_2025.md]
```
`document_id = <tema>_<fuente>_<n>` (slug del hallazgo).

### IndicadorRRHH
```yaml
type: IndicadorRRHH
document_id: densidad_medicos_ECU_2026
indicator: densidad_medicos_por_1000
country: ECU
year: 2026
unit: por 1000 hab.
value: 2.1                  # si viene de dato; opcional
source_documents: [datasets/cuentas_nacionales_personal_salud_ECU.md]
computation: computaciones/densidad_medicos_ECU.md   # Fase 2: link a Attested Computation
```
`document_id = <indicador>_<ISO3>_<year>`. En Fase 2, `value` se produce atestando la `computation`.

### RecomendacionPolitica
```yaml
type: RecomendacionPolitica
document_id: retencion_zonas_rurales
topic: retencion
evidence_strength: Alta      # Alta|Media|Baja (basado en fuentes)
source_documents: [fuentes/atraer_retener_zonas_rurales.md]
```

### Norma
```yaml
type: Norma
document_id: ecu_ley_servicio_civil_2022
jurisdiction: ECU             # país/entidad ISO3 o "OPS"
year: 2022
issuing_body: Asamblea Nacional
legal_type: ley                # ley|decreto|resolucion|reglamento|convenio
vigencia: vigente              # vigente|derogada|en_tramite
source_file: .docs_corpus/ley-servicio-civil-ecu.md
original_path: Docs/ley-servicio-civil-ecu.pdf
```
`document_id = <jurisdiction>_<legal_type>_<año>_<slug>`.

### GuiaMetodologica
```yaml
type: GuiaMetodologica
document_id: estimacion_brechas_rhs
year: 2023
organization: OPS
methodology_area: planificacion_rrhh
```

### BuenaPractica
```yaml
type: BuenaPractica
document_id: dr_rotacion_rural_1mas2
country: DOM
year: 2024
topic: retencion
source_documents: [fuentes/caso_rotacion_rural_dr.md]
```

### CooperacionTecnica
```yaml
type: CooperacionTecnica
document_id: taller_sirhs_panama_2026
country: PAN
year: 2026
activity_type: taller       # taller|informe|asistencia|capacitacion
```

### ConceptoClave
```yaml
type: ConceptoClave
document_id: definicion_sirhs
domain: sistemas_informacion_rrhh
```

### Dataset
```yaml
type: Dataset
document_id: cuentas_nacionales_personal_salud_ECU
file_format: xlsx            # xlsx|csv|tsv|json|jsonl|parquet|ods|dbf
size_bytes: 482000
file_sha256: <hash>
resource: Data/cuentas_nacionales_ECU.xlsx   # original preservado, NO se convierte a md
vintage: 2026-01              # revisión/edición del dato
profiling:
  at: 2026-07-29T12:00:00-05:00
  by: rhs-okf/profiler-duckdb
  depth: quick               # quick|deep
schema:                       # resumen estructural; ver docs/data-profiler.md
  sheets:                     # para csv/parquet: una "hoja" virtual
    - name: Hoja1
      n_rows: 18500
      n_columns: 12
      columns:
        - {name: anio, type: integer, null_count: 0, distinct: 16, min: 2010, max: 2025}
        - {name: pais, type: varchar, null_count: 0, distinct: 1}
        - {name: personal_salud, type: double, null_count: 230, distinct: 18500}
```
`document_id = <file_stem>[_<ISO3>][_<vintage>]`. `value` no va acá; el dato queda en `Data/` y se opera con herramientas.

### Attested Computation (Fase 2)
```yaml
type: Attested Computation
document_id: densidad_medicos_ECU
runtime: duckdb              # duckdb|python-readonly(DESCARTADO)|otro
parameters:
  - {name: anio, type: integer, required: true}
  - {name: iso3, type: string, required: true}
computation: computaciones/densidad_medicos.sql   # ruta a SQL sancionado
executor: {resource: references/executors/run-duckdb.md, receipt: [job_id, executed_sql, result]}
attester: {resource: references/attesters/duckdb-equality.ts}
stale_after: 2027-07-29
```

### DocumentacionTecnica / Log
`DocumentacionTecnica`: docs del propio bundle (p. ej. `OKF_logic.md`). `Log`: sólo `log.md`, sin `document_id`.

## 5. Reglas de `document_id` (resumen)

| type | patrón | ejemplo |
|---|---|---|
| DocumentoFuente | slug(título) o código OPS/ISBN | `atraer_retener_zonas_rurales` / `isbn-9789275324721` |
| PerfilPais | `<ISO3>-<año>` | `ECU-2026` |
| Hallazgo | `<tema>_<fuente>_<n>` | `enfermeria_mundo_2025_inversion` |
| IndicadorRRHH | `<indicador>_<ISO3>_<año>` | `densidad_medicos_ECU_2026` |
| Norma | `<jurisdiccion>_<legal_type>_<año>_<slug>` | `ecu_ley_2022_servicio_civil` |
| GuiaMetodologica | `<slug>` | `estimacion_brechas_rhs` |
| BuenaPractica | `<ISO3>_<tema>_<slug>` | `dr_retencion_rotacion_1mas2` |
| Dataset | `<file_stem>[_<ISO3>][_<vintage>]` | `cuentas_nacionales_personal_salud_ECU_2026-01` |
| ConceptoClave | `<slug>` | `definicion_sirhs` |

Reglas:
- Minúsculas, sin acentos, palabras unidas por `_`. Estable: no cambia entre reingestas del mismo documento.
- El `document_id` determina el `concept_path`. Si el LLM propone uno existente con hash distinto → versión (supersedes/superseded_by), no duplicado.
- Hash del original (sha256) es la clave de deduplicación exacta (duplicado = mismo hash), independiente del `document_id`.

## 6. Conformidad

- El verificador de rhs-okf valida: `type` presente y no vacío; `document_id` presente en conceptos ingeridos; `sources[].id` coincide con footnotes usadas; `status`/`verified`/`stale_after` con tipos correctos; `index.md`/`log.md` bien formados; enlaces tolerantes a rotos.
- No se rechaza por: campos opcionales ausentes, tipos desconocidos, claves adicionales, links rotos, `index.md` faltante (OKF v0.2 tolerante).
