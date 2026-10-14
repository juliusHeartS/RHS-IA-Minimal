# Matriz de cumplimiento de Napo

**Nombre clave:** Napo  
**Destino:** RHS-IA Minimal  
**Corte:** 2026-10-13  
**Artefacto:** `dist/Napo.app`  
**Digest de árbol:** `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`

Esta matriz resume la evidencia vigente. No convierte una prueba técnica en aprobación legal ni presenta el paquete de desarrollo como release público.

| Requisito | Evidencia autoritativa | Estado |
|---|---|---|
| Identidad Napo | `product.json`, paquete `Napo.app`, `org.rhsia.napo` | Cumplido técnicamente |
| Capibara completa integrada | `validate-napo.mjs`, integridad del runtime `rhs-agent4@4.0.0`, evidencia UI y E2E | Cumplido técnicamente |
| Proveedores visibles de Capibara | Manifiesto y validación de configuración; uso sujeto a configuración y acción explícita | Cumplido técnicamente |
| Extensiones de análisis de datos sin alteración funcional | `reports/napo-data-extension-integrity.json`: 17 componentes, 0 diferencias funcionales | Cumplido técnicamente |
| R | Runtime `R 4.5.3`, smoke de modelación y sesión UI | Cumplido técnicamente |
| Python | Runtime `Python 3.13.3`, `ipykernel`, smoke de modelación y Quarto/Python | Cumplido técnicamente |
| Quarto siempre incluido | Quarto `1.10.18` empaquetado, ejecutable y con renders R/Python | Cumplido técnicamente |
| Modelación, simulación y escenarios | `reports/napo-modeling-smoke.json`, capacidades 8/8 aprobadas | Cumplido técnicamente |
| Planificación reproducible | `reports/napo-capibara-planning-e2e.json`, aprobación visible y sesión R viva | Cumplido como coordinación local |
| Conocimiento versionado | `NAPO_CONOCIMIENTO.md`, validador de manifiestos y auditor de raíces | Cumplido como contrato técnico |
| Materialización de conocimiento aprobado | `prepare-napo-knowledge-bundle.mjs`: dry-run, `--apply` explícito, recibo, idempotencia y rechazo de colisiones | Cumplido como transferencia local; requiere fuentes institucionales aprobadas |
| Ejecución sobre conocimiento materializado | `reports/napo-materialized-planning.json`: `Docs/` materializado y leído por `Rscript` con marcador reproducible | Cumplido como smoke local; no es revisión jurídica ni sustituye E2E UI |
| Aprobación humana de conocimiento | `--require-approved` bloquea fuentes pendientes | Cumplido como control; revisión institucional externa requerida |
| Telemetría | `enableTelemetry=false`, contrato estático y smoke dinámico con 0 conexiones no locales | Cumplido técnicamente |
| Marketplace y actualizaciones automáticas | Endpoints vacíos y prueba de actualización manual/verificable/reversible | Cumplido técnicamente |
| Seguridad de acciones del agente | Aprobaciones sensibles, cancelación, procedencia, historial y recuperación observados | Cumplido en la cobertura vigente |
| Superficie de extensiones | 59 extensiones: 46 conservadas, 13 bajo clasificación conservadora; cuatro exclusiones reversibles | Cumplido técnicamente |
| Cobertura de las 13 extensiones bajo revisión | `reports/napo-extension-functional-coverage.json`: 13/13 UI `pass`, contratos sin errores y arranque sin errores | Cumplido como cobertura manual reconciliada |
| Reproducibilidad | Dos reconstrucciones idénticas; manifiesto con digest vigente | Cumplido para el artefacto actual |
| Consistencia documental | `reports/napo-document-consistency.json`: ocho documentos canónicos ligados al conteo, digest e inventario legal vigentes; históricos distinguidos | Cumplido técnicamente |
| Pruebas ejecutables del destino | `typecheck-client` código 0; `test:positron`: 415 archivos, 4.949 pruebas aprobadas, 3 expected-fail y 21 omitidas | Cumplido técnicamente; deuda de tipado de tests separada |
| Higiene del artefacto | `cacheArtifacts=0`; sin `*.pyc`, `*.pyo` ni `*.stats.json` | Cumplido técnicamente |
| Solo lectura de fuentes | `audit-napo-source-readonly -- --verify`: RHS-IA, Positron, rhs-agent3, rhs-agent4 y vscode intactos | Cumplido |
| Licencias y procedencia | Inventario de 64 manifiestos, 40 archivos legales con hash, expediente y registro lateral ligados al digest | Revisión humana pendiente: 30 casos; decisiones explícitas requeridas |
| Firma macOS | `reports/napo-macos-signature.json`, auditoría de estado macOS | La firma Apple no es requisito de la distribución manual libre; `development-only` queda documentado y no equivale a confianza de Apple |
| Notarización y canal de distribución | Canal manual y explícito documentado; sin descubrimiento, consulta ni instalación automática | Canal manual decidido; la notarización Apple queda fuera del alcance de Napo |

## Criterio de aceptación

La compuerta técnica vigente para el canal manual es:

```sh
npm run validate-napo-gate -- --package dist/Napo.app
```

El resultado vigente de la distribución manual libre es `ACEPTADA (desarrollo técnico)` con 17 pases y 2 puertas externas. `--manual-risk` se conserva como alias de compatibilidad.

La ruta opcional identificada por Apple puede diagnosticarse con:

```sh
npm run validate-napo-gate -- \
  --package dist/Napo.app \
  --require-distribution
```

Si esa ruta falla por firma o notarización, el resultado es informativo y no bloquea la distribución manual libre de Napo.

## Límites declarados

- La evidencia UI es manual y no equivale a automatizar todos los comandos y vistas.
- La gobernanza de conocimiento valida procedencia, integridad y aprobación declarada; no decide la verdad jurídica ni la autoridad institucional.
- La inspección de licencias organiza la revisión, pero no infiere licencias ni reemplaza asesoría legal.
- La firma `development-only` no acredita confianza de Apple; queda documentada como el estado del artefacto para la distribución manual libre.

## Revalidación técnica — 2026-10-13

El paquete vigente contiene 32.904 archivos y tiene el digest `ea4efbd9a3144e0f58fc2c32d1dd7605e00e92a54cd16618a33c09487e83a53e`. La prueba de apertura de proyectos queda corregida a nivel de host: Capibara está autorizada explícitamente para permanecer disponible en carpetas no confiables; su código y sus artefactos integrados no se modificaron.
