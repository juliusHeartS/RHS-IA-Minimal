# Política operativa de Napo

**Nombre clave:** Napo  
**Destino:** RHS-IA Minimal  
**Estado:** decisión de producto y criterios de aceptación  
**Fecha:** 2026-10-12

Este documento convierte las decisiones del proyecto en reglas verificables para el host, el empaquetado y la distribución. No modifica Capibara ni las extensiones de análisis de datos transferidas desde las fuentes.

La redistribución de Napo se entiende siempre conforme a las licencias de sus componentes. La auditoría preliminar está en `AUDITORIA_LEGAL_NAPO.md`; no se debe presentar todo el paquete como si tuviera una sola licencia.

El observador nativo de políticas administrativas de macOS (`@vscode/policy-watcher`) es una capacidad administrativa local del host, no un servicio externo, un proveedor LLM ni un canal de telemetría. Napo lo empaqueta y valida cuando la plataforma de destino es macOS arm64; no inicia conexiones remotas ni cambia las reglas de privacidad del producto.

## 1. Qué significa “servicio externo”

Un servicio externo es cualquier proceso o endpoint que no forma parte del paquete local de Napo y que puede recibir una solicitud o prestar una capacidad adicional.

| Tipo | Ejemplo | Política |
|---|---|---|
| Proceso local opcional | Ollama en `127.0.0.1:11434`, LM Studio en `127.0.0.1:1234` | Permitido; la persona usuaria debe tenerlo instalado/ejecutándose y elegirlo. No es telemetría. |
| Proveedor remoto de modelos | Anthropic, OpenAI, Gemini, DeepSeek, Mistral y los demás que Capibara expone | Se conserva la visibilidad de Capibara; requiere configuración, credencial y acción explícita de la persona usuaria. |
| Búsqueda o extracción web | Búsqueda web de Capibara y `obscura` | Desactivada al iniciar; solo se habilita desde la interfaz y solo para la tarea que la solicita. |
| Servicio auxiliar configurable | Qdrant, un endpoint OpenAI-compatible o un RAG alternativo | No obligatorio; solo se usa si se configura explícitamente. |
| Servicio de Napo | Telemetría, analítica, sincronización, marketplace, actualización automática | Prohibido en Napo. |

La presencia de un proveedor en el selector no significa que Napo lo esté usando, que tenga una cuenta configurada o que pueda enviar datos por su cuenta. Significa únicamente que Capibara conserva esa capacidad de configuración.

## 2. Regla de red y privacidad

- Telemetría, analítica de uso, diagnóstico remoto y sincronización automática: **nunca**.
- Credenciales, tokens y claves: nunca se empaquetan; se guardan solo mediante los mecanismos de configuración/secretos del usuario.
- Napo no inicia una conexión remota para actualizarse, consultar una galería o enviar diagnósticos.
- La prohibición alcanza tanto al host como a los manifiestos empaquetados: el host fija `enableTelemetry=false`, no se distribuyen claves `aiKey` y ningún manifiesto puede declarar `enableTelemetry=true`. La auditoría reproducible es `node scripts/audit-napo-privacy-contract.mjs --package dist/Napo.app`.
- Una URL declarada no equivale automáticamente a un servicio obligatorio. Las URLs de licencia, reporte de problemas, webview y servidor remoto solo habilitan compatibilidad o una acción iniciada explícitamente por la persona usuaria; no deben consultarse durante el arranque ni convertirse en canales automáticos.
- El producto no declara una galería de extensiones por defecto; las extensiones integradas se distribuyen con Napo y no se sincronizan mediante Marketplace.
- Las llamadas a un proveedor ocurren únicamente después de que la persona usuaria configure el proveedor y envíe una tarea que lo necesite.
- La búsqueda web permanece apagada por defecto; el estado apagado debe ser visible.
- Una conexión local a Ollama o LM Studio es una capacidad de análisis elegida por el usuario, no un canal oculto de Napo.
- Los fallos de red deben producir un mensaje local y recuperable, nunca una instalación silenciosa ni un reintento infinito.

## 3. Actualizaciones

La política de Napo es **manual, explícita, verificable y reversible**.

### Canal vigente

El canal de actualización de Napo es **manual y operado explícitamente**. Una persona responsable obtiene el artefacto completo desde el medio o ubicación de distribución que el equipo decida, junto con su manifiesto y hash SHA-256; después lo presenta al procedimiento local de verificación. Napo no descubre ese canal, no lo consulta y no descarga candidatos por su cuenta.

