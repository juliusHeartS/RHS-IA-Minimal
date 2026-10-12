---
title: Informe, estados parciales y recuperación
description: Criterios de éxito, reporte humano, manejo de fallos, consulta posterior y reset autorizado.
---

# Informe, estados parciales y recuperación

## Fallos y estados parciales

Ante un error, conservar la salida exacta y continuar con las fuentes
utilizables. No alterar estados de revisión, eliminar evidencia ni reiniciar el
workspace para hacer pasar la compilación. Si la verificación falla, detener
ediciones semánticas y señalar archivos y razones no conformes.

Un resultado parcial es válido cuando el bundle utilizable es conforme y cada
fuente fallida o pendiente conserva una razón duradera. No declarar éxito total
si fallaron conversión, verificación, interpretación requerida o RAG local.

## Informe humano

Incluir:

- workspace y herramientas usadas;
- preparación PDF, estrategia, páginas o regiones especiales y proveedor real;
- matriz de capacidades Positron/R/Python;
- documentos inventariados, convertidos, reutilizados, omitidos, duplicados,
  actualizados, retirados, fallidos y pendientes de revisión;
- datasets perfilados y fallidos;
- conceptos, relaciones, fuentes de gobernanza y hubs creados o cambiados;
- resultado de cada nivel de validación, especialmente `profile`;
- estado y chunks del RAG local;
- fases incompletas y próximas revisiones humanas;
- confirmación de que CORE y fuentes del usuario permanecieron intactos.

## Consulta posterior

Leer `.okf-local/index.md` y seguir enlaces progresivamente. Recuperar evidencia
con `document_search` desde RAG canónico y local. Aplicar Indicaciones a la
respuesta, no a la construcción del OKF.

## Reset

Ejecutar `rhs-okf reset <workspace> --yes` sólo con autorización explícita del
usuario. Puede borrar derivados LOCAL; nunca debe tocar `Docs/`, `Data/`, CORE,
`.baseglobal/` ni el RAG canónico.
