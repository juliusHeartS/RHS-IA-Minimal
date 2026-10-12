---
name: build-okf
description: >
    Build or refresh the LOCAL OKF and local project RAG from the workspace
    Docs/ and Data/ folders. Use this when the user invokes /build-okf or asks
    to construct the project knowledge base. rhs-agent is the intelligent actor
    and rhs-okf supplies deterministic inventory, profiles, governance and
    validation. Never modify CORE, canonical RAG, model settings or sources.
metadata:
    author: BPK
    version: "0.7"
    short-description: Construye o actualiza el OKF y RAG local desde Docs/ y Data/.
    triggers: [construir okf, build okf, base de conocimiento, organizar documentos y datos]
policy: implicit
dependencies:
    tools: [process_pdf, execute_command, execute_code, read_file, list_files]
---

# Build OKF

Construir o actualizar el conocimiento LOCAL del proyecto desde exactamente:

```text
Docs/
Data/
```

Nada fuera de esas raíces puede producir conceptos, corpus, ledger o RAG
local. Para incorporar una fuente externa, exigir primero una solicitud
explícita y colocarla bajo `Docs/`. No usar `Instrucciones/Indicaciones.md` como
fuente: sólo restringe cálculos y respuestas.

## Flujo obligatorio

1. Confirmar workspace y presencia de CORE sin editarlo.
2. Inventariar recursivamente `Docs/` y `Data/`.
3. Ejecutar el preflight determinista de correspondencia PDF-Markdown y
   reconciliar `Docs/.pdfstruct-manifest.json` con el inventario actual. Si todos
   los PDF tienen un Markdown final no vacío, reutilizarlos y no cargar
   `pdfstruct` ni invocar `process_pdf` durante este turno. Si faltan Markdown,
   cargar `pdfstruct` e invocar `process_pdf` únicamente una vez por cada PDF
   faltante; nunca procesar toda `Docs/` cuando ya hay resultados. El archivo
   `Docs/.pdfstruct-manifest.json` es derivado, se reconstruye antes de la
   ingesta y sólo registra los pares PDF-Markdown que existen.
4. Cargar `pipeline` y ejecutar en orden preparación, `rhs-okf ingest` y
   `rhs-okf verify`. La fase determinista debe terminar antes de cualquier
   enriquecimiento con R o Python y antes de construir el RAG.
5. Enriquecer semánticamente el bundle local después de la ingesta determinista.
   El agente puede editar sólo conceptos `draft` generados para esta ejecución
   y sus `index.md`, siempre conservando `document_id`, `type`, `status`,
   `generated`, `sources`, fingerprints, `source_file`, extracción y estados de
   revisión. Puede mejorar título, descripción, etiquetas y cuerpo cuando la
   evidencia lo permita, y añadir jerarquía y relaciones con enlaces Markdown
   estándar. No crear campos de relación propios, no inventar claves, no
   declarar `verified` humano y no convertir una inferencia en un hecho.
6. Ejecutar `rhs-okf verify` después del enriquecimiento y corregir cualquier
   error de esquema, procedencia, ledger o perfil. Sólo después construir el
   RAG con `rhs-rag ingest`; así los índices y enlaces semánticos también quedan
   disponibles para la recuperación.
7. Cargar `reporting-and-recovery` para emitir el resultado humano y conservar
   todo fallo o revisión pendiente.

Si un PDF no produce su Markdown, informar la ruta y continuar la conversión de
los demás. Ejecutar `rhs-okf ingest` cuando todos los PDF tengan su Markdown
final, de modo que el OKF se construya con el conjunto documental completo.
La ingesta gobernada siempre usa el manifiesto reconciliado; si faltan entradas,
primero se completan los Markdown faltantes y se vuelve a reconciliar.

## Invariantes

- CORE (`.rhs-okf/`, `.baseglobal/` y RAG canónico) es de sólo lectura.
- LOCAL (`.okf-local/`, `.docs_corpus/`, `.rhs-rag/`) es derivado y regenerable.
- Las fuentes originales y Markdown del usuario no se borran ni sobreescriben.
- `rhs-okf` no tiene subcomando `pdfstruct`.
- Cada `execute_command` contiene un solo comando y conserva JSON original.
- R/Python enriquecen perfiles después del pipeline; su ausencia no bloquea
  OKF ni RAG deterministas. Si no están disponibles, el agente conserva la
  estructura perfilada por `rhs-okf` y declara la limitación.
- El LLM no suplanta verificación humana ni cambia modelos/proveedores.
- La decisión de reutilizar o preparar Markdown la impone el runtime; no depende
  únicamente de que el LLM siga una instrucción textual.
- Si LOCAL no existe, las consultas usan CORE y RAG canónico sin error.

## Referencias

- `pipeline`: leer antes de ejecutar una construcción; contiene comandos,
  preparación y perfilado de Data.
- `governance`: leer para procedencia, campos protegidos, capas y semántica.
- `reporting-and-recovery`: leer al informar, manejar fallos, consultar el
  resultado o ejecutar un reset autorizado.
