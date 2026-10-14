# AGENTE.md — Reglas de trabajo para RHS-IA Minimal

## Regla no negociable: fuentes de solo lectura

Estos repositorios son fuentes y nunca deben modificarse:

- `/Users/julius3005/Documents/Github/RHS-IA`
- `/Users/julius3005/Documents/Github/positron`
- `/Users/julius3005/Documents/Github/rhs-agent3`
- `/Users/julius3005/Documents/Github/rhs-agent4`
- `/Users/julius3005/Documents/Github/vscode`

Se permite leer, buscar, comparar, analizar con REA y copiar selectivamente hacia el destino autorizado. No se permite escribir, borrar, mover, renombrar, cambiar ramas, actualizar dependencias ni alterar configuraciones en ellos.

## Destino autorizado

El destino del proyecto es:

`/Users/julius3005/Documents/Github/RHS-IA-Minimal`

El nombre clave de este producto es **Napo**. Napo es la plataforma; Capibara es la extensión-agente integrada. No deben confundirse ambos nombres.

La visión de Napo es convertirse en una plataforma de análisis de datos, modelación y planificación asistida por inteligencia artificial: R y Python ejecutan los análisis; Capibara coordina la interacción mediante LLMs; y el conocimiento legal y contextual debe conservar jurisdicción, fecha, fuente, versión y revisión humana. La IA generativa puede proponer, transformar, explicar y coordinar, pero no sustituye la ejecución analítica ni la responsabilidad científica, legal o de política pública.

Durante una fase de análisis no se deben crear cambios de implementación allí. Las escrituras de implementación requieren autorización explícita del usuario.

## Forma de trabajar

