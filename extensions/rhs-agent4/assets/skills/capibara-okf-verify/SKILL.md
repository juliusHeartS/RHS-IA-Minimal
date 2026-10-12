---
name: capibara-okf-verify
modeSlugs: [architect]
policy: implicit
description: Verifica la integridad y consistencia del OKF del workspace.
metadata:
  author: Cuy
  version: "1.0"
  short-description: Verifica integridad, trazabilidad y consistencia del OKF local.
  triggers: [verificar okf, validar okf, integridad del conocimiento]
---

# Verificación OKF

Ejecuta `rhs-okf verify` con el runner empaquetado sobre el workspace indicado.
Reporta errores, advertencias, conteos y rutas relevantes. No edites conceptos,
relaciones, manifests ni estados de verificación para hacer pasar el comando.

La verificación es diagnóstica: no sustituye la revisión humana ni construye
por sí sola el RAG local.