El canal elegido para Napo es la transferencia manual de un archivo local o de un medio controlado. La distribución es libre y explícita: se entrega el artefacto completo con su manifiesto y hash, y cada persona usuaria decide si lo abre después de leer la advertencia de macOS. La firma Apple no es un requisito de Napo. Napo no convierte una build `development-only` en una aplicación identificada por Apple ni pretende hacerlo.

1. Una actualización se publica como una versión completa de Napo, no como una sustitución silenciosa de extensiones integradas.
2. La persona usuaria decide cuándo descargarla e instalarla.
3. Cada versión debe publicar versión, cambios, plataforma y hash SHA-256. El hash permite verificar integridad y la persona usuaria decide abrir la aplicación pese a la advertencia de macOS. La firma y notarización de Apple son opcionales y quedan fuera de los criterios de aceptación de Napo.
4. Napo no consulta servidores de actualización en segundo plano; los endpoints de actualización y descarga permanecen vacíos en el producto.
5. La instalación prepara una copia nueva y conserva la anterior hasta verificar que el arranque, Capibara, R, Python y Quarto funcionan.
6. Si la comprobación falla, se conserva o restaura la versión anterior sin destruir los datos del usuario.
7. Las extensiones integradas se actualizan junto con Napo y no mediante Marketplace ni sincronización automática.
8. Una actualización explícita de datos canónicos de Capibara, si se habilita en el futuro, seguirá la misma verificación y no se descargará automáticamente.

El destino incluye un procedimiento local para hacer verificable el artefacto antes de distribuirlo:

```sh
npm run record-napo-release
npm run verify-napo-release
npm run test-napo-update-recovery -- --package dist/Napo.app
```

Para validar un candidato concreto antes de activarlo, sin descargarlo ni instalarlo:

```sh
node scripts/verify-napo-update-candidate.mjs \
  --current /ruta/a/Napo-actual.app \
  --candidate /ruta/a/Napo-candidato.app \
  --manifest /ruta/a/napo-release-manifest.json \
  --out reports/napo-update-candidate.json
```

El verificador comprueba identidad, versión posterior, telemetría desactivada, endpoints vacíos, Capibara 4.0.0, Quarto y coincidencia exacta del manifiesto. `--require-distribution` añade la puerta de firma macOS; el comando nunca reemplaza la aplicación activa.

El manifiesto registra identidad, versión, commit de origen, permisos, tamaños, SHA-256 por archivo y un digest determinista del árbol de la aplicación. No descarga nada, no instala nada y no reemplaza la firma de publicación ni la revisión legal.

La prueba de actualización y recuperación usa clones temporales enlazados, valida identidad, versión, telemetría, endpoints y digest del candidato, rechaza un candidato inseguro y simula un rollback atómico. No publica, descarga ni reemplaza el paquete real; la instalación efectiva sigue siendo manual y explícita.

La construcción del binding local de `policy-watcher` también forma parte del flujo reproducible del destino: `node-gyp@13.1.0` está fijado en las dependencias de desarrollo y `gulp vscode-darwin-arm64` ejecuta `scripts/build-napo-policy-watcher.mjs` para macOS arm64. La tarea reutiliza un binding existente validado o lo recompila cuando falta; `NAPO_FORCE_POLICY_WATCHER_BUILD=1` fuerza la recompilación. Esto no habilita red, telemetría ni actualizaciones.

El paquete generado en el entorno de desarrollo usa firma ad hoc. Para la distribución manual libre esto es un estado permitido y debe comunicarse claramente: macOS puede mostrar una advertencia y la persona usuaria debe autorizar la apertura por su propia decisión. Napo no desactiva Gatekeeper ni simula confianza de Apple. La firma Apple no es un requisito de Napo; si algún día se prepara un canal adicional identificado por Apple, ese canal necesitará identidad de firma, sellado de recursos, notarización y una verificación `codesign`/`spctl` exitosa. El manifiesto SHA-256 es una comprobación de integridad, no una firma.

### Canal manual de distribución libre

Este es el canal operativo de Napo. El equipo entrega el `.app` completo, su manifiesto y el hash por un medio controlado. La persona usuaria verifica que el hash coincida, intenta abrir la aplicación y, si macOS la bloquea por no identificar al desarrollador, utiliza deliberadamente el mecanismo de autorización disponible en su versión de macOS —por ejemplo, abrirla desde Finder con Control-clic y elegir `Abrir`, o autorizarla desde Privacidad y seguridad— bajo su propio riesgo.

Napo debe documentar que la build no está notarizada, no debe ocultar la advertencia del sistema y no debe presentar `adhoc` como firma de distribución. La firma Apple no es un requisito de Napo. El modo `--manual-risk` se conserva como alias de compatibilidad para auditorías anteriores; `--require-distribution` solo sirve para diagnosticar un canal opcional identificado por Apple y no es una puerta de cierre de Napo.