1. Leer primero `QUE_CONSERVAR.md` y este archivo.
2. Consultar `BITACORA.md` y `.memoria/CONTEXTO.md` antes de continuar una investigación.
3. Distinguir siempre hechos observados, inferencias y decisiones propuestas.
4. Usar REA para artefactos empaquetados y comportamiento de ejecución.
5. Usar herramientas normales para leer y comparar código fuente.
6. No tratar un resultado estático como si fuera una observación de ejecución.
7. Registrar evidencia, límites, desconocidos y decisiones importantes.
8. Preferir cambios reversibles y perfiles de configuración antes de eliminar físicamente componentes.
9. No copiar repositorios completos, credenciales, `node_modules`, binarios locales ni artefactos temporales.
10. Mantener licencias, avisos y procedencia de todo componente reutilizado.
11. Para evaluar una reducción, auditar primero el paquete real y usar `scripts/test-napo-surface-reduction.mjs` sobre un clon reversible; nunca retirar una extensión del destino por una clasificación estática aislada.
12. Antes de aceptar una reconstrucción, ejecutar `npm run validate-napo-gate -- --package dist/Napo.app`; la distribución manual libre no exige firma Apple.
13. Verificar la transferencia de extensiones de datos con `npm run audit-napo-data-integrity`; la línea base efectiva es RHS-IA y cualquier diferencia funcional no documentada detiene la aceptación.
14. Verificar la transferencia de capacidades de modelación, simulación, Quarto, planificación y conocimiento con `npm run audit-napo-capabilities`; una diferencia de archivos o hash detiene la aceptación.
15. Verificar los motores con `npm run smoke-napo-modeling -- --package dist/Napo.app`; el smoke debe demostrar modelo, simulación, escenarios y render reproducible antes de aceptar una reconstrucción.
16. Mantener separada la evidencia de coordinación UI: para análisis vivo la ruta canónica es `positron_execute_code` hacia la sesión R/Python del host; `execute_code` sin prefijo pertenece al kernel autónomo de Capibara y no sustituye la sesión analítica del usuario.
17. Para planificación basada en conocimiento local, exigir fuente versionada y legible con identificador, versión, jurisdicción y fecha efectiva; calcular el resultado en la sesión viva y registrar la evidencia. Esa prueba no equivale a validez legal ni sustituye revisión institucional.
18. Antes y después de cada implementación, ejecutar `npm run audit-napo-source-readonly`; el baseline `reports/napo-source-readonly-baseline.json` conserva los cambios preexistentes y la puerta falla si cambia el estado de cualquier fuente.
19. Para conocimiento institucional o legal, exigir manifiesto lateral con identificador, versión, jurisdicción, autoridad, fecha efectiva, procedencia, hash, licencia y estado de revisión; usar `--require-approved` antes de planificar y no presentar la validación técnica como aprobación jurídica.
20. Ejecutar `npm run smoke-napo-extension-startup -- --package dist/Napo.app` para separar extensiones activadas en el arranque, recursos no disparados y errores reales de activación; la ausencia de error no sustituye pruebas funcionales específicas.
21. Ejecutar `npm run audit-napo-extension-contracts -- --package dist/Napo.app` para comprobar manifiestos, entradas principales, comandos, vistas y recursos declarados de las extensiones bajo revisión; las advertencias web/host deben quedar explicadas y la prueba no sustituye la UI funcional.
22. Validar `npm run validate-napo-extension-ui-evidence -- --package dist/Napo.app` cuando exista evidencia manual: debe estar ligada al digest vigente y declarar sus limitaciones; nunca presentarla como cobertura automática completa.
23. Ejecutar `npm run audit-napo-extension-functional-coverage -- --package dist/Napo.app` para reconciliar la evidencia UI, los contratos, el arranque y la presencia física de cada extensión clasificada como `requiere-prueba`; el informe no autoriza retirarlas ni sustituye la revisión legal.
24. Para una raíz con varias fuentes institucionales o legales, ejecutar `npm run audit-napo-knowledge-bundle -- --root PATH --require-approved`; debe detectar manifiestos inválidos o identidades duplicadas y no debe seguir `sourceUri`, descargar contenido ni inferir autoridad.
25. Para llevar fuentes ya aprobadas al `Docs/` de un workspace, usar primero `npm run prepare-napo-knowledge-bundle -- --root PATH --workspace PATH --require-approved` en modo simulación; solo usar `--apply` después de revisar el reporte. La herramienta no sigue `sourceUri`, no sobrescribe colisiones y conserva manifiestos laterales.
26. La compuerta debe verificar el manifiesto del release y luego regenerar `reports/napo-license-review-packet.json`; las decisiones humanas viven en `reports/napo-license-decisions.json`, ligado al digest y a cada `caseId`. No inferir licencias ni editar el expediente regenerable.
27. Validar las raíces `node_modules` del paquete con `scripts/validate-napo.mjs`: se permiten únicamente árboles runtime declarados de Git, drivers/servidores Positron, el árbol común de extensiones y `rhs-okf` de Capibara; cualquier raíz nueva exige revisar dependencia, procedencia, licencia y prueba antes de aceptarla.
28. Conservar el informe `reports/napo-extension-dependency-roots.json` generado por `npm run audit-napo-extension-dependency-roots`; debe registrar raíces observadas, política permitida y cualquier raíz no declarada antes de aceptar un paquete.
29. Auditar la firma macOS con `npm run audit-napo-macos-signature`; ejecutar también `npm run test-napo-macos-signature` para asegurar que la evidencia identifique firma y `TeamIdentifier`, incluso cuando el estado sea `development-only`.
30. Ejecutar `npm run audit-napo-architecture` antes de aceptar una reconstrucción; debe reconciliar las capas, contratos del host, matrices de transferencia, capacidades y baseline de fuentes.
31. Distinguir `npm run test:positron` de `npm run test:positron:check-ts`: la suite ejecutable debe pasar; ejecutar `npm run audit-napo-positron-typecheck` para clasificar los diagnósticos. El chequeo TypeScript de tests debe reportarse con su baseline y no puede declararse verde mientras conserve diagnósticos. No excluir archivos ni relajar el compilador para ocultar deuda upstream.
32. Ejecutar `npm run audit-napo-document-consistency` después de reconstruir o actualizar reportes; debe ligar los documentos canónicos al conteo y digest del manifiesto vigente y permitir cifras antiguas únicamente dentro de secciones marcadas como históricas.
33. Ejecutar `npm run audit-napo-destination-tests` antes del cierre; debe registrar `typecheck-client` y `test:positron` con sus conteos reales, expected-fail, omitidas y avisos conocidos. `audit-napo-completion` lo ejecuta de nuevo y no acepta evidencia vieja o incompleta.

