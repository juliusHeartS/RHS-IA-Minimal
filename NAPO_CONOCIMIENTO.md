# Gobernanza del conocimiento de Napo

**Nombre clave:** Napo  
**Estado:** contrato de validación del receptor; no sustituye revisión legal o institucional

## Propósito

Napo puede usar documentos locales, OKF y RAG para ayudar a planificar, pero no debe tratar una fuente sin procedencia y revisión como conocimiento aprobado. Capibara puede explicar y coordinar; R y Python ejecutan el cálculo; la persona responsable decide si una fuente es apta para el caso.

## Manifiesto lateral obligatorio

Cada fuente institucional o normativa que se vaya a usar para planificación debe tener un manifiesto JSON junto al contenido con estos campos:

```json
{
  "schemaVersion": 1,
  "id": "IDENTIFICADOR-ESTABLE",
  "version": "2026.01",
  "jurisdiction": "jurisdicción explícita",
  "authority": "autoridad o institución declarada",
  "effectiveDate": "2026-01-15",
  "sourceUri": "URI o referencia de procedencia",
  "contentPath": "relative/path/to/source.md",
  "contentSha256": "SHA-256 del contenido exacto",
  "reviewStatus": "pending-human-review",
  "licenseRef": "referencia de licencia o condición de uso"
}
```

`reviewStatus` puede ser `pending-human-review`, `approved` o `rejected`. Una fuente pendiente es trazable, pero no es utilizable como conocimiento aprobado para planificación. Una fuente aprobada debe incluir además `reviewedBy` y `reviewedAt` en formato ISO.

La validación reproducible es:

```sh
node scripts/validate-napo-knowledge-source.mjs \
  --manifest path/to/source.json \
  --root path/to/knowledge-root \
  --require-approved
```

El validador comprueba los campos, la jurisdicción y una fecha calendario real, que el manifiesto y el contenido permanezcan dentro de la raíz autorizada, que `contentPath` sea relativo, que no haya escape por traversal o symlink, que el contenido sea un archivo regular y que su SHA-256 coincida. No sigue `sourceUri`, no descarga la fuente y no determina si el contenido es verdadero, vigente o jurídicamente suficiente; esas decisiones requieren revisión humana.

`schemaVersion` debe ser exactamente `1`; una versión ausente o desconocida se rechaza para evitar interpretar un contrato futuro con reglas antiguas.

## Auditoría de una raíz de conocimiento

Cuando una institución entregue más de una fuente, Napo puede auditar la raíz completa sin abrir conexiones ni inferir licencias:

```sh
npm run audit-napo-knowledge-bundle -- \
  --root path/to/knowledge-root \
  --out reports/napo-knowledge-bundle-audit.json
```

El auditor recorre únicamente archivos `*.source.json`, valida cada manifiesto contra la misma raíz, rechaza identidades duplicadas por `id`/`version`/`jurisdiction` y cuenta qué fuentes son realmente utilizables para planificación. `--require-approved` convierte cualquier fuente pendiente en un rechazo de la auditoría. El resultado no descarga `sourceUri`, no aprueba autoridad, no interpreta el contenido y no sustituye la revisión institucional.

## Materialización segura en un workspace

Cuando una institución entregue una raíz ya revisada, Napo puede preparar una copia local para que Capibara la consuma desde `Docs/`. La operación exige `--require-approved`, funciona primero en modo simulación y solo escribe con `--apply` explícito:

```sh
npm run prepare-napo-knowledge-bundle -- \
  --root /ruta/a/knowledge-root \
  --workspace /ruta/al/proyecto \
  --require-approved

npm run prepare-napo-knowledge-bundle -- \
  --root /ruta/a/knowledge-root \
  --workspace /ruta/al/proyecto \
  --require-approved \
  --apply
```

La herramienta copia únicamente el contenido y los manifiestos aprobados, conserva sus rutas relativas y deja un recibo en `.napo/knowledge/materialization.json`. No sigue `sourceUri`, no descarga nada, no sobrescribe archivos con contenido distinto y rechaza colisiones o identidades inválidas. La copia vuelve visible el conocimiento para el flujo local de Capibara, pero no convierte una fuente en jurídicamente válida.

`npm run test-napo-materialized-planning` encadena esa transferencia con una lectura desde `Rscript` en el workspace y deja `reports/napo-materialized-planning.json`. El fixture es deliberadamente no legal: la prueba demuestra el contrato de transferencia y ejecución, no la autoridad de una fuente.

## Evidencia actual

`npm run test-napo-knowledge-governance` prueba una fuente pendiente, el rechazo por hash cambiado, una fuente aprobada, una fecha imposible, escapes por traversal o symlink y el auditor de una raíz completa en modo normal y estricto. El reporte es `reports/napo-knowledge-governance.json`. La prueba no convierte el fixture en una fuente legal ni modifica Capibara.
