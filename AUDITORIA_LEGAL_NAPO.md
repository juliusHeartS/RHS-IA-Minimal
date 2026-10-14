# Auditoría legal preliminar de Napo

**Estado:** preliminar; no sustituye revisión legal  
**Fecha:** 2026-10-13  
**Regla:** los repositorios fuente fueron inspeccionados sin modificarlos.

## Hallazgo principal

Napo es redistribuible solo conforme al conjunto de licencias y avisos de cada componente. No debe describirse sin matiz como un único paquete bajo una licencia de software libre: el núcleo heredado de RHS-IA/Positron declara **Elastic License 2.0**, mientras que otros componentes declaran Apache-2.0 o MIT.

Esto no significa que la redistribución esté prohibida. Significa que deben conservarse los textos de licencia, avisos, atribuciones y restricciones aplicables, y que la distribución pública necesita una revisión legal antes de prometer compatibilidad con una definición específica de “software libre” u “open source”.

## Evidencia inspeccionada

| Componente | Evidencia | Licencia observada | Implicación de distribución |
|---|---|---|---|
| Núcleo Napo derivado de RHS-IA/Positron | `LICENSE.txt` de Napo, `../RHS-IA/LICENSE.txt`, `../positron/LICENSE.txt` | Elastic License 2.0 | Conservar el acuerdo, avisos y limitaciones; revisar especialmente redistribución, servicios hospedados, marcas y modificaciones. |
| Capibara / `rhs-agent4` | `extensions/rhs-agent4/LICENSE.txt`, `package.json` | Apache-2.0 | Conservar licencia, aviso y atribuciones; revisar también sus avisos de terceros. |
| Sacha Cuy / `rhs-agent3` usado como procedencia | `../rhs-agent3/LICENSE` | Apache-2.0 | Mantener la procedencia documentada cuando existan adaptaciones. |
| Code-OSS / VS Code | `../vscode/LICENSE.txt` | MIT | Conservar copyright y permiso MIT en la redistribución correspondiente. |
| Runtime y proveedores de Capibara | `extensions/rhs-agent4/dist/THIRD_PARTY_NOTICES.md`, `dist/LICENSES/`, `resources/bin/darwin-arm64/vendor-manifest.json` | Mixta | El inventario de terceros debe viajar dentro del paquete y coincidir con los artefactos realmente distribuidos. |

## Reglas adoptadas para Napo

- No reemplazar, acortar ni ocultar `LICENSE.txt`, `NOTICE`, `THIRD_PARTY_NOTICES.md` o los textos de terceros.
- No cambiar la licencia del núcleo por una licencia propia de Napo sin autorización del titular de los componentes heredados.
- Mantener la procedencia y el commit de cada copia o adaptación en los manifiestos y mapas de procedencia.
- No distribuir claves, credenciales, modelos o datos sujetos a una licencia no inventariada.
- Antes de una publicación pública, generar el inventario del artefacto final y comprobar que cada licencia declarada corresponde a los archivos que realmente contiene.
- La afirmación segura por ahora es: “Napo se puede redistribuir conforme a las licencias incluidas y sus condiciones”; no: “todo Napo está bajo una única licencia libre”.

## Pendientes de cierre

1. Completar el inventario de licencias de todas las extensiones, binarios nativos, modelos y dependencias transitivas del paquete final.
2. Verificar si algún componente tiene términos adicionales de marca, servicio hospedado, modelos o datos.
3. Confirmar con revisión legal la descripción pública de Napo y la compatibilidad de la redistribución con el uso previsto.
4. Incluir un paquete de avisos reproducible junto a cada versión publicada.

## Herramienta reproducible del destino

El destino incluye `scripts/audit-napo-license-inventory.mjs`, que genera un inventario determinista de manifiestos de extensiones, licencias, avisos, tamaños y SHA-256. Se ejecuta con:

```sh
npm run audit-napo-license-inventory
node scripts/audit-napo-license-inventory.mjs --package ../VSCode-darwin-arm64/Napo.app --out reports/napo-license-inventory-package.json
```

