# Harness OPS — Guía de Entregables

Sistema de conocimiento y router de documentos de la Organización Panamericana de la Salud (OPS/OMS) para integrar con agentes de IA.

---

## 📁 Archivos entregados

### 1. `knowledge_graph.json`
**Qué es**: Grafo de conocimiento con 214 nodos y 351 aristas que mapea documentos, países, temas, conceptos e idiomas.

**Para qué sirve**:
- Saber qué documento consultar cuando el agente necesita una directriz OPS
- Encontrar documentos relacionados (ej: versión en español de un documento en inglés)
- Identificar qué países tienen perfiles disponibles
- Descubrir conceptos clave asociados a cada documento

**Cómo usarlo**:
```python
import json

with open("knowledge_graph.json") as f:
    graph = json.load(f)

# Buscar documentos sobre un país
pais = graph["nodos"]["pais_guatemala"]
print(pais["documentos"])  # Lista de doc_ids

# Buscar documentos de un tema
tema = graph["nodos"]["tema_2_country_profiles_on_human_resources_for_health_in_the_region"]
print(tema["documentos"])
```

**No modificar manualmente** — se regenera automáticamente si cambian los documentos.

---

### 2. `router.py`
**Qué es**: Motor de búsqueda que recibe una pregunta en lenguaje natural y devuelve los documentos Markdown más relevantes.

**Para qué sirve**:
- El agente le pregunta al router: "¿Qué dice la OPS sobre migración de enfermeras?"
- El router responde con los documentos que contienen esa información
- Sin bases de datos vectoriales: todo en memoria, milisegundos de latencia

**Cómo usarlo**:
```python
from router import DocumentRouter

router = DocumentRouter("knowledge_graph.json", "markdown_output/")
resultados = router.route("migración de enfermeras", top_k=3)

for doc in resultados:
    print(doc["titulo"])      # Título del documento
    print(doc["archivo"])     # Ruta al Markdown
    print(doc["contenido"])   # Texto completo del documento
```

**Parámetros importantes**:
- `query`: Pregunta del usuario (string)
- `top_k`: Cuántos documentos devolver (default: 3)
- `idioma`: Filtrar por idioma — `"spa"`, `"eng"`, `"por"`, `"jpn"` (default: todos)

**Ejemplos de línea de comandos**:
```bash
# Consulta simple
python router.py "¿Cuántos médicos hay en Guatemala?"

# Con filtro de idioma
python router.py "health worker migration" --idioma eng --top-k 2

# Listar recursos disponibles
python router.py --list-paises
python router.py --list-conceptos
python router.py --list-temas
```

---

### 3. `personality_ops.md`
**Qué es**: Instrucciones de personalidad para que el agente de IA hable con la voz institucional de la OPS.

**Para qué sirve**:
- Darle al agente un "rol" claro: asesor senior de la OPS
- Definir principios (equidad, evidencia, derechos humanos, sostenibilidad)
- Establecer cuándo debe consultar el grafo de conocimiento
- Definir frases permitidas y prohibidas
- Darle estructura a las respuestas

**Cómo usarlo**:
Copiar el contenido completo de este archivo y pegarlo en el **system prompt** del agente (campo de instrucciones del sistema en Positron Assistant, Claude, GPT, etc.).

**Secciones clave**:
- **Identidad**: Quién es el agente
- **Principios fundamentales**: 4 pilares institucionales
- **Tono de voz**: Cómo debe hablar
- **Cuándo consultar el grafo**: 5 escenarios obligatorios
- **Estructura de respuesta**: 4 pasos (contexto → análisis → recomendación → fuente)
- **Conocimiento especializado**: Densidades, mercado laboral, migración, sistemas de información

---

### 4. `markdown_output/`
**Qué es**: Carpeta con 108 documentos Markdown organizados por idioma.

**Estructura**:
```
markdown_output/
├── PDF_ENG/     → 70 documentos en inglés
├── PDF_SPA/     → 33 documentos en español
├── PDF_POR/     → 3 documentos en portugués
├── PDF_JPN/     → 1 documento en japonés
└── paho_pdfs/   → 1 documento suelto
```

**Para qué sirve**:
- Son los documentos que el router devuelve como resultado
- Cada archivo contiene el texto completo extraído del PDF original
- El agente puede leerlos directamente para citar fuentes

**Nota**: Algunos documentos fueron generados con OCR (los del `doc_18`) porque eran imágenes escaneadas. El texto puede tener pequeños errores de reconocimiento.

---

### 5. `HRH_Core Documents.xlsx`
**Qué es**: Hoja de cálculo original con los 21 temas principales y sus enlaces por idioma.

**Para qué sirve**:
- Es la fuente de verdad de los títulos de los documentos
- El grafo se construye a partir de esta hoja
- Útil para verificar a qué tema corresponde cada documento

---

### 6. `correspondencia_archivos_temas.csv`
**Qué es**: Tabla que vincula cada archivo Markdown con su tema exacto en el Excel.

