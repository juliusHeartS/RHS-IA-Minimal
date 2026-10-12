---
title: Libro interno de evidencia
description: Método para vincular afirmaciones, fuentes, tipos de evidencia y confianza sin exponer metadatos técnicos al usuario.
---

# Libro interno de evidencia

Para cada afirmación sustantiva registrar durante el turno:

- afirmación breve;
- identificador interno estable de la fuente;
- tipo: `okf`, `rag`, `document`, `analysis` o `web`;
- confianza `high`, `medium` o `low` según el apoyo directo;
- nombre humano de la fuente que se mostrará al usuario.

Consultar primero la evidencia apropiada:

- política y planificación: RAG canónico y local mediante `capibara-rag-query`;
- documentos del proyecto: búsqueda documental y lectura puntual;
- resultados computados: código R/Python, método y archivo de datos;
- actualidad externa: búsqueda web habilitada.

Una afirmación sin fuente debe investigarse o declararse como inferencia. No
citar fuentes tocadas incidentalmente ni atribuir un cálculo propio a una
política institucional.

Antes de responder, verificar que cada referencia sostenga realmente una
afirmación y que toda inferencia visible esté identificada como tal.

