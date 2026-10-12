# Contrato de packs de dominio rhs-okf

Fecha: 2026-08-05.

Este documento define el contrato publico que permite usar `rhs-okf` como motor OKF agnostico. El dominio se declara en un pack; el razonamiento semantico lo hace `rhs-agent` o el agente que invoque el motor.

## Principios

- `rhs-okf` no contiene un LLM.
- `rhs-okf` no debe asumir Mendoza, PAHO, OPS, RHS ni ningun dominio en su capa generica.
- Todo supuesto de dominio debe vivir en un pack, por ejemplo `packs/rhs/pack.yaml`.
- El pack RHS es el default empaquetado para BPK, no una condicion del motor.
- En un mismo proceso pueden cargarse varios packs; la cache se aisla por `packRoot` resuelto.
- `Docs/` y `Data/` son las unicas fuentes locales de conocimiento para una ingesta de proyecto.
- `Instrucciones/Indicaciones.md` puede orientar respuestas o calculos del agente, pero no configura ni alimenta la construccion OKF.

## Seleccion de pack

El pack se selecciona por este orden:

1. Opcion CLI `--pack-root <path>`.
2. Variable de entorno `RHS_OKF_PACK_ROOT`.
3. Pack default empaquetado: `packs/rhs`.

Ejemplos:

```bash
rhs-okf pack --pack-root /ruta/a/packs/investigacion
rhs-okf ingest /ruta/proyecto --pack-root /ruta/a/packs/investigacion
rhs-okf verify /ruta/proyecto --pack-root /ruta/a/packs/investigacion
RHS_OKF_PACK_ROOT=/ruta/a/packs/investigacion rhs-okf ingest /ruta/proyecto
```

Cuando `rhs-agent` invoca `rhs-okf`, debe pasar `--pack-root` o `RHS_OKF_PACK_ROOT` solamente si el proyecto o la institucion han seleccionado explicitamente un pack distinto del default.

## Archivo obligatorio

Un pack es una carpeta con un archivo:

```text
pack.yaml
```

El archivo se carga con `loadPack(packRoot)`. Si falta o no es YAML valido, la invocacion debe fallar de forma visible.

## Campos requeridos

```yaml
pack:
  id: <id-estable>
  name: <nombre visible>
  lang: [es, en]
  okf_version: "0.2"

base_frontmatter:
  required: [type]
  required_on_ingest: [type, document_id, lang, generated]
  optional: [title, description, tags, status, verified, stale_after, sources]
  status_enum: [draft, stable, deprecated]

types:
  - type: <TipoConcepto>
    folder: <carpeta_relativa_en_bundle>
    document_id: <regla humana>
    extra: []
```

`pack.id` debe ser estable: se usa para diagnosticos, evidencias y trazabilidad. `types[].type` define los valores validos de `type`. `types[].folder` define donde se escriben conceptos de ese tipo dentro de `.okf-local/`.

## Defaults requeridos para ingesta generica

Para que la ingesta deterministica pueda generar conceptos base sin inyectar tipos de otro dominio, el pack debe declarar:

```yaml
defaults:
  document_type: <tipo para documentos generales>
  legal_document_type: <tipo para documentos legales, si existe>
  dataset_type: <tipo para archivos de Data/>
```

Reglas:

- Cada valor debe existir en `types[]`.
- `document_type` se usa para documentos de `Docs/` cuando no hay enriquecimiento semantico valido.
- `legal_document_type` se usa solo si el pack define un tipo legal y la heuristica de nombre detecta ley, decreto, resolucion, reglamento u ordenanza.
- `dataset_type` se usa para perfiles de archivos bajo `Data/`.
- Si un default no existe o no esta definido, `rhs-okf` cae al primer tipo del pack para evitar emitir tipos invalidos.

Para el pack RHS:

```yaml
defaults:
  document_type: DocumentoFuente
  legal_document_type: Norma
  dataset_type: Dataset
```

## Enriquecimiento semantico

El agente puede pasar un enriquecimiento a `buildDocConcept` con campos como `title`, `description`, `tags`, `type`, `document_id`, `lang` y `sections`.

Contrato:

- Si `enriched.type` existe en el pack, se usa ese tipo.
- Si `enriched.type` no existe en el pack, se ignora y se usa el default aplicable.
- La ruta del concepto se calcula con `folderFor(pack, type)`.
- `rhs-okf` escribe estructura, identidad, procedencia y validacion; no decide por si solo la taxonomia semantica profunda.
- El agente no debe declarar `verified: human:*` para contenido generado por LLM.

## Validacion

`verifyBundle(bundleDir, { projectDir, packRoot, ledgerFile })` debe ejecutarse con el mismo pack utilizado durante la ingesta.

Niveles relevantes:

- `minimal`: YAML, frontmatter y archivos reservados.
- `pack`: `type` conocido, carpeta esperada y estados validos.
- `provenance`: fuentes resolubles bajo `Docs/`, `Data/` o `.docs_corpus/`.
- `ledger`: consistencia de entradas de ingesta y ciclo de vida.
- `ingest`: integridad de conceptos generados.

Un `type` desconocido o ubicado en una carpeta que no corresponde al pack es error de nivel `pack`.

## Contrato para rhs-agent

`rhs-agent` debe tratar `rhs-okf` como una capacidad invocable:

1. Construye semanticamente el OKF local con su LLM.
2. Invoca `rhs-okf` para inventario, conversion, perfiles deterministas, escritura formal, ledger, ciclo de vida y validacion.
3. Pasa el pack correcto por `--pack-root` o entorno cuando no usa RHS.
4. Escribe solo en `.okf-local/` y `.docs_corpus/` para conocimiento local.
5. No modifica `.rhs-okf/`, `.baseglobal/` ni `.rhs-rag-canonical/`.
6. Despues de una ingesta valida, actualiza el RAG local mediante el puente de `rhs-agent`.

## Compatibilidad

Un cambio de pack puede mover conceptos entre carpetas porque `folderFor(pack, type)` depende de `types[].folder`. Por eso una reconstruccion con un pack distinto debe registrarse como cambio de configuracion del proyecto y no como una simple reingesta incremental.

El pack debe versionarse junto con la evidencia de ejecucion cuando se use para un proyecto regulado o institucional.
