---
type: DocumentacionTecnica
title: Guía técnica de integración del OKF Bundle en RHS-AI
description: Guía técnica para integrar el bundle OKF en el agente RHS-AI (RAG híbrido + grafo de conocimiento).
tags: [okf, rhs-ai, rag, integracion]
timestamp: 2026-07-12T00:00:00-05:00
---

**✅ Tienes razón.** La respuesta anterior fue demasiado abstracta. Vamos a ser mucho más concretos y accionables.

Aquí tienes una guía técnica clara para tu programador sobre **cómo hacer que el OKF bundle funcione realmente** dentro de RHS-AI.

---

### **Guía Técnica de Integración del OKF Bundle en RHS-AI**

#### 1. ¿Necesitamos construir un RAG?

**Sí**, pero no un RAG tradicional. Recomendamos un **RAG Híbrido + Grafo de Conocimiento**.

**Estrategia recomendada:**

| Tipo de pregunta del usuario               | Dónde buscar primero    | Por qué                    |
| ------------------------------------------ | ----------------------- | -------------------------- |
| Política, recomendaciones, relaciones      | **OKF Bundle** (curado) | Más preciso y estructurado |
| Datos específicos, tablas, citas textuales | PDFs originales         | Más completo y detallado   |
| Preguntas complejas / multi-paso           | **Ambos** (híbrido)     | Mejor calidad              |

---

#### 2. Arquitectura recomendada (visión general)

```
Usuario
   ↓
Agente (LangGraph o similar)
   ↓
Router / Planner
   ├──→ OKF Retriever (conceptos curados + grafo)
   ├──→ PDF Retriever (vector search sobre PDFs)
   └──→ Hybrid Retriever
   ↓
LLM + Tools
   ↓
Respuesta final + trazabilidad
```

---

#### 3. Cómo implementar cada parte (paso a paso)

### **Paso 1: Ingesta del OKF Bundle**

**Qué hacer:**

- Leer todos los archivos `.md` de forma recursiva.
- Extraer:
    - Frontmatter (YAML) → metadata estructurada (`type`, `tags`, `source_documents`, `timestamp`)
    - Contenido Markdown
    - Enlaces internos (markdown links) → para construir el grafo

**Tecnología recomendada:**

- Usar `python-frontmatter` + `markdown` + `pathlib`
- Almacenar en dos estructuras:
    1. **Vector Store** (para búsqueda semántica)
    2. **Grafo** (para relaciones)

**Ejemplo de metadata enriquecida que se puede guardar:**

```json
{
  "id": "politicas/politica_personal_salud_2030.md",
  "type": "Politicas",
  "title": "...",
  "tags": ["politica", "rrhh", "2030"],
  "source_documents": ["fuentes/politica_personal_salud_2030.md"],
  "links_to": ["plan_estrategico/vision.md", ...]
}
```

---

### **Paso 2: Construir el Grafo de Conocimiento**

**Opciones (de más simple a más potente):**

| Opción         | Dificultad | Recomendado           | Tecnología                        |
| -------------- | ---------- | --------------------- | --------------------------------- |
| **Simple**     | Baja       | Sí (empezar por aquí) | NetworkX + diccionario en memoria |
| **Intermedio** | Media      | Sí                    | KuzuDB o DuckDB + grafo           |
| **Avanzado**   | Alta       | Más adelante          | Neo4j local o Memgraph            |

**Cómo construirlo fácilmente:**

- Cada archivo `.md` = un **nodo**
- Cada enlace markdown interno = una **arista**
- El campo `source_documents` también genera aristas hacia los documentos fuente

Esto permite hacer preguntas como:

> "Muéstrame todos los conceptos relacionados con la Política 2030"

---

### **Paso 3: Cómo invocar cada componente (el Router)**

El **Router** es la pieza clave. Puede ser:

**Opción recomendada (más controlable):** Usar **LangGraph** con nodos condicionales.

Ejemplo de lógica del Router:

```python
def route_question(state):
    question = state["question"].lower()

    if any(word in question for word in ["política", "recomendación", "estrategia", "eje"]):
        return "okf_retriever"           # Priorizar bundle curado

    elif any(word in question for word in ["tabla", "dato", "página", "cita"]):
        return "pdf_retriever"           # Ir directo a PDFs

    else:
        return "hybrid_retriever"        # Usar ambos
```

---

### **Paso 4: Implementación práctica recomendada (MVP)**

**Fase 1 (Rápida - 1 a 2 semanas):**

1. Crear un pipeline de ingesta del OKF Bundle.
2. Indexar los archivos `.md` en un vector store local (Chroma o LanceDB).
3. Crear un retriever simple que filtre por `type` y `tags`.
4. Modificar el prompt del agente para que prefiera información del bundle cuando sea posible.

**Fase 2 (Media):**

1. Construir el grafo con NetworkX.
2. Crear una herramienta (`get_related_concepts`) que el agente pueda llamar.
3. Implementar el Router con LangGraph.

**Fase 3 (Avanzada):**

- Híbrido real (OKF + PDFs) con re-ranking.
- Evaluación de calidad de respuestas.
- Mantenimiento automático cuando se actualiza el bundle.

---

### **5. Stack tecnológico recomendado (local y offline)**

| Componente      | Recomendación             | Alternativa          |
| --------------- | ------------------------- | -------------------- |
| Embeddings      | Nomic Embed v1.5 o BGE-M3 | Snowflake Arctic     |
| Vector Store    | ChromaDB o LanceDB        | FAISS                |
| Grafo           | NetworkX (inicio)         | KuzuDB               |
| Agent Framework | **LangGraph**             | LlamaIndex Workflows |
| LLM local       | Qwen2.5, GLM-4, Nemotron  | Llama 3.3, Mistral   |
| PDF Processing  | El que ya tienes (Rust)   | -                    |

---

### **6. Próximos pasos concretos que le puedes pedir a tu programador**

1. **Esta semana:** Crear el pipeline de ingesta del OKF Bundle + indexado en vector store.
2. **Próxima semana:** Implementar un retriever que pueda filtrar por `type` y `tags`.
3. **Después:** Construir el Router básico con LangGraph.
4. **Paralelo:** Definir 3-4 tipos de preguntas de prueba y medir calidad de respuesta con vs sin el bundle.

---

¿Quieres que prepare ahora una versión más corta y directa (tipo "Tareas para el programador esta semana") o prefieres que desarrolle con más detalle técnico alguna de estas partes (por ejemplo, cómo construir el grafo con NetworkX o el Router en LangGraph)?