La privacidad tiene además una prueba dinámica local: `npm run smoke-napo-privacy -- --package dist/Napo.app` inicia el artefacto con perfil limpio, observa el árbol de procesos y registra las conexiones durante el arranque en `reports/napo-privacy-smoke.json`. La prueba falla ante cualquier conexión no local; no desactiva las extensiones ni sustituye una auditoría de proveedores cuando la persona usuaria los configura explícitamente.

La firma se audita con `npm run audit-napo-macos-signature -- --package dist/Napo.app`. Para una ruta opcional identificada por Apple, el comando puede incluir `--require-distribution`; el modo diagnóstico permite registrar que el artefacto de Napo es únicamente de desarrollo.

La regresión del reporte se prueba con `npm run test-napo-macos-signature -- --package dist/Napo.app`; la prueba conserva la evidencia del estado macOS del artefacto.

La puerta consolidada de aceptación técnica es `npm run validate-napo-gate -- --package dist/Napo.app`. Ejecuta estructura, runtimes, Quarto, privacidad dinámica, superficie, licencias, expediente legal, manifiesto y evidencia del estado macOS. La build `development-only` se acepta para la distribución manual libre; el inventario legal y el conocimiento institucional siguen siendo puertas independientes. `--manual-risk` se conserva como alias de compatibilidad. `--require-distribution` solo diagnostica una ruta opcional con firma Apple y no es necesaria para cerrar Napo. La revisión estricta del inventario puede ejecutarse por separado con `node scripts/audit-napo-license-inventory.mjs --package dist/Napo.app --require-human-review`.

La integridad funcional de las extensiones de datos se comprueba separadamente con `npm run audit-napo-data-integrity`. El reporte compara sus archivos contra la transferencia efectiva de RHS-IA; solo permite diferencias documentadas de empaquetado, localización, artefactos generados y runtimes copiados. Cualquier diferencia no autorizada de código hace fallar la puerta.

La revisión legal humana se conserva fuera del expediente regenerable: `reports/napo-license-review-packet.json` se vuelve a producir para cada release y `reports/napo-license-decisions.json` contiene las decisiones explícitas ligadas al digest y al `caseId` de cada manifiesto. La distribución exige que todos los casos pendientes tengan decisión `approved`, revisor, fecha y fundamento documental; una decisión ausente, rechazada, inválida o perteneciente a otro digest bloquea el release.

El conocimiento institucional y legal se gobierna mediante `NAPO_CONOCIMIENTO.md`. Una fuente pendiente puede conservarse y citarse como pendiente, pero `--require-approved` debe pasar antes de usarla como base aprobada de planificación. Para raíces con varias fuentes, `npm run audit-napo-knowledge-bundle -- --root PATH --require-approved` valida todos los manifiestos laterales y rechaza duplicados o fuentes sin aprobación.

## 4. Permisos y aprobación

Los valores iniciales son:

- perfil: `Workspace`;
- aprobación: `Solo sensibles`;
- lectura: permitida;
- escritura y ejecución: no autoaprobadas;
- búsqueda web: desactivada.

El perfil `Restringido` debe bloquear operaciones de escritura, ejecución y red. `Workspace` limita la operación al proyecto autorizado. `Full Access` amplía el alcance solo mediante decisión explícita y no elimina las protecciones permanentes de Capibara.

## 5. Qué se conserva

- Capibara completa, incluyendo proveedores, herramientas, skills, RAG, OKF, PDFSTRUCT, Obscura, historial y procedencia.
- Las extensiones de análisis de datos que provee RHS-IA/Positron, sin alteración.
- R, Python, notebooks, viewers y todas las funciones de datos incluidas en la selección de RHS-IA.
- Quarto, siempre incluido y validado como parte del producto.

La reducción de Napo solo puede retirar capacidades ajenas al flujo de análisis de datos. No se deben retirar proveedores, runners o componentes de Capibara por criterio de “minimalismo” sin una nueva decisión explícita.

## 6. Criterios de verificación

- El paquete no contiene claves ni credenciales.
- `enableTelemetry` es falso y las rutas de actualización/descarga están vacías.
- La galería de extensiones está desactivada en el producto; las extensiones que Napo necesita viajan integradas y no se actualizan desde Marketplace.
- El primer arranque no abre marketplace, sincronización ni búsqueda web.
- Capibara muestra proveedores, configuración, historial, permisos y runners.
- El paquete funciona sin ningún servicio externo; cuando se configura uno, el fallo es claro y recuperable.
- La actualización se puede verificar por hash y volver a la versión anterior.

