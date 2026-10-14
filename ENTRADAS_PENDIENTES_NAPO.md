# Entradas pendientes para cerrar Napo

**Nombre clave:** Napo  
**Estado actual:** aceptación técnica de desarrollo  
**Artefacto:** `dist/Napo.app`  
**Digest vigente:** `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`

Este documento separa lo que ya está construido en Napo de los insumos que solo puede proporcionar una persona responsable, una institución o el operador de distribución. No autoriza a inventar licencias, autoridades, firmas, credenciales ni contenido normativo.

## 1. Revisión legal humana

Estado: 30 casos pendientes; el expediente técnico ya está generado.

La persona revisora debe trabajar sobre:

- `reports/napo-license-review-packet.json` — expediente regenerable, no editarlo;
- `reports/napo-license-decisions.json` — registro durable que sí recibe las decisiones;
- `reports/napo-release-manifest.json` — digest del artefacto exacto revisado.

Cada entrada de `decisions` debe usar el `caseId` del expediente y contener:

```json
{
  "decision": "approved",
  "reviewer": "identidad de la persona revisora",
  "reviewedAt": "2026-10-13T00:00:00Z",
  "basis": "fundamento documental verificable",
  "notes": "observaciones opcionales"
}
```

Valores permitidos: `approved`, `rejected` y `needs-more-evidence`. Para distribución, todos los casos deben ser `approved`; una decisión de otro digest bloquea el proceso.

Validación:

```sh
npm run audit-napo-license-review-packet
npm run test-napo-license-review-decisions
npm run validate-napo-gate -- --package dist/Napo.app --require-distribution
```

La compuerta seguirá bloqueando la distribución mientras no existan decisiones humanas aprobadas. Napo no modifica manifiestos de extensiones para resolver esta cola.

## 2. Firma Apple: fuera del alcance de Napo

Estado: no es una entrada pendiente ni una condición de cierre. Napo se distribuirá libremente por transferencia manual, con el artefacto completo, manifiesto y hash SHA-256. El artefacto actual es `development-only`, con firma `adhoc` y `TeamIdentifier=not set`; cada usuario decide si autoriza su apertura en macOS bajo su propio riesgo.

La firma y notarización Apple no son requisitos de Napo. Si en el futuro se quisiera ofrecer un canal adicional identificado por Apple, sería un trabajo opcional separado y requeriría fuera del repositorio:

1. una identidad válida de firma de distribución macOS;
2. acceso autorizado a notarización y su perfil seguro;
3. un artefacto final reconstruido desde el commit y el árbol aprobados;
4. validación positiva de `codesign --verify` y `spctl --assess`.

No se deben guardar certificados, perfiles, contraseñas ni tokens en el repositorio. La auditoría local es:

```sh
npm run audit-napo-macos-signature -- --package dist/Napo.app
npm run test-napo-macos-signature -- --package dist/Napo.app
```

La firma no se simula con un hash. En el canal manual, el hash verifica integridad y la advertencia de macOS se acepta explícitamente; no acredita identidad ni notarización.

## 3. Fuente institucional de conocimiento

Estado: el receptor y la materialización local están probados con fixtures; falta una fuente institucional real revisada.

La institución debe entregar una raíz de conocimiento con el contenido y un manifiesto lateral `*.source.json` por fuente. El manifiesto debe declarar `schemaVersion: 1`, `id`, `version`, `jurisdiction`, `authority`, `effectiveDate`, `sourceUri`, `contentPath`, `contentSha256`, `reviewStatus` y `licenseRef`. Una fuente aprobada debe añadir `reviewedBy` y `reviewedAt`.

Validación y transferencia:

```sh
npm run audit-napo-knowledge-bundle -- --root /ruta/a/knowledge-root --require-approved
npm run prepare-napo-knowledge-bundle -- --root /ruta/a/knowledge-root --workspace /ruta/al/proyecto --require-approved
npm run prepare-napo-knowledge-bundle -- --root /ruta/a/knowledge-root --workspace /ruta/al/proyecto --require-approved --apply
npm run test-napo-materialized-planning
```

Napo no sigue `sourceUri`, no descarga contenido, no infiere autoridad y no presenta la fuente como válida por el solo hecho de pasar el hash. La revisión institucional sigue siendo responsabilidad de la autoridad correspondiente.

## Estado de cierre

La compuerta técnica por defecto para la distribución manual libre pasa 17 requisitos, 0 fallos y deja como únicas puertas externas la revisión legal humana y la fuente institucional real. `--manual-risk` permanece como alias de compatibilidad. La firma y notarización Apple no forman parte del cierre de Napo; `--require-distribution` solo diagnostica una ruta opcional.

La revalidación técnica vigente corresponde a `dist/Napo.app`, con 32.904 archivos y digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`. El host conserva Capibara al crear o abrir carpetas no confiables mediante una regla específica de Napo; no se modificó su extensión.