El reporte no sustituye la revisión legal ni resuelve por sí solo los términos de binarios, modelos o dependencias transitivas; deja visibles los manifiestos que requieren confirmación humana y conserva hashes para comparar el inventario con futuras versiones.

El manifiesto técnico de versión se genera por separado con `npm run record-napo-release`. Su digest de árbol sirve para verificar que el artefacto que se va a instalar es exactamente el artefacto auditado; no constituye una firma ni una aprobación legal.

La corrida vigente sobre `Napo.app` encontró 64 manifiestos y 40 archivos legales con hash; 30 manifiestos del paquete requieren confirmación humana porque no declaran una licencia directamente o remiten a un archivo. El inventario del árbol integrado puede contener más componentes que no entran en el artefacto; por eso la decisión de distribución se toma sobre el paquete final, no sobre el árbol fuente completo.

La evidencia del paquete se desglosa ahora sin convertir una señal automática en aprobación jurídica: 34 manifiestos declaran una licencia directamente; 28 no declaran licencia ni contienen un archivo legal local detectable; 1 remite a un archivo que no está localizado por el inventario; y 1 contiene un archivo legal local sin declaración en el manifiesto. Los 30 últimos casos permanecen en la cola de revisión humana. Esta clasificación mejora la trazabilidad del trabajo legal, pero no autoriza inferir una licencia por semejanza con otro componente.

El paquete auditado corresponde al manifiesto de release vigente: 32.904 archivos, digest de árbol `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`. El reporte añade `licenseEvidenceSummary` y conserva `decision=human-review-required`; el digest permite vincular la revisión legal al artefacto exacto, pero no sustituye la firma, la notarización ni la aprobación humana.

El inventario tiene un modo estricto para impedir una publicación accidental: `--require-human-review` termina con error si existe al menos un manifiesto pendiente. La puerta consolidada lo activa automáticamente cuando se usa `--require-distribution`; por eso el paquete actual puede pasar la aceptación técnica de desarrollo, pero no puede declararse release distribuible mientras queden 30 casos sin revisión humana.

Para facilitar la revisión sin alterar los manifiestos ni inferir licencias, el destino genera `reports/napo-license-review-packet.json` mediante `npm run audit-napo-license-review-packet`. El paquete contiene los 30 casos, hashes de los manifiestos, candidatos de procedencia, clasificación de evidencia y una lista de comprobación por caso; los 30 casos tienen al menos un candidato de procedencia. Las decisiones no se editan dentro del expediente regenerable: se registran en `reports/napo-license-decisions.json`, ligado al digest del release y al `caseId` de cada manifiesto.

Cada decisión debe indicar `approved`, `rejected` o `needs-more-evidence`, además de `reviewer`, `reviewedAt` y `basis`. La compuerta `--require-distribution` solo acepta casos `approved`; no infiere licencias, no acepta decisiones de otro digest y no modifica los manifiestos empaquetados. La prueba `npm run test-napo-license-review-decisions` cubre revisión vacía, parcial, completa y registro obsoleto.

## Artefacto vigente ligado a la revisión — 2026-10-13

La revisión legal técnica se volvió a ligar al paquete reconstruido: 32.903 archivos, digest `854d501405b732561d935add79c2b529ba0efecec2bc925985a37eba5d888a01`. El expediente `reports/napo-license-review-packet.json` conserva `decision=human-review-required`, los 30 casos pendientes, sus candidatos de procedencia y su lista de comprobación; `reports/napo-license-decisions.json` permanece vacío hasta una revisión humana explícita y no se infieren licencias.

La limpieza de `__pycache__`/`.pyc` solo afecta residuos generados en el destino durante pruebas y no cambia la composición funcional declarada. Antes de distribuir, debe repetirse el inventario sobre el artefacto final junto con revisión humana, firma y notarización.

La revalidación técnica vigente corresponde a 32.903 archivos y al digest `cadf971739658f24f262437be9622c4b2290df835b925875717d1affe59e8d62`. El cambio de esta reconstrucción es exclusivo del host de Napo: mantiene habilitada Capibara en carpetas no confiables y no altera su código, manifest ni runtime.

