---
name: capibara-rag-query
policy: implicit
description: Consulta el RAG institucional y el RAG local con fuentes trazables.
metadata:
  author: Cuy
  version: "1.0"
  short-description: Recupera evidencia institucional y local mediante RAG trazable.
  triggers: [consultar rag, buscar evidencia, conocimiento institucional, conocimiento local]
---

# Consulta RAG

Usa el runner `rhs-rag` en modo de recuperación (`query --chunks-only`) para recuperar contexto antes de responder preguntas
que dependan de documentos institucionales o del workspace. Consulta los corpus
canónico y local como capas complementarias. Usa en cada capa los identificadores
de sus propios conceptos OKF; una capa nunca sustituye ni silencia a la otra.

Devuelve una respuesta sintética junto con las fuentes, sus identificadores y
el método de recuperación; la redacción la realiza el modelo principal de RHS-Agent,
no un LLM generativo interno obligatorio de `rhs-rag`. Si ambos índices fallan o
no contienen evidencia, decláralo claramente y no presentes una inferencia como un hecho.
