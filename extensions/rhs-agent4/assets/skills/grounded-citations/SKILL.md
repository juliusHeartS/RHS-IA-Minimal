---
name: grounded-citations
policy: implicit
description: Ground substantive policy, planning, and factual claims in traceable evidence from institutional RAG, OKF, project documents, analysis, or current external sources. Present concise human-readable references instead of internal paths or retrieval metadata.
version: "1.1.0"
author: RHS-Agent
license: MIT
metadata:
  author: RHS-Agent
  version: "1.1"
  short-description: Sustenta afirmaciones con fuentes útiles para personas.
  triggers: [citar fuentes, referencias, evidencia documental, sustentar afirmaciones]
---

# Citas sustentadas

Cada afirmación sustantiva debe apoyarse en evidencia recuperada o quedar
marcada como inferencia. No sustituir una fuente institucional ausente con
memoria paramétrica ni con una búsqueda web silenciosa.

## Contrato

1. Recuperar evidencia antes de afirmar: RAG/OKF para conocimiento
   institucional, archivos del proyecto para evidencia local, R/Python para
   resultados analíticos y web solo para información externa actual.
2. Distinguir autoridad institucional, evidencia del proyecto, cálculo propio e
   información externa. No mezclar sus niveles de autoridad.
3. Mantener internamente la relación afirmación-fuente-confianza.
4. En la respuesta, citar únicamente las fuentes que sostienen una afirmación.
5. Presentar referencias para humanos: título del documento, institución y fecha
   cuando existan; para datos, nombre del archivo; para web, título y enlace.
6. No mostrar rutas absolutas, IDs de chunks, nombres de conceptos OKF, puntajes
   de recuperación ni fichas técnicas salvo que el usuario los pida.
7. Si falta evidencia, decirlo con claridad y separar la inferencia.

## Referencias

- Cargar `evidence-ledger` cuando la respuesta combine varios tipos de evidencia
  o requiera una auditoría rigurosa.
- Cargar `human-source-presentation` para informes, respuestas ejecutivas o
  cualquier salida destinada a planificadores.
- Combinar con `capibara-rag-query` cuando haga falta recuperar evidencia.