**Para qué sirve**:
- Verificar que un documento está correctamente clasificado
- Cruzar información entre archivos y temas
- Depuración del sistema

---

### 7. `archivos_espanol_por_tema.csv`
**Qué es**: Tabla de solo los documentos en español con sus temas.

**Para qué sirve**:
- Consulta rápida de documentos en español
- Verificar cobertura temática en ese idioma

---

## 🔧 Cómo integrar todo en tu agente

### Paso 1: Añadir personalidad
Copiar el contenido de `personality_ops.md` al **system prompt** de tu agente.

### Paso 2: Registrar el router como herramienta
En tu agente (Positron Assistant o similar), registrar una función que llame a `router.py`:

```python
def consultar_directriz_ops(consulta: str, idioma: str = None) -> str:
    """
    Consulta directrices, políticas y marcos normativos de la OPS/OMS.
    Úsala cuando necesites:
    - Ratios o densidades recomendadas de personal de salud
    - Políticas migratorias del personal de salud
    - Directrices de formación o distribución
    - Contexto institucional para una recomendación
    - Perfiles de países o comparaciones regionales
    
    Args:
        consulta: Pregunta o tema a buscar (ej: "migración de enfermeras")
        idioma: Código de idioma opcional ("spa", "eng", "por", "jpn")
    
    Returns:
        Texto con los documentos relevantes y su contenido
    """
    from router import DocumentRouter
    
    router = DocumentRouter("knowledge_graph.json", "markdown_output/")
    docs = router.route(consulta, top_k=3, idioma=idioma)
    
    if not docs:
        return "No se encontraron directrices específicas de la OPS sobre este tema."
    
    respuesta = []
    for i, doc in enumerate(docs, 1):
        respuesta.append(f"Documento {i}: {doc['titulo']}")
        respuesta.append(f"Idioma: {doc['idioma']}")
        respuesta.append(f"Contenido:\n{doc['contenido'][:3000]}...")
        respuesta.append("---")
    
    return "\n\n".join(respuesta)
```

### Paso 3: El agente decide cuándo usarlo
El agente, siguiendo las instrucciones de `personality_ops.md`, debe:

1. **Analizar la pregunta**: ¿Necesita datos de CSV? ¿Necesita directrices OPS? ¿Necesita cálculos?
2. **Si necesita directrices OPS**: Llamar a `consultar_directriz_ops()`
3. **Combinar resultados**: Fusionar datos técnicos (CSV + Python/R) con contexto institucional (documentos OPS)
4. **Responder con personalidad**: Usar el tono y estructura definidos en `personality_ops.md`

---

## 🧠 Flujo completo de una consulta

```
Usuario: "¿Cuántas parteras necesita Mendoza?"
    ↓
Agente (con personalidad OPS):
    1. Detecta que necesita:
       a) Datos de nacimientos → CSV + Python
       b) Ratio de parteras/nacimiento → Documento OPS
    2. Ejecuta en paralelo:
       a) pandas.read_csv("PAHO subnational.csv") → filtra Mendoza
       b) consultar_directriz_ops("ratio parteras nacimientos") → doc_11
    3. Calcula: nacimientos × ratio_OPS = parteras_necesarias
    4. Construye respuesta:
       "Según la Política sobre el Personal de Salud 2030 de la OPS... 
        Los datos de nacimientos en Mendoza (2021-2026) muestran... 
        Aplicando la ratio recomendada de X parteras por 1,000 nacimientos 
        (Guía de Análisis del Mercado Laboral de la Salud, doc_11)... 
        Se recomienda que Mendoza disponga de N parteras."
```

---

## 📝 Notas importantes

1. **No es un RAG**: No hay embeddings ni vectores. El router usa keywords y el grafo de conocimiento. Es más rápido y transparente.

2. **El grafo es estático**: Si añades nuevos documentos PDF, debes regenerar el grafo ejecutando el script que lo construye.

3. **Los documentos OCR**: El `doc_18` (WHO Global Code of Practice) fue convertido con OCR porque son imágenes escaneadas. Revisar si hay errores de reconocimiento antes de citar cifras exactas.

4. **Multi-idioma**: El router puede filtrar por idioma, pero también puedes dejarlo en "todos" y dejar que el agente decida cuál usar según la consulta del usuario.

5. **Extensible**: Puedes añadir más nodos al grafo (organizaciones, años, indicadores) editando el script generador.

---

## 🆘 Soporte

Si algo no funciona:
- Verificar que `knowledge_graph.json` existe y tiene contenido
- Verificar que `markdown_output/` tiene las subcarpetas `PDF_ENG`, `PDF_SPA`, etc.
- Ejecutar `python router.py --list-paises` para confirmar que el grafo carga correctamente
- Revisar que Python tenga instalado: `pandas` (solo si regeneras el grafo)

---

*Generado el 2026-06-09 para el proyecto HarnessRHS-IA*