### Principio de reutilización de código abierto

34. Para todo desarrollo de Napo, estudiar primero las implementaciones que ya funcionan en Positron, RHS-IA, RHS-Agent/Capibara y sus pruebas. La secuencia preferida es: observar, comparar, aprender, copiar selectivamente, adaptar en Minimal y verificar contra el comportamiento original. No inventar una solución nueva mientras exista una implementación abierta que resuelva el mismo problema. Esta regla no autoriza escribir en los repositorios fuente: la adaptación ocurre únicamente en Napo y debe conservar licencias, avisos, procedencia y contratos.

## Objetivo de producto

RHS-IA Minimal debe ser un escritorio de análisis de datos basado en el trabajo existente de RHS-IA y Positron, con R, Python, notebooks, Markdown, Quarto y RHS-Agent como capacidades centrales, manteniendo aprobaciones, trazabilidad, aislamiento y reproducibilidad.

La base prevista de RHS-Agent es la **extensión Capibara (`rhs-agent4`) ya existente y se integrará completa**. No se debe recortar, fragmentar, sustituir ni reescribir el agente. El trabajo principal es preparar el host RHS-IA Minimal para instalarla, activarla, conectar su runtime y exponer correctamente todos sus contratos y capacidades. Cuy, Sacha Cuy y otras versiones se consultarán solo para resolver brechas concretas de integración.

Las extensiones de análisis de datos provistas por RHS-IA y Positron también se integrarán sin alteración. No se deben recortar, reescribir ni modificar sus contratos o comportamiento; el trabajo de Napo será proporcionarles el host, runtime, configuración y dependencias que necesiten.

Napo no tendrá telemetría: no recopilará, enviará ni activará analítica de uso, diagnósticos o eventos de manera oculta. Tampoco dependerá de servicios externos obligatorios. Los proveedores que Capibara pueda ver forman parte de la integración completa y no se recortan; sus conexiones serán visibles, configuradas por la persona usuaria y controladas por ella. Esto no incluye autenticación Microsoft, Posit AI Next Edit Suggestions, Dev Containers ni Positron Skills, que quedan aplazados por ser integraciones ajenas al núcleo de Capibara.

## Regla de seguridad del agente

RHS-Agent no debe escribir, ejecutar, publicar, instalar o eliminar de forma invisible. Las acciones sensibles deben mostrar intención, pedir aprobación cuando corresponda y dejar registro de la fuente, acción, resultado y cambios.

## Referencia canónica de continuidad

Para el estado actual de Napo usar `AUDITORIA_CIERRE_NAPO.md` y `MATRIZ_CUMPLIMIENTO_NAPO.md`. Las tablas históricas de otros documentos pueden conservar diagnósticos ya superados; no deben prevalecer sobre ese corte. El paquete actual valida R, Python, Quarto y Capibara. La cobertura funcional de las 13 extensiones clasificadas como `requiere-prueba` ya está reconciliada en `reports/napo-extension-functional-coverage.json`; para la distribución manual libre las puertas abiertas son revisión legal humana y una fuente institucional real de conocimiento. La firma Apple no es un requisito de Napo. El canal de actualización ya está decidido como manual y explícito. La clasificación conservadora de superficie no autoriza retirar componentes.

Las entradas que faltan para un cierre de distribución están enumeradas en `ENTRADAS_PENDIENTES_NAPO.md`; no crear credenciales, licencias, firmas ni fuentes institucionales ficticias para hacer pasar una compuerta.

La referencia vigente registra además una deuda separada de tipado en 40 archivos de tests heredados (182 diagnósticos medidos el 2026-10-13); ninguno coincide con los archivos modificados por Napo. Esa deuda no autoriza modificar las extensiones fuente conservadas ni se debe presentar como fallo del runtime empaquetado. El canal de entrega elegido es la distribución manual libre; `--manual-risk` queda como alias de compatibilidad y la firma/notarización Apple está fuera del alcance de Napo.

