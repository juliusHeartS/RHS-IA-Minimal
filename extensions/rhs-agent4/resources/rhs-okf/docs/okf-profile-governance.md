# Perfil de gobernanza OKF de rhs-okf

`rhs-okf` sigue siendo el motor agnostico. No contiene LLM, no conoce Mendoza y
no asume OPS/RHS salvo cuando se usa el pack `packs/rhs`.

Este perfil agrega reglas inspiradas en OKF v0.2 y en el aprendizaje del perfil
WikiForge, adaptadas a la arquitectura real de proyectos con `Docs/` y `Data/`.

## Capas

1. **OKF minimo**: todo concepto Markdown debe tener frontmatter YAML valido y
   `type`.
2. **Pack**: el pack declara tipos, carpetas, defaults, estados y reglas de
   identidad.
3. **Ingesta**: todo concepto gobernado debe tener `document_id`, `lang`,
   `status`, `generated`, `sources` y ledger coherente.
4. **Provenancia**: `sources[].resource` debe resolver a `Docs/`, `Data/` o
   `.docs_corpus/` cuando corresponda.
5. **Perfil**: agrega evidencia, footnotes coherentes, fingerprints SHA-256 y
   conceptos derivados de navegacion.

## Raices de fuente

Las fuentes gobernadas son exactamente:

```text
Docs/
Data/
```

`.docs_corpus/`, `.rhs-okf/`, `.okf-local/`, `.rhs-rag/` y carpetas derivadas no
son fuentes primarias. Pueden ser recursos derivados o salidas, pero no sustituyen
la fuente original.

## Fingerprints

Cada concepto generado desde `Docs/` o `Data/` incluye `source_fingerprints`
para las fuentes originales gobernadas.
Cada entrada registra:

```yaml
resource: Docs/documento.pdf
algorithm: sha256
value: "<sha256>"
size: 12345
modified_at: "2026-08-11T03:00:00.000Z"
```

Los conceptos derivados de fuente usan `source_fingerprint` para representar el
archivo original. `verify` recalcula hash y tamano cuando el recurso es local.

## Evidence

Los conceptos nuevos generados por `rhs-okf` incluyen una seccion:

```markdown
## Evidence

- Fuente original preservada para trazabilidad.[^original]

[^original]: Archivo original preservado en Docs/.
```

El verificador revisa que las footnotes referenciadas existan y coincidan con
`sources[].id`.

## Conceptos derivados

Cuando el pack declara:

```yaml
defaults:
  source_type: FuenteOriginal
  hub_type: HubConocimiento
```

`rhs-okf ingest` regenera conceptos derivados:

- `sources/source_<document_id>.md`: una ficha trazable por fuente original.
- `hubs/hub_documentos.md`: hub de documentos bajo `Docs/`.
- `hubs/hub_datos.md`: hub de archivos bajo `Data/`.
- `hubs/hub_normativa.md`: hub heuristico de normativa/policy.

Estos conceptos tienen `derived: true`. No requieren entrada de ledger porque son
derivados reconstruibles desde el ledger y las fuentes. Antes de regenerarlos,
`rhs-okf` elimina solamente conceptos previos con `derived: true` en las carpetas
de gobernanza del pack. No borra fuentes del usuario ni conceptos humanos.

Si otro pack no declara `source_type` o `hub_type`, esta capa no se fuerza.

## CLI estable para rhs-agent

Construccion:

```bash
rhs-okf ingest <projectDir> --prepared-manifest Docs/.pdfstruct-manifest.json --json
```

Verificacion:

```bash
rhs-okf verify <projectDir> --json
```

El JSON de `verify` incluye niveles:

```text
minimal, pack, ingest, provenance, ledger, profile
```

`profile.errors > 0` indica ruptura de gobernanza. `profile.warnings > 0` indica
deuda de calidad, no necesariamente bloqueo.

## Responsabilidad del LLM

`rhs-okf` no hace interpretacion semantica profunda. El agente que lo envuelve
puede usar LLM para proponer mejores titulos, taxonomias, relaciones y
descripciones, pero debe escribir cambios gobernados y volver a ejecutar
`rhs-okf verify`.

El motor no debe fingir verificacion humana. `verified` solo puede registrar un
evento real.
